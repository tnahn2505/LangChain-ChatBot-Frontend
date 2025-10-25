import { useState, useRef } from 'react';
import type { ReactElement } from 'react';

interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps): ReactElement {
  const [text, setText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    const v = text.trim();
    if ((!v && selectedFiles.length === 0) || disabled) return;
    const messageText = v || (selectedFiles.length > 0 ? `Đã gửi ${selectedFiles.length} tệp` : "");
    setText("");
    setSelectedFiles([]);
    onSend(messageText, selectedFiles);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="composer">
      {selectedFiles.length > 0 && (
        <div className="composer__files">
          {selectedFiles.map((file, index) => (
            <div key={index} className="composer__file-item">
              <span className="composer__file-name">{file.name}</span>
              <button 
                onClick={() => removeFile(index)}
                className="composer__file-remove"
                aria-label="Remove file"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="composer__input-container">
        <button
          onClick={openFileDialog}
          disabled={disabled}
          className="btn btn--file btn--file-left"
          aria-label="Add file"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div style={{ position: 'relative', flex: 1 }}>
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Message ChatGPT..."
            className="input"
            disabled={disabled}
          />
          
          <button
            onClick={send}
            disabled={disabled}
            className="btn"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12L20 12M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
      />
      
      <div className="composer__hint">Press Enter to send • Shift+Enter for new line</div>
    </div>
  );
}
