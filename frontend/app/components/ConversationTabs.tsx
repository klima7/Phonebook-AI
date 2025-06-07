import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { PlusLg, ChatDots } from 'react-bootstrap-icons';
import type { Conversation } from '../services/conversationService';

interface ConversationTabsProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (id: number | null) => void;
  onNewConversation: () => void;
  loading: boolean;
}

export const ConversationTabs: React.FC<ConversationTabsProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  loading
}) => {
  return (
    <div className="mb-3 position-relative">
      {loading ? (
        <div className="text-center py-2">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading conversations...</span>
          </div>
        </div>
      ) : (
        <div className="d-flex overflow-auto p-2" style={{ scrollbarWidth: 'thin' }}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="me-2"
          >
            <Button
              variant="outline-primary"
              className="d-flex align-items-center justify-content-center"
              style={{ width: '42px', height: '42px' }}
              onClick={onNewConversation}
              aria-label="Start new conversation"
            >
              <PlusLg size={16} />
            </Button>
          </motion.div>
          
          {conversations.map((conversation) => (
            <OverlayTrigger
              key={conversation.id}
              placement="bottom"
              overlay={
                <Tooltip id={`conversation-${conversation.id}`}>
                  {new Date(conversation.created_at || '').toLocaleDateString()}
                </Tooltip>
              }
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="me-2"
              >
                <Button
                  variant={activeConversationId === conversation.id ? "primary" : "outline-secondary"}
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: '42px', height: '42px' }}
                  onClick={() => onSelectConversation(conversation.id!)}
                  aria-label={`Conversation from ${new Date(conversation.created_at || '').toLocaleDateString()}`}
                >
                  <ChatDots size={16} />
                </Button>
              </motion.div>
            </OverlayTrigger>
          ))}
        </div>
      )}
    </div>
  );
}; 