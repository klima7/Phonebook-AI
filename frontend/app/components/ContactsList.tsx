import { Alert, Spinner, Row, Col } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import ContactCard from "./ContactCard";
import AddContactCard from "./AddContactCard";
import { useContacts } from '../hooks/useContacts';

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
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : contacts.length === 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          <Col>
            <AddContactCard onAdd={addContact} />
          </Col>
        </Row>
      ) : (
        <div className="contacts-grid">
          <AnimatePresence mode="popLayout">
            <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={3} className="g-3">
              {contacts.map(contact => (
                <Col key={contact.id}>
                  <ContactCard
                    contact={contact}
                    onEdit={updateContact}
                    onDelete={deleteContact}
                  />
                </Col>
              ))}
              <Col>
                <AddContactCard onAdd={addContact} />
              </Col>
            </Row>
          </AnimatePresence>
        </div>
      )}
    </>
  );
} 