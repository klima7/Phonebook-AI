import type { Contact } from '~/models';
import { useApi } from '../utils/api';

export const useContactApi = () => {
  const api = useApi();

  const fetchContacts = async (): Promise<Contact[]> => {
    const response = await api.get('/api/contacts/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    
    return response.json();
  };

  const createContact = async (contact: Contact): Promise<Contact> => {
    const response = await api.post('/api/contacts/', contact);
    
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    
    return response.json();
  };

  const updateContact = async (contact: Contact): Promise<Contact> => {
    if (!contact.id) throw new Error('Contact ID is required for update');
    
    const response = await api.put(`/api/contacts/${contact.id}/`, contact);
    
    if (!response.ok) {
      throw new Error('Failed to update contact');
    }
    
    return response.json();
  };

  const deleteContact = async (id: number): Promise<void> => {
    const response = await api.delete(`/api/contacts/${id}/`);
    
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