import { useEffect, useState } from 'react';
import type { Message } from '~/models';
import { useMessageApi } from '~/api/messageApi';
import { useConversationApi } from '~/api/conversationApi';
import { useAuthedWebSocket } from '~/utils/websocket';

export interface MessageUpdate {
  type: 'create' | 'update' | 'delete';
  id: number;
  value?: Message;
}

export const useMessages = (conversationId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messageApi = useMessageApi();
  const conversationApi = useConversationApi();

  const wsUrl = conversationId ? `/api/ws/conversations/${conversationId}/messages/` : '';
  const { lastJsonMessage } = useAuthedWebSocket(wsUrl, {}, !!wsUrl);

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
        const fetchedMessages = await messageApi.fetchMessages(conversationId);
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
  }, [conversationId]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    
    const data = lastJsonMessage as MessageUpdate;
    
    switch (data.type) {
      case 'create':
        if (data.value) {
          setMessages((prevMessages) => [...prevMessages, data.value as Message]);
        }
        break;
      case 'update':
        if (data.value) {
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === data.id ? data.value as Message : message
            )
          );
        }
        break;
      case 'delete':
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== data.id)
        );
        break;
    }
  }, [lastJsonMessage]);

  const addMessage = async (content: string) => {
    try {
      let targetConversationId = conversationId;
      
      // If no conversation ID exists, create a new conversation first
      if (targetConversationId === null) {
        const newConversation = await conversationApi.createConversation();
        targetConversationId = newConversation.id!;
      }
      
      const newMessage = await messageApi.sendMessage(content, targetConversationId);
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
