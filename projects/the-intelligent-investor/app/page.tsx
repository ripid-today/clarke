import { getDailyNewsArticles, getDailyNewsUpdateCount } from "@/lib/firebase/firestore";
import { NewsArticleFeed } from "@/components/library/news/NewsArticleFeed";
import { CategoryTabs } from "@/components/library/news/CategoryTabs";
import { PaginationControls } from "@/components/library/news/PaginationControls";
import type { Article } from "@/types/library";

export const dynamic = "force-dynamic";

const DAILY_NEWS_FOLDER_ID = process.env.DAILY_NEWS_FOLDER_ID || "";

interface PageProps {
  searchParams: Promise<{
    cursor?: string;
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { cursor, category } = await searchParams;
  const activeCategory =
    category === "vietnam" || category === "world" ? category : undefined;

  let articles: Article[] = [];
  let hasMore = false;
  let nextCursor: string | undefined;
  let queryError = false;
  let updateCount = 0;

  if (DAILY_NEWS_FOLDER_ID) {
    try {
      const [result, count] = await Promise.all([
        getDailyNewsArticles(DAILY_NEWS_FOLDER_ID, cursor, 20),
        getDailyNewsUpdateCount(DAILY_NEWS_FOLDER_ID),
      ]);
      articles = result.articles;
      hasMore = result.hasMore;
      nextCursor = result.nextCursor;
      updateCount = count;
    } catch (err) {
      console.error("HomePage: failed to fetch articles", err);
      queryError = true;
    }
  }

  const filteredArticles = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  return (
    <div className="py-8 px-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-2">
          Intelligent Investor
        </h1>
        <p className="text-[17px] leading-relaxed text-claude-secondary">
          Investment-focused briefing on Vietnam and global economics, updated every 9 AM
        </p>
        <p className="text-[15px] text-claude-secondary mt-1">
          {updateCount === 1
            ? "1 article published today."
            : updateCount > 1
            ? `${updateCount} articles published today.`
            : "No articles published yet today."}
        </p>
      </div>

      <CategoryTabs activeCategory={activeCategory} />

      {filteredArticles.length === 0 ? (
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
          <NewsArticleFeed articles={filteredArticles} />
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
