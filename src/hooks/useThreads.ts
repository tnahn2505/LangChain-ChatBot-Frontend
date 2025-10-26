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
        messages: [] // Backend sẽ tự động tạo welcome message
      };
      
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
    
    // Nếu có title mới, gọi API để update
    if (updates.title) {
      try {
        await api.updateThreadTitle(threadId, updates.title);
      } catch (err) {
        console.error('Error updating thread title:', err);
        setError('Failed to update thread title.');
      }
    }
    
    // Cập nhật state
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
      setError(null);
      console.log('useThreads deleteThread called with:', threadId);
      console.log('Current threads before delete:', threads);
      
      await api.deleteThread(threadId);
      
      console.log('API delete successful, updating threads state');
      setThreads(prev => {
        const filtered = prev.filter(thread => thread.id !== threadId);
        console.log('Threads after filter:', filtered);
        return filtered;
      });
      
      console.log('Threads state updated');
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
