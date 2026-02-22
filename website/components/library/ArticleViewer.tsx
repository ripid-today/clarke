"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import type { Article } from "@/types/library";
import { DownloadButton } from "./DownloadButton";

interface ArticleViewerProps {
  article: Article;
}

export function ArticleViewer({ article }: ArticleViewerProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-4">{article.title}</h1>
      <div className="mb-6">
        <DownloadButton mode="article" article={article} />
      </div>

      <div className="prose prose-lg max-w-none">
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
