from .consumers import UserChannelConsumer
from django.urls import re_path


websocket_urlpatterns = [
  re_path('ws/user_channels',UserChannelConsumer.as_asgi())
]