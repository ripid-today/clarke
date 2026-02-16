import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const isDryRun = process.argv.includes("--dry-run");

async function migrateSearchIndex() {
  console.log("🔍 SEARCH INDEX MIGRATION: excerpt → description, remove tags");
  console.log(`Mode: ${isDryRun ? "DRY RUN (no writes)" : "LIVE (writes enabled)"}\n`);

  if (!isDryRun) {
    console.warn("⚠️  WARNING: LIVE MIGRATION MODE - Firestore will be modified!");
    console.warn("Press Ctrl+C within 5 seconds to abort...\n");
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  try {
    const searchRef = adminDb.collection("search_index");
    const snapshot = await searchRef.get();

    console.log(`Found ${snapshot.size} search index documents\n`);

    let batch = isDryRun ? null : adminDb.batch();
    let count = 0;
    let updated = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates: any = {};

      // Copy excerpt → description
      if (data.excerpt && !data.description) {
        updates.description = data.excerpt;
        updated++;
      }

      // Remove old excerpt field
      if (data.excerpt !== undefined) {
        updates.excerpt = FieldValue.delete();
      }

      // Remove tags field
      if (data.tags !== undefined) {
        updates.tags = FieldValue.delete();
      }

      if (Object.keys(updates).length > 0) {
        if (isDryRun) {
          console.log(`[DRY RUN] Would update ${doc.id}: ${Object.keys(updates).join(", ")}`);
        } else {
          batch!.update(doc.ref, updates);
        }
      }

      count++;

      if (!isDryRun && count % 100 === 0) {
        await batch!.commit();
        batch = adminDb.batch();
        console.log(`Migrated ${count}/${snapshot.size} documents...`);
      }
    }

    if (!isDryRun && count % 100 !== 0) {
      await batch!.commit();
    }

    if (isDryRun) {
      console.log(`\n✅ DRY RUN complete: ${count} documents would be processed, ${updated} would be updated`);
    } else {
      console.log(`\n✅ Search index migration complete: ${count} documents processed, ${updated} updated`);
    }

    return true;
  } catch (error) {
    console.error("\n❌ Search index migration failed:", error);
    return false;
  }
}

migrateSearchIndex()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Migration script failed:", error);
    process.exit(1);
  });
