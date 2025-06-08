import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { PlusLg, ChatDots } from 'react-bootstrap-icons';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation } from '../services/conversationService';

interface ConversationTabsProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (id: number | null) => void;
}

export const ConversationTabs: React.FC<ConversationTabsProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
}) => {
  return (
    <div className="mb-3 position-relative">
      <div className="position-relative">
        <div 
          className="d-flex overflow-auto p-2" 
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowX: 'auto',
            overflowY: 'hidden'
          }}
        >
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '60px', 
              height: '100%', 
              background: 'linear-gradient(to right, transparent, white)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="me-2"
          >
            <Button
              variant={activeConversationId === null ? "primary" : "outline-primary"}
              className="d-flex align-items-center justify-content-center"
              style={{ width: '42px', height: '42px' }}
              onClick={() => onSelectConversation(null)}
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
                  {conversation.created_at ? 
                    formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true }) : 
                    'Unknown time'}
                </Tooltip>
              }
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="me-2 position-relative"
              >
                <Button
                  variant={activeConversationId === conversation.id ? "primary" : "outline-secondary"}
                  className="d-flex align-items-center justify-content-center"
                  style={{ width: '42px', height: '42px' }}
                  onClick={() => onSelectConversation(conversation.id!)}
                  aria-label={`Conversation from ${conversation.created_at ? 
                    formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true }) : 
                    'unknown time'}`}
                >
                  <ChatDots size={16} />
                </Button>
                {conversation.in_progress && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'lightgreen',
                      borderRadius: '50%',
                      zIndex: 2
                    }}
                  />
                )}
              </motion.div>
            </OverlayTrigger>
          ))}
        </div>
      </div>
    </div>
  );
}; 