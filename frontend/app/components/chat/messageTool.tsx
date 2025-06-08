import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '~/models';

interface MessageToolProps {
  message: Message;
}

export const MessageTool: React.FC<MessageToolProps> = ({ message }) => {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-1 align-self-start"
      style={{ maxWidth: '75%' }}
    >
      <div className="p-1 rounded-3 bg-transparent d-flex">
        <div className="me-2">
        🔧 
        </div>
        <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>
          {message.content}
        </div>
      </div>
    </motion.div>
  );
};
