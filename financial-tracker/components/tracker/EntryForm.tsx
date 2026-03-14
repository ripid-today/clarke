'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatVnd, parseVnd } from '@/lib/utils/formatVnd';
import { Fund } from '@/types';

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

interface EntryFormProps {
  onSubmitEarning: (data: EarningFormData) => Promise<void>;
  onSubmitExpense: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  funds: Fund[];
  initialTab?: 'earning' | 'expense';
  defaultMonth: string;
  blockError?: string;
}

export default function EntryForm({
  onSubmitEarning,
  onSubmitExpense,
  onCancel,
  funds,
  initialTab = 'earning',
  defaultMonth,
  blockError,
}: EntryFormProps) {
  const [activeTab, setActiveTab] = useState<'earning' | 'expense'>(initialTab);

  return (
    <div className="flex flex-col gap-0">
      <div className="flex rounded-lg border border-claude-secondary overflow-hidden mb-5">
        {(['earning', 'expense'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[15px] font-medium transition-colors duration-150 capitalize ${
              activeTab === tab
                ? 'bg-claude-primary text-white'
                : 'bg-white text-claude-secondary hover:bg-black/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'earning' ? (
        <EarningForm
          onSubmit={onSubmitEarning}
          onCancel={onCancel}
          funds={funds}
          defaultMonth={defaultMonth}
          blockError={blockError}
        />
      ) : (
        <ExpenseForm
          onSubmit={onSubmitExpense}
          onCancel={onCancel}
          funds={funds}
          defaultMonth={defaultMonth}
          blockError={blockError}
        />
      )}
    </div>
  );
}

function EarningForm({
  onSubmit,
  onCancel,
  funds,
  defaultMonth,
  blockError,
}: {
  onSubmit: (data: EarningFormData) => Promise<void>;
  onCancel: () => void;
  funds: Fund[];
  defaultMonth: string;
  blockError?: string;
}) {
  const [name, setName] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [type, setType] = useState<'regular' | 'receivable'>('regular');
  const [receiverType, setReceiverType] = useState<'user' | 'fund'>('user');
  const [receiverId, setReceiverId] = useState<string>('');
  const [status, setStatus] = useState<'planned' | 'actual'>('planned');
  const [month, setMonth] = useState(defaultMonth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const numeric = e.target.value.replace(/[^\d]/g, '');
    setRawAmount(numeric);
    setDisplayAmount(numeric ? formatVnd(parseInt(numeric, 10)) : '');
    if (numeric) setAmountError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAmountError(null);
    const amount = parseVnd(rawAmount);
    if (!amount || amount <= 0) { setAmountError('Please enter a valid amount'); return; }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) { setError('Invalid month format'); return; }
    setLoading(true);
    try {
      await onSubmit({
        name,
        amount_vnd: amount,
        type,
        receiver_type: receiverType,
        receiver_id: receiverType === 'fund' ? receiverId || null : null,
        status,
        month,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Monthly salary"
        required
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
          required
        />
        {amountError && <p className="text-sm text-red-600">{amountError}</p>}
        {blockError && <p className="text-sm text-red-600 font-medium">{blockError}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-claude-secondary">Type</span>
        <div className="flex rounded-lg border border-claude-secondary overflow-hidden">
          {(['regular', 'receivable'] as const).map(t => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`flex-1 py-2 text-[15px] font-medium capitalize transition-colors duration-150 ${type === t ? 'bg-claude-primary text-white' : 'bg-white text-claude-secondary hover:bg-black/5'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-claude-secondary">Receiver</label>
        <select
          value={receiverType === 'user' ? 'user' : receiverId}
          onChange={e => {
            if (e.target.value === 'user') { setReceiverType('user'); setReceiverId(''); }
            else { setReceiverType('fund'); setReceiverId(e.target.value); }
          }}
          className="w-full rounded-lg border border-claude-secondary bg-white px-3 py-2 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-claude-primary"
        >
          <option value="user">Myself</option>
          {funds.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-claude-secondary">Status</span>
        <div className="flex rounded-lg border border-claude-secondary overflow-hidden">
          {(['planned', 'actual'] as const).map(s => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              className={`flex-1 py-2 text-[15px] font-medium capitalize transition-colors duration-150 ${status === s ? 'bg-claude-primary text-white' : 'bg-white text-claude-secondary hover:bg-black/5'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-claude-secondary">Month</label>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="w-full rounded-lg border border-claude-secondary bg-white px-3 py-2 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-claude-primary"
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading}>Add Earning</Button>
      </div>
    </form>
  );
}

function ExpenseForm({
  onSubmit,
  onCancel,
  funds,
  defaultMonth,
  blockError,
}: {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  funds: Fund[];
  defaultMonth: string;
  blockError?: string;
}) {
  const [name, setName] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [senderType, setSenderType] = useState<'user' | 'fund'>('user');
  const [senderId, setSenderId] = useState<string>('');
  const [receiverType, setReceiverType] = useState<'fund' | 'none'>('none');
  const [receiverId, setReceiverId] = useState<string>('');
  const [status, setStatus] = useState<'planned' | 'actual'>('planned');
  const [month, setMonth] = useState(defaultMonth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const numeric = e.target.value.replace(/[^\d]/g, '');
    setRawAmount(numeric);
    setDisplayAmount(numeric ? formatVnd(parseInt(numeric, 10)) : '');
    if (numeric) setAmountError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAmountError(null);
    const amount = parseVnd(rawAmount);
    if (!amount || amount <= 0) { setAmountError('Please enter a valid amount'); return; }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) { setError('Invalid month format'); return; }
    setLoading(true);
    try {
      await onSubmit({
        name,
        amount_vnd: amount,
        sender_type: senderType,
        sender_id: senderType === 'fund' ? senderId || null : null,
        receiver_type: receiverType,
        receiver_id: receiverType === 'fund' ? receiverId || null : null,
        status,
        month,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Rent payment"
        required
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
          required
        />
        {amountError && <p className="text-sm text-red-600">{amountError}</p>}
        {blockError && <p className="text-sm text-red-600 font-medium">{blockError}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-claude-secondary">Sender</label>
        <select
          value={senderType === 'user' ? 'user' : senderId}
          onChange={e => {
            if (e.target.value === 'user') { setSenderType('user'); setSenderId(''); }
            else { setSenderType('fund'); setSenderId(e.target.value); }
          }}
          className="w-full rounded-lg border border-claude-secondary bg-white px-3 py-2 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-claude-primary"
        >
          <option value="user">Myself</option>
          {funds.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-claude-secondary">Receiver (Fund)</label>
        <select
          value={receiverType === 'none' ? 'none' : receiverId}
          onChange={e => {
            if (e.target.value === 'none') { setReceiverType('none'); setReceiverId(''); }
            else { setReceiverType('fund'); setReceiverId(e.target.value); }
          }}
          className="w-full rounded-lg border border-claude-secondary bg-white px-3 py-2 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-claude-primary"
        >
          <option value="none">None (external expense)</option>
          {funds.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-claude-secondary">Status</span>
        <div className="flex rounded-lg border border-claude-secondary overflow-hidden">
          {(['planned', 'actual'] as const).map(s => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              className={`flex-1 py-2 text-[15px] font-medium capitalize transition-colors duration-150 ${status === s ? 'bg-claude-primary text-white' : 'bg-white text-claude-secondary hover:bg-black/5'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-claude-secondary">Month</label>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="w-full rounded-lg border border-claude-secondary bg-white px-3 py-2 text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-claude-primary"
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading}>Add Expense</Button>
      </div>
    </form>
  );
}
