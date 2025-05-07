import jwt
from urllib.parse import parse_qs
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async

from . models import ClerkUser as User

import logging

logger = logging.getLogger(__name__)

class ClerkJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            logger.warning("No Authorization header found")
            return None

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(
                token,
                settings.CLERK_JWT_PUBLIC_KEY,
                algorithms=['RS256'],
                issuer=settings.CLERK_ISSUER
            )
            logger.info("JWT payload: %s", payload)
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError as e:
            logger.error("Invalid token: %s", str(e))
            raise AuthenticationFailed('Invalid token')

        user_id = payload.get('sub')
        if not user_id:
            logger.warning("No 'sub' claim in JWT payload")
            return None

        try:
            user = User.objects.get(clerk_id=user_id)
            logger.info("Authenticated user: %s", user)
        except User.DoesNotExist:
            logger.error("User not found for clerk_id: %s", user_id)
            raise AuthenticationFailed('User not found')

        return (user, None)
        

class ClerkJWTAuthenticationMiddleware(BaseMiddleware):
  async def __call__(self, scope, receive, send):
    query_params = parse_qs(scope['query_string'].decode())
    token = query_params.get('token',[None])[0]
    user = None
    
    if token:
      try:
        payload = jwt.decode(
          token,
          settings.CLERK_JWT_PUBLIC_KEY,
          algorithms=['RS256'],
          issuer=settings.CLERK_ISSUER
        )
        user_id = payload.get('sub')
        if user_id:
          user = await self.get_user(user_id)
          
      except Exception as e:
        logger.error(e)
        
    scope['user'] = user
    return await super().__call__(scope,receive,send)
  
  @database_sync_to_async
  def get_user(self,clerk_id):
    try:
      user = User.objects.get(clerk_id=clerk_id)
      return user 
    except User.DoesNotExist:
      return None