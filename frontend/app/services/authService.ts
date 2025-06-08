import { useApi } from '../utils/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface User {
  username: string;
}

export const useAuthService = () => {
  const api = useApi();

  const login = async (credentials: LoginCredentials): Promise<string> => {
    const response = await fetch('/api/auth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.non_field_errors?.[0] || 'Invalid credentials');
    }

    if (!data.token) {
      throw new Error('No authentication token received');
    }

    return data.token;
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    const response = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.username || data.password || 'Registration failed';
      throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
  };

  const getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/api/auth/me/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    return response.json();
  };

  return {
    login,
    register,
    getCurrentUser,
  };
};
