import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { motion } from 'framer-motion';
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
        <div className="d-flex overflow-auto py-2" style={{ scrollbarWidth: 'thin' }}>
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
                  className="rounded-circle p-2"
                  onClick={() => onSelectConversation(conversation.id!)}
                  aria-label={`Conversation from ${new Date(conversation.created_at || '').toLocaleDateString()}`}
                >
                  <i className="bi bi-chat-dots"></i>
                </Button>
              </motion.div>
            </OverlayTrigger>
          ))}
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="success"
              className="rounded-circle p-2"
              onClick={onNewConversation}
              aria-label="Start new conversation"
            >
              <i className="bi bi-plus" style={{ fontSize: "1.2rem" }}></i>
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}; 