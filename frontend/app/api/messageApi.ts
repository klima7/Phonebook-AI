import type { Message } from '~/models';
import { useApi } from '../utils/api';

export const useMessageApi = () => {
  const api = useApi();

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

  return {
    fetchMessages,
    sendMessage,
  };
}; 