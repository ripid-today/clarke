'use client';

import { Earning, Expense, FundMember } from '@/types';
import { formatVnd } from '@/lib/utils/formatVnd';
import clsx from 'clsx';

interface EntryListProps {
  entries: (Earning | Expense)[];
  onToggle: (id: string, newStatus: 'planned' | 'actual') => void;
  onEdit: (entry: Earning | Expense) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  showOwner?: boolean;
  members?: FundMember[];
}

export default function EntryList({
  entries,
  onToggle,
  onEdit,
  onDelete,
  loading = false,
  showOwner = false,
  members = [],
}: EntryListProps) {
  if (loading) {
    return (
      <div className="py-8 text-center text-claude-secondary text-[15px]">
        Loading...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center text-claude-secondary text-[15px]">
        No entries yet.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-claude-secondary/20">
      {entries.map(entry => (
        <li key={entry.id} className="flex items-center gap-3 py-3 px-1">
          <div className="flex-1 min-w-0">
            <p className="text-[15px] text-black truncate">
              {entry.description ?? <span className="italic text-claude-secondary">No description</span>}
            </p>
            <p className="text-sm font-semibold text-black mt-0.5">
              {formatVnd(entry.amount_vnd)}
            </p>
            {showOwner && 'user_id' in entry && (
              <p className="text-[12px] text-claude-secondary mt-0.5">
                {members.find(m => m.user_id === entry.user_id)?.display_name ?? 'Unknown'}
              </p>
            )}
          </div>
          {/* Status badge — click to toggle */}
          <button
            onClick={() => onToggle(entry.id, entry.status === 'planned' ? 'actual' : 'planned')}
            className={clsx(
              'shrink-0 px-2.5 py-1 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary',
              entry.status === 'actual'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            )}
            aria-label={`Toggle status, currently ${entry.status}`}
          >
            {entry.status}
          </button>
          {/* Edit */}
          <button
            onClick={() => onEdit(entry)}
            className="shrink-0 p-1.5 text-claude-secondary hover:text-black rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary"
            aria-label="Edit entry"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(entry.id)}
            className="shrink-0 p-1.5 text-claude-secondary hover:text-red-600 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete entry"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
