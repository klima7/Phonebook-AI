import { useState, useEffect } from 'react';
import type { Route } from "./+types/home";
import { Container, Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { useContactService, type Contact } from "../services/contactService";
import { useMessageService, type Message } from "../services/messageService";
import ContactsList from "../components/ContactsList";
import Chat from "../components/Chat";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phonebook" },
    { name: "description", content: "Welcome to Phonebook!" },
  ];
}

export default function HomePage() {
  const { user, authInitialized } = useAuth();
  const contactService = useContactService();
  const messageService = useMessageService();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  const fetchContacts = async () => {
    setContactsLoading(true);
    setContactsError(null);
    try {
      const data = await contactService.fetchContacts();
      setContacts(data);
    } catch (err) {
      setContactsError('Failed to load contacts. Please try again later.');
      console.error(err);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchMessages = async (conversationId?: number) => {
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const data = await messageService.fetchMessages(conversationId);
      setMessages(data);
      if (conversationId) {
        setActiveConversationId(conversationId);
      }
    } catch (err) {
      setMessagesError('Failed to load messages. Please try again later.');
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data once auth is initialized
    if (authInitialized) {
      fetchContacts();
      fetchMessages();
    }
  }, [authInitialized]);

  const handleAddContact = async (contact: Omit<Contact, 'id'>) => {
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

  const handleSendMessage = async (content: string, conversationId?: number) => {
    try {
      const newMessage = await messageService.sendMessage(content, conversationId);
      setMessages(prev => [...prev, newMessage]);
      return Promise.resolve();
    } catch (err) {
      console.error('Error sending message:', err);
      return Promise.reject(err);
    }
  };

  const handleConversationChange = (conversationId: number | null) => {
    if (conversationId && conversationId !== activeConversationId) {
      setActiveConversationId(conversationId);
      fetchMessages(conversationId);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <Container fluid className="pt-4 px-4">
          <Row>
            <Col md={7}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5"
              >
                <ContactsList
                  contacts={contacts}
                  loading={contactsLoading}
                  error={contactsError}
                  onAddContact={handleAddContact}
                  onEditContact={handleEditContact}
                  onDeleteContact={handleDeleteContact}
                />
              </motion.div>
            </Col>
            
            <Col md={5}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Chat 
                  messages={messages}
                  loading={messagesLoading}
                  error={messagesError}
                  onSendMessage={handleSendMessage}
                  onConversationChange={handleConversationChange}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
