/**
 * Utility for making authenticated API requests
 */
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get the auth token from localStorage
const getToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem('token');
};

// Base options for fetch calls
const baseOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add auth token to headers if available
const getAuthHeaders = () => {
  const token = getToken();
  return token
    ? { ...baseOptions.headers, 'Authorization': `Token ${token}` }
    : baseOptions.headers;
};

// Generic fetch function with auth
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - could automatically logout user here
  if (response.status === 401) {
    console.warn('Authentication token expired or invalid');
    // Could add automatic logout here
  }

  return response;
};

// Helper methods for common HTTP verbs
export const api = {
  get: (url: string) => fetchWithAuth(url),
  
  post: (url: string, data: any) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (url: string, data: any) => fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (url: string) => fetchWithAuth(url, {
    method: 'DELETE',
  }),
};

// Create a hook for components to use that ensures auth is initialized
export const useApi = () => {
  const { authInitialized, getAuthHeader, isAuthenticated } = useAuth();
  
  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!authInitialized) {
      console.error('Attempting API request before auth initialization is complete');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  };

  return {
    fetchWithAuth,
    
    get: (url: string) => fetchWithAuth(url),
    
    post: (url: string, data: any) => fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    put: (url: string, data: any) => fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (url: string) => fetchWithAuth(url, {
      method: 'DELETE',
    }),
    
    isAuthenticated,
  };
}; 