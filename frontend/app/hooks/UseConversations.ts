import { useEffect, useState } from 'react';
import type { Conversation } from '../services/conversationService';
import { useConversationService } from '../services/conversationService';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const conversationService = useConversationService();

  useEffect(() => {
    const fetchInitialConversations = async () => {
      try {
        setLoading(true);
        const fetchedConversations = await conversationService.fetchConversations();
        setConversations(fetchedConversations);
        setError(null);
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialConversations();

    // Subscribe to real-time updates
    const unsubscribe = conversationService.subscribeToConversationUpdates(
      // Handle conversation created
      (newConversation) => {
        setConversations((prevConversations) => [...prevConversations, newConversation]);
      },
      // Handle conversation updated
      (updatedConversation) => {
        setConversations((prevConversations) =>
          prevConversations.map((conversation) =>
            conversation.id === updatedConversation.id ? updatedConversation : conversation
          )
        );
      },
      // Handle conversation deleted
      (deletedId) => {
        setConversations((prevConversations) =>
          prevConversations.filter((conversation) => conversation.id !== deletedId)
        );
      }
    );

    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const createNewConversation = async () => {
    try {
      const newConversation = await conversationService.createConversation();
      // We don't need to update the state here as the WebSocket will handle it
      return newConversation;
    } catch (err) {
      setError('Failed to create conversation');
      throw err;
    }
  };

  return {
    conversations,
    loading,
    error,
    createNewConversation
  };
};
