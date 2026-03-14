'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Fund } from '@/types';

export default function SettingsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [fundName, setFundName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function fetchFunds() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/funds');
      if (!res.ok) throw new Error('Failed to fetch funds');
      const data = await res.json() as { funds: Fund[] };
      setFunds(data.funds ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load funds');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchFunds();
  }, []);

  async function handleCreate() {
    if (!fundName.trim()) {
      setCreateError('Fund name is required');
      return;
    }
    setCreating(true);
    setCreateError(null);
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
      setCreateOpen(false);
      await fetchFunds();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create fund');
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Settings</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-[15px]">
          {error}
        </div>
      )}

      {/* Your Funds section */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Your Funds</h2>
          <Button variant="primary" onClick={() => { setFundName(''); setCreateError(null); setCreateOpen(true); }}>
            + Create Fund
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-claude-secondary">Loading...</div>
        ) : funds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-claude-secondary text-[17px] mb-2">No funds yet.</p>
            <p className="text-claude-secondary text-[15px]">Create a fund to track shared expenses with others.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funds.map(fund => (
              <Link
                key={fund.id}
                href={`/funds/${fund.id}`}
                className="block bg-cloud-dancer rounded-lg p-4 hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-claude-primary"
              >
                <h3 className="text-[15px] font-semibold text-black mb-1">{fund.name}</h3>
                <p className="text-[13px] text-claude-secondary">
                  Created {new Date(fund.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Fund">
        <div className="space-y-4">
          <Input
            label="Fund name"
            value={fundName}
            onChange={e => setFundName(e.target.value)}
            placeholder="e.g. Shared Apartment, Monthly Groceries"
            required
            error={createError ?? undefined}
            onKeyDown={e => { if (e.key === 'Enter') void handleCreate(); }}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} loading={creating}>
              Create Fund
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
