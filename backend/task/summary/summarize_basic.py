from enum import Enum
from backend.celery import app
from ..http_client import client
from .utils import read_document, update_summary, get_summary
import httpx
from celery.utils.log import get_logger
from .BasicSummarizer import BasicSummarizer

logger = get_logger(__name__)



@app.task()
def process_summary(id:str):

    summarizer = BasicSummarizer(id)
    while not summarizer.is_finished:
        summarizer.get_summary()
        summarizer.get_document()
        summarizer.read_document()
        summarizer.summarize()
        summarizer.update_summary()
        summarizer.set_is_finished(True)
    if summarizer.err:
        logger.info(summarizer.err)
    else:
        logger.info(summarizer.output)

    
