import Link from 'next/link';
import { Fund } from '@/types';
import { formatVnd } from '@/lib/utils/formatVnd';

interface FundCardProps {
  fund: Fund;
  myTotal: number;
  groupTotal: number;
  month: string;
}

export default function FundCard({ fund, myTotal, groupTotal, month }: FundCardProps) {
  return (
    <Link
      href={`/funds/${fund.id}?month=${month}`}
      className="block bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2"
    >
      <h3 className="text-lg font-semibold text-black mb-3">{fund.name}</h3>
      <div className="flex flex-col gap-1.5 text-[15px]">
        <div className="flex items-center justify-between">
          <span className="text-claude-secondary">My contribution</span>
          <span className="font-medium text-black">{formatVnd(myTotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-claude-secondary">Group total</span>
          <span className="font-medium text-claude-primary">{formatVnd(groupTotal)}</span>
        </div>
      </div>
    </Link>
  );
}
