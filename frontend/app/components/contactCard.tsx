import { useState, useEffect, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type { Contact } from '~/models';
import { Pencil, Trash } from 'react-bootstrap-icons';
import UpdateContactModal from './updateContactModal';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => Promise<Contact>;
  onDelete: (id: number) => Promise<void>;
}

export default function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cardState, setCardState] = useState('default');
  
  // Animation for recently created or updated contact
  useEffect(() => {
    const currentTime = new Date().getTime();
    let newState: 'created' | 'updated' | 'default' = 'default';
    
    // Check if created recently
    const createdTime = new Date(contact.created_at!).getTime();
    const timeSinceCreation = currentTime - createdTime;
    if (timeSinceCreation < 500) {
      newState = 'created';
    }
    
    // Check if updated recently
    const updatedTime = new Date(contact.updated_at!).getTime();
    const timeDifference = currentTime - updatedTime;
    if (timeDifference < 500) {
      newState = 'updated';
    }
    
    // Add animation if recently created or updated
    if (newState !== 'default') {
      setCardState(newState);
      const timeout = setTimeout(() => {
        setCardState('default');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [contact]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(contact.id!);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const getBackgroundColor = () => {
    switch (cardState) {
      case 'created':
        return 'rgba(40, 167, 69, 0.3)';
      case 'updated':
        return 'rgba(255, 193, 7, 0.3)';
      default:
        return 'white';
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="h-100"
      >
        <Card 
          className="h-100 shadow-sm" 
          style={{
            transition: 'background-color 1s ease',
            backgroundColor: getBackgroundColor()
          }}
        >
          <Card.Body className="d-flex flex-column">
            <div>
              <Card.Title>{contact.name}</Card.Title>
            </div>
            <div className="mt-auto d-flex justify-content-between align-items-center">
              <Card.Text className="text-muted mb-0">{contact.phone}</Card.Text>
              <div className="d-flex gap-2">
                <Button 
                  variant="light" 
                  size="sm" 
                  className="p-1" 
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="light" 
                  size="sm" 
                  className="p-1" 
                  onClick={handleDelete}
                  disabled={isDeleting}
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

      <UpdateContactModal 
        show={isEditing}
        onHide={() => setIsEditing(false)}
        contact={contact}
        onEdit={onEdit}
      />
    </>
  );
} 