'use client';

import { useEffect, useState, useMemo, Suspense, useRef } from 'react';
import { Earning, Expense, Fund } from '@/types';
import IncomeStatementTable from '@/components/tracker/IncomeStatementTable';
import BarChartDashboard from '@/components/tracker/BarChartDashboard';
import EntryForm, { EarningFormData, ExpenseFormData } from '@/components/tracker/EntryForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import Link from 'next/link';
import { formatVnd } from '@/lib/utils/formatVnd';

function getRollingMonths(windowOffset: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i + windowOffset, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

function getDefaultMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function isEarning(entry: Earning | Expense): entry is Earning {
  return 'type' in entry;
}

function DashboardContent() {
  const [windowOffset, setWindowOffset] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'back' | 'forward' | null>(null);
  const months = useMemo(() => getRollingMonths(windowOffset), [windowOffset]);
  const startMonth = months[0];
  const endMonth = months[months.length - 1];

  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedOnce = useRef(false);

  // Add entry modal
  const [addOpen, setAddOpen] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);

  // Edit entry modal
  const [editEntry, setEditEntry] = useState<Earning | Expense | null>(null);

  // Create fund modal
  const [createFundOpen, setCreateFundOpen] = useState(false);
  const [fundName, setFundName] = useState('');
  const [creatingFund, setCreatingFund] = useState(false);
  const [createFundError, setCreateFundError] = useState<string | null>(null);

  const { toasts, addToast, dismiss } = useToast();

  const defaultMonth = getDefaultMonth();

  async function fetchData(isNav = false) {
    if (isNav) {
      setNavLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const [entriesRes, fundsRes] = await Promise.all([
        fetch(`/api/entries?startMonth=${startMonth}&endMonth=${endMonth}`),
        fetch('/api/funds'),
      ]);

      if (!entriesRes.ok) throw new Error('Failed to fetch entries');

      const entriesData = await entriesRes.json() as { earnings: Earning[]; expenses: Expense[] };
      setEarnings(entriesData.earnings ?? []);
      setExpenses(entriesData.expenses ?? []);

      if (fundsRes.ok) {
        const fundsData = await fundsRes.json() as { funds: Fund[] };
        setFunds(fundsData.funds ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      if (isNav) {
        setNavLoading(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const isNav = hasFetchedOnce.current;
    hasFetchedOnce.current = true;
    void fetchData(isNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMonth, endMonth]);

  function handleWindowOffsetChange(newOffset: number) {
    setSlideDirection(newOffset < windowOffset ? 'back' : 'forward');
    setWindowOffset(newOffset);
  }

  async function handleAddEarning(data: EarningFormData) {
    const res = await fetch('/api/earnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      const msg = err.error ?? 'Failed to add earning';
      addToast(msg, 'error');
      throw new Error(msg);
    }
    setAddOpen(false);
    setBlockError(null);
    addToast('Earning added', 'success');
    await fetchData();
  }

  async function handleAddExpense(data: ExpenseFormData) {
    setBlockError(null);
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string; remaining?: number };
      if (res.status === 422) {
        const { formatVnd } = await import('@/lib/utils/formatVnd');
        const msg = err.remaining !== undefined
          ? `${err.error}. Remaining: ${formatVnd(err.remaining)}`
          : err.error;
        setBlockError(msg);
        addToast(msg, 'error');
        throw new Error(msg);
      }
      const msg = err.error ?? 'Failed to add expense';
      addToast(msg, 'error');
      throw new Error(msg);
    }
    setAddOpen(false);
    setBlockError(null);
    addToast('Expense added', 'success');
    await fetchData();
  }

  async function handleEditEarning(data: EarningFormData) {
    if (!editEntry || !isEarning(editEntry)) return;
    const res = await fetch(`/api/earnings/${editEntry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      const msg = err.error ?? 'Failed to update earning';
      addToast(msg, 'error');
      throw new Error(msg);
    }
    setEditEntry(null);
    addToast('Earning updated', 'success');
    await fetchData();
  }

  async function handleEditExpense(data: ExpenseFormData) {
    if (!editEntry || isEarning(editEntry)) return;
    const res = await fetch(`/api/expenses/${editEntry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string; remaining?: number };
      if (res.status === 422) {
        const { formatVnd } = await import('@/lib/utils/formatVnd');
        const msg = err.remaining !== undefined
          ? `${err.error}. Remaining: ${formatVnd(err.remaining)}`
          : err.error;
        addToast(msg, 'error');
        throw new Error(msg);
      }
      const msg = err.error ?? 'Failed to update expense';
      addToast(msg, 'error');
      throw new Error(msg);
    }
    setEditEntry(null);
    addToast('Expense updated', 'success');
    await fetchData();
  }

  async function handleCreateFund() {
    if (!fundName.trim()) {
      setCreateFundError('Fund name is required');
      return;
    }
    setCreatingFund(true);
    setCreateFundError(null);
    try {
      const res = await fetch('/api/funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fundName.trim() }),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? 'Failed to create fund');
      }
      setFundName('');
      setCreateFundOpen(false);
      addToast('Fund created', 'success');
      await fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create fund';
      setCreateFundError(msg);
      addToast(msg, 'error');
    } finally {
      setCreatingFund(false);
    }
  }

  // Fund contribution totals from current window expenses
  const fundContributionTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const e of expenses) {
      if (e.receiver_type === 'fund' && e.receiver_id && e.status === 'actual') {
        totals[e.receiver_id] = (totals[e.receiver_id] ?? 0) + e.amount_vnd;
      }
    }
    return totals;
  }, [expenses]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <Button variant="primary" onClick={() => { setBlockError(null); setAddOpen(true); }}>
          + Add Entry
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-[15px]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-claude-secondary">Loading...</div>
      ) : (
        <>
          <div className={navLoading ? 'opacity-60 pointer-events-none transition-opacity duration-150' : 'transition-opacity duration-200'}>
            <IncomeStatementTable
              earnings={earnings}
              expenses={expenses}
              months={months}
              onRefresh={fetchData}
              onEdit={setEditEntry}
              windowOffset={windowOffset}
              onWindowOffsetChange={handleWindowOffsetChange}
              slideDirection={slideDirection}
            />

            <div className="mt-12">
              <BarChartDashboard
                earnings={earnings}
                expenses={expenses}
                months={months}
                windowOffset={windowOffset}
                slideDirection={slideDirection}
              />
            </div>
          </div>

          {/* Your Funds section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">Your Funds</h2>
              <Button
                variant="primary"
                onClick={() => { setFundName(''); setCreateFundError(null); setCreateFundOpen(true); }}
              >
                + Create Fund
              </Button>
            </div>

            {funds.length === 0 ? (
              <div className="bg-white rounded-xl border border-claude-secondary/20 p-8 text-center">
                <p className="text-claude-secondary text-[17px] mb-2">No funds yet.</p>
                <p className="text-claude-secondary text-[15px]">Create a fund to track shared expenses with others.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funds.map(fund => {
                  const total = fundContributionTotals[fund.id] ?? 0;
                  return (
                    <Link
                      key={fund.id}
                      href={`/funds/${fund.id}`}
                      className="block bg-white rounded-xl border border-claude-secondary/20 p-4 hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-claude-primary"
                    >
                      <h3 className="text-[15px] font-semibold text-black mb-1">{fund.name}</h3>
                      <p className="text-[13px] text-claude-secondary">
                        Contributions: {total > 0 ? formatVnd(total) : '—'}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Entry modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => { setAddOpen(false); setBlockError(null); }}
        title="Add Entry"
      >
        <EntryForm
          onSubmitEarning={handleAddEarning}
          onSubmitExpense={handleAddExpense}
          onCancel={() => { setAddOpen(false); setBlockError(null); }}
          funds={funds}
          defaultMonth={defaultMonth}
          blockError={blockError ?? undefined}
        />
      </Modal>

      {/* Edit Entry modal */}
      <Modal
        isOpen={!!editEntry}
        onClose={() => setEditEntry(null)}
        title="Edit Entry"
      >
        {editEntry && (
          <EntryForm
            onSubmitEarning={handleEditEarning}
            onSubmitExpense={handleEditExpense}
            onCancel={() => setEditEntry(null)}
            funds={funds}
            defaultMonth={defaultMonth}
            editEntry={editEntry}
          />
        )}
      </Modal>

      {/* Create Fund modal */}
      <Modal
        isOpen={createFundOpen}
        onClose={() => setCreateFundOpen(false)}
        title="Create Fund"
      >
        <div className="space-y-4">
          <Input
            label="Fund name"
            value={fundName}
            onChange={e => setFundName(e.target.value)}
            placeholder="e.g. Shared Apartment, Monthly Groceries"
            required
            error={createFundError ?? undefined}
            onKeyDown={e => { if (e.key === 'Enter') void handleCreateFund(); }}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setCreateFundOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateFund} loading={creatingFund}>
              Create Fund
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-claude-secondary">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
