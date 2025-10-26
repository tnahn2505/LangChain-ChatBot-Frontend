import { useState, useMemo, useCallback } from 'react';
import type { Thread, Message } from '../types';
import { now, newId } from '../utils';
import { useThreads } from './useThreads';
import { useToast } from './useToast';

export function useAppState() {
  const { threads, loading, error, createThread, updateThread, setError } = useThreads();
  const { showError, showSuccess } = useToast();
  const [activeId, setActiveId] = useState<string>('');

  const activeThread = useMemo(() => 
    threads.find((t) => t.id === activeId), 
    [threads, activeId]
  );

  const handleCreateThread = useCallback(async () => {
    try {
      const newThread = await createThread("New Chat");
      
      // Create welcome message
      const welcomeMessage: Message = {
        id: newId(),
        role: "assistant",
        content: "Xin chào 👋\nMình là AI Assistant. Hãy hỏi mình điều gì đó!",
        createdAt: now()
      };
      
      // Update thread with welcome message
      updateThread(newThread.id, { 
        messages: [welcomeMessage],
        updatedAt: now()
      });
      
      setActiveId(newThread.id);
      showSuccess("New chat created successfully!");
    } catch (err) {
      console.error('Error creating thread:', err);
      showError("Failed to create new chat. Please try again.");
    }
  }, [createThread, updateThread, showSuccess, showError]);

  const handleThreadUpdate = useCallback(async (threadId: string, updates: Partial<Thread>) => {
    await updateThread(threadId, updates);
  }, [updateThread]);

  const handleSelectThread = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleRetry = useCallback(async () => {
    try {
      setError(null);
      // Force reload threads
      window.location.reload();
    } catch (err) {
      console.error('Error during retry:', err);
      showError("Failed to retry. Please refresh the page.");
    }
  }, [setError, showError]);

  // Auto-select first thread if none selected
  useMemo(() => {
    if (!activeId && threads.length > 0) {
      setActiveId(threads[0].id);
    }
  }, [activeId, threads]);

  return {
    // State
    threads,
    activeThread,
    activeId,
    loading,
    error,
    
    // Actions
    handleCreateThread,
    handleThreadUpdate,
    handleSelectThread,
    handleRetry,
    setActiveId
  };
}
