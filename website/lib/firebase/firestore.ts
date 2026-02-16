import { adminDb } from "./admin";
import type { Folder, Article, SearchResult } from "@/types/library";

// Convert Firestore Admin Timestamp instances to plain serializable objects
// so they can be passed from Server Components to Client Components
function serializeDoc<T>(doc: FirebaseFirestore.DocumentSnapshot): T {
  const data = doc.data() || {};
  const serialized: Record<string, unknown> = { id: doc.id };
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && "_seconds" in value && "_nanoseconds" in value) {
      const ts = value as { _seconds: number; _nanoseconds: number };
      serialized[key] = { seconds: ts._seconds, nanoseconds: ts._nanoseconds };
    } else {
      serialized[key] = value;
    }
  }
  return serialized as T;
}

export async function getFolders(parentId?: string): Promise<Folder[]> {
  const ref = adminDb.collection("folders");
  const query = parentId
    ? ref.where("parentId", "==", parentId).orderBy("order")
    : ref.orderBy("order");

  const snapshot = await query.get();
  return snapshot.docs.map(doc => serializeDoc<Folder>(doc));
}

export async function getArticles(folderId: string): Promise<Article[]> {
  const snapshot = await adminDb
    .collection("articles")
    .where("folderId", "==", folderId)
    .orderBy("order")
    .get();

  return snapshot.docs.map(doc => serializeDoc<Article>(doc));
}

export async function getArticleById(articleId: string): Promise<Article | null> {
  const doc = await adminDb.collection("articles").doc(articleId).get();

  if (!doc.exists) return null;
  return serializeDoc<Article>(doc);
}

export async function searchArticles(searchQuery: string, folderId?: string): Promise<SearchResult[]> {
  const snapshot = await adminDb.collection("search_index").get();
  const lowerQuery = searchQuery.toLowerCase();

  return snapshot.docs
    .map(doc => doc.data() as SearchResult)
    .filter(result => {
      const matchesQuery =
        result.title.toLowerCase().includes(lowerQuery) ||
        result.description.toLowerCase().includes(lowerQuery); // Changed from excerpt to description
      const matchesFolder = !folderId || result.folderPath.includes(folderId);
      return matchesQuery && matchesFolder;
    })
    .slice(0, 20);
}

export async function getFeaturedFolders(): Promise<Folder[]> {
  const snapshot = await adminDb
    .collection("folders")
    .where("featured", "==", true)
    .orderBy("order")
    .get();

  return snapshot.docs.map(doc => serializeDoc<Folder>(doc));
}

export async function getFolderArticleCount(folderId: string): Promise<number> {
  // Get direct articles in this folder
  const directArticles = await adminDb
    .collection("articles")
    .where("folderId", "==", folderId)
    .count()
    .get();

  // Get sub-folders
  const subFolders = await adminDb
    .collection("folders")
    .where("parentId", "==", folderId)
    .get();

  // Get articles in each sub-folder
  let subFolderCount = 0;
  for (const subFolder of subFolders.docs) {
    const count = await adminDb
      .collection("articles")
      .where("folderId", "==", subFolder.id)
      .count()
      .get();
    subFolderCount += count.data().count;
  }

  return directArticles.data().count + subFolderCount;
}
