'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

function getDefaultMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function formatMonthLabel(month: string): string {
  const [year, mon] = month.split('-');
  const date = new Date(parseInt(year), parseInt(mon) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function shiftMonth(month: string, delta: number): string {
  const [year, mon] = month.split('-').map(Number);
  const date = new Date(year, mon - 1 + delta, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function useMonth(): string {
  const searchParams = useSearchParams();
  return searchParams.get('month') ?? getDefaultMonth();
}

export default function MonthNavigator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMonth = searchParams.get('month') ?? getDefaultMonth();

  const navigate = useCallback(
    (delta: number) => {
      const next = shiftMonth(currentMonth, delta);
      const params = new URLSearchParams(searchParams.toString());
      params.set('month', next);
      router.push(`?${params.toString()}`);
    },
    [currentMonth, router, searchParams]
  );

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-lg hover:bg-black/5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5 text-claude-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="text-[17px] font-semibold text-black min-w-[160px] text-center">
        {formatMonthLabel(currentMonth)}
      </span>
      <button
        onClick={() => navigate(1)}
        className="p-2 rounded-lg hover:bg-black/5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary"
        aria-label="Next month"
      >
        <svg className="w-5 h-5 text-claude-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
