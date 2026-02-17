import Link from "next/link";
import { Folder } from "lucide-react";
import type { Folder as FolderType } from "@/types/library";

interface FeaturedFoldersProps {
  folders: FolderType[];
}

export function FeaturedFolders({ folders }: FeaturedFoldersProps) {
  if (folders.length === 0) {
    return (
      <div className="p-6 text-center text-claude-secondary">
        <p>No featured folders available yet.</p>
        <p className="text-sm mt-2">Check back soon as we add more content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
      {folders.map((folder) => (
        <Link
          key={folder.id}
          href={`/library/${folder.slug}`}
          className="block p-6 bg-white border border-claude-secondary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cloud-dancer rounded-lg">
              <Folder size={24} className="text-claude-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold leading-normal mb-2">{folder.name}</h3>
              <p className="text-[15px] text-claude-secondary mb-3">{folder.description}</p>
              <span className="text-xs text-claude-secondary">
                {folder.articleCount} {folder.articleCount === 1 ? "article" : "articles"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
