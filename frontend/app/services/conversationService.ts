import { useApi } from '../utils/api';

export interface Conversation {
  id?: number;
  in_progress: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useConversationService = () => {
  const api = useApi();

  const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await api.get('/api/conversations/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    
    return response.json();
  };

  const createConversation = async (): Promise<Conversation> => {
    const response = await api.post('/api/conversations/', {});
    
    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }
    
    return response.json();
  };

  return {
    fetchConversations,
    createConversation,
  };
}; 