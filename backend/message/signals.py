from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Message, Conversation
from .serializers import MessageSerializer, ConversationSerializer


@receiver(post_save, sender=Conversation)
def conversation_created_or_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"conversations_{instance.user.id}",
        dict(
            type="conversation.change",
            operation_type="create" if created else "update",
            id=instance.id,
            value=ConversationSerializer(instance).data
        )
    )


@receiver(post_delete, sender=Conversation)
def conversation_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"conversations_{instance.user.id}",
        dict(
            type="conversation.change",
            operation_type="delete",
            id=instance.id
        )
    )


@receiver(post_save, sender=Message)
def message_created_or_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"messages_{instance.conversation.user.id}",
        dict(
            type="message.change",
            operation_type="create" if created else "update",
            id=instance.id,
            value=MessageSerializer(instance).data
        )
    )


@receiver(post_delete, sender=Message)
def message_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"messages_{instance.conversation.user.id}",
        dict(
            type="message.change",
            operation_type="delete",
            id=instance.id
        )
    )
