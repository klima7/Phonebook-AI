from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"api/ws/contacts/$", consumers.ContactsConsumer.as_asgi()),
]
