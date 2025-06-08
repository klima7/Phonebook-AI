import { useState, useRef, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { ChatMessagesList } from './ChatMessagesList';
import { ChatSendField } from './ChatSendField';
import { ConversationTabs } from './ConversationTabs';
import { useMessages } from '../hooks/UseMessages';
import { useConversations } from '../hooks/UseConversations';

interface ChatProps {
  onConversationChange?: (conversationId: number | null) => void;
}

export default function Chat({ onConversationChange }: ChatProps) {
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
    // If there are conversations loaded and no active conversation,
    // set the first one as active
    if (conversations.length > 0 && activeConversationId === null) {
      setActiveConversationId(conversations[0].id!);
      if (onConversationChange) {
        onConversationChange(conversations[0].id!);
      }
    }
  }, [conversations, conversationsLoading]);

  const handleSend = async (message: string) => {
    const new_message = await addMessage(message);
    setActiveConversationId(new_message.conversation_id!);
    if (onConversationChange) {
      onConversationChange(new_message.conversation_id!);
    }
  };

  const handleSelectConversation = (id: number | null) => {
    setActiveConversationId(id);
    if (onConversationChange) {
      onConversationChange(id);
    }
  };

  return (
    <>
      <h2 className="mb-3">Your Assistant</h2>
      
      <ConversationTabs
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        loading={conversationsLoading}
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
              containerRef={messagesContainerRef}
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