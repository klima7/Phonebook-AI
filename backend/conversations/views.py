from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError

from .models import Message, MessageType, Conversation
from .serializers import MessageSerializer, ConversationSerializer


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Conversation.objects.none()
        return Conversation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Message.objects.none()
            
        conversation_id = int(self.kwargs['conversation_id'])
        return Message.objects.filter(
            conversation_id=conversation_id,
        )
    
    def perform_create(self, serializer):
        conversation = Conversation.objects.get(id=int(self.kwargs['conversation_id']))
        if conversation.in_progress:
            raise ValidationError("Unable to add message to a conversation that is in progress")
        serializer.save(type=MessageType.USER, conversation=conversation)
