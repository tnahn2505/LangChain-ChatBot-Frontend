import { useState } from 'react';
import type { ReactElement } from 'react';
import type { Thread } from '../types';

interface SidebarProps {
  threads: Thread[];
  activeId?: string;
  onCreate: () => void;
  onSelect: (id: string) => void;
}

export function Sidebar({
  threads,
  activeId,
  onCreate,
  onSelect,
}: SidebarProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  
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
          <div key={t.id}>
            <button
              onClick={() => onSelect(t.id)}
              className={
                "sidebar__item " +
                (t.id === activeId ? "sidebar__item--active" : "")
              }
            >
              <div className="sidebar__title">{t.title || "Untitled"}</div>
              <div className="sidebar__time">{new Date(t.updatedAt).toLocaleString()}</div>
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
