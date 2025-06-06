import { useState } from 'react';
import { Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import type { Contact } from "../services/contactService";
import ContactCard from "./ContactCard";
import ContactForm from "./ContactForm";

interface ContactsListProps {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  onAddContact: (contact: Contact) => Promise<void>;
  onEditContact: (contact: Contact) => Promise<void>;
  onDeleteContact: (id: number) => Promise<void>;
}

export default function ContactsList({
  contacts,
  loading,
  error,
  onAddContact,
  onEditContact,
  onDeleteContact
}: ContactsListProps) {
  return (
    <>
      <h2 className="mb-4">Your Contacts</h2>
      
      <ContactForm onSubmit={onAddContact} />

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : contacts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="text-center p-5">
            <Card.Body>
              <p className="mb-0 text-muted">No contacts found. Add your first contact above!</p>
            </Card.Body>
          </Card>
        </motion.div>
      ) : (
        <div className="contacts-grid">
          <AnimatePresence mode="popLayout">
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              {contacts.map(contact => (
                <Col key={contact.id}>
                  <ContactCard
                    contact={contact}
                    onEdit={onEditContact}
                    onDelete={onDeleteContact}
                  />
                </Col>
              ))}
            </Row>
          </AnimatePresence>
        </div>
      )}
    </>
  );
} 