import { useApi } from '../utils/api';
// import { useWebSocket } from '../utils/websocket';

export interface Message {
  id?: number;
  type: 'user' | 'assistant' | 'tool';
  content: string;
  conversation_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MessageUpdate {
  type: 'create' | 'update' | 'delete';
  id: number;
  value?: Message;
}

export const useMessageService = () => {
  const api = useApi();
  const getWebSocketManager = useWebSocket();

  const fetchMessages = async (conversationId?: number): Promise<Message[]> => {
    const url = conversationId 
      ? `/api/conversations/${conversationId}/messages/` 
      : '/api/messages/';
    
    const response = await api.get(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return response.json();
  };

  const sendMessage = async (content: string, conversationId?: number): Promise<Message> => {
    const payload = { content };
    const url = conversationId 
      ? `/api/conversations/${conversationId}/messages/` 
      : '/api/messages/';
      
    const response = await api.post(url, payload);
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  };

  const subscribeToMessageUpdates = (
    conversationId: number,
    onMessageCreated?: (message: Message) => void,
    onMessageUpdated?: (message: Message) => void,
    onMessageDeleted?: (id: number) => void
  ) => {
    const wsPath = `/api/ws/conversations/${conversationId}/messages/`
    
    const wsManager = getWebSocketManager(wsPath);
    
    wsManager.connect().then(() => {
      console.log('Connected to messages WebSocket');
    }).catch(error => {
      console.error('Failed to connect to messages WebSocket:', error);
    });
    
    const unsubscribe = wsManager.setMessageHandler((data: MessageUpdate) => {
      switch (data.type) {
        case 'create':
          if (data.value && onMessageCreated) {
            onMessageCreated(data.value);
          }
          break;
        case 'update':
          if (data.value && onMessageUpdated) {
            onMessageUpdated(data.value);
          }
          break;
        case 'delete':
          if (onMessageDeleted) {
            onMessageDeleted(data.id);
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
    fetchMessages,
    sendMessage,
    subscribeToMessageUpdates,
  };
}; 