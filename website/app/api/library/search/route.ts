import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const folderId = searchParams.get("folder") || undefined;

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 });
    }

    const results = await searchArticles(query, folderId);

    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error("Error searching articles:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
