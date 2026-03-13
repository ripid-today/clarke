'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MonthNavigator, { useMonth } from '@/components/ui/MonthNavigator';
import SummaryCard from '@/components/tracker/SummaryCard';
import FundCard from '@/components/tracker/FundCard';
import { Earning, Expense, Fund } from '@/types';

function getDefaultMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

interface FundExpenseTotals {
  fundId: string;
  myTotal: number;
  groupTotal: number;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const month = searchParams.get('month') ?? getDefaultMonth();

  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [fundTotals, setFundTotals] = useState<FundExpenseTotals[]>([]);
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [earningsRes, expensesRes, fundsRes] = await Promise.all([
          fetch(`/api/earnings?month=${month}`),
          fetch(`/api/expenses?month=${month}`),
          fetch('/api/funds'),
        ]);

        if (!earningsRes.ok || !expensesRes.ok || !fundsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [earningsData, expensesData, fundsData] = await Promise.all([
          earningsRes.json() as Promise<{ earnings: Earning[] }>,
          expensesRes.json() as Promise<{ expenses: Expense[] }>,
          fundsRes.json() as Promise<{ funds: Fund[] }>,
        ]);

        setEarnings(earningsData.earnings ?? []);
        setExpenses(expensesData.expenses ?? []);
        setFunds(fundsData.funds ?? []);

        // Fetch fund expense totals
        const fundList: Fund[] = fundsData.funds ?? [];
        if (fundList.length > 0) {
          const totals = await Promise.all(
            fundList.map(async (fund) => {
              const res = await fetch(`/api/expenses?month=${month}&fund_id=${fund.id}`);
              if (!res.ok) return { fundId: fund.id, myTotal: 0, groupTotal: 0 };
              const data = await res.json() as { expenses: Expense[] };
              const allExpenses: Expense[] = data.expenses ?? [];
              const myExp = allExpenses.filter(e => e.user_id === fund.created_by);
              const myTotal = myExp.reduce((s, e) => s + e.amount_vnd, 0);
              const groupTotal = allExpenses.reduce((s, e) => s + e.amount_vnd, 0);
              return { fundId: fund.id, myTotal, groupTotal };
            })
          );
          setFundTotals(totals);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [month]);

  const plannedEarnings = earnings.filter(e => e.status === 'planned').reduce((s, e) => s + e.amount_vnd, 0);
  const actualEarnings = earnings.filter(e => e.status === 'actual').reduce((s, e) => s + e.amount_vnd, 0);
  const plannedExpenses = expenses.filter(e => e.status === 'planned').reduce((s, e) => s + e.amount_vnd, 0);
  const actualExpenses = expenses.filter(e => e.status === 'actual').reduce((s, e) => s + e.amount_vnd, 0);

  // Add fund expenses for selected user
  const allFundExpensesPlanned = fundTotals.reduce((s, f) => {
    const fund = funds.find(fu => fu.id === f.fundId);
    if (!fund) return s;
    return s + f.myTotal;
  }, 0);

  const totalPlannedExpenses = plannedExpenses + allFundExpensesPlanned;
  const totalActualExpenses = actualExpenses;

  const plannedNet = plannedEarnings - totalPlannedExpenses;
  const actualNet = actualEarnings - totalActualExpenses;

  const selectedFund = selectedFundId ? funds.find(f => f.id === selectedFundId) : null;
  const selectedFundTotals = selectedFundId ? fundTotals.find(f => f.fundId === selectedFundId) : null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <MonthNavigator />
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
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <SummaryCard
              label="Planned"
              planned={plannedEarnings}
              actual={totalPlannedExpenses}
              showNet
            />
            <SummaryCard
              label="Actual"
              planned={actualEarnings}
              actual={totalActualExpenses}
              showNet
            />
          </div>

          {/* Monthly net summary */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-xl font-semibold text-black mb-4">Monthly Net</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[15px] text-claude-secondary mb-1">Planned net</p>
                <p className={`text-2xl font-bold ${plannedNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {plannedNet >= 0 ? '+' : ''}{plannedNet.toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <div>
                <p className="text-[15px] text-claude-secondary mb-1">Actual net</p>
                <p className={`text-2xl font-bold ${actualNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {actualNet >= 0 ? '+' : ''}{actualNet.toLocaleString('vi-VN')} ₫
                </p>
              </div>
            </div>
          </div>

          {/* Funds */}
          {funds.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <h2 className="text-xl font-semibold text-black">Funds</h2>
                <select
                  className="text-[15px] border border-claude-secondary rounded-lg px-3 py-1.5 bg-white text-black focus:outline-none focus:ring-2 focus:ring-claude-primary"
                  value={selectedFundId ?? ''}
                  onChange={e => setSelectedFundId(e.target.value || null)}
                  aria-label="Select fund to view"
                >
                  <option value="">All funds</option>
                  {funds.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {selectedFund && selectedFundTotals ? (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold text-black mb-4">{selectedFund.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-claude-secondary mb-1">My contributions</p>
                      <p className="text-2xl font-bold text-black">
                        {selectedFundTotals.myTotal.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-claude-secondary mb-1">Group total</p>
                      <p className="text-2xl font-bold text-claude-primary">
                        {selectedFundTotals.groupTotal.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {funds.map(fund => {
                    const totals = fundTotals.find(t => t.fundId === fund.id);
                    return (
                      <FundCard
                        key={fund.id}
                        fund={fund}
                        myTotal={totals?.myTotal ?? 0}
                        groupTotal={totals?.groupTotal ?? 0}
                        month={month}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </>
      )}
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
