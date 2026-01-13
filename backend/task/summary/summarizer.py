import requests
import httpx
from ..http_client import client
from .utils import construct_operation_value_error, parse_ollama_output
from django.conf import settings
from celery.utils.log import get_logger
from io import BytesIO
import pymupdf.layout
import pymupdf4llm
import json
from pydantic import BaseModel, RootModel
from typing import  List, Literal, Optional, TypedDict
from markdown_chunker import MarkdownChunkingStrategy

logger = get_logger(__name__)


strategy = MarkdownChunkingStrategy()


class JsonListItem(TypedDict):
    key:str
    value:str

class ListType(TypedDict):
    type:Literal["regular", "kv_pair"]
    content:list[str] | list[JsonListItem]

class ChunkSection(TypedDict):
    heading:str | None
    subheading:str | None
    text:str | None
    list:ListType | None


class ChunkOutputStructure(RootModel[List[ChunkSection]]):
    pass


system_prompt = """
You are a proffesor who prioritize efficiency rather than just effectiveness.
Your goal is to make a document that contains lessons easier to understand by simplifying
words and ommiting unneccessary information (eg. Instructor information). 
The documents you will get are partial/chunks, make sure each section makes sense—
make way if they don't. eg. If a section has a heading and list but there is no text,
make up a text that will connect the heading to the list, making it more sequential

Convert the chunk into a list of ChunkSection:

ChunkSection structure:

{
    "heading": string | null,
    "subheading": string | null,
    "text": string | null,
    "list": { 
        "type": "regular" | "kv_pair" 
        "content":string[] | { key: string, value:string }[]
    } | null
}

Rules:

1. **All lists must only contain strings. Never nest objects inside a list.**
2. **Each input is a json that contains two keys "index" and "content".
    if index is not equal to 0, every heading is a subheading
    unless two headings exist in one section—in that case the first one is the main heading.
    but if index is 0, the first heading in the first section must be set as heading, not a subheading
3. If list items are Word-Definition list type must be kv_pair,
    store the word to "key" and definition to "content", otherwise string. 
    list items must be consistent; if type is regular, all the items are string
4. Always prefer lists over paragraphs IF AND ONLY IF content is a sequence—even if marked by headings. 5. 
5. Output strictly valid JSON, no extra text.
6. Each key of ChunkSection must exist even it their values are null
7. Use emojis to make the content more engaging
8. Do not include unneccessary information (eg. Instructor information)
9. Use plain texts instead of markdown
"""


class SummarizerObject:


    def __init__(self, id:str) -> None:
        self.id = id
        self.err = None
        self.summary = None
        self.document = None
        self.md_chunks:list[str] = []
        self.output: List[ChunkSection] = []

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
                                "content": json.dumps({
                                    "index": index,
                                    "content": chunk
                                })
                            }
                        ],
                        "model":"ministral-3:14b",
                        "stream":False,
                        "format":ChunkOutputStructure.model_json_schema()
                    },
                    )
                res.raise_for_status()
                json_res = res.json()["message"]["content"]
                output = parse_ollama_output(json_res)
                validated = ChunkOutputStructure.model_validate(output)
                sections = validated.model_dump()
                for section in sections:
                    self.output.append(section)

        except requests.HTTPError as e:
            logger.info(f"Ollama Error: { e }")
            self.err = e
        except Exception as e:
            logger.info(e)
            self.err = e
        finally:
            for index, section in enumerate(self.output):
                logger.info(json.dumps(section, indent=2))

    def update_summary(self):
        try:
            client.patch(f"summaries?select=*&id=eq.{self.id}", json={
                "status":"error",
                "content":{"summary":self.output if self.output else "nigga"}
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

    

