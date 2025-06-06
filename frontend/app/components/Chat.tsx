import React, { useState, useRef, useEffect } from 'react';
import { Card, Alert, Spinner, Form, Button, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import type { Message } from '../services/messageService';

interface ChatProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSendMessage: (content: string) => Promise<void>;
}

export default function Chat({ messages, loading, error, onSendMessage }: ChatProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h4 className="mb-0">AI Assistant</h4>
      </Card.Header>
      <Card.Body className="p-0">
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
              {/* Message List */}
              <div 
                className="flex-grow-1 p-3 overflow-auto"
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center text-muted my-5">
                    <p>No messages yet. Start the conversation with your AI assistant!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isUser = msg.type === 'user';
                      const bubbleClassName = isUser 
                        ? 'bg-primary text-white' 
                        : 'bg-light text-dark';
                      const alignmentClassName = isUser 
                        ? 'align-self-end' 
                        : 'align-self-start';

                      return (
                        <motion.div
                          key={msg.id}
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
                              {msg.content}
                            </div>
                          </div>
                          <div className="text-muted small mt-1">
                            {new Date(msg.created_at || '').toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Send */}
              <div className="p-3 border-top">
                <Form onSubmit={handleSubmit}>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      disabled={isSending}
                      style={{ resize: 'none', height: '50px' }}
                    />
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={isSending || !message.trim()}
                    >
                      {isSending ? 
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> :
                        'Send'
                      }
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Press Enter to send, Shift+Enter for a new line
                  </Form.Text>
                </Form>
              </div>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
} 