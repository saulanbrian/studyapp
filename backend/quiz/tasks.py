from celery import shared_task

from common.genai_client import client
from google.genai import errors 

from summary.models import Summary
from quiz.models import Quiz, Question, Option
import json

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .serializers import QuizSerializer

from pydantic import BaseModel

import logging 

logger = logging.getLogger(__name__)



def notify_user(quiz):

    channel_layer = get_channel_layer()
    serializer = QuizSerializer(quiz)

    clerk_id = str(quiz.summary.user.clerk_id)

    async_to_sync(channel_layer.group_send)(
        f'user_{clerk_id}',
        {
            'type':'quiz_update',
            'updated_quiz':serializer.data
        }
    )

class OptionModel(BaseModel):
    option_text:str
    is_correct:bool

class QuestionModel(BaseModel):
    question_text:str
    options:list[OptionModel]
 
 
@shared_task()
def generate_quiz(quiz_id):

    quiz = Quiz.objects.filter(pk=quiz_id).first()
    if not quiz:
        return None

    try:
        result = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            config={
                "response_mime_type":"application/json",
                "response_schema":list[QuestionModel]
            },
            contents=(
                f"create a quiz based on this document:{ quiz.summary.content}."
                "up to 4 options with one correct answer randomly indexed"
            )
        )

        questions = json.loads(result.text)
        
        for q in questions:
            question_instance = Question.objects.create(
                question_text=q['question_text'],
                quiz=quiz
            )
            for opt in q['options']:
                Option.objects.create(
                    option_text=opt['option_text'],
                    is_correct=opt['is_correct'],
                    question=question_instance
                )
        quiz.status = 'processed'
        quiz.save()
        notify_user(quiz)
        return quiz.status

    except (errors.ClientError, errors.ServerError) as e: 
        quiz.status = 'error'
        quiz.save()
        notify_user(quiz)
        return str(e)
