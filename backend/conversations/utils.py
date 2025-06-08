from contextlib import contextmanager

from .models import Conversation


@contextmanager
def conversation_progress(conversation: Conversation):
    conversation.in_progress = True
    conversation.save()
    try:
        yield
    finally:
        conversation.in_progress = False
        conversation.save()
