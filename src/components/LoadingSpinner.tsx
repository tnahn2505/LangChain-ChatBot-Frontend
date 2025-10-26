import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showDots?: boolean;
  variant?: 'default' | 'chat' | 'minimal';
}

export function LoadingSpinner({ 
  message = "Loading...", 
  size = 'medium',
  showDots = true,
  variant = 'default'
}: LoadingSpinnerProps): ReactElement {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!showDots) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [showDots]);

  const sizeClasses = {
    small: { spinner: '24px', icon: '16px' },
    medium: { spinner: '48px', icon: '24px' },
    large: { spinner: '72px', icon: '32px' }
  };

  const currentSize = sizeClasses[size];

  if (variant === 'minimal') {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        color: 'var(--muted)',
        fontSize: '14px'
      }}>
        <div style={{ 
          width: '16px', 
          height: '16px', 
          border: '2px solid var(--border)', 
          borderTop: '2px solid var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <span>{message}{dots}</span>
      </div>
    );
  }

  if (variant === 'chat') {
    return (
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
        margin: '0 auto'
      }}>
        {/* Chat Icon */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(16, 163, 127, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          💬
        </div>

        {/* Loading Animation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: 'var(--accent)',
            borderRadius: '50%',
            animation: 'pulse 1.4s ease-in-out infinite'
          }}></div>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: 'var(--accent)',
            borderRadius: '50%',
            animation: 'pulse 1.4s ease-in-out infinite 0.2s'
          }}></div>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            background: 'var(--accent)',
            borderRadius: '50%',
            animation: 'pulse 1.4s ease-in-out infinite 0.4s'
          }}></div>
        </div>

        {/* Message */}
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text)',
          marginBottom: '8px'
        }}>
          {message}
        </div>

        <div style={{
          fontSize: '16px',
          color: 'var(--muted)',
          lineHeight: '1.5'
        }}>
          Setting up your chat experience...
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '200px',
          height: '4px',
          background: 'var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '24px'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
            borderRadius: '2px',
            animation: 'loading-bar 2s ease-in-out infinite'
          }}></div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '24px',
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Spinner */}
      <div style={{ 
        width: currentSize.spinner, 
        height: currentSize.spinner, 
        border: '4px solid var(--border)', 
        borderTop: '4px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      
      {/* Message */}
      <div style={{
        fontSize: '18px',
        fontWeight: '500',
        color: 'var(--text)'
      }}>
        {message}{dots}
      </div>
    </div>
  );
}
