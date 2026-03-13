'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MonthNavigator from '@/components/ui/MonthNavigator';
import EntryList from '@/components/tracker/EntryList';
import EntryForm from '@/components/tracker/EntryForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Earning } from '@/types';

function getDefaultMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function EarningsContent() {
  const searchParams = useSearchParams();
  const month = searchParams.get('month') ?? getDefaultMonth();

  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Earning | null>(null);

  async function fetchEarnings() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/earnings?month=${month}`);
      if (!res.ok) throw new Error('Failed to fetch earnings');
      const data = await res.json() as { earnings: Earning[] };
      setEarnings(data.earnings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchEarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  async function handleAdd(data: { description: string; amount_vnd: number; status: 'planned' | 'actual' }) {
    const res = await fetch('/api/earnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, month }),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      throw new Error(err.error ?? 'Failed to add earning');
    }
    setModalOpen(false);
    await fetchEarnings();
  }

  async function handleEdit(data: { description: string; amount_vnd: number; status: 'planned' | 'actual' }) {
    if (!editingEntry) return;
    const res = await fetch(`/api/earnings/${editingEntry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json() as { error: string };
      throw new Error(err.error ?? 'Failed to update earning');
    }
    setEditingEntry(null);
    await fetchEarnings();
  }

  async function handleToggle(id: string, newStatus: 'planned' | 'actual') {
    const res = await fetch(`/api/earnings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) await fetchEarnings();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this earning?')) return;
    const res = await fetch(`/api/earnings/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchEarnings();
  }

  const planned = earnings.filter(e => e.status === 'planned');
  const actual = earnings.filter(e => e.status === 'actual');

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-black">Earnings</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <MonthNavigator />
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Add Earning
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
          <h2 className="text-lg font-semibold text-black mb-4">Planned Earnings</h2>
          <EntryList
            entries={planned}
            onToggle={handleToggle}
            onEdit={entry => setEditingEntry(entry as Earning)}
            onDelete={handleDelete}
            loading={loading}
          />
        </section>

        {/* Actual */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-black mb-4">Actual Earnings</h2>
          <EntryList
            entries={actual}
            onToggle={handleToggle}
            onEdit={entry => setEditingEntry(entry as Earning)}
            onDelete={handleDelete}
            loading={loading}
          />
        </section>
      </div>

      {/* Add modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Earning">
        <EntryForm
          type="earning"
          onSubmit={handleAdd}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        title="Edit Earning"
      >
        {editingEntry && (
          <EntryForm
            type="earning"
            initialValues={editingEntry ? { ...editingEntry, description: editingEntry.description ?? undefined } : undefined}
            onSubmit={handleEdit}
            onCancel={() => setEditingEntry(null)}
          />
        )}
      </Modal>
    </main>
  );
}

export default function EarningsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-claude-secondary">Loading...</div>}>
      <EarningsContent />
    </Suspense>
  );
}
