import time

from conversations.models import Conversation, Message, MessageType


def react_agent(conversation: Conversation):
    user_message = conversation.last_user_message()
    time.sleep(3)
    Message.objects.create(
        conversation=conversation,
        content=f"Hello, you written: {user_message.content}",
        type=MessageType.ASSISTANT,
    )
