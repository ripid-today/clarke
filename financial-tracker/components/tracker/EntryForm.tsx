'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatVnd, parseVnd } from '@/lib/utils/formatVnd';

interface EntryFormData {
  description: string;
  amount_vnd: number;
  status: 'planned' | 'actual';
}

interface EntryFormProps {
  onSubmit: (data: EntryFormData) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<EntryFormData>;
  type: 'earning' | 'expense';
  blockError?: string;
}

export default function EntryForm({
  onSubmit,
  onCancel,
  initialValues,
  type,
  blockError,
}: EntryFormProps) {
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [rawAmount, setRawAmount] = useState(
    initialValues?.amount_vnd ? String(initialValues.amount_vnd) : ''
  );
  const [displayAmount, setDisplayAmount] = useState(
    initialValues?.amount_vnd ? formatVnd(initialValues.amount_vnd) : ''
  );
  const [status, setStatus] = useState<'planned' | 'actual'>(
    initialValues?.status ?? 'planned'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const numeric = raw.replace(/[^\d]/g, '');
    setRawAmount(numeric);
    if (numeric) {
      setDisplayAmount(formatVnd(parseInt(numeric, 10)));
      setAmountError(null);
    } else {
      setDisplayAmount('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAmountError(null);

    const amount = parseVnd(rawAmount);
    if (!amount || amount <= 0) {
      setAmountError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ description, amount_vnd: amount, status });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const typeLabel = type === 'earning' ? 'Earning' : 'Expense';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder={`e.g. ${type === 'earning' ? 'Monthly salary' : 'Rent payment'}`}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-claude-secondary">
          Amount (VND) <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={displayAmount}
          onChange={handleAmountChange}
          placeholder="e.g. 10.000.000 ₫"
          className="w-full rounded-lg border border-claude-secondary bg-white px-3 py-2 text-[15px] text-black placeholder:text-claude-secondary focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2 focus:border-claude-primary"
          aria-label="Amount in VND"
          required
        />
        {amountError && <p className="text-sm text-red-600">{amountError}</p>}
        {(blockError) && (
          <p className="text-sm text-red-600 font-medium">{blockError}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-claude-secondary">Status</span>
        <div className="flex rounded-lg border border-claude-secondary overflow-hidden">
          {(['planned', 'actual'] as const).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`flex-1 py-2 text-[15px] font-medium transition-colors duration-150 ${
                status === s
                  ? 'bg-claude-primary text-white'
                  : 'bg-white text-claude-secondary hover:bg-black/5'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialValues?.amount_vnd ? `Update ${typeLabel}` : `Add ${typeLabel}`}
        </Button>
      </div>
    </form>
  );
}
