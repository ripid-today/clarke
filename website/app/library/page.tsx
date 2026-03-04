import { getFeaturedFolders } from "@/lib/firebase/firestore";
import { FeaturedFolders } from "@/components/library/FeaturedFolders";
import type { Folder } from "@/types/library";

export const revalidate = 300;

export default async function LibraryPage() {
  let featuredFolders: Folder[] = [];
  try {
    featuredFolders = await getFeaturedFolders();
  } catch (error) {
    console.error("Error fetching featured folders:", error);
    // Continue with empty array
  }

  return (
    <div className="py-8">
      <div className="px-6 mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold leading-snug mb-4">Welcome to Clarke&apos;s Library</h1>
        <p className="text-[17px] leading-relaxed text-claude-secondary">
          Explore curated knowledge organized by topic. Browse folders or use the search to find
          what you need.
        </p>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold leading-normal px-6 mb-4">Featured Topics</h2>
        <FeaturedFolders folders={featuredFolders} />
      </div>
    </div>
  );
}
