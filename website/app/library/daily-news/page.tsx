import { getDailyNewsArticles } from "@/lib/firebase/firestore";
import { CategoryTabs } from "@/components/library/news/CategoryTabs";
import { NewsArticleList } from "@/components/library/news/NewsArticleList";
import { PaginationControls } from "@/components/library/news/PaginationControls";
import type { Article } from "@/types/library";

export const dynamic = "force-dynamic";

const DAILY_NEWS_FOLDER_ID = process.env.DAILY_NEWS_FOLDER_ID || "";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    cursor?: string;
  }>;
}

export default async function DailyNewsPage({ searchParams }: PageProps) {
  const { category, cursor } = await searchParams;
  const validCategory =
    category === "vietnam" || category === "world" ? category : undefined;

  let articles: Article[] = [];
  let hasMore = false;
  let nextCursor: string | undefined;

  if (DAILY_NEWS_FOLDER_ID) {
    try {
      const result = await getDailyNewsArticles(
        DAILY_NEWS_FOLDER_ID,
        validCategory,
        cursor,
        20
      );
      articles = result.articles;
      hasMore = result.hasMore;
      nextCursor = result.nextCursor;
    } catch (err) {
      console.error("DailyNewsPage: failed to fetch articles", err);
    }
  }

  return (
    <div className="py-8 px-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-2">
          Daily News
        </h1>
        <p className="text-[17px] leading-relaxed text-claude-secondary">
          Investment-focused briefing on Vietnam and World economics. Updated every morning at 9 AM GMT+7.
        </p>
      </div>

      <CategoryTabs activeCategory={validCategory} />

      {articles.length === 0 ? (
        <div className="text-center py-16 text-claude-secondary">
          <p className="text-[17px]">No articles available yet.</p>
          <p className="text-[15px] mt-2">Check back after 9 AM GMT+7.</p>
        </div>
      ) : (
        <>
          <NewsArticleList articles={articles} folderSlug="daily-news" />
          <PaginationControls
            hasMore={hasMore}
            nextCursor={nextCursor}
            activeCategory={validCategory}
            hasPrev={!!cursor}
          />
        </>
      )}
    </div>
  );
}
