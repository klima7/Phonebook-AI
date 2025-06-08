import type { User } from '~/models';
import { useApi } from '../utils/api';

export const useUserApi = () => {
  const api = useApi();

  const getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/api/auth/me/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    return response.json();
  };

  return {
    getCurrentUser,
  };
};
