from contacts.models import Contact


def create_contact(name: str, phone: str):
    Contact.objects.create(
        name=name,
        phone=phone,
    )


def delete_contact(contact_id: int):
    Contact.objects.get(id=contact_id).delete()


def update_contact(contact_id: int, name: str | None = None, phone: str | None = None):
    contact = Contact.objects.get(id=contact_id)
    if name:
        contact.name = name
    if phone:
        contact.phone = phone
    contact.save()


def search_contacts(name: str, limit: int = 10):
    return Contact.objects.filter(name__icontains=name)[:limit]
