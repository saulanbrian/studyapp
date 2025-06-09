import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from user.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

asgi_app = get_asgi_application()

from user.authentication import ClerkJWTAuthenticationMiddleware

application = ProtocolTypeRouter(
    {
        "http": asgi_app,
        "websocket":AllowedHostsOriginValidator(
          ClerkJWTAuthenticationMiddleware(
            URLRouter(
              websocket_urlpatterns
            )
          )
        )
    }
)
