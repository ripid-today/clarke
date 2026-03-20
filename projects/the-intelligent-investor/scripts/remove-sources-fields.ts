/**
 * One-time migration: remove all source-related fields from every article.
 * Removes: sourceUrl, sourceName (top-level) + metadata.sourceCount,
 *          metadata.sourceUrls, metadata.sourceNames (nested).
 *
 * Run: npx tsx scripts/remove-sources-fields.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { adminDb } from "../lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function run() {
  const snap = await adminDb.collection("articles").get();
  console.log(`Total articles: ${snap.size}`);

  let batch = adminDb.batch();
  let updated = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const hasTopLevel = "sourceUrl" in data || "sourceName" in data;
    const meta = data.metadata || {};
    const hasMeta =
      "sourceCount" in meta || "sourceUrls" in meta || "sourceNames" in meta;

    if (!hasTopLevel && !hasMeta) {
      skipped++;
      continue;
    }

    const update: Record<string, unknown> = {};
    if ("sourceUrl" in data) update["sourceUrl"] = FieldValue.delete();
    if ("sourceName" in data) update["sourceName"] = FieldValue.delete();
    if ("sourceCount" in meta) update["metadata.sourceCount"] = FieldValue.delete();
    if ("sourceUrls" in meta) update["metadata.sourceUrls"] = FieldValue.delete();
    if ("sourceNames" in meta) update["metadata.sourceNames"] = FieldValue.delete();

    batch.update(doc.ref, update);
    updated++;

    if (updated % 500 === 0) {
      await batch.commit();
      batch = adminDb.batch();
      console.log(`  committed ${updated} so far...`);
    }
  }

  if (updated % 500 !== 0) await batch.commit();

  console.log(`✅ Updated: ${updated}, Skipped (no source fields): ${skipped}`);
}

run().then(() => process.exit(0)).catch(e => { console.error("❌", e); process.exit(1); });
