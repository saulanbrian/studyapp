from .base import *


SECRET_KEY = os.environ.get("SECRET_KEY")

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL")
CELERY_BROKER_USE_SSL = {
    'ssl_cert_reqs': None
}
CELERY_REDIS_BACKEND_USE_SSL = {
    'ssl_cert_reqs': None
}
