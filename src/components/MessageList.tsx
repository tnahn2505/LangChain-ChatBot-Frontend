import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import type { Message } from '../types';
import { Bubble } from './Bubble';
import { LoadingSpinner } from './LoadingSpinner';

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
  }, [messages?.length, typing]);

  return (
    <div ref={listRef} className="chat__list">
      {messages?.map((message) => (
        <Bubble key={message.id} message={message} />
      ))}
      {typing && (
        <div style={{ 
          padding: '24px 20px',
          textAlign: 'center',
          maxWidth: '4000px',
          margin: '0 auto'
        }}>
          <LoadingSpinner 
            message="AI is typing"
            variant="minimal"
            size="small"
            showDots={true}
          />
        </div>
      )}
    </div>
  );
}
