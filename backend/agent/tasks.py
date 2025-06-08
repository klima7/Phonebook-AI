from celery import shared_task

from conversations.models import Conversation
from conversations.utils import conversation_progress
from .agents import get_agent
from .context import with_user, with_conversation

@shared_task
def run_agent(conversation_id: int, agent_name: str):
    conversation = Conversation.objects.get(id=conversation_id)
    with conversation_progress(conversation):
        with with_user(conversation.user):
            with with_conversation(conversation):   
                agent = get_agent(agent_name)
                agent(conversation)
