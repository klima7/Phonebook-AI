import { useEffect, useState } from 'react';
import type { Conversation } from '../services/conversationService';
import { useConversationService } from '../services/conversationService';
import { useAuthedWebSocket } from '~/utils/websocket';

// Helper function to sort conversations by created_at date (newest first)
const sortConversationsByDate = (conversations: Conversation[]) => {
  return [...conversations].sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
};

export interface ConversationUpdate {
  type: 'create' | 'update' | 'delete';
  id: number;
  value?: Conversation;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const conversationService = useConversationService();

  const { lastJsonMessage } = useAuthedWebSocket('/api/ws/conversations/');

  useEffect(() => {
    const fetchInitialConversations = async () => {
      try {
        setLoading(true);
        const fetchedConversations = await conversationService.fetchConversations();
        setConversations(fetchedConversations);
        setError(null);
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialConversations();
  }, []);

  useEffect(() => {
    if (!lastJsonMessage) return;
    
    const data = lastJsonMessage as ConversationUpdate;
    
    switch (data.type) {
      case 'create':
        if (data.value) {
          setConversations((prevConversations) => 
            sortConversationsByDate([...prevConversations, data.value as Conversation])
          );
        }
        break;
      case 'update':
        if (data.value) {
          setConversations((prevConversations) => 
            sortConversationsByDate(
              prevConversations.map((conversation) =>
                conversation.id === data.id ? data.value as Conversation : conversation
              )
            )
          );
        }
        break;
      case 'delete':
        setConversations((prevConversations) =>
          prevConversations.filter((conversation) => conversation.id !== data.id)
        );
        break;
    }
  }, [lastJsonMessage]);

  const createNewConversation = async () => {
    try {
      const newConversation = await conversationService.createConversation();
      // We don't need to update the state here as the WebSocket will handle it
      return newConversation;
    } catch (err) {
      setError('Failed to create conversation');
      throw err;
    }
  };

  return {
    conversations,
    loading,
    error,
    createNewConversation
  };
};
