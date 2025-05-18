from google import genai
from django.conf import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)
