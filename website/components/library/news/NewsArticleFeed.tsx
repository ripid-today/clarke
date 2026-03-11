import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Article } from "@/types/library";

interface NewsArticleFeedProps {
  articles: Article[];
}

function formatDate(ts?: { seconds: number; nanoseconds: number }): string {
  if (!ts) return "";
  const date = new Date(ts.seconds * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function NewsArticleFeed({ articles }: NewsArticleFeedProps) {
  return (
    <div className="flex flex-col gap-12">
      {articles.map(article => (
        <article
          key={article.id}
          className="bg-white border border-claude-secondary/40 rounded-xl p-6 md:p-8"
        >
          <header className="mb-6 pb-4 border-b border-claude-secondary/20">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-[13px] text-claude-secondary">
              {article.publishedAt && (
                <span>{formatDate(article.publishedAt)}</span>
              )}
              {article.metadata?.sourceCount && (
                <>
                  <span>·</span>
                  <span>{article.metadata.sourceCount} sources</span>
                </>
              )}
              {article.metadata?.readingTime && (
                <>
                  <span>·</span>
                  <span>{article.metadata.readingTime} min read</span>
                </>
              )}
              {article.metadata?.newsDate && (
                <>
                  <span>·</span>
                  <span className="font-medium text-claude-primary">
                    {article.metadata.newsDate}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
              {article.title}
            </h2>
          </header>

          <div className="prose prose-lg max-w-none
            prose-headings:font-semibold prose-headings:text-black
            prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
            prose-p:text-[17px] prose-p:leading-relaxed prose-p:text-black
            prose-li:text-[17px] prose-li:leading-relaxed
            prose-a:text-claude-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:font-semibold prose-strong:text-black
            prose-hr:border-claude-secondary/30">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      ))}
    </div>
  );
}
