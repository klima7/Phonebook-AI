import contextlib
from contextvars import ContextVar
from typing import Optional

from django.contrib.auth.models import User

from conversations.models import Conversation


user_var: ContextVar[Optional[User]] = ContextVar('user', default=None)
conversation_var: ContextVar[Optional[Conversation]] = ContextVar('conversation', default=None)

def get_current_user() -> Optional[User]:
    return user_var.get()

def get_current_conversation() -> Optional[Conversation]:
    return conversation_var.get()


@contextlib.contextmanager
def with_user(user: User):
    token = user_var.set(user)
    try:
        yield
    finally:
        user_var.reset(token)

@contextlib.contextmanager
def with_conversation(conversation: Conversation):
    token = conversation_var.set(conversation)
    try:
        yield
    finally:
        conversation_var.reset(token)
