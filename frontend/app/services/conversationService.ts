import type { Conversation } from '~/models';
import { useApi } from '../utils/api';

export const useConversationService = () => {
  const api = useApi();

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

  return {
    fetchConversations,
    createConversation,
  };
}; 