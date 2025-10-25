import type { ReactElement } from 'react';

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorScreen({ error, onRetry, showRetry = true }: ErrorScreenProps): ReactElement {
  return (
    <div className="app">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ color: 'var(--error)', fontSize: '18px' }}>
          ⚠️ {error}
        </div>
        {showRetry && (
          <button 
            onClick={onRetry || (() => window.location.reload())} 
            className="btn"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
