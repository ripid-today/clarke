import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/firebase/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

// Mark as dynamic route (don't pre-render at build time)
export const dynamic = 'force-dynamic';

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

    const { title, slug, folderId, content, description, status = "complete", priority = "medium" } = await request.json();

    // Validation: Required fields
    if (!title || !slug || !folderId || !content) {
      return NextResponse.json(
        { error: "title, slug, folderId, and content are required" },
        { status: 400 }
      );
    }

    // Validation: Description type check
    if (description && typeof description !== "string") {
      return NextResponse.json(
        { error: "description must be a string" },
        { status: 400 }
      );
    }

    // Generate description from content if not provided (first 200 chars)
    let finalDescription = description || content.substring(0, 200);

    // Validation: Trim whitespace and check empty (CRITICAL-04 fix)
    const trimmedDescription = finalDescription.trim();

    if (trimmedDescription.length === 0) {
      return NextResponse.json(
        { error: "description cannot be empty or whitespace-only" },
        { status: 400 }
      );
    }

    // Validation: Character limit (200 chars for articles)
    if (trimmedDescription.length > 200) {
      return NextResponse.json(
        {
          error: "Description must be 200 characters or less",
          field: "description",
          current: trimmedDescription.length,
          max: 200
        },
        { status: 400 }
      );
    }

    // Get folder path
    let folderPath: string[] = [];
    const folderDoc = await adminDb.collection("folders").doc(folderId).get();
    if (folderDoc.exists) {
      folderPath = folderDoc.data()?.path || [];
    }

    // Generate metadata
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    // Create article document (using new schema: description instead of excerpt, no tags)
    const articleRef = adminDb.collection("articles").doc();
    await articleRef.set({
      id: articleRef.id,
      title,
      slug,
      folderId,
      folderPath,
      content,
      description: trimmedDescription, // Use trimmed description
      // tags removed (REQ-005)
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

    // Update search index (using new schema: description instead of excerpt, no tags)
    const searchRef = adminDb.collection("search_index").doc(articleRef.id);
    await searchRef.set({
      articleId: articleRef.id,
      title: title.toLowerCase(),
      description: trimmedDescription.toLowerCase(), // Changed from excerpt
      // tags removed (REQ-005)
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
