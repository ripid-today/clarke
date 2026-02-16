"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";
import type { Folder as FolderType } from "@/types/library";

interface SidebarProps {
  folders: FolderType[];
  currentPath?: string[];
}

export function Sidebar({ folders, currentPath = [] }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isActive = currentPath.includes(folder.id);
    const children = folders.filter((f) => f.parentId === folder.id);

    return (
      <div key={folder.id} className="mb-1">
        <div className="flex items-center gap-1">
          {children.length > 0 && (
            <button
              onClick={() => toggleFolder(folder.id)}
              className="p-1 hover:bg-cloud-dancer rounded transition-colors duration-150"
            >
              {isExpanded ? <ChevronDown size={16} className="text-claude-primary" /> : <ChevronRight size={16} className="text-claude-primary" />}
            </button>
          )}
          <Link
            href={`/library/${folder.slug}`}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cloud-dancer transition-colors duration-150 ${
              isActive ? "bg-cloud-dancer font-medium text-claude-primary" : ""
            }`}
            style={{ paddingLeft: `${children.length > 0 ? 0 : 12 + level * 16}px` }}
          >
            <Folder size={16} className={isActive ? "text-claude-primary" : ""} />
            <span className="flex-1 text-left text-sm">{folder.name}</span>
            {folder.articleCount > 0 && (
              <span className="text-xs text-claude-secondary">{folder.articleCount}</span>
            )}
          </Link>
        </div>

        {isExpanded && children.length > 0 && (
          <div className="ml-4">
            {children.map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter((f) => f.parentId === null);

  return (
    <aside className="w-64 bg-white border-r border-claude-secondary h-screen sticky top-0 overflow-y-auto p-4">
      <Link href="/library">
        <h2 className="text-lg font-semibold mb-4 cursor-pointer hover:text-claude-primary transition-colors duration-150">
          Clarke&apos;s Library
        </h2>
      </Link>
      <nav>{rootFolders.map((folder) => renderFolder(folder))}</nav>
    </aside>
  );
}
