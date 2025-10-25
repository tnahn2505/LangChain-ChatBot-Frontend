import { useState, useEffect } from 'react';
import type { Thread } from '../types';
import { api } from '../services/api';
import { seedThread } from '../utils';

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load threads from API
  useEffect(() => {
    const loadThreads = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test API connection
        await api.health();
        
        // Load threads from API
        const apiThreads = await api.getAllThreads();
        setThreads(apiThreads);
      } catch (err) {
        console.error('Error loading threads:', err);
        setError('Failed to load threads. Using offline mode.');
        // Fallback to mock data
        const mockThread = seedThread();
        setThreads([mockThread]);
      } finally {
        setLoading(false);
      }
    };
    
    loadThreads();
  }, []);

  const createThread = async (title: string = "New Chat") => {
    try {
      setError(null);
      const result = await api.createThread(title);
      
      const newThread: Thread = {
        id: result.id,
        title,
        updatedAt: new Date().toISOString(),
        messages: []
      };
      
      // Lưu thread vào localStorage
      await api.saveThread(newThread);
      
      setThreads(prev => [newThread, ...prev]);
      return newThread;
    } catch (err) {
      console.error('Error creating thread:', err);
      setError('Failed to create thread. Using offline mode.');
      // Fallback to mock data
      const mockThread = seedThread();
      setThreads(prev => [mockThread, ...prev]);
      return mockThread;
    }
  };

  const updateThread = async (threadId: string, updates: Partial<Thread>) => {
    const updatedThread = { ...updates, updatedAt: new Date().toISOString() };
    
    // Lưu vào localStorage
    const stored = localStorage.getItem(`thread_${threadId}`);
    if (stored) {
      const thread = JSON.parse(stored);
      const updated = { ...thread, ...updatedThread };
      await api.saveThread(updated);
    }
    
    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, ...updatedThread }
          : thread
      )
    );
  };

  const deleteThread = async (threadId: string) => {
    try {
      // TODO: Add API call to delete thread
      setThreads(prev => prev.filter(thread => thread.id !== threadId));
    } catch (err) {
      console.error('Error deleting thread:', err);
      setError('Failed to delete thread.');
    }
  };

  return {
    threads,
    loading,
    error,
    createThread,
    updateThread,
    deleteThread,
    setError
  };
}
