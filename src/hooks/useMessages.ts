import { useState, useCallback } from 'react';
import type { Message } from '../types';
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

      // Lưu messages vào localStorage
      const currentMessages = await api.getMessages(threadId);
      const updatedMessages = [...currentMessages, newMessage];
      await api.saveMessages(threadId, updatedMessages);
      
      return newMessage;
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Failed to send message.');
      // Remove optimistic update on error
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      throw err;
    }
  }, [threadId, messages]);

  const simulateTyping = useCallback((callback: () => void, delay: number = 600) => {
    setTyping(true);
    setTimeout(() => {
      callback();
      setTyping(false);
    }, delay);
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      setError(null);
      const loadedMessages = await api.getMessages(threadId);
      setMessages(loadedMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages.');
    }
  }, [threadId]);

  const sendMessageToAI = useCallback(async (content: string) => {
    try {
      setError(null);
      const response = await api.sendMessage(threadId, content);
      
      // Tạo assistant message từ response
      const assistantMessage: Message = {
        id: response.assistant_message_id,
        role: 'assistant',
        content: response.assistant.content,
        createdAt: now()
      };
      
      // Thêm assistant message
      const currentMessages = await api.getMessages(threadId);
      const updatedMessages = [...currentMessages, assistantMessage];
      setMessages(updatedMessages);
      await api.saveMessages(threadId, updatedMessages);
      
      return assistantMessage;
    } catch (err) {
      console.error('Error sending message to AI:', err);
      setError('Failed to get AI response.');
      throw err;
    }
  }, [threadId, messages]);

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
