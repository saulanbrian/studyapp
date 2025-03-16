# your_app/authentication.py
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

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
        
