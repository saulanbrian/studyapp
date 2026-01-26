from typing import Literal, TypedDict
from django.conf import settings

from markdown_chunker import MarkdownChunkingStrategy
import requests


strategy = MarkdownChunkingStrategy()


class Message(TypedDict):
    role: Literal["user", "system"]
    content:str


def get_completion(
    messages:list[Message],
    output_format = None
) -> requests.Response:

    payload = {
        "model":"ministral-3:14b",
        "stream":False,
        "messages":messages,
    }

    if output_format:
        payload["format"] = output_format

    return requests.post(
        "https://ollama.com/api/chat",
        headers={
            'Authorization': f'Bearer {settings.OLLAMA_API_KEY}',
            'Content-Type': 'application/json'
        },
        json=payload
    )


def chunk_markdown(md:str,min_chunk_lines=15) -> list[str]:
    chunks = strategy.chunk_markdown(markdown_text=md)
    output_chunks = []
    current_chunk = []
    for chunk in chunks:
        meaningful_lines = [
            line for line in chunk.splitlines() if line.strip() 
            and "intentionally ommited" not in line
        ]
        if len(current_chunk) < min_chunk_lines:
            current_chunk.extend([line for line in meaningful_lines])
        else:
            output_chunks.append(" ".join(current_chunk))
            current_chunk = [line for line in meaningful_lines]
    if current_chunk:
        output_chunks.append(" ".join(current_chunk))
    return output_chunks

