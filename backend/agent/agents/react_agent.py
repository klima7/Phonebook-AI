import time

from conversations.models import Conversation, Message, MessageType


def react_agent(conversation: Conversation):
    time.sleep(3)
    Message.objects.create(
        conversation=conversation,
        content="Hello, how are you?",
        type=MessageType.ASSISTANT,
    )
