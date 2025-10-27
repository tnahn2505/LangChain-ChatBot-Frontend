import { useState, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

interface RenameDialogProps {
  isOpen: boolean;
  currentTitle: string;
  onConfirm: (newTitle: string) => void;
  onCancel: () => void;
}

export function RenameDialog({ isOpen, currentTitle, onConfirm, onCancel }: RenameDialogProps): ReactElement {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle);
      // Focus input after dialog opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, currentTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle && trimmedTitle !== currentTitle) {
      onConfirm(trimmedTitle);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return <></>;

  return (
    <div 
      className="rename-dialog-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onCancel}
    >
      <div 
        className="rename-dialog"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text)'
        }}>
          Rename Thread
        </h3>
        
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter thread title..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'var(--bg)',
              color: 'var(--text)',
              outline: 'none',
              marginBottom: '20px'
            }}
            autoFocus
          />
          
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim() || newTitle.trim() === currentTitle}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: newTitle.trim() && newTitle.trim() !== currentTitle ? 'var(--primary)' : 'var(--muted)',
                color: 'white',
                cursor: newTitle.trim() && newTitle.trim() !== currentTitle ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
