from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"api/ws/conversations/(?P<conversation_id>[^/.]+)/messages/$", consumers.MessageConsumer.as_asgi()),
    re_path(r"api/ws/conversations/$", consumers.ConversationConsumer.as_asgi()),
]
