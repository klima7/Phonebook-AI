from celery import shared_task

from .models import Contact
from .weaviate import weaviate_add_contact, weaviate_update_contact


@shared_task
def add_contact_to_weaviate(contact_id: int):
    contact = Contact.objects.get(id=contact_id)
    weaviate_add_contact(contact)


@shared_task
def update_contact_in_weaviate(contact_id: int):
    contact = Contact.objects.get(id=contact_id)
    weaviate_update_contact(contact, update_embedding=True)
