from azure.ai.documentintelligence.models import AnalyzeResult, ParagraphRole
import httpx
import requests

from ..http_client import client
from .utils import construct_operation_value_error
from django.conf import settings
from celery.utils.log import get_logger
from io import BytesIO

from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient

from requests import request


logger = get_logger(__name__)

credential = AzureKeyCredential(
    settings.DOCUMENT_INTELLIGENCE_API_KEY
)

doc_intelligence_client = DocumentIntelligenceClient(
    settings.DOCUMENT_INTELLIGENCE_ENDPOINT,
    credential=credential
)


class SummarizerObject:


    def __init__(self, id:str) -> None:
        self.id = id
        self.err = None
        self.summary = None
        self.document = None
        self.content = None
        self.content_chunks = []
        self.output = None


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
                    lookup_value="doc_as_image"
                )
            return
        
        doc = BytesIO(self.document)
            
        poller = doc_intelligence_client.begin_analyze_document(
            "prebuilt-layout",
            body=doc
        )
        res:AnalyzeResult = poller.result()

        content = ""

        chunks = []
        current_chunk = ""
        current_has_title = False
        current_has_subheading = False
        
        if res.paragraphs:
            for p in res.paragraphs:
                if p.role == ParagraphRole.TITLE:
                    if current_has_title:
                        chunks.append(current_chunk)
                        current_chunk = ""
                    else:
                        current_chunk += f"Title: {p.content} \n"
                        current_has_title = True
                elif p.role == ParagraphRole.SECTION_HEADING:
                    if current_has_subheading:
                        chunks.append(current_chunk)
                        current_has_subheading = True
                    else:
                        current_chunk += f"SubHeading: {p.content} \n"
                        current_has_subheading = True
                elif p.role is None:
                    current_chunk += p.content

        self.content_chunks = [
            chunk for chunk in chunks if chunk.strip()
        ]

        
    def summarize(self):
        if not self.content_chunks:
            error = construct_operation_value_error(
                operation="summarize",
                lookup_value="content_chunks"
            )
            self.err = error
            return

        chunks_summary = []

        groq_key = settings.GROQ_API_KEY
        logger.info(groq_key)

        try:
            for chunk in self.content_chunks:
                res = httpx.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Content-Type":"application/json",
                        "Authorization": f"Bearer { groq_key }",
                        "api-key":groq_key
                    },
                    json={
                        "messages":[
                            {
                                "role": "user",
                                "content": f"summarize the following without losing context. \
                                don\'t overdo it and use basic english. text:{ chunk }",
                            }
                        ],
                        "model":"llama-3.1-8b-instant",
                    }
                    )
                res.raise_for_status()
                logger.info(res.content)
        except httpx.HTTPStatusError as e:
            logger.info(f"Groq Error: { e }")
            self.err = e
        except Exception as e:
            logger.info(f"Groq Error: { e }")
            self.err = e
        else:
            logger.info(f"chunks whole summary: \n {(''.join(chunks_summary))}")
        

    def update_summary(self):
        try:
            client.patch(f"summaries?select=*&id=eq.{self.id}", json={
                "status":"success" if not self.err else "error",
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
            self.summarize,
        ]

        for step in steps:
            if not self.err:
                step()
        self.update_summary()

    

