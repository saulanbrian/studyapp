import json 

from channels.generic.websocket import AsyncWebsocketConsumer
from celery.result import AsyncResult
from django_celery_results.models import TaskResult
from asgiref.sync import sync_to_async

class TaskConsumer(AsyncWebsocketConsumer):
  
  async def connect(self):
    self.task_id = self.scope["url_route"]["kwargs"]["task_id"]
    self.room_group_name = f'task_{self.task_id}'
    
    task_exists = self.check_task_existence()
    
    if task_exists:
      await self.channel_layer.group_add(
        self.room_group_name,
        self.channel_name
      )
      
      await self.accept()
      await self.send_initial_state()
    else:
      self.close(status=1000,reason='task doesnt exist')
      
      
  async def disconnect(self,close_code):
    await self.channel_layer.group_discard(
      self.room_group_name,
      self.channel_name
    )
    
  async def send_update(self,event):
    task_id = event['task_id']
    status = event['status']
    await self.send(json.dumps(
      {
      'task':task_id,
      'status':status
      }
    ))
    
    
  async def check_task_existence(self):
    try:
      await sync_to_async(TaskResult.objects.get)(pk=self.task_id)
      return True
    except TaskResult.DoesNotExist:
      return False
      
      
  async def send_initial_state(self):
    task = AsyncResult(self.task_id)
    await self.send(json.dumps(
      {
        'task_id':task.id,
        'status_on_connect':task.status
      }
    ))