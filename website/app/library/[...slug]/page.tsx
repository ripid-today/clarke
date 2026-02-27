import { notFound } from "next/navigation";
import { getFolders, getArticles, getArticleBySlug } from "@/lib/firebase/firestore";
import { ArticleViewer } from "@/components/library/ArticleViewer";
import { Breadcrumbs } from "@/components/library/Breadcrumbs";
import { ArticleNavigation } from "@/components/library/ArticleNavigation";
import { DownloadButton } from "@/components/library/DownloadButton";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function LibrarySlugPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const folders = await getFolders();

    // Handle 2-segment URLs: /library/{folder-slug}/{article-slug}
    if (slug.length === 2) {
      const [folderSlug, articleSlug] = slug;
      const folder = folders.find((f) => f.slug === folderSlug);

      if (folder) {
        const article = await getArticleBySlug(articleSlug, folder.id);

        if (article) {
          const moduleParent = folders.find((f) => f.id === folder.parentId);
          return (
            <div className="py-8 px-6">
              <Breadcrumbs
                items={[
                  ...(moduleParent
                    ? [{ name: moduleParent.name, href: `/library/${moduleParent.slug}` }]
                    : []),
                  { name: folder.name, href: `/library/${folder.slug}` },
                  { name: article.title, href: `/library/${folder.slug}/${article.slug}` },
                ]}
              />
              <ArticleViewer article={article} />
              <ArticleNavigation article={article} subChapter={folder} allFolders={folders} />
            </div>
          );
        }
      }
    }

    // Handle 1-segment URLs: /library/{slug}
    if (slug.length === 1) {
      const singleSlug = slug[0];

      // Try to find folder first
      const folder = folders.find((f) => f.slug === singleSlug);

      if (folder) {
        // Render folder view
        const articles = await getArticles(folder.id);
        const childFolders = folders.filter((f) => f.parentId === folder.id);
        const parentFolder = folders.find((f) => f.id === folder.parentId);

        return (
          <div className="py-8 px-6">
            <Breadcrumbs
              items={[
                ...(parentFolder
                  ? [{ name: parentFolder.name, href: `/library/${parentFolder.slug}` }]
                  : []),
                { name: folder.name, href: `/library/${folder.slug}` },
              ]}
            />

            <h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-4">{folder.name}</h1>
            <p className="text-[17px] leading-relaxed text-claude-secondary mb-4">{folder.description}</p>

            {articles.length > 0 ? (
              <>
              <div className="mb-8">
                <DownloadButton mode="module" folderId={folder.id} folderName={folder.name} folderDescription={folder.description} folderSlug={folder.slug} />
              </div>
              <div className="grid gap-4">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/library/${folder.slug}/${article.slug}`}
                    className="block p-6 bg-white border border-claude-secondary rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                  >
                    <h3 className="text-xl md:text-2xl font-semibold leading-normal mb-2">{article.title}</h3>
                    <p className="text-[15px] text-claude-secondary leading-normal">{article.description}</p>
                  </Link>
                ))}
              </div>
              </>
            ) : childFolders.length > 0 ? (
              <>
              <div className="mb-8">
                <DownloadButton mode="masterclass" folderId={folder.id} folderName={folder.name} folderDescription={folder.description} folderSlug={folder.slug} />
              </div>
              <div className="grid gap-4">
                {childFolders.sort((a, b) => a.order - b.order).map((child) => (
                  <Link
                    key={child.id}
                    href={`/library/${child.slug}`}
                    className="block p-6 bg-white border border-claude-secondary rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl md:text-2xl font-semibold leading-normal">{child.name}</h3>
                      {child.articleCount > 0 && (
                        <span className="text-[15px] text-claude-secondary">{child.articleCount} articles</span>
                      )}
                    </div>
                    <p className="text-[15px] text-claude-secondary leading-normal">{child.description}</p>
                  </Link>
                ))}
              </div>
              </>
            ) : (
              <div className="text-center py-12 text-claude-secondary">
                <p>No content in this folder yet.</p>
                <p className="text-sm mt-2">Check back soon!</p>
              </div>
            )}
          </div>
        );
      }

      // Try to find article by slug (legacy single-slug articles)
      const article = await getArticleBySlug(singleSlug);

      if (article) {
        return (
          <div className="py-8 px-6">
            <Breadcrumbs
              items={[
                { name: article.title, href: `/library/${singleSlug}` },
              ]}
            />
            <ArticleViewer article={article} />
          </div>
        );
      }
    }

    notFound();
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}
