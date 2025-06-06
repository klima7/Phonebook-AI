import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

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
  return (
    <div className="p-3 border-top">
      <Form onSubmit={onSubmit}>
        <InputGroup>
          <Form.Control
            as="textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
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
  );
}; 