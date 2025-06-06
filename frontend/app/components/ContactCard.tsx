import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type { Contact } from '../services/contactService';
import { Pencil, Trash, X, Check } from 'react-bootstrap-icons';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onEdit({ ...contact, name, phone });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(contact.id!);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-100 shadow-sm">
          <Card.Body>
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
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={16} /> Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  <Check size={16} /> Save
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="h-100"
    >
      <Card className="h-100 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title>{contact.name}</Card.Title>
              <Card.Text className="text-muted">{contact.phone}</Card.Text>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="light" 
                size="sm" 
                className="p-1" 
                onClick={() => setIsEditing(true)}
                aria-label="Edit contact"
              >
                <Pencil size={16} />
              </Button>
              <Button 
                variant="light" 
                size="sm" 
                className="p-1" 
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete contact"
              >
                {isDeleting ? 
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 
                  <Trash size={16} />
                }
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
} 