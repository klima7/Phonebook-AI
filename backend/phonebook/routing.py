from message.routing import websocket_urlpatterns as message_websocket_urlpatterns
from contacts.routing import websocket_urlpatterns as contacts_websocket_urlpatterns

websocket_urlpatterns = [
    *message_websocket_urlpatterns,
    *contacts_websocket_urlpatterns,
]
