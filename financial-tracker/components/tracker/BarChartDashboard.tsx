'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Earning, Expense, ChartMonthData } from '@/types';

interface Props {
  earnings: Earning[];
  expenses: Expense[];
  months: string[];
}

function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function formatMillions(value: number): string {
  if (value === 0) return '0';
  return `${(value / 1_000_000).toFixed(0)}M`;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-claude-secondary/20 rounded-lg shadow-lg p-3 text-[12px]">
      <p className="font-semibold text-black mb-1">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-claude-secondary">{item.name}:</span>
          <span className="font-medium text-black">{item.value.toLocaleString('vi-VN')} ₫</span>
        </div>
      ))}
    </div>
  );
}

interface LegendSwatchProps {
  color: string;
  label: string;
}

function LegendSwatch({ color, label }: LegendSwatchProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

export default function BarChartDashboard({ earnings, expenses, months }: Props) {
  const chartData = useMemo((): ChartMonthData[] => {
    return months.map(month => {
      const monthEarnings = earnings.filter(e => e.month === month);
      const monthExpenses = expenses.filter(e => e.month === month);

      return {
        month,
        monthLabel: formatMonthLabel(month),
        planned: {
          earnings: monthEarnings.filter(e => e.status === 'planned' && e.type === 'regular').reduce((s, e) => s + e.amount_vnd, 0),
          receivables: monthEarnings.filter(e => e.status === 'planned' && e.type === 'receivable').reduce((s, e) => s + e.amount_vnd, 0),
          expensesExt: monthExpenses.filter(e => e.status === 'planned' && e.receiver_type === 'none').reduce((s, e) => s + e.amount_vnd, 0),
          expensesFund: monthExpenses.filter(e => e.status === 'planned' && e.receiver_type === 'fund').reduce((s, e) => s + e.amount_vnd, 0),
        },
        actual: {
          earnings: monthEarnings.filter(e => e.status === 'actual' && e.type === 'regular').reduce((s, e) => s + e.amount_vnd, 0),
          receivables: monthEarnings.filter(e => e.status === 'actual' && e.type === 'receivable').reduce((s, e) => s + e.amount_vnd, 0),
          expensesExt: monthExpenses.filter(e => e.status === 'actual' && e.receiver_type === 'none').reduce((s, e) => s + e.amount_vnd, 0),
          expensesFund: monthExpenses.filter(e => e.status === 'actual' && e.receiver_type === 'fund').reduce((s, e) => s + e.amount_vnd, 0),
        },
      };
    });
  }, [earnings, expenses, months]);

  // Flatten for recharts: each month = 1 data point, keys are the bar series
  const flatData = chartData.map(d => ({
    monthLabel: d.monthLabel,
    'Planned Earnings': d.planned.earnings,
    'Planned Receivables': d.planned.receivables,
    'Planned Expenses': d.planned.expensesExt,
    'Planned Fund': d.planned.expensesFund,
    'Actual Earnings': d.actual.earnings,
    'Actual Receivables': d.actual.receivables,
    'Actual Expenses': d.actual.expensesExt,
    'Actual Fund': d.actual.expensesFund,
  }));

  const COLORS = {
    earnings: 'var(--color-chart-earnings)',
    receivables: 'var(--color-chart-receivables)',
    expensesExt: 'var(--color-chart-expenses-ext)',
    expensesFund: 'var(--color-chart-expenses-fund)',
  };

  // Opacity for planned bars (lighter)
  const plannedOpacity = 0.4;

  return (
    <div>
      <h2 className="text-xl font-semibold text-black mb-6">12-Month Overview</h2>
      <div className="overflow-x-auto">
        <div style={{ minWidth: '900px' }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={flatData} barGap={2} barCategoryGap="35%">
              <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatMillions} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />

              {/* Planned group (stackId="planned", lighter opacity) */}
              <Bar dataKey="Planned Earnings" stackId="planned" fill={COLORS.earnings} opacity={plannedOpacity} />
              <Bar dataKey="Planned Receivables" stackId="planned" fill={COLORS.receivables} opacity={plannedOpacity} />
              <Bar dataKey="Planned Expenses" stackId="planned" fill={COLORS.expensesExt} opacity={plannedOpacity} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Planned Fund" stackId="planned" fill={COLORS.expensesFund} opacity={plannedOpacity} />

              {/* Actual group (stackId="actual") */}
              <Bar dataKey="Actual Earnings" stackId="actual" fill={COLORS.earnings} />
              <Bar dataKey="Actual Receivables" stackId="actual" fill={COLORS.receivables} />
              <Bar dataKey="Actual Expenses" stackId="actual" fill={COLORS.expensesExt} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual Fund" stackId="actual" fill={COLORS.expensesFund} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-4 mt-3 text-[13px] text-claude-secondary">
            <LegendSwatch color={COLORS.earnings} label="Earnings" />
            <LegendSwatch color={COLORS.receivables} label="Receivables" />
            <LegendSwatch color={COLORS.expensesExt} label="External expenses" />
            <LegendSwatch color={COLORS.expensesFund} label="Fund contributions" />
            <span className="text-claude-secondary/60 text-[12px] ml-2">(faded = planned, solid = actual)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
