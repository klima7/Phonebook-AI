import React from 'react';
import { motion } from 'framer-motion';
import type { Message } from '~/models';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const bubbleClassName = isUser 
    ? 'bg-primary text-white' 
    : 'bg-light text-dark';
  const alignmentClassName = isUser 
    ? 'align-self-end' 
    : 'align-self-start';

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-2 ${alignmentClassName}`}
      style={{ maxWidth: '75%' }}
    >
      <div className={`p-3 rounded-3 ${bubbleClassName}`}>
        <div className="mb-1 small">
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </div>
      </div>
      <div className="text-muted small mt-1">
        {new Date(message.created_at || '').toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </motion.div>
  );
}; 