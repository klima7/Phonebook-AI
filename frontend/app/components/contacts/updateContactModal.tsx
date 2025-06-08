import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { Contact } from '~/models';
import PhoneInputField from './phoneInputField';

interface UpdateContactModalProps {
  show: boolean;
  onHide: () => void;
  contact: Contact;
  onEdit: (contact: Contact) => Promise<Contact>;
}

export default function UpdateContactModal({ show, onHide, contact, onEdit }: UpdateContactModalProps) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form fields when modal is opened with a different contact
  useEffect(() => {
    if (show) {
      setName(contact.name);
      setPhone(contact.phone);
    }
  }, [show, contact.name, contact.phone]);

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
            <PhoneInputField
              value={phone}
              onChange={setPhone}
              required
              className="w-100 bg-white border border-secondary"
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
          disabled={isSubmitting || !name.trim() || !phone.trim()}
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