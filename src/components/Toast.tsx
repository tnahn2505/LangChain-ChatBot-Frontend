import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function ToastComponent({ toast, onRemove }: ToastProps): ReactElement {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300); // Wait for animation
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = () => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 1000
    };

    switch (toast.type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: 'var(--success-bg, #d4edda)',
          color: 'var(--success-text, #155724)',
          border: '1px solid var(--success-border, #c3e6cb)'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: 'var(--error-bg, #f8d7da)',
          color: 'var(--error-text, #721c24)',
          border: '1px solid var(--error-border, #f5c6cb)'
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: 'var(--warning-bg, #fff3cd)',
          color: 'var(--warning-text, #856404)',
          border: '1px solid var(--warning-border, #ffeaa7)'
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: 'var(--info-bg, #d1ecf1)',
          color: 'var(--info-text, #0c5460)',
          border: '1px solid var(--info-border, #bee5eb)'
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div style={getToastStyles()}>
      <span>{getIcon()}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: 'inherit',
          opacity: 0.7
        }}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps): ReactElement {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
