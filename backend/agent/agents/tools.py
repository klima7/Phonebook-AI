import json

from conversations.models import Message, MessageType
from contacts.models import Contact
from agent.context import get_current_user, get_current_conversation


def create_contact(name: str, phone: str) -> dict:
    """
    Create a new contact in the database.
    
    Args:
        name: The contact's name
        phone: The contact's phone number
        
    Returns:
        dict: Dictionary containing the created contact's information (id, name, phone)
    """
    _add_tool_message(f"Creating contact \"{name}\" with phone \"{phone}\"")
    contact = Contact.objects.create(
        user=get_current_user(),
        name=name,
        phone=phone,
    )
    return _to_json(contact)

def delete_contact(contact_id: int) -> dict:
    """
    Delete an existing contact from the database.
    
    Args:
        contact_id: The ID of the contact to delete
        
    Returns:
        dict: Dictionary containing the deleted contact's information (id, name, phone)
    """
    contact = Contact.objects.get(id=contact_id)
    _add_tool_message(f"Deleting \"{contact.name}\"")
    contact.delete()
    return _to_json(contact)


def update_contact(contact_id: int, name: str | None = None, phone: str | None = None) -> dict:
    """
    Update an existing contact's information.
    
    Args:
        contact_id: The ID of the contact to update
        name: Optional new name for the contact
        phone: Optional new phone number for the contact
        
    Returns:
        dict: Dictionary containing the updated contact's information (id, name, phone)
    """
    contact = Contact.objects.get(id=contact_id)
    
    _add_tool_message(f"Updating contact \"{contact.name}\"")
    
    if name:
        contact.name = name
    if phone:
        contact.phone = phone
    contact.save()
    
    return _to_json(contact)

def search_contacts(name: str, limit: int = 10) -> list[dict]:
    """
    Search for contacts by name (case-insensitive partial match).
    
    Args:
        name: The name to search for
        limit: Maximum number of results to return (default: 10)
        
    Returns:
        list[dict]: List of dictionaries containing the matching contacts with their id, name and phone number
    """
    _add_tool_message(f"Searching for \"{name}\"")
    contacts = get_current_user().contacts.filter(name__icontains=name)[:limit]
    return _to_json(contacts)


def _add_tool_message(message: str):
    Message.objects.create(
        conversation=get_current_conversation(),
        content=message,
        type=MessageType.TOOL,
    )
    
    
def _to_json(contacts: Contact | list[Contact]):
    if isinstance(contacts, Contact):
        return {"id": contacts.id, "name": contacts.name, "phone": contacts.phone}
    else:
        return [{"id": contact.id, "name": contact.name, "phone": contact.phone} for contact in contacts]
