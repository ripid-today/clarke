import { notFound } from "next/navigation";
import { getFolders, getArticles, getArticleById, getArticleBySlug } from "@/lib/firebase/firestore";
import { ArticleViewer } from "@/components/library/ArticleViewer";
import { Breadcrumbs } from "@/components/library/Breadcrumbs";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function LibrarySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  try {
    const folders = await getFolders();

    // Handle 2-segment URLs: /library/{folder-slug}/{article-slug}
    if (slug.length === 2) {
      const [folderSlug, articleSlug] = slug;
      const folder = folders.find((f) => f.slug === folderSlug);

      if (folder) {
        const article = await getArticleBySlug(articleSlug, folder.id);

        if (article) {
          return (
            <div className="py-8 px-6">
              <Breadcrumbs
                items={[
                  { name: folder.name, href: `/library/${folder.slug}` },
                  { name: article.title, href: `/library/${folder.slug}/${article.slug}` },
                ]}
              />
              <ArticleViewer article={article} />
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

        return (
          <div className="py-8 px-6">
            <Breadcrumbs items={[{ name: folder.name, href: `/library/${folder.slug}` }]} />

            <h1 className="text-4xl font-bold mb-4">{folder.name}</h1>
            <p className="text-lg text-gray-600 mb-8">{folder.description}</p>

            {articles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No articles in this folder yet.</p>
                <p className="text-sm mt-2">Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/library/${folder.slug}/${article.slug}`}
                    className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                  </Link>
                ))}
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
