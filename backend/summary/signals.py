from django.dispatch import receiver
from django.db.models.signals import post_save 

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Summary
from .serializers import SummarySerializer


