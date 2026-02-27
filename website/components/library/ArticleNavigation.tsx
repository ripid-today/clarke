import Link from "next/link";
import { getArticles } from "@/lib/firebase/firestore";
import type { Article, Folder } from "@/types/library";

interface ArticleNavigationProps {
  article: Article;
  subChapter: Folder;
  allFolders: Folder[];
}

interface NavItem {
  article: Article;
  folderSlug: string;
  contextLines: string[] | null;
}

export async function ArticleNavigation({
  article,
  subChapter,
  allFolders,
}: ArticleNavigationProps) {
  const subChapterArticles = await getArticles(subChapter.id);
  const currentIdx = subChapterArticles.findIndex((a) => a.id === article.id);

  if (currentIdx === -1) return null;

  const siblings = allFolders
    .filter((f) => f.parentId === subChapter.parentId)
    .sort((a, b) => a.order - b.order);
  const siblingIdx = siblings.findIndex((s) => s.id === subChapter.id);

  // Compute NEXT
  let next: NavItem | null = null;

  if (currentIdx < subChapterArticles.length - 1) {
    next = {
      article: subChapterArticles[currentIdx + 1],
      folderSlug: subChapter.slug,
      contextLines: null,
    };
  } else {
    const nextSubChapter = siblings[siblingIdx + 1];
    if (nextSubChapter) {
      const articles = await getArticles(nextSubChapter.id);
      if (articles.length > 0) {
        next = {
          article: articles[0],
          folderSlug: nextSubChapter.slug,
          contextLines: [`Next up: ${nextSubChapter.name}`],
        };
      }
    } else {
      const chapter = allFolders.find((f) => f.id === subChapter.parentId);
      if (chapter) {
        const siblingChapters = allFolders
          .filter((f) => f.parentId === chapter.parentId)
          .sort((a, b) => a.order - b.order);
        const chapIdx = siblingChapters.findIndex((c) => c.id === chapter.id);
        const nextChapter = siblingChapters[chapIdx + 1];
        if (nextChapter) {
          const firstSub = allFolders
            .filter((f) => f.parentId === nextChapter.id)
            .sort((a, b) => a.order - b.order)[0];
          if (firstSub) {
            const articles = await getArticles(firstSub.id);
            if (articles.length > 0) {
              next = {
                article: articles[0],
                folderSlug: firstSub.slug,
                contextLines: [nextChapter.name, firstSub.name],
              };
            }
          }
        }
      }
    }
  }

  // Compute PREV
  let prev: NavItem | null = null;

  if (currentIdx > 0) {
    prev = {
      article: subChapterArticles[currentIdx - 1],
      folderSlug: subChapter.slug,
      contextLines: null,
    };
  } else {
    const prevSubChapter = siblings[siblingIdx - 1];
    if (prevSubChapter) {
      const articles = await getArticles(prevSubChapter.id);
      if (articles.length > 0) {
        prev = {
          article: articles[articles.length - 1],
          folderSlug: prevSubChapter.slug,
          contextLines: [`Back to: ${prevSubChapter.name}`],
        };
      }
    } else {
      const chapter = allFolders.find((f) => f.id === subChapter.parentId);
      if (chapter) {
        const siblingChapters = allFolders
          .filter((f) => f.parentId === chapter.parentId)
          .sort((a, b) => a.order - b.order);
        const chapIdx = siblingChapters.findIndex((c) => c.id === chapter.id);
        const prevChapter = siblingChapters[chapIdx - 1];
        if (prevChapter) {
          const lastSub = allFolders
            .filter((f) => f.parentId === prevChapter.id)
            .sort((a, b) => a.order - b.order)
            .at(-1);
          if (lastSub) {
            const articles = await getArticles(lastSub.id);
            if (articles.length > 0) {
              prev = {
                article: articles[articles.length - 1],
                folderSlug: lastSub.slug,
                contextLines: [prevChapter.name, lastSub.name],
              };
            }
          }
        }
      }
    }
  }

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Article navigation"
      className="mt-12 pt-8 border-t border-claude-secondary"
    >
      <div className="flex justify-between gap-8">
        {prev ? (
          <div className="flex-1 text-left">
            {prev.contextLines &&
              prev.contextLines.map((line, i) => (
                <p key={i} className="text-sm text-claude-secondary mb-1">
                  {line}
                </p>
              ))}
            <Link
              href={`/library/${prev.folderSlug}/${prev.article.slug}`}
              className="text-[17px] font-medium hover:text-claude-primary transition-colors duration-150"
            >
              ← {prev.article.title}
            </Link>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {next ? (
          <div className="flex-1 text-right">
            {next.contextLines &&
              next.contextLines.map((line, i) => (
                <p key={i} className="text-sm text-claude-secondary mb-1">
                  {line}
                </p>
              ))}
            <Link
              href={`/library/${next.folderSlug}/${next.article.slug}`}
              className="text-[17px] font-medium hover:text-claude-primary transition-colors duration-150"
            >
              {next.article.title} →
            </Link>
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}
