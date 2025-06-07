import React, { useState, useRef, useEffect } from 'react';
import { Card, Alert, Spinner } from 'react-bootstrap';
import type { Message } from '../services/messageService';
import type { Conversation } from '../services/conversationService';
import { useConversationService } from '../services/conversationService';
import { ChatMessagesList } from './ChatMessagesList';
import { ChatSendField } from './ChatSendField';
import { ConversationTabs } from './ConversationTabs';
import { useMessages } from '../hooks/UseMessages';
import { useConversations } from '../hooks/UseConversations';

interface ChatProps {
  onConversationChange?: (conversationId: number | null) => void;
}

export default function Chat({ onConversationChange }: ChatProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { conversations, loading: conversationsLoading, error: conversationsError, createNewConversation } = useConversations();
  const { messages, loading, error, addMessage } = useMessages(activeConversationId || undefined);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set the first conversation as active when conversations are loaded
    if (conversations.length > 0 && activeConversationId === null) {
      setActiveConversationId(conversations[0].id!);
      if (onConversationChange) {
        onConversationChange(conversations[0].id!);
      }
    } else if (conversations.length === 0 && !conversationsLoading) {
      // Create a default conversation if none exists
      handleNewConversation();
    }
  }, [conversations, conversationsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await addMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConversation = await createNewConversation();
      setActiveConversationId(newConversation.id!);
      if (onConversationChange) {
        onConversationChange(newConversation.id!);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSelectConversation = (id: number | null) => {
    if (id !== activeConversationId) {
      setActiveConversationId(id);
      if (onConversationChange) {
        onConversationChange(id);
      }
    }
  };

  return (
    <>
      <h2 className="mb-3">Your Assistant</h2>
      
      <ConversationTabs
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        loading={conversationsLoading}
      />
      
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 200px)' }}>
        {error && (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div className="d-flex flex-column flex-grow-1 overflow-hidden">
            <ChatMessagesList 
              messages={messages} 
              containerRef={messagesContainerRef}
            />
            <ChatSendField
              message={message}
              setMessage={setMessage}
              isSending={isSending}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
      </div>
    </>
  );
} 