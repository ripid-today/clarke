import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Article } from "@/types/library";

interface NewsArticleFeedProps {
  articles: Article[];
}


export function NewsArticleFeed({ articles }: NewsArticleFeedProps) {
  return (
    <div className="flex flex-col gap-12">
      {articles.map(article => (
        <article
          key={article.id}
          className="bg-white border border-claude-secondary/40 rounded-xl p-6 md:p-8"
        >
          <h2 className="text-xl font-semibold text-black leading-snug mb-4">
            {article.title}
          </h2>

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
