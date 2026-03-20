"use client";

import Link from "next/link";
import type { Article } from "@/types/library";

interface NewsArticleListProps {
  articles: Article[];
  folderSlug: string;
}

type FirestoreTimestamp = { seconds: number; nanoseconds: number };

function formatDDMMYYYY(ts: FirestoreTimestamp): string {
  const GMT7_OFFSET_MS = 7 * 60 * 60 * 1000;
  const date = new Date(ts.seconds * 1000 + GMT7_OFFSET_MS);
  const d = String(date.getUTCDate()).padStart(2, "0");
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const y = date.getUTCFullYear();
  return `${d}/${m}/${y}`;
}

export function NewsArticleList({ articles, folderSlug }: NewsArticleListProps) {
  return (
    <div className="grid gap-4">
      {articles.map((article) => {
        const dateLabel =
          article.isUpdated && article.updatedAt
            ? `updated at: ${formatDDMMYYYY(article.updatedAt)}`
            : `created at: ${formatDDMMYYYY(article.publishedAt ?? article.createdAt)}`;

        return (
          <Link
            key={article.id}
            href={`/library/${folderSlug}/${article.slug}`}
            className="relative block p-6 bg-white border border-claude-secondary/40 rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            {article.isUpdated && (
              <span className="absolute top-2 right-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                Updated
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {article.sourceName && (
                  <span className="text-[13px] font-medium text-claude-secondary uppercase tracking-wide">
                    {article.sourceName}
                  </span>
                )}
                {article.category && (
                  <span className="text-[13px] text-claude-secondary">
                    · {article.category === "vietnam" ? "Vietnam" : "World"}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold leading-normal mb-0.5">
                {article.title}
              </h3>
              <p className="text-[13px] text-claude-secondary mt-0.5">{dateLabel}</p>
              <p className="text-[15px] text-claude-secondary leading-normal line-clamp-2 mt-2">
                {article.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
