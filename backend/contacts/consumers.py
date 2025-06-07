import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class ContactsConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope["user"]
        self.accept()
        async_to_sync(self.channel_layer.group_add)(f"contacts_{user.id}", self.channel_name)

    def disconnect(self, close_code):
        user = self.scope["user"]
        async_to_sync(self.channel_layer.group_discard)(f"contacts_{user.id}", self.channel_name)
        
    def receive(self, text_data):
        pass

    def contact_change(self, event):
        type = event['operation_type']
        id = event['id']
        value = event['value'] if 'value' in event else None
        data = {'type': type, 'id': id, 'value': value}
        self.send(text_data=json.dumps(data))
