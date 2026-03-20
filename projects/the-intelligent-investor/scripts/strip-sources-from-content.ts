/**
 * One-time migration: strip "**Sources:**" lines from article content.
 * The AI was appending "\n\n**Sources:** ..." at the end of articles because
 * source names were included in the prompt. This removes those trailing lines.
 *
 * Run: npx tsx scripts/strip-sources-from-content.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { adminDb } from "../lib/firebase/admin";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SOURCES_PATTERN = /\n\n\*\*Sources:\*\*[^\n]*/g;

async function run() {
  const snap = await adminDb.collection("articles").get();
  console.log(`Total articles: ${snap.size}`);

  let batch = adminDb.batch();
  let updated = 0;
  let skipped = 0;
  let batchCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const content: string = data.content || "";

    if (!content.includes("**Sources:**")) {
      skipped++;
      continue;
    }

    const stripped = content.replace(SOURCES_PATTERN, "").trimEnd();
    batch.update(doc.ref, { content: stripped });
    updated++;
    batchCount++;

    if (batchCount === 500) {
      await batch.commit();
      batch = adminDb.batch();
      batchCount = 0;
      console.log(`  committed ${updated} so far...`);
    }
  }

  if (batchCount > 0) await batch.commit();

  console.log(`✅ Updated: ${updated}, Skipped (no Sources line): ${skipped}`);
}

run().then(() => process.exit(0)).catch(e => { console.error("❌", e); process.exit(1); });
