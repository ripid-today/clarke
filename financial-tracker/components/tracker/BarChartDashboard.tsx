'use client';

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Earning, Expense } from '@/types';

interface Props {
  earnings: Earning[];
  expenses: Expense[];
  months: string[];
  windowOffset?: number;
  slideDirection?: 'back' | 'forward' | null;
}

const COLORS = {
  extExpenses: '#E8724A',
  fundContributions: '#B84A20',
  remaining: '#4A9B8E',
};

function formatMonthLabel(month: string): string {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function formatMillions(value: number): string {
  if (value === 0) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
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
      {payload.filter(item => item.value > 0).map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-claude-secondary">{item.name}:</span>
          <span className="font-medium text-black">{item.value.toLocaleString('vi-VN')} ₫</span>
        </div>
      ))}
    </div>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

interface FlatChartItem {
  monthLabel: string;
  extExpenses: number;
  fundContributions: number;
  remaining: number;
  overflowAmount: number;
}

export default function BarChartDashboard({ earnings, expenses, months, windowOffset, slideDirection }: Props) {
  const [chartMode, setChartMode] = useState<'actual' | 'planned'>('actual');

  const flatData = useMemo((): FlatChartItem[] => {
    return months.map(month => {
      const me = chartMode === 'actual'
        ? earnings.filter(e => e.month === month && e.status === 'actual')
        : earnings.filter(e => e.month === month);
      const mx = chartMode === 'actual'
        ? expenses.filter(e => e.month === month && e.status === 'actual')
        : expenses.filter(e => e.month === month);

      const totalIncome =
        me.reduce((s, e) => s + e.amount_vnd, 0);

      const rawExt = mx.filter(e => e.receiver_type === 'none').reduce((s, e) => s + e.amount_vnd, 0);
      const rawFund = mx.filter(e => e.receiver_type === 'fund').reduce((s, e) => s + e.amount_vnd, 0);
      const totalExpenses = rawExt + rawFund;

      const cappedExt = Math.min(rawExt, totalIncome);
      const cappedFund = Math.min(rawFund, Math.max(0, totalIncome - cappedExt));
      const remaining = Math.max(0, totalIncome - cappedExt - cappedFund);
      const overflowAmount = Math.max(0, totalExpenses - totalIncome);

      return {
        monthLabel: formatMonthLabel(month),
        extExpenses: cappedExt,
        fundContributions: cappedFund,
        remaining,
        overflowAmount,
      };
    });
  }, [earnings, expenses, months, chartMode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderOverflowLabel(props: any) {
    const x: number = typeof props.x === 'string' ? parseFloat(props.x) : (props.x ?? 0);
    const y: number = typeof props.y === 'string' ? parseFloat(props.y) : (props.y ?? 0);
    const width: number = typeof props.width === 'string' ? parseFloat(props.width) : (props.width ?? 0);
    const index: number = props.index ?? 0;
    const value: number = props.value ?? 0;
    const item = flatData[index];
    if (!item || item.overflowAmount <= 0 || value !== 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        textAnchor="middle"
        fill="#888"
        fontSize={10}
        fontWeight="500"
      >
        +{formatMillions(item.overflowAmount)}
      </text>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">Monthly Overview</h2>
        <div className="flex gap-0 rounded-lg border border-claude-secondary overflow-hidden">
          <button
            onClick={() => setChartMode('actual')}
            className={chartMode === 'actual' ? 'bg-claude-primary text-white px-4 py-1.5 text-[14px] font-medium' : 'bg-white text-claude-secondary hover:bg-black/5 px-4 py-1.5 text-[14px] font-medium'}
          >
            Actual
          </button>
          <button
            onClick={() => setChartMode('planned')}
            className={chartMode === 'planned' ? 'bg-claude-primary text-white px-4 py-1.5 text-[14px] font-medium' : 'bg-white text-claude-secondary hover:bg-black/5 px-4 py-1.5 text-[14px] font-medium'}
          >
            All
          </button>
        </div>
      </div>
      <div
        key={windowOffset}
        className={
          slideDirection === 'back' ? 'animate-slide-from-left' :
          slideDirection === 'forward' ? 'animate-slide-from-right' :
          ''
        }
      >
      <div className="overflow-x-auto">
        <div style={{ minWidth: '900px' }}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={flatData} barGap={2} barCategoryGap="35%">
              <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatMillions} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="extExpenses" stackId="main" name="External Expenses" fill={COLORS.extExpenses} />
              <Bar dataKey="fundContributions" stackId="main" name="Fund Contributions" fill={COLORS.fundContributions} />
              <Bar
                dataKey="remaining"
                stackId="main"
                name="Remaining Income"
                fill={COLORS.remaining}
                radius={[4, 4, 0, 0]}
                label={renderOverflowLabel}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-4 mt-3 text-[13px] text-claude-secondary">
            <LegendSwatch color={COLORS.remaining} label="Remaining Income" />
            <LegendSwatch color={COLORS.extExpenses} label="External Expenses" />
            <LegendSwatch color={COLORS.fundContributions} label="Fund Contributions" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
