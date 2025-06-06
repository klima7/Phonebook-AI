import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type { Contact } from '../services/contactService';

interface ContactFormProps {
  onSubmit: (contact: Contact) => Promise<void>;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({ name, phone });
      // Reset form
      setName('');
      setPhone('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <Button 
          variant="primary" 
          onClick={() => setIsOpen(true)}
          className="w-100"
        >
          Add New Contact
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card>
        <Card.Body>
          <Card.Title>Add New Contact</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Contact'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </motion.div>
  );
} 