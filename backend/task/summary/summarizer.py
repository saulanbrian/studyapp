import requests
import httpx
from ..http_client import client
from .utils import clean_markdown, construct_operation_value_error 
from django.conf import settings
from celery.utils.log import get_logger
from io import BytesIO
import pymupdf.layout
import pymupdf4llm
from pydantic import BaseModel, RootModel
from typing import  List, Literal, Optional, TypedDict
from markdown_chunker import MarkdownChunkingStrategy

logger = get_logger(__name__)


strategy = MarkdownChunkingStrategy()


system_prompt = """
You are a content processor for educational documents.

Your task is to convert Markdown input into **clean, mobile-ready Markdown**
using **Basic English**, while preserving the **original meaning, structure,
and completeness** of the document.

This is NOT summarization.
This is NOT rewriting into a new document.
This is STRICT sentence-level simplification.

─────────────────────────────
CORE PRINCIPLES (STRICT)
─────────────────────────────
• Preserve ALL content and ideas.
• Preserve ALL headings, subheadings, lists, tables, and blockquotes.
• Do NOT remove sections unless they are clearly administrative
  (names, emails, dates, log lines, system messages).
• Simplify ONLY sentences — never remove concepts.
• Convert complex English into **Basic English**:
  - Short sentences
  - Common words
  - Clear cause-and-effect
• When a technical term is unavoidable:
  - Keep the term
  - Add a **short, basic explanation** immediately after it.

Example:
“Greenhouse gases trap infrared radiation”
→ “Greenhouse gases trap heat (infrared radiation) in the air.”

─────────────────────────────
EMOJIS (CONTROLLED)
─────────────────────────────
• Emojis are allowed ONLY in headings (#, ##, ###).
• Emojis should help understanding, not decoration.
• Do NOT use emojis in paragraphs, bullets, or tables.

─────────────────────────────
STRUCTURE & CONTINUITY
─────────────────────────────
• Treat each chunk as part of ONE continuous document.
• Do NOT repeat headings unnecessarily.
• Do NOT reset tone or structure between chunks.
• Ensure smooth reading when chunks are joined together.

─────────────────────────────
SPACING & MOBILE READABILITY
─────────────────────────────
• Always insert a blank line between:
  - A heading and the next paragraph
  - A paragraph and a list or table
• Restore spacing logically if blank lines were removed earlier.
• Keep paragraphs short (2–4 lines max on mobile).

─────────────────────────────
LISTS & ENUMERATIONS
─────────────────────────────
• Preserve bullet order exactly.
• Preserve numbering (1., 2., 3.).
• Do NOT merge or split list items.
• If a list item is a long sentence:
  - Simplify the sentence
  - Keep it as ONE list item.

─────────────────────────────
KEY-VALUE & DEFINITION LINES
─────────────────────────────
Some lines may appear as plain text in this form:

word: meaning

Rules:
• Detect these as definitions.
• Keep them on ONE line.
• Simplify the meaning using Basic English.
• Do NOT convert them into tables or bullets unless already formatted.

─────────────────────────────
TABLES
─────────────────────────────
• Preserve tables exactly as tables.
• Do NOT remove tables.
• Simplify text inside cells using Basic English.
• Remove excessive spacing inside cells.
• Do NOT add emojis to tables.

─────────────────────────────
TEXT SIMPLIFICATION (VERY IMPORTANT)
─────────────────────────────
• Use Basic English only:
  - Prefer common words
  - Avoid academic phrasing
  - Avoid long dependent clauses
• Break long sentences into shorter ones.
• Keep explanations direct and concrete.
• If a sentence is already simple, DO NOT change it.
• Do NOT sound formal or academic.
• Clarity is more important than elegance.

─────────────────────────────
OUTPUT RULES
─────────────────────────────
• Output RAW Markdown only.
• Do NOT use triple backticks or any code fences.
• Do NOT include explanations, notes, or metadata.
• Do NOT mention the rules.
• Ensure the final Markdown is:
  - Easy to read
  - Easy to scan
  - Easy to understand for beginners
"""

class SummarizerObject:


    def __init__(self, id:str) -> None:
        self.id = id
        self.err = None
        self.summary = None
        self.document = None
        self.md_chunks:list[str] = []
        self.output: list[str] =  []

    def get_summary_object(self):
        try:
            r = client.get(f"summaries?select=*&id=eq.{self.id}")
            r.raise_for_status()
            if len(r.json()) < 1:
                raise httpx.HTTPStatusError(
                    message="Summary Not Found",
                    request=r.request,
                    response=r
                )
            self.summary = r.json()[0]
                
        except httpx.HTTPStatusError as e:
            logger.error(f"""
                Supabase Client Status Error 
                pon retrieving summary: {e}
            """)
            self.err = e


    def get_document(self):
        if not self.summary:
            return 

        try:
            document_url = self.summary["document_url"]
            r = client.get(document_url)
            r.raise_for_status()
            self.document = r.content
        except httpx.HTTPStatusError as e:
            logger.error(f"""
                Supabase Client Status Error
                upon retrieving document: {e}
            """)
            self.err = e


    def read_document(self):
        if not self.document:
            self.err = construct_operation_value_error(
                    operation="read_doc_as_image",
                    lookup_value="document"
                )
            return
        
        doc_bytes  = BytesIO(self.document)
        with pymupdf.open(stream=doc_bytes) as doc:
            md_text = pymupdf4llm.to_markdown(doc)
            if not isinstance(md_text,str):
                return
            chunks = strategy.chunk_markdown(markdown_text=md_text)
            current_chunk = []
            for index, chunk in enumerate(chunks):

                lines = chunk.splitlines()
                meaningful_lines = [
                    line for line in lines if line.strip() 
                    and "intentionally omitted" not in line
                ]
                current_chunk.extend([line for line in meaningful_lines]) 

                if len(current_chunk) >= 15:
                    self.md_chunks.append("\n".join(current_chunk))
                    current_chunk = []

            if current_chunk:
                self.md_chunks.append("\n".join(current_chunk))
                


    def summarize(self):
        if not self.md_chunks:
            error = construct_operation_value_error(
                operation="summarize",
                lookup_value="document_chunks"
            )
            self.err = error
            return

        try:
            for index, chunk in enumerate(self.md_chunks):

                if index > 5:
                    return 

                res = requests.post(
                    "https://ollama.com/api/chat",
                    headers={
                        'Authorization': f'Bearer {settings.OLLAMA_API_KEY}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        "messages":[
                            {
                                "role":"system",
                                "content":system_prompt
                            },
                            {
                                "role": "user",
                                "content": chunk
                            }
                        ],
                        "model":"ministral-3:14b",
                        "stream":False,
                    },
                    )
                res.raise_for_status()
                content = res.json()["message"]["content"]
                final_output = clean_markdown(content)
                self.output.append(final_output)

        except requests.HTTPError as e:
            logger.info(f"Ollama Error: { e }")
            self.err = e
        except Exception as e:
            logger.info(e)
            self.err = e

    def update_summary(self):
        try:
            client.patch(f"summaries?select=*&id=eq.{self.id}", json={
                "status":"success" if self.output else "error",
                "content":" ".join(self.output) if self.output else None
            }).raise_for_status()
        except Exception as e:
            self.err = e
        finally:
            return self.output


    def start(self):
        steps = [
            self.get_summary_object,
            self.get_document,
            self.read_document,
            self.summarize
        ]

        for step in steps:
            if not self.err:
                step()
        self.update_summary()

    

