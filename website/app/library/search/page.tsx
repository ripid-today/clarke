import { searchArticles } from "@/lib/firebase/firestore";
import Link from "next/link";
import { SearchBar } from "@/components/library/SearchBar";
import type { SearchResult } from "@/types/library";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  let results: SearchResult[] = [];
  try {
    results = query ? await searchArticles(query) : [];
  } catch (error) {
    console.error("Error searching:", error);
    // Continue with empty results
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Library</h1>
        <SearchBar />
      </div>

      {query && (
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-6">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No results found for your search.</p>
              <p className="text-sm mt-2">Try different keywords or browse our folders.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Link
                  key={result.articleId}
                  href={`/library/${result.articleId}`}
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                  <p className="text-gray-600 text-sm">{result.description}</p>
                  {result.folderPath.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">{result.folderPath.join(" > ")}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
