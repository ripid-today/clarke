import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/firebase/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId");

    if (!folderId) {
      return NextResponse.json({ error: "folderId required" }, { status: 400 });
    }

    const articles = await getArticles(folderId);
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
    if (apiKey !== process.env.LIBRARY_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, slug, folderId, content, tags = [], status = "complete", priority = "medium" } = await request.json();

    // Get folder path
    let folderPath: string[] = [];
    const folderDoc = await adminDb.collection("folders").doc(folderId).get();
    if (folderDoc.exists) {
      folderPath = folderDoc.data()?.path || [];
    }

    // Generate metadata
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    const excerpt = content.substring(0, 200);

    // Create article document
    const articleRef = adminDb.collection("articles").doc();
    await articleRef.set({
      id: articleRef.id,
      title,
      slug,
      folderId,
      folderPath,
      content,
      excerpt,
      tags,
      order: 0,
      status,
      priority,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      metadata: {
        wordCount,
        readingTime,
        lastModifiedBy: "ai-agent",
        version: 1,
      },
    });

    // Update search index
    const searchRef = adminDb.collection("search_index").doc(articleRef.id);
    await searchRef.set({
      articleId: articleRef.id,
      title: title.toLowerCase(),
      excerpt: excerpt.toLowerCase(),
      tags: tags.map((t: string) => t.toLowerCase()),
      folderPath,
      updatedAt: Timestamp.now(),
    });

    // Increment folder article count
    await adminDb.collection("folders").doc(folderId).update({
      articleCount: (folderDoc.data()?.articleCount || 0) + 1,
    });

    return NextResponse.json({ success: true, articleId: articleRef.id });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
