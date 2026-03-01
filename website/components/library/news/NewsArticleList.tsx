"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Article } from "@/types/library";

interface NewsArticleListProps {
  articles: Article[];
  folderSlug: string;
}

function formatDate(ts?: { seconds: number; nanoseconds: number }): string {
  if (!ts) return "";
  const date = new Date(ts.seconds * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function NewsArticleList({ articles, folderSlug }: NewsArticleListProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("news:read") || "[]"
      ) as string[];
      setReadIds(new Set(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <div className="grid gap-4">
      {articles.map((article) => {
        const showUpdated = article.isUpdated && !readIds.has(article.id);
        return (
          <Link
            key={article.id}
            href={`/library/${folderSlug}/${article.slug}`}
            className="block p-6 bg-white border border-claude-secondary/40 rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4">
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
                  {article.publishedAt && (
                    <span className="text-[13px] text-claude-secondary">
                      · {formatDate(article.publishedAt)}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold leading-normal mb-2">
                  {article.title}
                </h3>
                <p className="text-[15px] text-claude-secondary leading-normal line-clamp-2">
                  {article.description}
                </p>
              </div>
              {showUpdated && (
                <span className="flex-shrink-0 px-2 py-1 text-[12px] font-semibold bg-orange-100 text-orange-700 rounded-full whitespace-nowrap">
                  Updated
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
