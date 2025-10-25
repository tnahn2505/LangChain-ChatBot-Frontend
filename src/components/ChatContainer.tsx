import React, { useState, useRef, useEffect } from 'react';
import type { ReactElement } from 'react';
import type { Thread, Message } from '../types';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useMessages } from '../hooks/useMessages';
import { newId, now } from '../utils';
import { api } from '../services/api';

interface ChatContainerProps {
  thread: Thread;
  onThreadUpdate: (threadId: string, updates: Partial<Thread>) => void;
  dark: boolean;
  toggleDarkMode: () => void;
}

export function ChatContainer({ thread, onThreadUpdate, dark, toggleDarkMode }: ChatContainerProps): ReactElement {
  const { messages, typing, addMessage, simulateTyping, sendMessageToAI, setMessages } = useMessages(thread.id);
  const [error, setError] = useState<string | null>(null);

  // Load messages when thread changes
  useEffect(() => {
    if (thread.messages.length > 0) {
      setMessages(thread.messages);
    }
  }, [thread.id, thread.messages, setMessages]);

  const handleSend = async (text: string, files?: File[]) => {
    if (!text.trim() && (!files || files.length === 0)) return;
    
    try {
      setError(null);
      
      // Add user message
      const userMessage = await addMessage('user', text, files);
      
      // Update thread title if this is the first user message
      const isFirstUserMessage = thread.messages.length === 1; // Only welcome message
      const newTitle = isFirstUserMessage 
        ? text.slice(0, 50) + (text.length > 50 ? "..." : "") 
        : thread.title;
      
      if (isFirstUserMessage) {
        await onThreadUpdate(thread.id, { 
          title: newTitle,
          updatedAt: now()
        });
      }

      // Simulate AI response
      simulateTyping(async () => {
        try {
          // Gửi message đến AI backend
          const assistantMessage = await sendMessageToAI(text);
          
          // Update thread with new messages
          await onThreadUpdate(thread.id, { 
            messages: [...messages, userMessage, assistantMessage],
            updatedAt: now()
          });
        } catch (err) {
          console.error('Error sending message:', err);
          setError('Failed to send message. Please try again.');
        }
      });
    } catch (err) {
      console.error('Error in handleSend:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="chat">
        <div className="chat__header">
          <div className="chat__title">Error</div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px'
        }}>
          <div style={{ color: 'var(--error)', textAlign: 'center' }}>
            {error}
          </div>
          <button 
            onClick={() => setError(null)}
            className="btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__title">{thread.title}</div>
        <div>
          <button
            onClick={toggleDarkMode}
            className="btn"
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '8px 16px',
              fontSize: '14px',
              position: 'static'
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
      
      <MessageList messages={messages} typing={typing} />
      
      <ChatInput onSend={handleSend} disabled={typing} />
    </div>
  );
}
