import React, { useRef, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Send, SendFill } from 'react-bootstrap-icons';

interface ChatSendFieldProps {
  message: string;
  setMessage: (message: string) => void;
  isSending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ChatSendField: React.FC<ChatSendFieldProps> = ({ 
  message, 
  setMessage, 
  isSending, 
  onSubmit, 
  onKeyDown 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '40px';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight+5, 100)}px`;
    }
  }, [message]);

  return (
    <div className="pb-0 pt-1 border-top">
      <Form onSubmit={onSubmit}>
        <InputGroup>
          <Form.Control
            as="textarea"
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Anything you want..."
            disabled={isSending}
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
            disabled={isSending || !message.trim()}
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