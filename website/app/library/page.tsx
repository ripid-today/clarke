import { getFeaturedFolders } from "@/lib/firebase/firestore";
import { FeaturedFolders } from "@/components/library/FeaturedFolders";

export default async function LibraryPage() {
  let featuredFolders = [];
  try {
    featuredFolders = await getFeaturedFolders();
  } catch (error) {
    console.error("Error fetching featured folders:", error);
    // Continue with empty array
  }

  return (
    <div className="py-8">
      <div className="px-6 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Clarke's Library</h1>
        <p className="text-lg text-gray-600">
          Explore curated knowledge organized by topic. Browse folders or use the search to find
          what you need.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold px-6 mb-4">Featured Topics</h2>
        <FeaturedFolders folders={featuredFolders} />
      </div>
    </div>
  );
}
