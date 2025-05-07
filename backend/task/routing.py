from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/task/(?P<task_id>[0-9a-f-]+)/$", consumers.TaskConsumer.as_asgi()),
]