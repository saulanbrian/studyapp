from httpx import Client
from django.conf import settings


SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = settings.SUPABASE_KEY

client = Client(
    base_url=SUPABASE_URL,
    headers={
        "Authorization":f"Bearer {SUPABASE_KEY}",
        "apikey":SUPABASE_KEY,
        "Content-Type":"application/json"
    }
)
