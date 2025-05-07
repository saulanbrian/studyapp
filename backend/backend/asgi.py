import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from user.routing import websocket_urlpatterns

from user.authentication import ClerkJWTAuthenticationMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket":AllowedHostsOriginValidator(
          ClerkJWTAuthenticationMiddleware(
            URLRouter(
              websocket_urlpatterns
            )
          )
        )
    }
)