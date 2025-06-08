import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { ChatMessagesList } from './chatMessagesList';
import { ChatSendField } from './chatSendField';
import { ConversationTabs } from './conversationTabs';
import { useMessages } from '../../hooks/useMessages';
import { useConversations } from '../../hooks/useConversations';

interface ChatProps {}

export default function Chat({}: ChatProps) {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const { conversations } = useConversations();
  const { messages, error, addMessage } = useMessages(activeConversationId);

  const handleSend = async (message: string) => {
    const new_message = await addMessage(message);
    setActiveConversationId(new_message.conversation_id!);
  };

  return (
    <div className="mb-1">
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

        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
          <ChatMessagesList 
            messages={messages} 
          />
          <ChatSendField
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}