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

logger = logging.getLogger(__name__)


def get_summary(text):
  try:
    response = client.models.generate_content(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(
      system_instruction="""
      You are to provide a document for students to study.

      🔍 Your task:
      You receive a raw document from your superior. Students struggle reading full-length materials, so your job is to trim the document – **keeping all important content** – to make it effective for learning.

      ✅ Guidelines:
      1. **No unnecessary details** like course descriptions or author notes.
      2. Use only **headings, subheadings, and concise descriptions** – avoid deep nesting.
      3. Add **emojis** to headings/subheadings for visual clarity.
      4. VERY IMPORTANT: **Do NOT include introductions** like “Here’s the summary…” or “Okay…” – go straight into the content.
      5. Include **key takeaways** for the whole document as the last part.
      6. Make explanations shorter but **don’t remove key information**.

      ❗️Important:
      - Your output will be sent directly to students.
      - **Make it look original** – not like it was processed by an AI.
      - Do NOT include comments, disclaimers, or acknowledge the request.
      """ 
    ),
    contents={text}
)
  except errors.ClientError as e:
    return None, str(e)
  except Exception as e:
    return None, str(e)
  else:
    return response.text, None 



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

