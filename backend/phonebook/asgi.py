import os

import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

# must be create before importhing anything else
# https://stackoverflow.com/questions/53683806/django-apps-arent-loaded-yet-when-using-asgi
django_asgi_app = get_asgi_application()

from users.authentication.channels import CustomWebsocketAuthenticationMiddleware
from .routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "phonebook.settings")

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        CustomWebsocketAuthenticationMiddleware(
            URLRouter(websocket_urlpatterns)
        )
    )
})
