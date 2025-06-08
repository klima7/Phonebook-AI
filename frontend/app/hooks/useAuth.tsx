import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthService } from '../services/authService';
import type { LoginCredentials, RegisterCredentials } from '../services/authService';

interface AuthContextType {
  token: string | null;
  user: { username: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to safely check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe localStorage access
const getStorageItem = (key: string): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem(key);
};

const setStorageItem = (key: string, value: string): void => {
  if (!isBrowser) return;
  localStorage.setItem(key, value);
};

const removeStorageItem = (key: string): void => {
  if (!isBrowser) return;
  localStorage.removeItem(key);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const authService = useAuthService();
  
  // Initialize token from localStorage only on client-side
  useEffect(() => {
    const storedToken = getStorageItem('token');
    setToken(storedToken);
    setIsInitialized(true);
    
    // If no token, we can immediately mark auth as initialized
    if (!storedToken) {
      setAuthInitialized(true);
      setIsLoading(false);
    }
  }, []);
  
  const isAuthenticated = !!token;

  useEffect(() => {
    // Load user data if token exists, but only after initialization
    const fetchCurrentUser = async () => {
      if (!isInitialized) return;
      
      if (!token) {
        setIsLoading(false);
        setAuthInitialized(true);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/auth/me/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If token is invalid, clear it
          logout();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        logout();
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    fetchCurrentUser();
  }, [token, isInitialized]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const newToken = await authService.getAuthToken(credentials);
      setStorageItem('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await authService.register(credentials);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    removeStorageItem('token');
    setToken(null);
    setUser(null);
  };

  const getAuthHeader = () => {
    return token ? { 'Authorization': `Token ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isAuthenticated,
      isLoading,
      authInitialized,
      login, 
      register,
      logout,
      getAuthHeader
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 