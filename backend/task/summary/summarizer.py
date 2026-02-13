import requests
import httpx

from task.utils import chunk_markdown, get_completion
from ..http_client import supabase_rest_client, supabase_storage_client
from .utils import clean_markdown, construct_operation_value_error, get_summary 
from django.conf import settings
from celery.utils.log import get_logger
from io import BytesIO
import pymupdf.layout
import pymupdf4llm
from pydantic import BaseModel, RootModel
from typing import  List, Literal, Optional, TypedDict
from markdown_chunker import MarkdownChunkingStrategy

logger =get_logger(__name__)


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
COREPRINCIPLES (STRICT)
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


finalize_prompt = """
You are a content refiner for educational Markdown documents.

Your task is to refine an already simplified Markdown document into a
shorter, clearer, and better-structured version for teenage
non-native English readers.

This IS NOT summarization.
This IS NOT rewriting into a new document.
This IS controlled refinement and compression.

─────────────────────────────
CORE GOALS
─────────────────────────────
• Keep the original meaning and learning value.
• Make long explanations shorter while keeping context.
• Remove repeated or unnecessary text.
• Use very simple, natural English.
• Avoid formal or academic tone unless required.
• Improve spacing and Markdown hierarchy.

─────────────────────────────
WHAT YOU MAY REMOVE
─────────────────────────────
• Repeated explanations of the same idea.
• Long examples if the idea is already clear.
• Filler phrases that add no meaning.
• Overly detailed background that does not help understanding.

─────────────────────────────
WHAT YOU MUST NEVER REMOVE
─────────────────────────────
• Definitions and key concepts.
• Cause-and-effect explanations.
• Lists that introduce new ideas.
• Headings that define structure.
• Tables (must always stay).

─────────────────────────────
STRUCTURE & MARKDOWN FIXING
─────────────────────────────
• Fix bad heading hierarchy (e.g., ### under # without ##).
• Do NOT invent new sections.
• Do NOT merge unrelated sections.
• Ensure headings match their content.
• Add missing blank lines for mobile reading.

─────────────────────────────
PRECISION RULE (VERY IMPORTANT)
─────────────────────────────
• Do NOT replace specific terms with more generic ones.
• Do NOT remove words that limit or define the exact meaning.
Bad example:
“A specific group performs a task.”
→ “People perform a task.” ❌
Correct example:
“A specific group performs a task.”
→ “That specific group performs the task.” ✅
Bad example:
“A clearly defined type of thing”
→ “A thing” ❌
Correct example:
“A clearly defined type of thing”
→ “That defined type of thing.” ✅

─────────────────────────────
LANGUAGE RULES
─────────────────────────────
• Use short sentences.
• Use common words.
• Explain ideas directly.
• Sound natural, not academic.
• If a sentence is already clear, keep it.

─────────────────────────────
EMOJIS (ENGAGING BUT CONTROLLED)
─────────────────────────────
• Emojis ARE encouraged to improve engagement and scanning.
• Emojis may be used in:
  - Headings
  - Subheadings
  - The start of short list items
• Do NOT use emojis inside long paragraphs.
• Use at most ONE emoji per line.
• Emojis must support meaning, not decoration.

Good use:
## 🌍 Types of Systems
• ⚙️ Mechanical systems
• 🧠 Biological systems

Bad use:
This 🌟 system 🌟 is 🌟 very 🌟 important ❌

─────────────────────────────
OUTPUT RULES
─────────────────────────────
• Output RAW Markdown only.
• Do NOT use code fences.
• Do NOT add explanations or notes.
• Do NOT mention these rules.
"""


class SummarizerObject:


    def __init__(self, id:str) -> None:
        self.id = id
        self.err = None
        self.summary = None
        self.document = None
        self.md_chunks:list[str] = []
        self.output_chunks: list[str] =  []
        self.final_output = None

    def get_summary_object(self):
        try:
            r = get_summary(self.id)
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
            r = supabase_storage_client.get(
                f"summary_bucket/{document_url}"
            )
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
            self.md_chunks = chunk_markdown(
                md=md_text,
                min_chunk_lines=20
            )


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
                res = get_completion(
                    messages=[
                        {
                            "role":"system",
                            "content":system_prompt
                        },
                        {
                            "role":"user",
                            "content":chunk
                        }
                    ]
                )
                res.raise_for_status()
                content = res.json()["message"]["content"]
                final_output = clean_markdown(content)
                self.output_chunks.append(final_output)

        except requests.HTTPError as e:
            logger.info(f"Ollama Error: { e }")
            self.err = e
        except Exception as e:
            logger.info(e)
            self.err = e


    def update_summary(self):
        try:
            supabase_rest_client.patch(f"summaries?select=*&id=eq.{self.id}", json={
                "status":"success" if self.final_output else "error",
                "content": self.final_output if self.final_output else None
            }).raise_for_status()
        except Exception as e:
            self.err = e
        finally:
            return self.final_output


    def refine_summary(self):
        if not self.output_chunks or len(self.output_chunks) < 1:
            self.err = construct_operation_value_error(
                lookup_value="output (chunks)",
                operation="refine_summary"
            )
            return
        try:
            r = get_completion(messages=[
                {
                    "role":"system",
                    "content":finalize_prompt
                },
                {
                    "role":"user",
                    "content":"\n\n".join(self.output_chunks)
                }
            ])
            r.raise_for_status()
            output = r.json()["message"]["content"]
            self.final_output = clean_markdown(output)
        except requests.HTTPError as e:
            logger.info(f"ollama error: { e }")
            self.err = e
        except Exception as e:
            logger.info(e)
            self.err = e


    def start(self):
        steps = [
            self.get_summary_object,
            self.get_document,
            self.read_document,
            self.summarize,
            self.refine_summary
        ]

        for step in steps:
            if not self.err:
                step()
        self.update_summary()

    

