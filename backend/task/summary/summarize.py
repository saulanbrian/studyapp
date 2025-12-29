from enum import Enum
from backend.celery import app
from task.summary.summarizer import SummarizerObject
from ..http_client import client
from .utils import read_document, update_summary, get_summary
import httpx
from celery.utils.log import get_logger

logger = get_logger(__name__)



@app.task()
def process_summary(id:str):

    summarizer = SummarizerObject(id)    
    summarizer.start()
    if summarizer.err:
        logger.info(f"err:{summarizer.err} ",)
    else:
        return summarizer.output
