from celery import shared_task

from common.genai_client import client
from google.genai import errors 

from summary.models import Summary
from quiz.models import Quiz, Question, Option
import json

import logging 

logger = logging.getLogger(__name__)
 
@shared_task()
def generate_quiz(summary_id,quiz_id):

    try:
        summary = Summary.objects.get(pk=summary_id)
        quiz = Quiz.objects.get(pk=quiz_id)
    except Summary.DoesNotExist:
        return {'error':'summary not found'}

    try:
        result = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=(
                f"Generate a quiz about this document: {summary.content}\n\n"
                "Your response MUST be:\n"
                "1. Strictly valid JSON format\n"
                "2. No markdown or code formatting\n"
                "3. Follow this structure:\n"
                """{
                    "quiz": {
                        "questions": [
                            {
                                "question_text": "text here",
                                "options": [
                                    {"option_text": "choice 1", "is_correct": true},
                                    {"option_text": "choice 2", "is_correct": false}
                                ]
                            } 
                        ]
                    }
                "4. up to 4 options with the correct one randomly placed"
                }"""
        ))
    except (errors.ClientError, errors.ServerError) as e: 
        quiz.status = 'error'
        quiz.save()
        return str(e)
    else:

        text_result = result.text.replace('```json','').replace('```','').strip()

        try:
            json_response = json.loads(text_result)

            for question in json_response['quiz']['questions']:
                question_instance = Question.objects.create(
                    question_text=question['question_text'],
                    quiz=quiz
                )
                for option in question['options']:
                    Option.objects.create(
                        option_text=option['option_text'],
                        is_correct=option['is_correct'],
                        question=question_instance 
                    )

            quiz.status = 'processed'
            quiz.save()
            return quiz.status

        except Exception as e:
            quiz.status = 'error'
            quiz.save()
            return str(e)
