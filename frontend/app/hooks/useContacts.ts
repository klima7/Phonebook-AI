import { useEffect, useState } from 'react';
import type { Contact } from '../services/contactService';
import { useContactService } from '../services/contactService';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contactService = useContactService();

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

    // Subscribe to real-time updates
    const unsubscribe = contactService.subscribeToContactUpdates(
      // Handle contact created
      (newContact) => {
        setContacts((prevContacts) => [...prevContacts, newContact]);
      },
      // Handle contact updated
      (updatedContact) => {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === updatedContact.id ? updatedContact : contact
          )
        );
      },
      // Handle contact deleted
      (deletedId) => {
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== deletedId)
        );
      }
    );

    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

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
