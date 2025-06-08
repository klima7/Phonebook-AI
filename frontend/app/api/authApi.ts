import type { LoginCredentials, RegisterCredentials } from "~/models";


export const useAuthApi = () => {

  const getAuthToken = async (credentials: LoginCredentials): Promise<string> => {
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

  return {
    getAuthToken,
    register,
  };
};
