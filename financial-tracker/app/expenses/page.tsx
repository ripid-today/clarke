'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MonthNavigator from '@/components/ui/MonthNavigator';
import EntryList from '@/components/tracker/EntryList';
import EntryForm from '@/components/tracker/EntryForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Expense } from '@/types';
import { formatVnd } from '@/lib/utils/formatVnd';

function getDefaultMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function ExpensesContent() {
  const searchParams = useSearchParams();
  const month = searchParams.get('month') ?? getDefaultMonth();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Expense | null>(null);
  const [blockError, setBlockError] = useState<string | null>(null);

  async function fetchExpenses() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/expenses?month=${month}`);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json() as { expenses: Expense[] };
      setExpenses(data.expenses ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  async function handleAdd(data: { description: string; amount_vnd: number; status: 'planned' | 'actual' }) {
    setBlockError(null);
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, month }),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string; remaining?: number };
      if (res.status === 422) {
        const msg = err.remaining !== undefined
          ? `${err.error}. Remaining: ${formatVnd(err.remaining)}`
          : err.error;
        setBlockError(msg);
        throw new Error(msg);
      }
      throw new Error(err.error ?? 'Failed to add expense');
    }
    setModalOpen(false);
    setBlockError(null);
    await fetchExpenses();
  }

  async function handleEdit(data: { description: string; amount_vnd: number; status: 'planned' | 'actual' }) {
    if (!editingEntry) return;
    setBlockError(null);
    const res = await fetch(`/api/expenses/${editingEntry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string; remaining?: number };
      if (res.status === 422) {
        const msg = err.remaining !== undefined
          ? `${err.error}. Remaining: ${formatVnd(err.remaining)}`
          : err.error;
        setBlockError(msg);
        throw new Error(msg);
      }
      throw new Error(err.error ?? 'Failed to update expense');
    }
    setEditingEntry(null);
    setBlockError(null);
    await fetchExpenses();
  }

  async function handleToggle(id: string, newStatus: 'planned' | 'actual') {
    const res = await fetch(`/api/expenses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string; remaining?: number };
      if (res.status === 422) {
        alert(`Cannot toggle: ${err.error}${err.remaining !== undefined ? `. Remaining: ${formatVnd(err.remaining)}` : ''}`);
      }
    } else {
      await fetchExpenses();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return;
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchExpenses();
  }

  const planned = expenses.filter(e => e.status === 'planned');
  const actual = expenses.filter(e => e.status === 'actual');

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-black">Personal Expenses</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <MonthNavigator />
          <Button variant="primary" onClick={() => { setBlockError(null); setModalOpen(true); }}>
            + Add Expense
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-[15px]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Planned */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Planned Expenses</h2>
          <EntryList
            entries={planned}
            onToggle={handleToggle}
            onEdit={entry => { setBlockError(null); setEditingEntry(entry as Expense); }}
            onDelete={handleDelete}
            loading={loading}
          />
        </section>

        {/* Actual */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Actual Expenses</h2>
          <EntryList
            entries={actual}
            onToggle={handleToggle}
            onEdit={entry => { setBlockError(null); setEditingEntry(entry as Expense); }}
            onDelete={handleDelete}
            loading={loading}
          />
        </section>
      </div>

      {/* Add modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setBlockError(null); }} title="Add Expense">
        <EntryForm
          type="expense"
          onSubmit={handleAdd}
          onCancel={() => { setModalOpen(false); setBlockError(null); }}
          blockError={blockError ?? undefined}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingEntry}
        onClose={() => { setEditingEntry(null); setBlockError(null); }}
        title="Edit Expense"
      >
        {editingEntry && (
          <EntryForm
            type="expense"
            initialValues={editingEntry ? { ...editingEntry, description: editingEntry.description ?? undefined } : undefined}
            onSubmit={handleEdit}
            onCancel={() => { setEditingEntry(null); setBlockError(null); }}
            blockError={blockError ?? undefined}
          />
        )}
      </Modal>
    </main>
  );
}

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-claude-secondary">Loading...</div>}>
      <ExpensesContent />
    </Suspense>
  );
}
