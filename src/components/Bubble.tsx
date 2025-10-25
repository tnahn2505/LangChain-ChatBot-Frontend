import type { ReactElement } from 'react';
import type { Message } from '../types';

interface BubbleProps {
  message: Message;
}

export function Bubble({ message }: BubbleProps): ReactElement {
  const isUser = message.role === "user";

  return (
    <div className={`bubble ${isUser ? "bubble--user" : "bubble--assistant"}`}>
      <div className={`avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className="bubble__content">
        {message.content}
        {message.files && message.files.length > 0 && (
          <div className="bubble__files">
            {message.files.map((file, index) => (
              <div key={index} className="bubble__file">
                <div className="bubble__file-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="bubble__file-info">
                  <div className="bubble__file-name">{file.name}</div>
                  <div className="bubble__file-size">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="bubble__meta">{new Date(message.createdAt).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}
