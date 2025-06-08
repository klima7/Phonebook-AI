import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusLg, ChatDots } from 'react-bootstrap-icons';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation } from '~/models';

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
    <motion.div 
      className="mb-3 position-relative"
      layout
    >
      <div className="position-relative">
        <motion.div 
          className="d-flex overflow-auto p-2" 
          layout
          style={{ 
            scrollbarWidth: 'none',
            overflowX: 'auto',
            overflowY: 'hidden'
          }}
        >
          <div 
            style={{ 
              position: 'absolute', 
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
          
          <AnimatePresence mode="popLayout">
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="me-2 position-relative"
                  layout
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
                    <motion.div
                      animate={{ 
                        opacity: [0.6, 1, 0.6], 
                        scale: [0.9, 1.1, 0.9] 
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 1.5
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'lightgreen',
                        borderRadius: '50%'
                      }}
                    />
                  )}
                </motion.div>
              </OverlayTrigger>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}; 