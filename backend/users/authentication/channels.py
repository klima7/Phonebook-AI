from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token


class CustomWebsocketAuthenticationMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        try:
            subprotocols = scope.get('subprotocols', [])
            token = None
            
            for protocol in subprotocols:
                if protocol.startswith('token.'):
                    token = protocol[6:]  # Remove 'token.' prefix
                    break
            
            if not token:
                raise Exception("No authentication token provided")
            
            user = await self.authenticate(token)
            
            scope['user'] = user
            
            return await super().__call__(scope, receive, send)
            
        except Exception as e:
            await send({
                'type': 'websocket.close',
                'code': 3000,
                'text': str(e)
            })
            return
    
    @database_sync_to_async
    def authenticate(self, token):
        """Authenticate the token and return the user"""
        token_obj = Token.objects.get(key=token)
        return token_obj.user
