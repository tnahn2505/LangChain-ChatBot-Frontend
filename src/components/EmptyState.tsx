import type { ReactElement } from 'react';

interface EmptyStateProps {
  onCreateThread: () => void;
}

export function EmptyState({ onCreateThread }: EmptyStateProps): ReactElement {
  return (
    <div className="app">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>No chat available</div>
        <button onClick={onCreateThread} className="btn">
          Start New Chat
        </button>
      </div>
    </div>
  );
}
