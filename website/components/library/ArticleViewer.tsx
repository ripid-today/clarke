"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import type { Article } from "@/types/library";
import { Download } from "lucide-react";

interface ArticleViewerProps {
  article: Article;
}

export function ArticleViewer({ article }: ArticleViewerProps) {
  const handleDownload = () => {
    const blob = new Blob([article.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-bold">{article.title}</h1>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download size={18} />
          <span className="text-sm">Download</span>
        </button>
      </div>

      {article.tags.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {article.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-sm rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {article.content}
        </ReactMarkdown>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>Last updated: {article.updatedAt.toDate().toLocaleDateString()}</p>
        {article.metadata?.readingTime && <p>{article.metadata.readingTime} min read</p>}
      </div>
    </article>
  );
}
