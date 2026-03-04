import { NextRequest, NextResponse } from "next/server";
import { getFolders } from "@/lib/firebase/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";

// Mark as dynamic route (don't pre-render at build time)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("parentId") || undefined;
    const folders = await getFolders(parentId);

    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");
    if (apiKey !== process.env.LIBRARY_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, slug, parentId, description, featured = false, order = 0 } = await request.json();

    // Validation: Required fields
    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: "name, slug, and description are required" },
        { status: 400 }
      );
    }

    // Validation: Description type check
    if (typeof description !== "string") {
      return NextResponse.json(
        { error: "description must be a string" },
        { status: 400 }
      );
    }

    // Validation: Trim whitespace and check empty (CRITICAL-04 fix)
    const trimmedDescription = description.trim();

    if (trimmedDescription.length === 0) {
      return NextResponse.json(
        { error: "description cannot be empty or whitespace-only" },
        { status: 400 }
      );
    }

    // Validation: Character limit (300 chars for folders)
    if (trimmedDescription.length > 300) {
      return NextResponse.json(
        {
          error: "Description must be 300 characters or less",
          field: "description",
          current: trimmedDescription.length,
          max: 300
        },
        { status: 400 }
      );
    }

    // Calculate path from parentId
    let path: string[] = [slug];
    if (parentId) {
      const parentDoc = await adminDb.collection("folders").doc(parentId).get();
      if (parentDoc.exists) {
        const parentData = parentDoc.data();
        path = [...(parentData?.path || []), slug];
      }
    }

    // Create folder document
    const folderRef = adminDb.collection("folders").doc();
    await folderRef.set({
      id: folderRef.id,
      name,
      slug,
      parentId: parentId || null,
      description: trimmedDescription, // Use trimmed description
      path,
      order,
      featured,
      articleCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      metadata: {},
    });

    revalidateTag("folders");

    return NextResponse.json({ success: true, folderId: folderRef.id });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
