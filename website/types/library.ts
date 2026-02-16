type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export interface Folder {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  path: string[];
  order: number;
  featured: boolean;
  articleCount: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  metadata?: {
    icon?: string;
    color?: string;
    status?: "building" | "review" | "complete";
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  folderId: string;
  folderPath: string[];
  content: string;
  description: string; // Renamed from excerpt (max 200 characters)
  // tags field removed (REQ-005)
  order: number;
  status: string;
  priority: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    lastModifiedBy?: string;
    version?: number;
  };
}

export interface SearchResult {
  articleId: string;
  title: string;
  description: string; // Renamed from excerpt (REQ-008)
  folderPath: string[];
  score?: number;
}
