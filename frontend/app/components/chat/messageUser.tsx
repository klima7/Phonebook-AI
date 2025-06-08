import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '~/models';

interface MessageUserProps {
  message: Message;
}

export const MessageUser: React.FC<MessageUserProps> = ({ message }) => {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-2 align-self-end"
      style={{ maxWidth: '75%' }}
    >
      <div className="mt-3 p-3 rounded-3 bg-primary text-white">
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </div>
      </div>
      <div className="text-muted small mt-1 text-end">
        {new Date(message.created_at || '').toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </motion.div>
  );
};
