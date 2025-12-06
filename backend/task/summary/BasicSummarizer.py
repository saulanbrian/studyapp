from io import BytesIO
from .SummaryModel import SummaryModel
from task.summary.utils import construct_operation_value_error
from .Summarizer import Summarizer
import pdfplumber
from google import genai
from google.genai import types
import io
import httpx
from ..gemini_client import gemini_client
from celery.utils.log import get_logger

logger = get_logger(__name__)


class BasicSummarizer(Summarizer):


    def __init__(self, id: str) -> None:
        super().__init__(id)
        self.content = None
        self.summary = None
        self.output = None


    def read_document(self):
        if not self.document:
            error = construct_operation_value_error(
                lookup_value="document",
                operation="read_document"
            )
            self.err = error
            return

        doc = BytesIO(self.document)
        with pdfplumber.open(doc) as file:
            content = ""
            for page in file.pages:
                content += page.extract_text()
            self.content = content


    def summarize(self):
        if not self.content:
            error = construct_operation_value_error(
                operation="summarize",
                lookup_value="content"
            )
            self.err = error
            return
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.0-flash-lite",
                contents=f"summarize this: \n {self.content}",
                config={
                    "response_mime_type":"application/json",
                    "response_json_schema": SummaryModel.model_json_schema()
                }
            )
            self.output = response.text
        except Exception as e:
            self.err = e
    
