import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../utils/api';
import { useWebSocket } from '../utils/websocket';

export interface Contact {
  id?: number;
  name: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactWebSocketMessage {
  type: 'create' | 'update' | 'delete';
  id: number;
  value?: Contact;
}

export const useContactService = () => {
  const api = useApi();
  const getWebSocketManager = useWebSocket();

  const fetchContacts = async (): Promise<Contact[]> => {
    const response = await api.get('/api/contacts/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    
    return response.json();
  };

  const createContact = async (contact: Contact): Promise<Contact> => {
    const response = await api.post('/api/contacts/', contact);
    
    if (!response.ok) {
      throw new Error('Failed to create contact');
    }
    
    return response.json();
  };

  const updateContact = async (contact: Contact): Promise<Contact> => {
    if (!contact.id) throw new Error('Contact ID is required for update');
    
    const response = await api.put(`/api/contacts/${contact.id}/`, contact);
    
    if (!response.ok) {
      throw new Error('Failed to update contact');
    }
    
    return response.json();
  };

  const deleteContact = async (id: number): Promise<void> => {
    const response = await api.delete(`/api/contacts/${id}/`);
    
    if (!response.ok) {
      throw new Error('Failed to delete contact');
    }
  };

  const subscribeToContactUpdates = (
    onContactCreated?: (contact: Contact) => void,
    onContactUpdated?: (contact: Contact) => void,
    onContactDeleted?: (id: number) => void
  ) => {
    const wsManager = getWebSocketManager('/api/ws/contacts/');
    
    wsManager.connect().then(() => {
      console.log('Connected to contacts WebSocket');
    }).catch(error => {
      console.error('Failed to connect to contacts WebSocket:', error);
    });
    
    const unsubscribe = wsManager.setMessageHandler((data: ContactWebSocketMessage) => {
      switch (data.type) {
        case 'create':
          if (data.value && onContactCreated) {
            onContactCreated(data.value);
          }
          break;
        case 'update':
          if (data.value && onContactUpdated) {
            onContactUpdated(data.value);
          }
          break;
        case 'delete':
          if (onContactDeleted) {
            onContactDeleted(data.id);
          }
          break;
      }
    });
    
    return () => {
      unsubscribe();
      wsManager.disconnect();
    };
  };

  return {
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    subscribeToContactUpdates,
  };
}; 