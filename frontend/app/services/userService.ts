import { useApi } from '../utils/api';

export interface User {
  username: string;
}

export const useUserService = () => {
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
