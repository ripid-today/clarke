import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Article } from "@/types/library";

type FirestoreTimestamp = { seconds: number; nanoseconds: number };

function formatDDMMYYYY(ts: FirestoreTimestamp): string {
  const GMT7_OFFSET_MS = 7 * 60 * 60 * 1000;
  const date = new Date(ts.seconds * 1000 + GMT7_OFFSET_MS);
  const d = String(date.getUTCDate()).padStart(2, "0");
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const y = date.getUTCFullYear();
  return `${d}/${m}/${y}`;
}

interface NewsArticleFeedProps {
  articles: Article[];
}

export function NewsArticleFeed({ articles }: NewsArticleFeedProps) {
  return (
    <div className="flex flex-col gap-12">
      {articles.map((article) => {
        const dateLabel =
          article.isUpdated && article.updatedAt
            ? `updated at: ${formatDDMMYYYY(article.updatedAt)}`
            : `created at: ${formatDDMMYYYY(article.publishedAt ?? article.createdAt)}`;

        return (
          <article
            key={article.id}
            className="relative bg-white border border-claude-secondary/40 rounded-xl p-6 md:p-8"
          >
            {article.isUpdated && (
              <span className="absolute top-4 right-4 text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                Updated
              </span>
            )}
            <h2 className="text-xl font-semibold text-black leading-snug mb-1">
              {article.title}
            </h2>
            <p className="text-[13px] text-claude-secondary mb-4">{dateLabel}</p>

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
        );
      })}
    </div>
  );
}
