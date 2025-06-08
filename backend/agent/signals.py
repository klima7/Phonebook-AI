from django.db.models.signals import post_save
from django.dispatch import receiver

from conversations.models import Message, MessageType
from .tasks import run_agent


@receiver(post_save, sender=Message)
def run_agent_on_message(sender, instance, created, **kwargs):
    if created and instance.type == MessageType.USER:
        run_agent.delay(
            conversation_id=instance.conversation.id,
            agent_name="react",
        )
