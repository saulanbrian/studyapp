from celery import shared_task

from django.shortcuts import get_object_or_404
from django.conf import settings

from google import genai
from google.genai import errors 

from summary.models import Summary

client = genai.Client(api_key=settings.GEMINI_API_KEY)

@shared_task()
def generate_quiz(summary_id):
    summary = get_object_or_404(Summary,pk=summary_id)

    try:
        result = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=(
                f"generate a quiz about this document: {summary.conten}"
            )
        )
    except errors.ClientError as e: 
        return e
    else:
        return result.text 
