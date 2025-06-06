import { useState } from 'react';
import { Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import type { Contact } from "../services/contactService";
import ContactCard from "./ContactCard";
import AddContactCard from "./AddContactCard";

interface ContactsListProps {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  onAddContact: (contact: Omit<Contact, 'id'>) => Promise<void>;
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
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          <Col>
            <AddContactCard onAdd={onAddContact} />
          </Col>
        </Row>
      ) : (
        <div className="contacts-grid">
          <AnimatePresence mode="popLayout">
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              <Col>
                <AddContactCard onAdd={onAddContact} />
              </Col>
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