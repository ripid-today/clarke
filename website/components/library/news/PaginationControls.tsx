import Link from "next/link";

interface PaginationControlsProps {
  hasMore: boolean;
  nextCursor?: string;
  activeCategory?: "vietnam" | "world";
  hasPrev: boolean;
}

function buildUrl(cursor?: string, category?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (cursor) params.set("cursor", cursor);
  const qs = params.toString();
  return `/library/daily-news${qs ? `?${qs}` : ""}`;
}

export function PaginationControls({
  hasMore,
  nextCursor,
  activeCategory,
  hasPrev,
}: PaginationControlsProps) {
  if (!hasMore && !hasPrev) return null;

  return (
    <div className="flex items-center justify-between mt-8">
      {hasPrev ? (
        <Link
          href={buildUrl(undefined, activeCategory)}
          className="px-4 py-2 text-[15px] font-medium text-claude-primary border border-claude-primary rounded-lg hover:bg-claude-primary hover:text-white transition-colors duration-150"
        >
          ← Newer
        </Link>
      ) : (
        <div />
      )}
      {hasMore && nextCursor ? (
        <Link
          href={buildUrl(nextCursor, activeCategory)}
          className="px-4 py-2 text-[15px] font-medium text-claude-primary border border-claude-primary rounded-lg hover:bg-claude-primary hover:text-white transition-colors duration-150"
        >
          Older →
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
