import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import type { Message } from '../types';
import { Bubble } from './Bubble';

interface MessageListProps {
  messages: Message[];
  typing: boolean;
}

export function MessageList({ messages, typing }: MessageListProps): ReactElement {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ 
      top: listRef.current.scrollHeight, 
      behavior: "smooth" 
    });
  }, [messages.length, typing]);

  return (
    <div ref={listRef} className="chat__list">
      {messages.map((message) => (
        <Bubble key={message.id} message={message} />
      ))}
      {typing && (
        <div style={{ 
          color: 'var(--muted)', 
          fontSize: '14px', 
          padding: '24px 20px',
          textAlign: 'center',
          maxWidth: '4000px',
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px' 
          }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid var(--muted)', 
              borderTop: '2px solid var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            AI is typing...
          </div>
        </div>
      )}
    </div>
  );
}
