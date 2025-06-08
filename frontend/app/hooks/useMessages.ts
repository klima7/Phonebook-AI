import { useEffect, useState } from 'react';
import type { Message } from '../services/messageService';
import { useMessageService } from '../services/messageService';
import { useConversationService } from '../services/conversationService';

export const useMessages = (conversationId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messageService = useMessageService();
  const conversationService = useConversationService();

  useEffect(() => {
    // If conversationId is undefined, set empty messages and return early
    if (conversationId === null) {
      setMessages([]);
      setLoading(false);
      return;
    }

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
      let targetConversationId = conversationId;
      
      // If no conversation ID exists, create a new conversation first
      if (targetConversationId === null) {
        const newConversation = await conversationService.createConversation();
        targetConversationId = newConversation.id!;
      }
      
      const newMessage = await messageService.sendMessage(content, targetConversationId);
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
