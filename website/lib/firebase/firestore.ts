import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import type { Folder, Article, SearchResult } from "@/types/library";

export async function getFolders(parentId?: string): Promise<Folder[]> {
  const foldersRef = collection(db, "folders");
  const q = parentId
    ? query(foldersRef, where("parentId", "==", parentId), orderBy("order"))
    : query(foldersRef, orderBy("order"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder));
}

export async function getArticles(folderId: string): Promise<Article[]> {
  const articlesRef = collection(db, "articles");
  const q = query(articlesRef, where("folderId", "==", folderId), orderBy("order"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
}

export async function getArticleById(articleId: string): Promise<Article | null> {
  const docRef = doc(db, "articles", articleId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Article;
}

export async function searchArticles(query: string, folderId?: string): Promise<SearchResult[]> {
  const searchRef = collection(db, "search_index");
  const snapshot = await getDocs(searchRef);
  const lowerQuery = query.toLowerCase();

  return snapshot.docs
    .map(doc => doc.data() as SearchResult)
    .filter(result => {
      const matchesQuery = 
        result.title.toLowerCase().includes(lowerQuery) ||
        result.excerpt.toLowerCase().includes(lowerQuery);
      const matchesFolder = !folderId || result.folderPath.includes(folderId);
      return matchesQuery && matchesFolder;
    })
    .slice(0, 20);
}

export async function getFeaturedFolders(): Promise<Folder[]> {
  const foldersRef = collection(db, "folders");
  const q = query(foldersRef, where("featured", "==", true), orderBy("order"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder));
}
