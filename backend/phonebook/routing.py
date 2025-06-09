from django.conf import settings
from conversations.routing import websocket_urlpatterns as conversations_websocket_urlpatterns
from contacts.routing import websocket_urlpatterns as contacts_websocket_urlpatterns

websocket_urlpatterns = [
    *conversations_websocket_urlpatterns,
    *contacts_websocket_urlpatterns,
]
