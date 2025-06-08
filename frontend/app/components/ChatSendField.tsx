import React, { useRef, useEffect, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Send, SendFill } from 'react-bootstrap-icons';

interface ChatSendFieldProps {
  onSend: (msg: string) => void;
}

export const ChatSendField: React.FC<ChatSendFieldProps> = ({ 
  onSend
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '40px';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight+5, 100)}px`;
    }
  }, [message]);

  const handleSend = async (msg: string) => {
    setIsSending(true);
    try {
      await onSend(msg);
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(message);
    }
  };

  return (
    <div className="pb-0 pt-1 border-top">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            as="textarea"
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Anything you want..."
            disabled={false}
            style={{ 
              resize: 'none', 
              minHeight: '40px',
              maxHeight: '100px',
              borderRadius: '25px 0 0 25px', 
              paddingLeft: '20px',
              boxShadow: 'none'
            }}
            className="bg-white border border-primary"
          />
          <Button 
            type="submit" 
            variant="primary"
            disabled={false}
            style={{ 
              borderRadius: '0 25px 25px 0',
              width: '50px'
            }}
          >
            {isSending ? 
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> :
              <SendFill />
            }
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};
