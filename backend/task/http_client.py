from httpx import Client
from django.conf import settings


SUPABASE_URL = settings.SUPABASE_URL
SUPABASE_KEY = settings.SUPABASE_KEY

REST_URL = f'{SUPABASE_URL}/rest/v1/'
STORAGE_URL = f'{SUPABASE_URL}/storage/v1/object/public/'

supabase_rest_client = Client(
    base_url=REST_URL,
    headers={
        "Authorization":f"Bearer {SUPABASE_KEY}",
        "apikey":SUPABASE_KEY,
        "Content-Type":"application/json"
    }
)

supabase_storage_client = Client(
    base_url=STORAGE_URL,
    headers={
        "Authorization":f"Bearer { SUPABASE_KEY }",
        "apikey":SUPABASE_KEY,
        "Content-Type":"application/json"
    }
)
