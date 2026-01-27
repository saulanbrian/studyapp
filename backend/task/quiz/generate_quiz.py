from celery.utils.log import get_logger
from backend.celery import app
from task.quiz.quiz_maker import QuizMaker

logger = get_logger(__name__)

@app.task()
def generate_quiz(summary_id:str):

    generator = QuizMaker(summary_id)
    generator.start()

    if generator.err:
        logger.info(generator.err)
