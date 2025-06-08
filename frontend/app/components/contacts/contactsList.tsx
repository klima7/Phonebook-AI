import { Alert, Spinner, Row, Col } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ContactCard from "./contactCard";
import AddContactCard from "./addContactCard";
import { useContacts } from '../../hooks/useContacts';
import type { Contact } from '~/models';

const LoadingState = () => (
  <div className="text-center py-5">
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

interface ContactsGridProps {
  contacts: Contact[];
  onAdd: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
  onEdit: (contact: Contact) => Promise<Contact>;
  onDelete: (id: number) => Promise<void>;
}

const ContactsGrid = ({ contacts, onAdd, onEdit, onDelete }: ContactsGridProps) => {
  const [displayedContacts, setDisplayedContacts] = useState<Contact[]>([]);
  const [deletingContactIds, setDeletingContactIds] = useState<number[]>([]);
  
  // Update displayed contacts whenever the actual contacts list changes
  useEffect(() => {
    // Check for contacts that were in displayedContacts but are no longer in contacts
    // These are contacts that were deleted externally (via websocket)
    const currentContactIds = new Set(contacts.map(c => c.id));
    const previousContactIds = new Set(displayedContacts.map(c => c.id).filter(Boolean) as number[]);
    
    const externallyDeletedIds = [...previousContactIds].filter(id => !currentContactIds.has(id));
    
    if (externallyDeletedIds.length > 0) {
      // Mark these contacts for animation before removal
      setDeletingContactIds(prev => [...prev, ...externallyDeletedIds]);
      
      // After animation delay, update the displayed contacts
      setTimeout(() => {
        setDeletingContactIds(prev => prev.filter(id => !externallyDeletedIds.includes(id)));
        setDisplayedContacts(prev => prev.filter(c => c.id && !externallyDeletedIds.includes(c.id)));
      }, 300); // Match the animation duration
    } else {
      // No external deletions, just update the displayed contacts
      setDisplayedContacts(contacts);
    }
  }, [contacts]);
  
  // Handle local deletion (through delete button)
  const handleDelete = async (id: number) => {
    // Mark this contact for deletion animation
    setDeletingContactIds(prev => [...prev, id]);
    
    // The actual deletion will be handled by the ContactCard component
    // which will call onDelete after the animation
    await onDelete(id);
  };
  
  return (
    <div>
      <AnimatePresence mode="popLayout">
        <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={3} className="g-3">
          {displayedContacts.map(contact => {
            const isDeleting = contact.id ? deletingContactIds.includes(contact.id) : false;
            return (
              <Col key={contact.id}>
                <ContactCard
                  contact={contact}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  isExternallyDeleting={isDeleting}
                />
              </Col>
            );
          })}
          <Col>
            <AddContactCard onAdd={onAdd} />
          </Col>
        </Row>
      </AnimatePresence>
    </div>
  );
};

export default function ContactsList() {
  const { contacts, loading, error, addContact, updateContact, deleteContact } = useContacts();
  
  return (
    <>
      <h2 className="mb-4">Your Contacts</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingState />
      ) : (
        <ContactsGrid 
          contacts={contacts}
          onAdd={addContact}
          onEdit={updateContact}
          onDelete={deleteContact}
        />
      )}
    </>
  );
} 