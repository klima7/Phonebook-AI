from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Message
from .serializers import MessageReadSerializer


@receiver(post_save, sender=Message)
def message_created_or_updated(sender, instance, created, **kwargs):
    print("Message created or updated", flush=True)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"messages_{instance.user.id}",
        dict(
            type="message.change",
            operation_type="create" if created else "update",
            id=instance.id,
            value=MessageReadSerializer(instance).data
        )
    )

@receiver(post_delete, sender=Message)
def message_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"messages_{instance.user.id}",
        dict(
            type="message.change",
            operation_type="delete",
            id=instance.id
        )
    )
