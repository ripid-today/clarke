import { adminDb } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
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

export const getFolders = unstable_cache(
  async (parentId?: string): Promise<Folder[]> => {
    const ref = adminDb.collection("folders");
    const query = parentId
      ? ref.where("parentId", "==", parentId).orderBy("order")
      : ref.orderBy("order");

    const snapshot = await query.get();
    return snapshot.docs.map(doc => serializeDoc<Folder>(doc));
  },
  ["get-folders"],
  { revalidate: 300, tags: ["folders"] }
);

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

export async function getArticleBySlug(slug: string, folderId?: string): Promise<Article | null> {
  let query = adminDb.collection("articles").where("slug", "==", slug);

  if (folderId) {
    query = query.where("folderId", "==", folderId);
  }

  const snapshot = await query.limit(1).get();

  if (snapshot.empty) return null;
  return serializeDoc<Article>(snapshot.docs[0]);
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

export const getFeaturedFolders = unstable_cache(
  async (): Promise<Folder[]> => {
    const snapshot = await adminDb
      .collection("folders")
      .where("featured", "==", true)
      .orderBy("order")
      .get();

    return snapshot.docs.map(doc => serializeDoc<Folder>(doc));
  },
  ["get-featured-folders"],
  { revalidate: 300, tags: ["folders"] }
);

export async function getDailyNewsArticles(
  rootFolderId: string,
  cursor?: string,
  limit = 20
): Promise<{ articles: Article[]; hasMore: boolean; nextCursor?: string }> {
  // Query by folderId — all daily-news articles (both legacy and v2) are stored
  // with folderId = rootFolderId. Uses the existing folderId + publishedAt DESC index.
  let query: FirebaseFirestore.Query = adminDb
    .collection("articles")
    .where("folderId", "==", rootFolderId)
    .orderBy("publishedAt", "desc");

  if (cursor) {
    const cursorSeconds = parseInt(Buffer.from(cursor, "base64").toString("utf8"), 10);
    const cursorTimestamp = new Timestamp(cursorSeconds, 0);
    query = query.startAfter(cursorTimestamp);
  }

  const snapshot = await query.limit(limit + 1).get();
  const docs = snapshot.docs;
  const hasMore = docs.length > limit;
  const pageDocs = hasMore ? docs.slice(0, limit) : docs;
  const articles = pageDocs.map(doc => serializeDoc<Article>(doc));

  let nextCursor: string | undefined;
  if (hasMore) {
    const lastDoc = pageDocs[pageDocs.length - 1];
    const lastPublishedAt = lastDoc.data().publishedAt;
    if (lastPublishedAt) {
      const seconds = (lastPublishedAt as { _seconds?: number; seconds?: number })._seconds ?? lastPublishedAt.seconds;
      nextCursor = Buffer.from(String(seconds)).toString("base64");
    }
  }

  return { articles, hasMore, nextCursor };
}

export async function getRecentArticleTitles(
  rootFolderId: string,
  days = 30
): Promise<{ id: string; title: string }[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const snapshot = await adminDb
    .collection("articles")
    .where("folderId", "==", rootFolderId)
    .where("publishedAt", ">=", Timestamp.fromDate(cutoff))
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, title: (doc.data().title as string) || "" }));
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
