import { getFolders } from "@/lib/firebase/firestore";
import { Sidebar } from "@/components/library/Sidebar";
import { SearchBar } from "@/components/library/SearchBar";
import { Menu } from "lucide-react";

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch all folders for sidebar (will be empty initially)
  let folders = [];
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 p-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-20">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
