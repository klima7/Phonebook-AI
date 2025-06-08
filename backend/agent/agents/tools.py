import json

from conversations.models import Message, MessageType
from contacts.models import Contact
from agent.context import get_current_user, get_current_conversation


def add_tool_message(message: str):
    Message.objects.create(
        conversation=get_current_conversation(),
        content=message,
        type=MessageType.TOOL,
    )


def create_contact(name: str, phone: str):
    """
    Create a new contact in the database.
    
    Args:
        name: The contact's name
        phone: The contact's phone number
    """
    add_tool_message(f"Creating contact: {name} with phone: {phone}")
    Contact.objects.create(
        user=get_current_user(),
        name=name,
        phone=phone,
    )


def delete_contact(contact_id: int):
    """
    Delete an existing contact from the database.
    
    Args:
        contact_id: The ID of the contact to delete
    """
    contact = Contact.objects.get(id=contact_id)
    add_tool_message(f"Deleting contact: {contact.name} with phone: {contact.phone}")
    contact.delete()


def update_contact(contact_id: int, name: str | None = None, phone: str | None = None):
    """
    Update an existing contact's information.
    
    Args:
        contact_id: The ID of the contact to update
        name: Optional new name for the contact
        phone: Optional new phone number for the contact
    """
    contact = Contact.objects.get(id=contact_id)
    
    if name and phone:
        add_tool_message(f"Updating contact: {contact.name} with name: {name} and phone: {phone}")
    elif name:
        add_tool_message(f"Updating contact: {contact.name} with new name: {name}")
    elif phone:
        add_tool_message(f"Updating contact: {contact.name} with new phone: {phone}")
    
    if name:
        contact.name = name
    if phone:
        contact.phone = phone
    contact.save()


def search_contacts(name: str, limit: int = 10):
    """
    Search for contacts by name (case-insensitive partial match).
    
    Args:
        name: The name to search for
        limit: Maximum number of results to return (default: 10)
        
    Returns:
        A JSON string containing the matching contacts with their name and phone number
    """
    add_tool_message(f"Searching for: {name}")
    contacts = get_current_user().contacts.filter(name__icontains=name)[:limit]
    contacts_json = [{"id": contact.id, "name": contact.name, "phone": contact.phone} for contact in contacts]
    return json.dumps(contacts_json, indent=2, ensure_ascii=False)
