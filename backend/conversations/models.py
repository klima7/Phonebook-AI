from django.db import models
from django.contrib.auth.models import User


class MessageType(models.TextChoices):
    USER = "user", "User"
    ASSISTANT = "assistant", "Assistant"
    TOOL = "tool", "Tool"
    THINKING = "thinking", "Thinking"
    
    
class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    in_progress = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}"
    
    def last_message_of_type(self, type: MessageType):
        return self.messages.filter(type=type).order_by("-created_at").first()
    
    def last_user_message(self):
        return self.last_message_of_type(MessageType.USER)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    type = models.CharField(max_length=10, choices=MessageType.choices)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Message: {self.type} - {self.content[:20]}"
