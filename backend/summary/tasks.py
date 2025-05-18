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

logger = logging.getLogger(__name__)


def get_summary(text):
  try:
    response = client.models.generate_content(
      model="gemini-2.0-flash-lite",
      contents=f"provide a summary of this whole paper. this will be used as a reviewer so make sure to highlight the important things and ensure good and proper formatting without saying anything unnecessary. content: { text }",
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
def summarize_file(summary_id,file):
  
  try:
    summary = Summary.objects.get(pk=summary_id)
  except Summary.DoesNotExist:
    return
  else:

    file_bytes = base64.b64decode(file)
    pdf_reader = PdfReader(BytesIO(file_bytes))
    
    content = ""
    for page_num in range(len(pdf_reader.pages)):
      page_text = pdf_reader.pages[page_num].extract_text()
      if page_text:
        content += "\n".join(page_text)
        
    if content:
      content_summary, error = get_summary(content)

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

