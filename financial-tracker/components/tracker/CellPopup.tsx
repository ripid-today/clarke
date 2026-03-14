'use client';

import { useEffect, useRef } from 'react';
import { Earning, Expense } from '@/types';
import { formatVnd } from '@/lib/utils/formatVnd';

interface CellPopupProps {
  entries: (Earning | Expense)[];
  anchorRect: DOMRect;
  onClose: () => void;
  onRefresh: () => void;
  onEdit?: (entry: Earning | Expense) => void;
}

export default function CellPopup({ entries, anchorRect, onClose, onRefresh, onEdit }: CellPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const top = anchorRect.bottom + 8 + window.scrollY;
  const left = Math.min(anchorRect.left, window.innerWidth - 300);

  function isEarning(entry: Earning | Expense): entry is Earning {
    return 'type' in entry;
  }

  async function handleToggle(entry: Earning | Expense) {
    const newStatus = entry.status === 'actual' ? 'planned' : 'actual';
    const endpoint = isEarning(entry) ? `/api/earnings/${entry.id}` : `/api/expenses/${entry.id}`;
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    onRefresh();
  }

  return (
    <div
      ref={popupRef}
      style={{ top, left, position: 'fixed', zIndex: 50, width: '280px' }}
      className="bg-white rounded-xl shadow-xl border border-claude-secondary/20 p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-claude-secondary uppercase tracking-wide">Entries</span>
        <button
          onClick={onClose}
          className="text-claude-secondary hover:text-black text-[18px] leading-none focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-black truncate">{entry.name || 'Unnamed'}</p>
              <p className="text-[12px] text-claude-secondary">{formatVnd(entry.amount_vnd)}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                entry.status === 'actual'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {entry.status}
              </span>
              <button
                onClick={() => void handleToggle(entry)}
                className="text-[11px] text-claude-secondary hover:text-claude-primary transition-colors underline"
                title="Toggle status"
              >
                toggle
              </button>
              {onEdit && (
                <button
                  onClick={() => { onClose(); onEdit(entry); }}
                  className="text-[13px] text-claude-secondary hover:text-claude-primary transition-colors"
                  title="Edit entry"
                  aria-label="Edit entry"
                >
                  ✎
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
