import { getDailyNewsArticles } from "@/lib/firebase/firestore";
import { NewsArticleFeed } from "@/components/library/news/NewsArticleFeed";
import { PaginationControls } from "@/components/library/news/PaginationControls";
import type { Article } from "@/types/library";

export const dynamic = "force-dynamic";

const DAILY_NEWS_FOLDER_ID = process.env.DAILY_NEWS_FOLDER_ID || "";

interface PageProps {
  searchParams: Promise<{
    cursor?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { cursor } = await searchParams;

  let articles: Article[] = [];
  let hasMore = false;
  let nextCursor: string | undefined;
  let queryError = false;

  if (DAILY_NEWS_FOLDER_ID) {
    try {
      const result = await getDailyNewsArticles(DAILY_NEWS_FOLDER_ID, cursor, 20);
      articles = result.articles;
      hasMore = result.hasMore;
      nextCursor = result.nextCursor;
    } catch (err) {
      console.error("HomePage: failed to fetch articles", err);
      queryError = true;
    }
  }

  return (
    <div className="py-8 px-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-2">
          Intelligent Investor
        </h1>
        <p className="text-[17px] leading-relaxed text-claude-secondary">
          Investment-focused briefing on Vietnam and global economics, updated every 9 AM
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-claude-secondary">
          {queryError ? (
            <p className="text-[17px] text-red-600">
              Failed to load articles. Please try again later.
            </p>
          ) : (
            <>
              <p className="text-[17px]">No briefings available yet.</p>
              <p className="text-[15px] mt-2">Check back after 9 AM GMT+7.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <NewsArticleFeed articles={articles} />
          <PaginationControls
            hasMore={hasMore}
            nextCursor={nextCursor}
            hasPrev={!!cursor}
          />
        </>
      )}
    </div>
  );
}
