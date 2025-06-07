from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Contact
from .serializers import ContactSerializer


@receiver(post_save, sender=Contact)
def contact_created_or_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"contacts_{instance.user.id}",
        dict(
            type="contact.change",
            operation_type="create" if created else "update",
            id=instance.id,
            value=ContactSerializer(instance).data
        )
    )

@receiver(post_delete, sender=Contact)
def contact_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"contacts_{instance.user.id}",
        dict(
            type="contact.change",
            operation_type="delete",
            id=instance.id
        )
    )
