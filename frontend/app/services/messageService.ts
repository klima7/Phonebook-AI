import { useApi } from '../utils/api';

export interface Message {
  id?: number;
  type: 'user' | 'assistant' | 'tool';
  content: string;
  created_at?: string;
  updated_at?: string;
}

export const useMessageService = () => {
  const api = useApi();

  const fetchMessages = async (): Promise<Message[]> => {
    const response = await api.get('/api/messages/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return response.json();
  };

  const sendMessage = async (content: string): Promise<Message> => {
    const response = await api.post('/api/messages/', { content });
    
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