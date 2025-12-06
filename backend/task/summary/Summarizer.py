import httpx
from ..http_client import client

from celery.utils.log import get_logger

logger = get_logger(__name__)

class Summarizer:


    def __init__(self, id:str) -> None:
        self.id = id
        self.err = None
        self.summary = None
        self.document = None
        self.is_finished = False


    def get_summary(self):
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


    def update_summary(self):
        try:
            r = client.patch(f"summaries?select=*&id=eq.{self.id}", json={
                "status":"success"
            })
            logger.info(r.content)
        except Exception as e:
            self.err = e


    def set_is_finished(self,is_finished:bool):
        self.is_finished = is_finished
