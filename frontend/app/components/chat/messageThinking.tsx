import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import type { Message } from '~/models';

interface MessageThinkingProps {
  message: Message;
}

export const MessageThinking: React.FC<MessageThinkingProps> = ({ message }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-1 align-self-start"
      style={{ maxWidth: '75%' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip id={`tooltip-${message.id}`}>
            {message.content}
          </Tooltip>
        }
      >
        <div className="p-1 rounded-3 bg-transparent d-flex">
          <div className="me-2">
            🧠
          </div>
          <div style={{ whiteSpace: 'pre-wrap', color: '#555' }}>
            Thinking
          </div>
        </div>
      </OverlayTrigger>
    </motion.div>
  );
};
