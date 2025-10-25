import type { ReactElement } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ 
  message = "Loading...", 
  size = 'medium' 
}: LoadingSpinnerProps): ReactElement {
  const sizeClasses = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ 
        width: sizeClasses[size], 
        height: sizeClasses[size], 
        border: '4px solid var(--border)', 
        borderTop: '4px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <div>{message}</div>
    </div>
  );
}
