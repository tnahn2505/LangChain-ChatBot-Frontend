import { useState, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import type { Thread } from '../types';
import { RenameDialog } from './RenameDialog';

interface SidebarProps {
  threads: Thread[];
  activeId?: string;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
}

export function Sidebar({
  threads,
  activeId,
  onCreate,
  onSelect,
  onDelete,
  onRename,
}: SidebarProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [renameDialog, setRenameDialog] = useState<{ isOpen: boolean; threadId: string; currentTitle: string }>({
    isOpen: false,
    threadId: '',
    currentTitle: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log('Sidebar rendered with onDelete:', !!onDelete);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <aside className="sidebar">
      <button
        onClick={onCreate}
        className="sidebar__new"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        New chat
      </button>

      <div className="sidebar__search">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sidebar__search-input"
        />
      </div>

      <div className="sidebar__group">Recent</div>
      <div className="sidebar__list">
        {filteredThreads.map((t) => (
          <div key={t.id} className="sidebar__item-wrapper">
            <button
              onClick={() => onSelect(t.id)}
              className={
                "sidebar__item " +
                (t.id === activeId ? "sidebar__item--active" : "")
              }
            >
              <div className="sidebar__content">
                <div className="sidebar__title">{t.title || "Untitled"}</div>
                <div className="sidebar__time">{new Date(t.updatedAt).toLocaleString()}</div>
              </div>
            </button>
            
            {onDelete && (
              <div className="sidebar__actions" ref={dropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('=== 3-DOT BUTTON CLICKED ===');
                    console.log('Thread ID:', t.id);
                    console.log('Current showDropdown:', showDropdown);
                    console.log('Setting showDropdown to:', showDropdown === t.id ? null : t.id);
                    setShowDropdown(showDropdown === t.id ? null : t.id);
                    console.log('=== 3-DOT BUTTON CLICKED END ===');
                  }}
                  className="sidebar__menu-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="5" r="1" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    <circle cx="12" cy="19" r="1" fill="currentColor"/>
                  </svg>
                </button>
                
                {showDropdown === t.id && (
                  <div className="sidebar__dropdown">
                    {console.log('=== DROPDOWN SHOWING ===')}
                    {console.log('Dropdown showing for thread:', t.id)}
                    {console.log('Dropdown visible:', true)}
                    {console.log('=== DROPDOWN SHOWING END ===')}
                    
                    {/* Rename Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('=== RENAME BUTTON CLICKED ===');
                        console.log('Rename button clicked for thread:', t.id);
                        console.log('onRename function:', onRename);
                        console.log('onRename type:', typeof onRename);
                        setRenameDialog({
                          isOpen: true,
                          threadId: t.id,
                          currentTitle: t.title
                        });
                        // Tạm thời bỏ setShowDropdown(null) để debug
                        // setShowDropdown(null);
                        console.log('=== RENAME BUTTON CLICKED END ===');
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        console.log('=== RENAME BUTTON MOUSE DOWN ===');
                        console.log('Mouse down on rename button for thread:', t.id);
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                        console.log('=== RENAME BUTTON MOUSE UP ===');
                        console.log('Mouse up on rename button for thread:', t.id);
                      }}
                      className="sidebar__dropdown-item"
                      style={{ 
                        background: '#007bff', 
                        color: 'white', 
                        padding: '8px 12px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        marginBottom: '4px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Rename
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('=== DELETE BUTTON CLICKED ===');
                        console.log('Delete button clicked for thread:', t.id);
                        console.log('onDelete function:', onDelete);
                        console.log('onDelete type:', typeof onDelete);
                        if (onDelete) {
                          console.log('Calling onDelete with threadId:', t.id);
                          onDelete(t.id);
                          console.log('onDelete called successfully');
                        } else {
                          console.log('onDelete is null/undefined, not calling');
                        }
                        // Tạm thời bỏ setShowDropdown(null) để debug
                        // setShowDropdown(null);
                        console.log('=== DELETE BUTTON CLICKED END ===');
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        console.log('=== DELETE BUTTON MOUSE DOWN ===');
                        console.log('Mouse down on delete button for thread:', t.id);
                      }}
                      onMouseUp={(e) => {
                        e.stopPropagation();
                        console.log('=== DELETE BUTTON MOUSE UP ===');
                        console.log('Mouse up on delete button for thread:', t.id);
                      }}
                      className="sidebar__dropdown-item sidebar__dropdown-item--danger"
                      style={{ 
                        background: 'red', 
                        color: 'white', 
                        padding: '8px 12px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        zIndex: 10001,
                        position: 'relative'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <RenameDialog
        isOpen={renameDialog.isOpen}
        currentTitle={renameDialog.currentTitle}
        onConfirm={(newTitle) => {
          if (onRename) {
            onRename(renameDialog.threadId, newTitle);
          }
          setRenameDialog({ isOpen: false, threadId: '', currentTitle: '' });
        }}
        onCancel={() => {
          setRenameDialog({ isOpen: false, threadId: '', currentTitle: '' });
        }}
      />
    </aside>
  );
}