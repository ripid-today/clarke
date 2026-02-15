import { NextRequest, NextResponse } from "next/server";
import { getFeaturedFolders } from "@/lib/firebase/firestore";

// Mark as dynamic route (don't pre-render at build time)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const folders = await getFeaturedFolders();
    return NextResponse.json({ folders });
  } catch (error) {
    console.error("Error fetching featured folders:", error);
    return NextResponse.json({ error: "Failed to fetch featured folders" }, { status: 500 });
  }
}
