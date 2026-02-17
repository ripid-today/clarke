import { getFolders } from "@/lib/firebase/firestore";
import { Sidebar } from "@/components/library/Sidebar";
import { MobileNav } from "@/components/library/MobileNav";
import type { Folder } from "@/types/library";

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all folders for sidebar (will be empty initially)
  let folders: Folder[] = [];
  try {
    folders = await getFolders();
  } catch (error) {
    console.error("Error fetching folders:", error);
    // Continue with empty folders array
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar folders={folders} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileNav folders={folders} />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-20">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
