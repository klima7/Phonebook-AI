import React, { useState, useRef, useEffect } from 'react';
import { Card, Alert, Spinner } from 'react-bootstrap';
import type { Message } from '../services/messageService';
import { ChatMessagesList } from './ChatMessagesList';
import { ChatSendField } from './ChatSendField';

interface ChatProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSendMessage: (content: string) => Promise<void>;
}

export default function Chat({ messages, loading, error, onSendMessage }: ChatProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await onSendMessage(message);
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

  return (
    <>
      <h2 className="mb-4">AI Assistant</h2>
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 220px)' }}>
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
          <>
            <ChatMessagesList 
              messages={messages} 
              messagesEndRef={messagesEndRef}
            />
            <ChatSendField
              message={message}
              setMessage={setMessage}
              isSending={isSending}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
            />
          </>
        )}
      </div>
    </>
  );
} 