import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { Contact } from '../services/contactService';

interface UpdateContactModalProps {
  show: boolean;
  onHide: () => void;
  contact: Contact;
  onEdit: (contact: Contact) => Promise<void>;
}

export default function UpdateContactModal({ show, onHide, contact, onEdit }: UpdateContactModalProps) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form fields when modal is opened with a different contact
  if (show && (name !== contact.name || phone !== contact.phone)) {
    setName(contact.name);
    setPhone(contact.phone);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onEdit({ ...contact, name, phone });
      onHide();
    } catch (error) {
      // Handle error if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onHide();
    setName(contact.name);
    setPhone(contact.phone);
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder="Enter name"
              autoFocus
              className="bg-white border border-secondary"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              required 
              placeholder="Enter phone number"
              className="bg-white border border-secondary"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          ) : null}
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 