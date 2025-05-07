from celery import shared_task
from django.conf import settings
from PyPDF2 import PdfReader
from io import BytesIO
import base64

from .models import Summary
from google import genai
from google.genai import errors 


client = genai.Client(api_key=settings.GEMINI_API_KEY)

def get_summary(text):
  try:
    response = client.models.generate_content(
      model="gemini-2.0-flash-lite",
      contents=f"provide a summary of this whole paper. this will be used as a reviewer so make sure to highlight the important things and ensure good and proper formatting without saying anything unnecessary. content: { text }",
    )
  except errors.ClientError as e:
    return None, str(e)
  else:
    return response.text, None 


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
    return summary.status
