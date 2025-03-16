from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status 
import json


from .models import ClerkUser

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def webhook_listener(request):
  payload = json.loads(request.body)
  
  user_data = payload.get('data')
  event_type = payload.get('type')
  user_id = user_data.get('id')
  
  if event_type == 'user.created':
    ClerkUser.objects.create(clerk_id=user_id)
  if event_type == 'user.deleted':
    try:
      user = ClerkUser.objects.get(clerk_id=user_id)
      user.delete()
    except ClerkUser.DoesNotExist:
      pass
  
  return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
  user_id = request.user.clerk_id
  return Response({'data':user_id})