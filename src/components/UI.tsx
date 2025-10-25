import type { ReactElement } from 'react';
import '../styles/UI.css';
import { useAppState } from '../hooks/useAppState';
import { useDarkMode } from '../hooks/useDarkMode';
import { useToast } from '../hooks/useToast';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorScreen } from './ErrorScreen';
import { EmptyState } from './EmptyState';
import { Sidebar } from './Sidebar';
import { ChatContainer } from './ChatContainer';
import { ToastContainer } from './Toast';

// ---- Main ----
export default function UI(): ReactElement {
  const { dark, toggleDarkMode } = useDarkMode();
  const { toasts, removeToast } = useToast();
  const {
    threads,
    activeThread,
    activeId,
    loading,
    error,
    handleCreateThread,
    handleThreadUpdate,
    handleSelectThread
  } = useAppState();

  // Loading state
  if (loading) {
    return (
      <div className="app">
        <LoadingSpinner message="Loading chat..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorScreen error={error} />;
  }

  // Empty state
  if (!activeThread && threads.length === 0) {
    return <EmptyState onCreateThread={handleCreateThread} />;
  }

  // Loading thread state
  if (!activeThread && threads.length > 0) {
    return <LoadingSpinner message="Loading thread..." />;
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <Sidebar 
          threads={threads} 
          activeId={activeId} 
          onCreate={handleCreateThread} 
          onSelect={handleSelectThread} 
        />
          
        {activeThread && (
          <ChatContainer 
            thread={activeThread}
            onThreadUpdate={handleThreadUpdate}
            dark={dark}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ErrorBoundary>
  );
}
