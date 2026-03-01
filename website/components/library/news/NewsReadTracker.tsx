"use client";

import { useEffect } from "react";

interface NewsReadTrackerProps {
  articleId: string;
  isUpdated?: boolean;
}

export function NewsReadTracker({ articleId, isUpdated }: NewsReadTrackerProps) {
  useEffect(() => {
    if (!isUpdated) return;
    try {
      const stored = JSON.parse(
        localStorage.getItem("news:read") || "[]"
      ) as string[];
      if (!stored.includes(articleId)) {
        stored.push(articleId);
        localStorage.setItem("news:read", JSON.stringify(stored));
      }
    } catch {
      // ignore
    }
  }, [articleId, isUpdated]);

  return null;
}
