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
  isExternallyDeleting?: boolean;
}

export default function ContactCard({ contact, onEdit, onDelete, isExternallyDeleting = false }: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cardState, setCardState] = useState('default');
  const contactRef = useRef(contact);
  const isBeingDeletedExternally = useRef(false);
  
  // Track if contact has been removed from the parent's list
  useEffect(() => {
    // If we still have the contact reference but the id has changed, 
    // it likely means this component is being reused for a different contact
    if (contactRef.current.id !== contact.id) {
      contactRef.current = contact;
      isBeingDeletedExternally.current = false;
      return;
    }
    
    // Update our ref to the latest contact data
    contactRef.current = contact;
  }, [contact]);
  
  // Detect if the component is about to be unmounted (possibly due to deletion)
  useEffect(() => {
    return () => {
      // Only trigger the deletion animation if we're not already handling a manual deletion
      // and we haven't detected this as being deleted externally before
      if (!isDeleting && !isBeingDeletedExternally.current) {
        isBeingDeletedExternally.current = true;
        // We can't actually delay unmounting here, but we can inform parent components
        // about what's happening through an event or callback if needed
      }
    };
  }, [isDeleting]);
  
  // Handle external deletion animation
  useEffect(() => {
    if (isExternallyDeleting && !isDeleting) {
      setCardState('deleting');
    }
  }, [isExternallyDeleting, isDeleting]);
  
  // Animation for recently created or updated contact
  useEffect(() => {
    // Don't override deleting state with other animations
    if (cardState === 'deleting') return;
    
    const currentTime = new Date().getTime();
    let newState: 'created' | 'updated' | 'default' = 'default';

    // Check if updated recently
    const updatedTime = new Date(contact.updated_at!).getTime();
    const timeDifference = currentTime - updatedTime;
    if (timeDifference < 500) {
      newState = 'updated';
    }
    
    // Check if created recently
    const createdTime = new Date(contact.created_at!).getTime();
    const timeSinceCreation = currentTime - createdTime;
    if (timeSinceCreation < 500) {
      newState = 'created';
    }
    
    // Add animation if recently created or updated
    if (newState !== 'default') {
      setCardState(newState);
      const timeout = setTimeout(() => {
        // Only reset if not in deleting state
        if (cardState !== 'deleting') {
          setCardState('default');
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [contact, cardState]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setCardState('deleting');
    
    try {
      // Wait for the animation to complete before actually deleting
      await new Promise(resolve => setTimeout(resolve, 300));
      await onDelete(contact.id!);
    } catch (error) {
      setIsDeleting(false);
      setCardState('default');
    }
  };

  const getBackgroundColor = () => {
    switch (cardState) {
      case 'created':
        return 'rgba(40, 167, 69, 0.3)';
      case 'updated':
        return 'rgba(255, 193, 7, 0.3)';
      case 'deleting':
        return 'rgba(220, 53, 69, 0.3)';
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
            transition: 'background-color 0.3s ease',
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
                  disabled={isDeleting || isExternallyDeleting}
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="light" 
                  size="sm" 
                  className="p-1" 
                  onClick={handleDelete}
                  disabled={isDeleting || isExternallyDeleting}
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