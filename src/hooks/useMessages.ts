import { useState, useCallback } from 'react';
import type { Message, SendMessageRequest } from '../types';
import { api } from '../services/api';
import { newId, now } from '../utils';

export function useMessages(threadId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback(async (role: 'user' | 'assistant', content: string, files?: File[]) => {
    const newMessage: Message = {
      id: newId(),
      role,
      content,
      createdAt: now(),
      files: files || []
    };

    try {
      setError(null);
      
      // Optimistic update
      setMessages(prev => [...prev, newMessage]);
      
      return newMessage;
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Failed to send message.');
      // Remove optimistic update on error
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      throw err;
    }
  }, []);

  const simulateTyping = useCallback((callback: () => void, delay: number = 600) => {
    setTyping(true);
    setTimeout(() => {
      callback();
      setTyping(false);
    }, delay);
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      console.log('useMessages: Loading messages for threadId:', threadId);
      setError(null);
      const loadedMessages = await api.getMessages(threadId);
      console.log('useMessages: Loaded messages from API:', loadedMessages);
      
      // Ensure we have an array
      if (Array.isArray(loadedMessages)) {
        setMessages(loadedMessages);
      } else {
        console.warn('useMessages: API returned non-array response:', loadedMessages);
        setMessages([]);
      }
    } catch (err) {
      console.error('useMessages: Error loading messages:', err);
      setError('Failed to load messages.');
      // Don't clear messages on error, keep existing ones
    }
  }, [threadId]);

  const sendMessageToAI = useCallback(async (request: SendMessageRequest) => {
    try {
      setError(null);
      const response = await api.sendMessage(threadId, request);
      
      // Thêm assistant message vào state thay vì reload toàn bộ
      const assistantMessage: Message = {
        id: response.assistant_message_id,
        role: 'assistant',
        content: response.assistant.content,
        createdAt: now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      return response.assistant;
    } catch (err) {
      console.error('Error sending message to AI:', err);
      setError('Failed to get AI response.');
      throw err;
    }
  }, [threadId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setMessagesDirect = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
  }, []);

  return {
    messages,
    typing,
    error,
    addMessage,
    simulateTyping,
    loadMessages,
    sendMessageToAI,
    setMessages: setMessagesDirect,
    setError: clearError
  };
}
