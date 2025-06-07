from rest_framework import serializers
from .models import Message, Conversation


class MessageReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'type', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'type']


class MessageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['conversation', 'content'] 
        read_only_fields = ['conversation']


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'in_progress', 'created_at', 'updated_at']
        read_only_fields = ['id', 'in_progress', 'created_at', 'updated_at'] 
