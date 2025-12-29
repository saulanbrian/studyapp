from io import BytesIO
import httpx
import pdfplumber
from celery.utils.log import get_logger
from ..http_client import client

logger = get_logger(__name__)


def get_summary(id:str):

    r = None
    err = None

    try:
        r = client.get(f"summaries?select=*&id=eq.{id}")
        r.raise_for_status()
        if len(r.json()) < 1:
            raise httpx.HTTPStatusError(
        message="Summary not found",
                request=r.request,
                response=r
            )
    except httpx.HTTPStatusError as e:
        logger.info(f"""
            Supabase Client Status Error: {e}
        """)
        err = e
    finally:
        return r, err


def read_document(path:str):
    try:
        r = httpx.get(path)
        r.raise_for_status()
        document = BytesIO(r.content)

        content = ""

        with pdfplumber.open(document) as doc:
            for page in doc.pages:
                content += page.extract_text()

        return content

    except httpx.HTTPStatusError as e:
        logger.error(f"""
            Supabase client returned an error status upon retreiving document: {e}
        """)
    except Exception as e:
        logger.error(f"Unexpected Error:{e}")


def update_summary(id:str,status:str):
    try:
        r = client.patch(f"summaries?id=eq.{id}",json={
            "status":status
        })
        r.raise_for_status()
    except httpx.HTTPStatusError as e:
        logger.error(f"""
            Supabase client returned and error status upon updating document: {e}
        """)


def construct_operation_value_error(operation:str,lookup_value:str):
    return ValueError(f"""
        Cannot proceed to the next operation: { operation } \
        value: { lookup_value } is either None or Unknown
    """)

