from django.shortcuts import render
from rest_framework import viewsets, permissions, status, mixins
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
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
            
        conversation_id = self.kwargs['conversation_id']
        return Message.objects.filter(
            conversation_id=conversation_id,
        )
    
    def perform_create(self, serializer):
        serializer.save(type=MessageType.USER, conversation_id=self.kwargs['conversation_id'])
