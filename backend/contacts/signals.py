from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Contact
from .serializers import ContactSerializer
from .weaviate import weaviate_delete_contact
from .tasks import add_contact_to_weaviate, update_contact_in_weaviate


@receiver(post_save, sender=Contact)
def send_create_update_notification(sender, instance, created, **kwargs):
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
def send_delete_notification(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"contacts_{instance.user.id}",
        dict(
            type="contact.change",
            operation_type="delete",
            id=instance.id
        )
    )


@receiver(post_save, sender=Contact)
def add_contact_to_weaviate_signal(sender, instance, created, **kwargs):
    if created:
        add_contact_to_weaviate.delay(instance.id)
    else:
        update_contact_in_weaviate.delay(instance.id)
    
    
@receiver(post_delete, sender=Contact)
def delete_contact_from_weaviate_signal(sender, instance, **kwargs):
    weaviate_delete_contact(instance)
