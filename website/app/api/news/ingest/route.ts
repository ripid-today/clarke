import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

interface NewsArticleInput {
  title: string;
  slug: string;
  content: string;
  description: string;
  category: "vietnam" | "world";
  sourceUrl: string;
  sourceName: string;
  publishedAt: number; // Unix seconds
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
    if (apiKey !== process.env.LIBRARY_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { folderId, articles } = body as { folderId: string; articles: NewsArticleInput[] };

    if (!folderId || typeof folderId !== "string") {
      return NextResponse.json({ error: "folderId is required" }, { status: 400 });
    }
    if (!Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ error: "articles array is required" }, { status: 400 });
    }
    if (articles.length > 500) {
      return NextResponse.json({ error: "Maximum 500 articles per request" }, { status: 400 });
    }

    const folderDoc = await adminDb.collection("folders").doc(folderId).get();
    if (!folderDoc.exists) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    const folderData = folderDoc.data()!;
    const folderPath: string[] = folderData.path || [];

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const article of articles) {
      try {
        if (
          !article.title ||
          !article.slug ||
          !article.content ||
          !article.category ||
          !article.sourceUrl ||
          !article.sourceName
        ) {
          errors.push(`Article "${article.slug}": missing required fields`);
          continue;
        }

        const publishedAtTimestamp = Timestamp.fromMillis(
          (article.publishedAt || Date.now() / 1000) * 1000
        );
        const description = (article.description || article.content.replace(/[#*`\[\]]/g, ""))
          .trim()
          .substring(0, 200);
        const wordCount = article.content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        const existing = await adminDb
          .collection("articles")
          .where("folderId", "==", folderId)
          .where("slug", "==", article.slug)
          .limit(1)
          .get();

        if (!existing.empty) {
          await existing.docs[0].ref.update({
            title: article.title,
            content: article.content,
            description,
            sourceUrl: article.sourceUrl,
            sourceName: article.sourceName,
            isUpdated: true,
            updatedAt: Timestamp.now(),
            "metadata.wordCount": wordCount,
            "metadata.readingTime": readingTime,
            "metadata.lastModifiedBy": "news-ingest",
          });
          updated++;
        } else {
          const articleRef = adminDb.collection("articles").doc();
          await articleRef.set({
            id: articleRef.id,
            title: article.title,
            slug: article.slug,
            folderId,
            folderPath,
            content: article.content,
            description,
            order: 0,
            status: "published",
            priority: "medium",
            category: article.category,
            sourceUrl: article.sourceUrl,
            sourceName: article.sourceName,
            publishedAt: publishedAtTimestamp,
            isUpdated: false,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            metadata: {
              wordCount,
              readingTime,
              lastModifiedBy: "news-ingest",
              version: 1,
            },
          });

          await adminDb.collection("folders").doc(folderId).update({
            articleCount: FieldValue.increment(1),
          });

          created++;
        }
      } catch (err) {
        errors.push(
          `Article "${article.slug}": ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    return NextResponse.json({ created, updated, errors }, { status: 200 });
  } catch (error) {
    console.error("Error in news ingest:", {
      context: "POST /api/news/ingest",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: "Failed to ingest articles" }, { status: 500 });
  }
}
