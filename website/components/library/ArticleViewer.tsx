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
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <h1 className="text-2xl md:text-4xl font-bold leading-tight">{article.title}</h1>
        <button
          onClick={handleDownload}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-3 md:py-2 bg-cloud-dancer hover:bg-[#E5E2DC] rounded-lg transition-colors duration-200"
        >
          <Download size={18} />
          <span className="text-sm">Download</span>
        </button>
      </div>

      <div className="prose prose-lg max-w-none font-mono">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {article.content}
        </ReactMarkdown>
      </div>

      <div className="mt-8 pt-6 border-t border-claude-secondary text-sm text-claude-secondary">
        <p>Last updated: {new Date(article.updatedAt.seconds * 1000).toLocaleDateString()}</p>
        {article.metadata?.readingTime && <p>{article.metadata.readingTime} min read</p>}
      </div>
    </article>
  );
}
