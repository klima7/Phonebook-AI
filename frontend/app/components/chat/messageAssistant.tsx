import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '~/models';

interface MessageAssistantProps {
  message: Message;
}

export const MessageAssistant: React.FC<MessageAssistantProps> = ({ message }) => {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-2 align-self-start"
      style={{ maxWidth: '75%' }}
    >
      <div className="mt-3 p-3 rounded-3 bg-secondary text-white">
        <div className="mb-1 small">
          Assistant
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </div>
      </div>
    </motion.div>
  );
};
