'use client';

import { useState } from 'react';
import { Earning, Expense, IncomeStatementRow, IncomeStatementCell } from '@/types';
import { formatVnd } from '@/lib/utils/formatVnd';
import CellPopup from '@/components/tracker/CellPopup';

interface Props {
  earnings: Earning[];
  expenses: Expense[];
  months: string[];
  onAddEntry?: () => void;
  onRefresh?: () => void;
}

function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function buildTableData(earnings: Earning[], expenses: Expense[], months: string[]) {
  const earningRowMap = new Map<string, IncomeStatementRow>();
  const receivableRowMap = new Map<string, IncomeStatementRow>();
  const expenseRowMap = new Map<string, IncomeStatementRow>();

  function getOrCreate(map: Map<string, IncomeStatementRow>, name: string): IncomeStatementRow {
    if (!map.has(name)) {
      const cells: Record<string, IncomeStatementCell> = {};
      for (const m of months) {
        cells[m] = { actual: 0, planned: 0, actualEntries: [], plannedEntries: [] };
      }
      map.set(name, { name, cells });
    }
    return map.get(name)!;
  }

  for (const e of earnings) {
    if (!months.includes(e.month)) continue;
    const map = e.type === 'receivable' ? receivableRowMap : earningRowMap;
    const row = getOrCreate(map, e.name);
    if (e.status === 'actual') {
      row.cells[e.month].actual += e.amount_vnd;
      row.cells[e.month].actualEntries.push(e);
    } else {
      row.cells[e.month].planned += e.amount_vnd;
      row.cells[e.month].plannedEntries.push(e);
    }
  }

  for (const e of expenses) {
    if (!months.includes(e.month)) continue;
    const row = getOrCreate(expenseRowMap, e.name);
    if (e.status === 'actual') {
      row.cells[e.month].actual += e.amount_vnd;
      row.cells[e.month].actualEntries.push(e);
    } else {
      row.cells[e.month].planned += e.amount_vnd;
      row.cells[e.month].plannedEntries.push(e);
    }
  }

  return {
    earningRows: Array.from(earningRowMap.values()),
    receivableRows: Array.from(receivableRowMap.values()),
    expenseRows: Array.from(expenseRowMap.values()),
  };
}

function SectionHeader({ label, colSpan }: { label: string; colSpan: number; isExpense?: boolean }) {
  return (
    <tr className="bg-black/5">
      <td colSpan={colSpan} className="sticky left-0 bg-black/5 px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-claude-secondary">
        {label}
      </td>
    </tr>
  );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr className="border-b border-claude-secondary/10">
      <td colSpan={colSpan} className="px-4 py-3 text-[13px] text-claude-secondary/60 italic">
        No entries
      </td>
    </tr>
  );
}

interface IncomeRowProps {
  row: IncomeStatementRow;
  months: string[];
  viewMode: 'actual' | 'planned';
  onCellClick: (name: string, month: string, entries: (Earning | Expense)[], event: React.MouseEvent) => void;
  isExpense?: boolean;
}

function IncomeRow({ row, months, viewMode, onCellClick, isExpense }: IncomeRowProps) {
  return (
    <tr className="border-b border-claude-secondary/10 hover:bg-black/[0.02]">
      <td className="sticky left-0 bg-white px-4 py-2.5 text-black border-r border-claude-secondary/10 font-medium">
        {row.name || <span className="text-claude-secondary italic">Unnamed</span>}
      </td>
      {months.map(month => {
        const cell = row.cells[month];
        const hasActual = cell && cell.actual > 0;
        const hasPlanned = cell && cell.planned > 0;
        const isEmpty = !hasActual && !hasPlanned;

        return (
          <td key={month} className="text-right px-3 py-2.5">
            {isEmpty ? (
              <span className="text-claude-secondary/40">—</span>
            ) : viewMode === 'actual' ? (
              <button
                className={`text-right font-medium ${isExpense ? 'text-red-600' : 'text-black'} ${hasActual ? 'cursor-pointer hover:underline' : 'cursor-default opacity-40'}`}
                onClick={(e) => hasActual && cell && onCellClick(row.name, month, cell.actualEntries, e)}
                disabled={!hasActual}
              >
                {hasActual ? formatVnd(cell.actual) : '—'}
              </button>
            ) : (
              <div className="flex flex-col items-end gap-0.5">
                {hasActual && (
                  <button
                    className={`text-right font-medium text-[12px] ${isExpense ? 'text-red-600' : 'text-black'} hover:underline`}
                    onClick={(e) => cell && onCellClick(row.name, month, cell.actualEntries, e)}
                  >
                    {formatVnd(cell.actual)}
                  </button>
                )}
                {hasPlanned && (
                  <button
                    className={`text-right text-[12px] bg-yellow-50 rounded px-1 ${isExpense ? 'text-red-400' : 'text-claude-secondary'} hover:underline`}
                    onClick={(e) => cell && onCellClick(row.name, month, cell.plannedEntries, e)}
                  >
                    {formatVnd(cell.planned)}
                  </button>
                )}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}

export default function IncomeStatementTable({ earnings, expenses, months, onAddEntry, onRefresh }: Props) {
  const [viewMode, setViewMode] = useState<'actual' | 'planned'>('actual');
  const [popup, setPopup] = useState<{
    name: string;
    month: string;
    entries: (Earning | Expense)[];
    anchorRect: DOMRect;
  } | null>(null);

  function handleCellClick(name: string, month: string, entries: (Earning | Expense)[], event: React.MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPopup({ name, month, entries, anchorRect: rect });
  }

  const { earningRows, receivableRows, expenseRows } = buildTableData(earnings, expenses, months);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">Income Statement</h2>
        <div className="flex gap-0 rounded-lg border border-claude-secondary overflow-hidden">
          <button
            onClick={() => setViewMode('actual')}
            className={viewMode === 'actual' ? 'bg-claude-primary text-white px-4 py-1.5 text-[14px] font-medium' : 'bg-white text-claude-secondary hover:bg-black/5 px-4 py-1.5 text-[14px] font-medium'}
          >
            Actual
          </button>
          <button
            onClick={() => setViewMode('planned')}
            className={viewMode === 'planned' ? 'bg-claude-primary text-white px-4 py-1.5 text-[14px] font-medium' : 'bg-white text-claude-secondary hover:bg-black/5 px-4 py-1.5 text-[14px] font-medium'}
          >
            Planned
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-claude-secondary/20">
        <table className="min-w-max w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-cloud-dancer border-b border-claude-secondary/20">
              <th className="sticky left-0 z-10 bg-cloud-dancer text-left px-4 py-3 font-semibold text-black min-w-[160px] border-r border-claude-secondary/20">
                Name
              </th>
              {months.map(m => (
                <th key={m} className="text-right px-3 py-3 font-semibold text-black min-w-[110px] whitespace-nowrap">
                  {formatMonthLabel(m)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SectionHeader label="Earnings" colSpan={months.length + 1} />
            {earningRows.map(row => (
              <IncomeRow key={row.name} row={row} months={months} viewMode={viewMode} onCellClick={handleCellClick} />
            ))}
            {earningRows.length === 0 && <EmptyRow colSpan={months.length + 1} />}

            <SectionHeader label="Receivables" colSpan={months.length + 1} />
            {receivableRows.map(row => (
              <IncomeRow key={row.name} row={row} months={months} viewMode={viewMode} onCellClick={handleCellClick} />
            ))}
            {receivableRows.length === 0 && <EmptyRow colSpan={months.length + 1} />}

            <SectionHeader label="Expenses" colSpan={months.length + 1} isExpense />
            {expenseRows.map(row => (
              <IncomeRow key={row.name} row={row} months={months} viewMode={viewMode} onCellClick={handleCellClick} isExpense />
            ))}
            {expenseRows.length === 0 && <EmptyRow colSpan={months.length + 1} />}
          </tbody>
        </table>
      </div>

      {popup && (
        <CellPopup
          entries={popup.entries}
          anchorRect={popup.anchorRect}
          onClose={() => setPopup(null)}
          onRefresh={() => { setPopup(null); onRefresh?.(); }}
        />
      )}
    </div>
  );
}
