from channels.generic.websocket import AsyncWebsocketConsumer
import json

class UserChannelConsumer(AsyncWebsocketConsumer):
  
  async def connect(self):
    user = self.scope['user']
    
    if not user:
      await self.close(code=4000)
    
    self.room_group_name = f'user_{user.clerk_id}'
    
    await self.channel_layer.group_add(
      self.room_group_name,
      self.channel_name
    )
    
    await self.accept()

    await self.send(json.dumps({
      "conneced":self.room_group_name
    }))

  
  async def summary_update(self,event):

    print('updated summary')

    await self.send(json.dumps({
      'msg_type':'summary_update',
      'updated_summary':event['updated_summary']
    }))


  async def quiz_update(self,event):

    await self.send(json.dumps({
      'msg_type':'quiz_update',
      'updated_quiz':event['updated_quiz']
    }))
