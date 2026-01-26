import re

import httpx
from ..http_client import client

def get_summary(id:str) -> httpx.Response:
    return client.get(f"summaries?select=*&id=eq.{id}")

def construct_operation_value_error(operation:str,lookup_value:str):
    return ValueError(f"""
        Cannot proceed to the next operation: { operation } \
        value: { lookup_value } is either None or Unknown
    """)


def clean_markdown(raw_text: str) -> str:
    cleaned = re.sub(r"^```(?:markdown)?\s*", "", raw_text, flags=re.IGNORECASE)
    cleaned = re.sub(r"```$", "", cleaned, flags=re.IGNORECASE)
    cleaned = cleaned.strip()
    return cleaned
