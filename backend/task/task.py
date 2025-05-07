from celery import shared_task
from channels.layers import get_channel_layer
import time
from asgiref.sync import async_to_sync

@shared_task(bind=True)
def greet(self, user_id):
    time.sleep(60)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'task_{self.request.id}',
        {
            'type': 'send_update',
            'status': 'SUCCESS',
            'task_id': self.request.id
        }
    )