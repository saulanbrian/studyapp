from celery import shared_task
from django.conf import settings
from PyPDF2 import PdfReader
from io import BytesIO
import base64

from .models import Summary
from google.genai import errors 

from channels.layers import get_channel_layer
from .serializers import SummarySerializer
from asgiref.sync import async_to_sync

import logging 

from common.genai_client import client
from google.genai import types

from pydantic import BaseModel
import json

logger = logging.getLogger(__name__)

class SummaryContentSection(BaseModel):
  heading:str;
  text:str

class SummaryContentModel(BaseModel):
  title:str
  sections:list[SummaryContentSection]
  

def get_summary(text):
  try:
    response = client.models.generate_content(
    model="gemini-2.0-flash",
    config={
        "response_mime_type":"application/json",
        "response_schema":SummaryContentModel 
    },
    contents=(f"""""
      You are a helpful assistant. Given the following document,
      your task is to condense it only by removing genuinely unnecessary information,
      such as redundancies, excessive examples, filler phrases, 
      or overly detailed tangents that do not contribute meaningfully to the main ideas.
      ⚠️ Do not shorten based on a percentage or arbitrary length.
      ✅ Focus instead on preserving all important facts, concepts, arguments, and discussions.
      🎯 The goal is for a reader (such as a student or an interested person) 
      to understand the full essence of the document—as if they read the original, 
      but faster and with less mental clutter.
      Return the cleaned-up version of the document, 
      keeping the structure and flow as natural as possible.
      avoid deep nesting. use emojis for headings and title

      document: {text}
      """ 
      )
    )
    content = json.loads(response.text)
  except errors.ClientError as e:
    return None, str(e)
  except Exception as e:
    return None, str(e)
  else:
    return content, None 



def notify_user(summary):

  channel_layer = get_channel_layer()
  serializer = SummarySerializer(summary)

  async_to_sync(channel_layer.group_send)(
    f'user_{summary.user.clerk_id}',
    {
      'type':'summary_update',
      'updated_summary':serializer.data
    }
  )


@shared_task()
def summarize_file(summary_id,):

  summary = Summary.objects.filter(pk=summary_id).first()

  if not summary:
    return

  content_summary = ''

  try:
    with summary.file.open('rb') as f:
      
      pdf_reader = PdfReader(f)

      for page_num in range(len(pdf_reader.pages)): 

        page_text = pdf_reader.pages[page_num].extract_text()

        if page_text:
          content_summary += "\n".join(page_text)
              
      if content_summary:
        content_summary, error = get_summary(content_summary)

        if error:
          summary.status = 'error'
          summary.error_message = error
        else:
          summary.content = content_summary
          summary.status = 'processed'

      else:
        summary.status = 'error'
        summary.error_message = 'no content available' 
        
      summary.save()

      notify_user(summary)

      return summary.status
  except Exception as e:
    summary.status = 'error'
    summary.save()
    notify_user(summary)
    return summary.status
