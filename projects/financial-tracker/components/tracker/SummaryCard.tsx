import { formatVnd } from '@/lib/utils/formatVnd';

interface SummaryCardProps {
  label: string;
  planned: number;
  actual: number;
  showNet?: boolean;
}

export default function SummaryCard({ label, planned, actual, showNet = false }: SummaryCardProps) {
  const net = planned - actual;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-black">{label}</h3>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[15px]">
          <span className="text-claude-secondary">Planned</span>
          <span className="font-medium text-black">{formatVnd(planned)}</span>
        </div>
        <div className="flex items-center justify-between text-[15px]">
          <span className="text-claude-secondary">Actual</span>
          <span className="font-medium text-black">{formatVnd(actual)}</span>
        </div>
        {showNet && (
          <div className="flex items-center justify-between text-[15px] pt-2 border-t border-claude-secondary/20 mt-1">
            <span className="font-semibold text-black">Net</span>
            <span
              className={`font-semibold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {net >= 0 ? '+' : ''}{formatVnd(net)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
