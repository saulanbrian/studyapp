import json
import httpx
from pydantic_core import ValidationError
import requests
from task.quiz.model import QuizModel
from task.summary.utils import construct_operation_value_error, get_summary
from celery.utils.log import get_logger
from ..http_client import client

from task.utils import chunk_markdown, cleanup_json_output, get_completion


logger = get_logger(__name__)

system_prompt = """
You are given a markdown chunk of a lesson document.

Your task is to generate as many quiz questions as possible based strictly on the content.

Rules:
- Output MUST be valid JSON only.
- Do NOT include markdown, explanations, or extra text.
- Follow the exact JSON structure defined below.
- Each question must be either "multiple_choice" or "true_or_false".
- Each question MUST include a "choices" array.
- Exactly ONE choice must have is_correct = true.
- Questions must be clear, factual, and derived ONLY from the lesson content.

IMPORTANT RULES FOR QUESTION TYPES:
- For "multiple_choice":
  - Each choice MUST use the field "text".
  - Include at least 3 choices.
  - Exactly one choice must have is_correct = true.

- For "true_or_false":
  - ALWAYS include EXACTLY TWO choices.
  - One choice MUST have value = true.
  - One choice MUST have value = false.
  - Exactly one of these choices must have is_correct = true.
  - Do NOT include "text" in true_or_false choices.

JSON STRUCTURE (MUST MATCH EXACTLY):

{
  "questions": [
    {
      "question": "string",
      "type": "multiple_choice",
      "choices": [
        {
          "text": "string",
          "is_correct": boolean
        }
      ]
    },
    {
      "question": "string",
      "type": "true_or_false",
      "choices": [
        {
          "value": boolean,
          "is_correct": boolean
        }
      ]
    }
  ]
}

The output must be directly parsable by JSON.load().
"""


class QuizMaker:

    
    def __init__(self,summary_id:str) -> None:
        self.summary_id = summary_id
        self.summary_content: str | None = None
        self.err = None
        self.questions = []

    
    def get_summary(self):
        try:
            r = get_summary(self.summary_id)
            r.raise_for_status()
            if len(r.json()) < 1:
                self.err = httpx.HTTPStatusError(
                    message="Summary Not Found",
                    request=r.request,
                    response=r
                )
                return
            summary = r.json()[0]
            if not summary["content"] or summary["status"] != "success":
                self.err = ValueError(
                    "Error: Make sure your summary has status of succcess and content is not null"                
                )   
            self.summary_content = summary["content"]
        except httpx.HTTPStatusError as e:
            logger.info(f"error upon retrieving summary: { e }")
            self.err = e
        except Exception as e:
            print(f"Unexpected error: { e }")
            self.err = e


    def generate_questions(self):
        if not self.summary_content:
            self.err = construct_operation_value_error(
                lookup_value="summary_content",
                operation="generate_questions"
            )
            return
        chunks = chunk_markdown(self.summary_content)
        for chunk in chunks:
            try:
                r = get_completion(
                    messages=[
                        {
                            "role":"system",
                            "content":system_prompt
                        },
                        {
                            "role":"user",
                            "content":chunk
                        }
                    ],
                    output_format=QuizModel.model_json_schema()
                )
                r.raise_for_status()
                content = r.json()["message"]["content"]
                output = json.loads(cleanup_json_output(content))

                try:
                    QuizModel.model_validate(output)
                except ValidationError as e:
                    logger.info(f"Invalid quiz output: { e }")
                else:
                    self.questions.extend([output["questions"]])

            except requests.HTTPError as e:
                logger.info(f"Ollama Error:{ e }")
                pass
            except Exception as e:
                logger.info(f"Unexpected error: { e }")


    def create_quiz(self):
        try:
            client.post("quizzes", json={
                "ref":self.summary_id,
                "content":{
                    "questions":self.questions
                }
            }).raise_for_status()
        except httpx.HTTPStatusError as e:
            logger.info(f"Error creating quiz: { e }")
        except Exception as e:
            logger.info(e)
        else:
            logger.info("Quiz Created!")

                

    def start(self):
        steps = [
            self.get_summary,
            self.generate_questions,
            self.create_quiz
        ]

        for step in steps:
            if not self.err:
                step()




