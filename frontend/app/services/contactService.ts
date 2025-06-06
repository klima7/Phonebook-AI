import { useAuth } from '../contexts/AuthContext';

export interface Contact {
  id?: number;
  name: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export const useContactService = () => {
  const { getAuthHeader } = useAuth();

  const fetchContacts = async (): Promise<Contact[]> => {
    const response = await fetch('/api/contacts/', {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    
    return response.json();
  };

  const createContact = async (contact: Contact): Promise<Contact> => {
    const response = await fetch('/api/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(contact),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    
    return response.json();
  };

  const updateContact = async (contact: Contact): Promise<Contact> => {
    if (!contact.id) throw new Error('Contact ID is required for update');
    
    const response = await fetch(`/api/contacts/${contact.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(contact),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update contact');
    }
    
    return response.json();
  };

  const deleteContact = async (id: number): Promise<void> => {
    const response = await fetch(`/api/contacts/${id}/`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete contact');
    }
  };

  return {
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}; 