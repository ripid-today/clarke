'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import MonthNavigator from '@/components/ui/MonthNavigator';
import EntryList from '@/components/tracker/EntryList';
import EntryForm from '@/components/tracker/EntryForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Expense, FundMember, Fund } from '@/types';
import { formatVnd } from '@/lib/utils/formatVnd';

function getDefaultMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function FundDetailContent({ fundId }: { fundId: string }) {
  const searchParams = useSearchParams();
  const month = searchParams.get('month') ?? getDefaultMonth();

  const [fund, setFund] = useState<Fund | null>(null);
  const [members, setMembers] = useState<FundMember[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add expense modal
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [blockError, setBlockError] = useState<string | null>(null);

  // Add member modal
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [fundsRes, membersRes, expensesRes] = await Promise.all([
        fetch('/api/funds'),
        fetch(`/api/funds/${fundId}/members`),
        fetch(`/api/expenses?month=${month}&fund_id=${fundId}`),
      ]);

      if (!fundsRes.ok) throw new Error('Fund not found');

      const fundsData = await fundsRes.json() as { funds: Fund[] };
      const foundFund = fundsData.funds?.find(f => f.id === fundId);
      if (!foundFund) throw new Error('Fund not found or you are not a member');
      setFund(foundFund);

      if (membersRes.ok) {
        const membersData = await membersRes.json() as { members: FundMember[] };
        setMembers(membersData.members ?? []);
      }

      if (expensesRes.ok) {
        const expensesData = await expensesRes.json() as { expenses: Expense[] };
        setExpenses(expensesData.expenses ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fund');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundId, month]);

  // The API enforces that only the fund creator can add members.
  // We show the "Add Member" button to all members; unauthorized attempts are rejected by the API.

  async function handleAddExpense(data: { description: string; amount_vnd: number; status: 'planned' | 'actual' }) {
    setBlockError(null);
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, month, fund_id: fundId }),
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
    setExpenseModalOpen(false);
    setBlockError(null);
    await fetchAll();
  }

  async function handleEditExpense(data: { description: string; amount_vnd: number; status: 'planned' | 'actual' }) {
    if (!editingExpense) return;
    setBlockError(null);
    const res = await fetch(`/api/expenses/${editingExpense.id}`, {
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
    setEditingExpense(null);
    setBlockError(null);
    await fetchAll();
  }

  async function handleToggleExpense(id: string, newStatus: 'planned' | 'actual') {
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
      await fetchAll();
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm('Delete this expense?')) return;
    const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchAll();
  }

  async function handleAddMember() {
    if (!newMemberEmail.trim()) {
      setMemberError('Email is required');
      return;
    }
    setAddingMember(true);
    setMemberError(null);
    try {
      const res = await fetch(`/api/funds/${fundId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newMemberEmail.trim() }),
      });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error ?? 'Failed to add member');
      }
      setNewMemberEmail('');
      setMemberModalOpen(false);
      await fetchAll();
    } catch (err) {
      setMemberError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-claude-secondary">Loading...</div>;
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600">{error}</div>
      </main>
    );
  }

  const groupTotal = expenses.reduce((s, e) => s + e.amount_vnd, 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-[13px] text-claude-secondary mb-1">
            <a href="/funds" className="hover:text-claude-primary transition-colors">Funds</a> /
          </p>
          <h1 className="text-3xl font-bold text-black">{fund?.name}</h1>
        </div>
        <MonthNavigator />
      </div>

      {/* Members section */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">Members ({members.length})</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setNewMemberEmail(''); setMemberError(null); setMemberModalOpen(true); }}
          >
            + Add Member
          </Button>
        </div>
        {members.length === 0 ? (
          <p className="text-claude-secondary text-[15px]">No members yet.</p>
        ) : (
          <ul className="space-y-2">
            {members.map(m => (
              <li key={m.user_id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-cloud-dancer flex items-center justify-center text-claude-primary font-semibold text-sm shrink-0">
                  {m.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[15px] font-medium text-black">{m.display_name}</p>
                  <p className="text-[13px] text-claude-secondary">{m.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Fund expenses */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-black">Fund Expenses</h2>
            <p className="text-[13px] text-claude-secondary mt-0.5">
              Group total: <span className="font-semibold text-claude-primary">{formatVnd(groupTotal)}</span>
            </p>
          </div>
          <Button variant="primary" onClick={() => { setBlockError(null); setExpenseModalOpen(true); }}>
            + Add My Expense
          </Button>
        </div>

        {expenses.length === 0 ? (
          <p className="text-claude-secondary text-[15px] py-4 text-center">No expenses for this month.</p>
        ) : (
          <EntryList
            entries={expenses}
            onToggle={handleToggleExpense}
            onEdit={entry => { setBlockError(null); setEditingExpense(entry as Expense); }}
            onDelete={handleDeleteExpense}
            loading={false}
            showOwner
            members={members}
          />
        )}
      </section>

      {/* Add expense modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => { setExpenseModalOpen(false); setBlockError(null); }}
        title="Add Fund Expense"
      >
        <EntryForm
          type="expense"
          onSubmit={handleAddExpense}
          onCancel={() => { setExpenseModalOpen(false); setBlockError(null); }}
          blockError={blockError ?? undefined}
        />
      </Modal>

      {/* Edit expense modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => { setEditingExpense(null); setBlockError(null); }}
        title="Edit Fund Expense"
      >
        {editingExpense && (
          <EntryForm
            type="expense"
            initialValues={editingExpense ? { ...editingExpense, description: editingExpense.description ?? undefined } : undefined}
            onSubmit={handleEditExpense}
            onCancel={() => { setEditingExpense(null); setBlockError(null); }}
            blockError={blockError ?? undefined}
          />
        )}
      </Modal>

      {/* Add member modal */}
      <Modal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        title="Add Member"
      >
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={newMemberEmail}
            onChange={e => setNewMemberEmail(e.target.value)}
            placeholder="friend@email.com"
            required
            error={memberError ?? undefined}
            onKeyDown={e => { if (e.key === 'Enter') void handleAddMember(); }}
          />
          <p className="text-[13px] text-claude-secondary">
            The person must already have a Finance Tracker account.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setMemberModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddMember} loading={addingMember}>
              Add Member
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

export default function FundDetailPage() {
  const params = useParams();
  const fundId = params.fundId as string;

  return (
    <Suspense fallback={<div className="text-center py-16 text-claude-secondary">Loading...</div>}>
      <FundDetailContent fundId={fundId} />
    </Suspense>
  );
}
