import { useApi } from '../utils/api';
import { useWebSocket } from '../utils/websocket';

export interface Conversation {
  id?: number;
  in_progress: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationWebSocketMessage {
  type: 'create' | 'update' | 'delete';
  id: number;
  value?: Conversation;
}

export const useConversationService = () => {
  const api = useApi();
  const getWebSocketManager = useWebSocket();

  const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await api.get('/api/conversations/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    
    const conversations = await response.json();
    return conversations.sort((a: Conversation, b: Conversation) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  };

  const createConversation = async (): Promise<Conversation> => {
    const response = await api.post('/api/conversations/', {});
    
    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }
    
    return response.json();
  };

  const subscribeToConversationUpdates = (
    onConversationCreated?: (conversation: Conversation) => void,
    onConversationUpdated?: (conversation: Conversation) => void,
    onConversationDeleted?: (id: number) => void
  ) => {
    const wsManager = getWebSocketManager('/api/ws/conversations/');
    
    wsManager.connect().then(() => {
      console.log('Connected to conversations WebSocket');
    }).catch(error => {
      console.error('Failed to connect to conversations WebSocket:', error);
    });
    
    const unsubscribe = wsManager.setMessageHandler((data: ConversationWebSocketMessage) => {
      switch (data.type) {
        case 'create':
          if (data.value && onConversationCreated) {
            onConversationCreated(data.value);
          }
          break;
        case 'update':
          if (data.value && onConversationUpdated) {
            onConversationUpdated(data.value);
          }
          break;
        case 'delete':
          if (onConversationDeleted) {
            onConversationDeleted(data.id);
          }
          break;
      }
    });
    
    return () => {
      unsubscribe();
      wsManager.disconnect();
    };
  };

  return {
    fetchConversations,
    createConversation,
    subscribeToConversationUpdates,
  };
}; 