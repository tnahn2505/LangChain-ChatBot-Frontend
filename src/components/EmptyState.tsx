import type { ReactElement } from 'react';

interface EmptyStateProps {
  onCreateThread: () => void;
}

export function EmptyState({ onCreateThread }: EmptyStateProps): ReactElement {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '0px',
      padding: '20px',
      textAlign: 'center',
      zIndex: 1000
    }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          💬
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--text)',
          marginBottom: '12px'
        }}>
          No chat available
        </div>
        <div style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          marginBottom: '32px'
        }}>
          Start a new conversation to begin chatting
        </div>
        <button 
          onClick={onCreateThread} 
          className="btn"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--primary-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
        >
          🚀 Start New Chat
        </button>
    </div>
  );
}
