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
        console.log('useThreads: Starting to load threads');
        setLoading(true);
        setError(null);
        
        // Test API connection
        console.log('useThreads: Testing API health');
        await api.health();
        console.log('useThreads: API health check passed');
        
        // Load threads from API
        console.log('useThreads: Loading threads from API');
        const apiThreads = await api.getAllThreads();
        console.log('useThreads: Loaded threads:', apiThreads);
        setThreads(apiThreads);
      } catch (err) {
        console.error('useThreads: Error loading threads:', err);
        setError('Failed to load threads. Using offline mode.');
        // Fallback to mock data
        const mockThread = seedThread();
        console.log('useThreads: Using mock thread:', mockThread);
        setThreads([mockThread]);
      } finally {
        setLoading(false);
        console.log('useThreads: Loading completed');
      }
    };
    
    loadThreads();
  }, []);

  const createThread = async (title: string = "New Chat") => {
    try {
      setError(null);
      console.log('useThreads: Creating thread with title:', title);
      const result = await api.createThread({ title });
      console.log('useThreads: API response:', result);
      console.log('useThreads: API response ID:', result.id, 'Type:', typeof result.id);
      
      const newThread: Thread = {
        id: result.id, // Use the ID from backend response
        title,
        updatedAt: new Date().toISOString(),
        messages: [] // Backend sẽ tự động tạo welcome message
      };
      
      console.log('useThreads: Created thread:', newThread);
      console.log('useThreads: Thread ID from backend:', newThread.id);
      setThreads(prev => [newThread, ...prev]);
      return newThread;
    } catch (err) {
      console.error('Error creating thread:', err);
      setError('Failed to create thread. Using offline mode.');
      // Fallback to mock data
      const mockThread = seedThread();
      console.log('useThreads: Using mock thread:', mockThread);
      setThreads(prev => [mockThread, ...prev]);
      return mockThread;
    }
  };

  const updateThread = async (threadId: string, updates: Partial<Thread>) => {
    console.log('useThreads: updateThread called with:', threadId, updates);
    const updatedThread = { ...updates, updatedAt: new Date().toISOString() };
    
    // Nếu có title mới, gọi API để update
    if (updates.title) {
      try {
        console.log('useThreads: Updating thread title:', threadId, updates.title);
        await api.updateThreadTitle(threadId, { title: updates.title });
        console.log('useThreads: Thread title updated successfully');
      } catch (err) {
        console.error('Error updating thread title:', err);
        setError('Failed to update thread title.');
      }
    }
    
    // Cập nhật state
    setThreads(prev => {
      const updated = prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, ...updatedThread }
          : thread
      );
      console.log('useThreads: Updated threads state:', updated);
      return updated;
    });
  };

  const deleteThread = async (threadId: string) => {
    try {
      setError(null);
      console.log('=== DELETE THREAD DEBUG ===');
      console.log('useThreads deleteThread called with:', threadId);
      console.log('Thread ID type:', typeof threadId);
      console.log('Thread ID length:', threadId.length);
      console.log('Current threads before delete:', threads);
      console.log('Thread IDs in current state:', threads.map(t => t.id));
      console.log('Thread ID types in state:', threads.map(t => ({ id: t.id, type: typeof t.id, length: t.id.length })));
      console.log('Thread exists in state:', threads.some(t => t.id === threadId));
      console.log('Exact match check:', threads.some(t => t.id === threadId));
      console.log('Strict equality check:', threads.some(t => t.id === threadId));
      
      const response = await api.deleteThread(threadId);
      console.log('API delete response:', response);
      
      console.log('API delete successful, updating threads state');
      setThreads(prev => {
        console.log('Previous threads state:', prev);
        const filtered = prev.filter(thread => {
          const shouldKeep = thread.id !== threadId;
          console.log(`Thread ${thread.id} ${shouldKeep ? 'kept' : 'removed'}`);
          return shouldKeep;
        });
        console.log('Threads after filter:', filtered);
        return filtered;
      });
      
      console.log('Threads state updated');
      console.log('=== DELETE THREAD DEBUG END ===');
    } catch (err) {
      console.error('=== DELETE THREAD ERROR ===');
      console.error('Error deleting thread:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError('Failed to delete thread.');
      console.error('=== DELETE THREAD ERROR END ===');
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
