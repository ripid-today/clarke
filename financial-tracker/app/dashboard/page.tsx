'use client';

import { useEffect, useState, Suspense } from 'react';
import { Earning, Expense, Fund } from '@/types';
import IncomeStatementTable from '@/components/tracker/IncomeStatementTable';
import BarChartDashboard from '@/components/tracker/BarChartDashboard';
import EntryForm from '@/components/tracker/EntryForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

function getRolling12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  // Start 11 months back, end at current month
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

function getDefaultMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

interface EarningFormData {
  name: string;
  amount_vnd: number;
  type: 'regular' | 'receivable';
  receiver_type: 'user' | 'fund';
  receiver_id: string | null;
  status: 'planned' | 'actual';
  month: string;
}

interface ExpenseFormData {
  name: string;
  amount_vnd: number;
  sender_type: 'user' | 'fund';
  sender_id: string | null;
  receiver_type: 'fund' | 'none';
  receiver_id: string | null;
  status: 'planned' | 'actual';
  month: string;
}

function DashboardContent() {
  const months = getRolling12Months();
  const startMonth = months[0];
  const endMonth = months[months.length - 1];

  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);

  const defaultMonth = getDefaultMonth();

  async function fetchData() {
    setLoading(true);
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
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddEarning(data: EarningFormData) {
    const res = await fetch('/api/earnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      throw new Error(err.error ?? 'Failed to add earning');
    }
    setAddOpen(false);
    setBlockError(null);
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
        throw new Error(msg);
      }
      throw new Error(err.error ?? 'Failed to add expense');
    }
    setAddOpen(false);
    setBlockError(null);
    await fetchData();
  }

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
          <IncomeStatementTable
            earnings={earnings}
            expenses={expenses}
            months={months}
            onRefresh={fetchData}
          />

          <div className="mt-12">
            <BarChartDashboard
              earnings={earnings}
              expenses={expenses}
              months={months}
            />
          </div>
        </>
      )}

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
