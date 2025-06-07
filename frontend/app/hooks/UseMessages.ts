import { useEffect, useState } from 'react';
import type { Message } from '../services/messageService';
import { useMessageService } from '../services/messageService';

export const useMessages = (conversationId?: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messageService = useMessageService();

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        setLoading(true);
        const fetchedMessages = await messageService.fetchMessages(conversationId);
        setMessages(fetchedMessages);
        setError(null);
      } catch (err) {
        setError('Failed to fetch messages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMessages();

    // Subscribe to real-time updates
    const unsubscribe = messageService.subscribeToMessageUpdates(
      conversationId,
      // Handle message created
      (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      },
      // Handle message updated
      (updatedMessage) => {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === updatedMessage.id ? updatedMessage : message
          )
        );
      },
      // Handle message deleted
      (deletedId) => {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== deletedId)
        );
      }
    );

    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  const addMessage = async (content: string) => {
    try {
      const newMessage = await messageService.sendMessage(content, conversationId);
      // We don't need to update the state here as the WebSocket will handle it
      return newMessage;
    } catch (err) {
      setError('Failed to send message');
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    addMessage
  };
};
