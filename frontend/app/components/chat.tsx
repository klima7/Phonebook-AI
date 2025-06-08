import { useState, useRef, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { ChatMessagesList } from './chatMessagesList';
import { ChatSendField } from './chatSendField';
import { ConversationTabs } from './conversationTabs';
import { useMessages } from '../hooks/useMessages';
import { useConversations } from '../hooks/useConversations';

interface ChatProps {}

export default function Chat({}: ChatProps) {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const { conversations } = useConversations();
  const { messages, loading, error, addMessage } = useMessages(activeConversationId);

  const handleSend = async (message: string) => {
    const new_message = await addMessage(message);
    setActiveConversationId(new_message.conversation_id!);
  };

  return (
    <>
      <h2 className="mb-3">Your Assistant</h2>
      
      <ConversationTabs
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />
      
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
          <div className="d-flex flex-column flex-grow-1 overflow-hidden">
            <ChatMessagesList 
              messages={messages} 
            />
            <ChatSendField
              onSend={handleSend}
            />
          </div>
        )}
      </div>
    </>
  );
}