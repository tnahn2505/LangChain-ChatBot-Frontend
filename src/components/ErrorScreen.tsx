import { useState } from 'react';
import type { ReactElement } from 'react';

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
  retryText?: string;
}

export function ErrorScreen({ 
  error, 
  onRetry, 
  showRetry = true, 
  retryText = "Try Again" 
}: ErrorScreenProps): ReactElement {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        window.location.reload();
      }
    } finally {
      // Reset retry state after a delay
      setTimeout(() => setIsRetrying(false), 2000);
    }
  };

  return (
    <div className="app">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '32px',
        padding: '40px 20px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Error Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          ⚠️
        </div>

        {/* Error Message */}
        <div style={{ 
          color: 'var(--text)', 
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '12px',
          lineHeight: '1.2'
        }}>
          Oops! Something went wrong
        </div>
        
        <div style={{ 
          color: 'var(--muted)', 
          fontSize: '18px',
          lineHeight: '1.6',
          marginBottom: '32px',
          maxWidth: '400px'
        }}>
          {error}
        </div>

        {/* Retry Button - Centered */}
        {showRetry && (
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="btn"
            style={{
              background: isRetrying 
                ? 'var(--muted)' 
                : 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: 'var(--radius-lg)',
              fontSize: '18px',
              fontWeight: '700',
              cursor: isRetrying ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '200px',
              justifyContent: 'center',
              boxShadow: isRetrying 
                ? 'none' 
                : '0 8px 24px rgba(16, 163, 127, 0.3)',
              transform: isRetrying ? 'scale(0.98)' : 'scale(1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isRetrying ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid transparent',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Retrying...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {retryText}
              </>
            )}
          </button>
        )}

        {/* Additional Help */}
        <div style={{
          color: 'var(--muted)',
          fontSize: '14px',
          marginTop: '24px',
          padding: '16px 24px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '400px'
        }}>
          💡 <strong>Tip:</strong> If the problem persists, please check your internet connection or try refreshing the page
        </div>
      </div>
    </div>
  );
}
