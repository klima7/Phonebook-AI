import { useEffect, useState } from 'react';
import type { Contact } from '~/models';
import { useContactService } from '../services/contactService';
import { useAuthedWebSocket } from '~/utils/websocket';

export interface ContactUpdate {
  type: 'create' | 'update' | 'delete';
  id: number;
  value?: Contact;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contactService = useContactService();
  const { lastJsonMessage } = useAuthedWebSocket('/api/ws/contacts/');

  useEffect(() => {
    const fetchInitialContacts = async () => {
      try {
        setLoading(true);
        const fetchedContacts = await contactService.fetchContacts();
        setContacts(fetchedContacts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch contacts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialContacts();
  }, []);

  useEffect(() => {
    if (!lastJsonMessage) return;
    
    const data = lastJsonMessage as ContactUpdate;
    
    switch (data.type) {
      case 'create':
        if (data.value) {
          setContacts((prevContacts) => [...prevContacts, data.value as Contact]);
        }
        break;
      case 'update':
        if (data.value) {
          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact.id === data.id ? data.value as Contact : contact
            )
          );
        }
        break;
      case 'delete':
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== data.id)
        );
        break;
    }
  }, [lastJsonMessage]);

  const addContact = async (contact: Omit<Contact, 'id'>) => {
    try {
      const newContact = await contactService.createContact(contact);
      // We don't need to update the state here as the WebSocket will handle it
      return newContact;
    } catch (err) {
      setError('Failed to add contact');
      throw err;
    }
  };

  const updateContact = async (contact: Contact) => {
    try {
      const updatedContact = await contactService.updateContact(contact);
      // We don't need to update the state here as the WebSocket will handle it
      return updatedContact;
    } catch (err) {
      setError('Failed to update contact');
      throw err;
    }
  };

  const deleteContact = async (id: number) => {
    try {
      await contactService.deleteContact(id);
      // We don't need to update the state here as the WebSocket will handle it
    } catch (err) {
      setError('Failed to delete contact');
      throw err;
    }
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact
  };
};
