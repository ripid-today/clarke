/**
 * One-time migration: extract Haiku-generated headings from daily-news article content
 * and promote them to the title field, leaving pure prose in content.
 *
 * Run: npx ts-node --project tsconfig.json scripts/fix-daily-news-titles.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { adminDb } from "../lib/firebase/admin";

// Load .env.local from website root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DAILY_NEWS_FOLDER_ID = process.env.DAILY_NEWS_FOLDER_ID;
if (!DAILY_NEWS_FOLDER_ID) {
  console.error("❌ DAILY_NEWS_FOLDER_ID is not set");
  process.exit(1);
}

// Matches a markdown heading (# to ###) at the start of the content string
const HEADING_RE = /^#{1,3}\s+(.+?)(?:\n|$)/;

async function fixDailyNewsTitles(): Promise<void> {
  console.log(`Querying articles for folderId: ${DAILY_NEWS_FOLDER_ID}`);

  const snapshot = await adminDb
    .collection("articles")
    .where("folderId", "==", DAILY_NEWS_FOLDER_ID)
    .get();

  console.log(`Found ${snapshot.size} articles`);

  let updated = 0;
  let skipped = 0;
  let batchCount = 0;
  let batch = adminDb.batch();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const content: string = data.content || "";

    const match = HEADING_RE.exec(content);
    if (!match) {
      skipped++;
      continue;
    }

    const newTitle = match[1].trim();
    // Remove the heading line (and any blank line immediately after it) from content
    const newContent = content.replace(/^#{1,3}\s+.+?\n\n?/, "").trim();

    batch.update(doc.ref, {
      title: newTitle,
      content: newContent,
      updatedAt: new Date(),
    });
    updated++;
    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      console.log(`  Committed batch of 500 (${updated} updated so far)...`);
      batch = adminDb.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`\n✅ Done: ${updated} articles updated, ${skipped} skipped (no heading found)`);
}

fixDailyNewsTitles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
