/**
 * One-time script: delete all articles where folderId == DAILY_NEWS_FOLDER_ID
 * Does NOT touch any other folders or articles.
 *
 * Run: npx tsx scripts/clear-daily-news-articles.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { adminDb } from "../lib/firebase/admin";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DAILY_NEWS_FOLDER_ID = process.env.DAILY_NEWS_FOLDER_ID as string;
if (!DAILY_NEWS_FOLDER_ID) { console.error("❌ DAILY_NEWS_FOLDER_ID is not set"); process.exit(1); }

async function run() {
  const snap = await adminDb.collection("articles").where("folderId", "==", DAILY_NEWS_FOLDER_ID).get();
  console.log(`Found ${snap.size} articles to delete`);
  if (snap.size === 0) return;

  let batch = adminDb.batch();
  let count = 0;
  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    if (++count % 500 === 0) { await batch.commit(); batch = adminDb.batch(); }
  }
  if (count % 500 !== 0) await batch.commit();

  // Reset articleCount on the root folder
  await adminDb.collection("folders").doc(DAILY_NEWS_FOLDER_ID).update({ articleCount: 0 });

  console.log(`✅ Deleted ${count} articles, reset folder articleCount to 0`);
}

run().then(() => process.exit(0)).catch(e => { console.error("❌", e); process.exit(1); });
