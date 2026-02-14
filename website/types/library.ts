import { Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  excerpt: string;
  tags: string[];
  order: number;
  status: string;
  priority: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  excerpt: string;
  folderPath: string[];
  score?: number;
}
