import { Alert, Spinner, Row, Col } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import ContactCard from "./contactCard";
import AddContactCard from "./addContactCard";
import { useContacts } from '../hooks/useContacts';
import type { Contact } from '../services/contactService';

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

const ContactsGrid = ({ contacts, onAdd, onEdit, onDelete }: ContactsGridProps) => (
  <div>
    <AnimatePresence mode="popLayout">
      <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={3} className="g-3">
        {contacts.map(contact => (
          <Col key={contact.id}>
            <ContactCard
              contact={contact}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Col>
        ))}
        <Col>
          <AddContactCard onAdd={onAdd} />
        </Col>
      </Row>
    </AnimatePresence>
  </div>
);

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