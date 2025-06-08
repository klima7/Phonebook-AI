import React, { useRef, useEffect } from 'react';
import type { Message } from '~/models';
import { MessageUser } from './messageUser';
import { MessageAssistant } from './messageAssistant';
import { MessageTool } from './messageTool';

interface ChatMessagesListProps {
  messages: Message[];
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({ messages }) => {

  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (msg: Message) => {
    switch (msg.type) {
      case 'user':
        return <MessageUser key={msg.id} message={msg} />;
      case 'assistant':
        return <MessageAssistant key={msg.id} message={msg} />;
      case 'tool':
        return <MessageTool key={msg.id} message={msg} />;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-grow-1 p-3 overflow-auto"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages.length === 0 ? (
        <div className="text-center text-muted my-5">
          <p>No messages yet.</p>
        </div>
      ) : (
        <>
          {messages.map(renderMessage)}
        </>
      )}
    </div>
  );
}; 