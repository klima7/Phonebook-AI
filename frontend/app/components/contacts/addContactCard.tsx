import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type { Contact } from '~/models';
import { Plus } from 'react-bootstrap-icons';
import AddContactModal from './addContactModal';

interface AddContactCardProps {
  onAdd: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
}

export default function AddContactCard({ onAdd }: AddContactCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-100"
      >
        <Card 
          className="h-100 shadow-sm text-center border-primary border-dashed" 
          style={{ cursor: 'pointer', border: '2px dashed' }}
          onClick={() => setShowModal(true)}
        >
          <Card.Body className="d-flex align-items-center justify-content-center">
            <Plus size={70} className="text-primary me-2" />
            <span className="text-primary fs-5">Add Contact</span>
          </Card.Body>
        </Card>
      </motion.div>

      <AddContactModal 
        show={showModal} 
        onHide={handleModalClose} 
        onAdd={onAdd}
      />
    </>
  );
} 