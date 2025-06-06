import { useState, useEffect } from 'react';
import type { Route } from "./+types/home";
import { Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { useContactService, type Contact } from "../services/contactService";
import ContactsList from "../components/ContactsList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phonebook" },
    { name: "description", content: "Welcome to Phonebook!" },
  ];
}

export default function HomePage() {
  const { user, authInitialized } = useAuth();
  const contactService = useContactService();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.fetchContacts();
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch contacts once auth is initialized
    if (authInitialized) {
      fetchContacts();
    }
  }, [authInitialized]);

  const handleAddContact = async (contact: Contact) => {
    try {
      const newContact = await contactService.createContact(contact);
      setContacts(prev => [...prev, newContact]);
      return Promise.resolve();
    } catch (err) {
      console.error('Error adding contact:', err);
      return Promise.reject(err);
    }
  };

  const handleEditContact = async (updatedContact: Contact) => {
    try {
      const result = await contactService.updateContact(updatedContact);
      setContacts(prev => 
        prev.map(contact => 
          contact.id === updatedContact.id ? result : contact
        )
      );
      return Promise.resolve();
    } catch (err) {
      console.error('Error updating contact:', err);
      return Promise.reject(err);
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await contactService.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      return Promise.resolve();
    } catch (err) {
      console.error('Error deleting contact:', err);
      return Promise.reject(err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-5 min-vh-100">
        <Container className="py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-sm mb-4">
              <Card.Body className="p-4">
                <h1 className="text-center mb-3">Welcome to Phonebook</h1>
                <p className="text-center text-muted mb-3">
                  Your AI powered phonebook!
                </p>
                {user && (
                  <h5 className="text-center mb-3">
                    Hello, {user.username}!
                  </h5>
                )}
              </Card.Body>
            </Card>

            <ContactsList
              contacts={contacts}
              loading={loading}
              error={error}
              onAddContact={handleAddContact}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
            />
          </motion.div>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
