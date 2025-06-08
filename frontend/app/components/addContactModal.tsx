import { useState, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { Contact } from '../services/contactService';
import PhoneInputField from './phoneInputField';

interface AddContactModalProps {
  show: boolean;
  onHide: () => void;
  onAdd: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
}

export default function AddContactModal({ show, onHide, onAdd }: AddContactModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd({ name, phone });
      // Reset form
      setName('');
      setPhone('');
      onHide();
    } catch (error) {
      // Handle error if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onHide();
    setName('');
    setPhone('');
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} ref={formRef}>
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
          onClick={() => formRef.current?.requestSubmit()}
          disabled={isSubmitting || !name.trim() || !phone.trim()}
        >
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          ) : null}
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 