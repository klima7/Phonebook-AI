from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/messages/$", consumers.MessageConsumer.as_asgi()),
    re_path(r"ws/conversations/$", consumers.ConversationConsumer.as_asgi()),
]
