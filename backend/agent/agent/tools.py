from django.db import IntegrityError
from conversations.models import Message, MessageType
from contacts.models import Contact
from agent.context import get_current_user, get_current_conversation
from contacts.weaviate import search_user_contacts
import re

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
    
    try:
        contact = Contact.objects.create(
            user=get_current_user(),
            name=name,
            phone=phone,
        )
    except IntegrityError:
        raise Exception("Contact with this name already exists")
    
    return _to_json(contact)

def delete_contact(contact_id: int) -> dict:
    """
    Delete an existing contact from the database.
    
    Args:
        contact_id: The ID of the contact to delete
        
    Returns:
        dict: Dictionary containing the deleted contact's information (id, name, phone)
    """
    contact = get_current_user().contacts.filter(id=contact_id).first()
    if contact is None:
        raise Exception("Contact not found")
    
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
    contact = get_current_user().contacts.filter(id=contact_id).first()
    if contact is None:
        raise Exception("Contact not found")
    
    _add_tool_message(f"Updating contact \"{contact.name}\"")
    
    if name:
        contact.name = name
    if phone:
        contact.phone = phone
    contact.save()
    
    return _to_json(contact)

def search_contacts(regex: str, limit: int = 20, offset: int = 0) -> list[dict]:
    """
    Search for contacts by name using regex pattern matching.
    
    Args:
        name: The regex pattern to search for in contact names
        limit: Maximum number of results to return (default: 10)
        offset: Number of results to skip (default: 0)
        
    Returns:
        list[dict]: List of dictionaries containing the matching contacts with their id, name and phone number, along with extra metadata including the total count of results
    """
    _add_tool_message(f"Searching for pattern \"{regex}\"")
    
    # Get all user contacts
    all_contacts = get_current_user().contacts.all()
    
    # Apply regex pattern matching
    pattern = re.compile(regex, re.IGNORECASE)
    matching_contacts = [contact for contact in all_contacts if pattern.search(contact.name)]
    
    # Calculate total count and apply pagination
    total_count = len(matching_contacts)
    paginated_contacts = matching_contacts[offset:offset+limit]
    
    return _to_json(paginated_contacts, {"total_count": total_count})


def search_contacts_semantic(query: str, limit: int = 20) -> list[dict]:
    """
    Search for contacts using semantic search (meaning-based) rather than exact text matching.
    Results from this functions may be not accurate and must be validated.
    
    Unlike search_contacts which uses regex matching, this function
    uses vector embeddings to find contacts semantically related to the query.
    Use it for searching for example "brother", "grandparent", "womans"
    
    Args:
        query: The semantic query to search for
        limit: Maximum number of results to return (default: 10)
        
    Returns:
        list[dict]: List of dictionaries containing the semantically matching contacts with their id, name and phone number
    """
    _add_tool_message(f"Searching semantically for \"{query}\"")
    contacts = search_user_contacts(get_current_user().id, query, limit)
    return _to_json(contacts)


def _add_tool_message(message: str):
    Message.objects.create(
        conversation=get_current_conversation(),
        content=message,
        type=MessageType.TOOL,
    )
    
    
def _to_json(contacts: Contact | list[Contact], extra: dict = {}):
    if isinstance(contacts, Contact):
        return {"id": contacts.id, "name": contacts.name, "phone": contacts.phone, **extra}
    else:
        return [{"id": contact.id, "name": contact.name, "phone": contact.phone, **extra} for contact in contacts]
