import React from 'react';
import type { Message } from '../services/messageService';
import { ChatMessage } from './chatMessage';

interface ChatMessagesListProps {
  messages: Message[];
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const ChatMessagesList: React.FC<ChatMessagesListProps> = ({ messages, containerRef }) => {
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
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </>
      )}
    </div>
  );
}; 