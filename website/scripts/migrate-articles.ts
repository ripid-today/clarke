import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const isDryRun = process.argv.includes("--dry-run");

async function migrateArticles() {
  console.log("🚀 MIGRATION: excerpt → description, remove tags");
  console.log(`Mode: ${isDryRun ? "DRY RUN (no writes)" : "LIVE (writes enabled)"}\n`);

  if (!isDryRun) {
    console.warn("⚠️  WARNING: LIVE MIGRATION MODE - Firestore will be modified!");
    console.warn("⚠️  NO BACKUP exists - only manual JSON exports!");
    console.warn("Press Ctrl+C within 10 seconds to abort...\n");
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  try {
    const articlesRef = adminDb.collection("articles");
    const snapshot = await articlesRef.get();

    console.log(`Found ${snapshot.size} articles to migrate\n`);

    // Pre-migration validation
    const longExcerpts = snapshot.docs.filter(doc => {
      const excerpt = doc.data().excerpt;
      return excerpt && excerpt.length > 200;
    });

    if (longExcerpts.length > 0) {
      console.warn(`⚠️  WARNING: ${longExcerpts.length} articles have excerpt >200 chars`);
      console.warn("These will be truncated to 200 characters:\n");
      longExcerpts.forEach(doc => {
        const data = doc.data();
        console.warn(`  - ${doc.id}: "${data.title}" (${data.excerpt.length} chars)`);
      });
      console.warn("\nContinuing in 5 seconds...\n");
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.log("✅ Pre-validation passed: All excerpts ≤200 chars\n");
    }

    let batch = isDryRun ? null : adminDb.batch();
    let count = 0;
    let updated = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates: any = {};

      // Copy excerpt → description if description doesn't exist
      if (data.excerpt && !data.description) {
        updates.description = data.excerpt.substring(0, 200); // Enforce 200 char limit
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
          if (updates.description) {
            console.log(`  description: "${updates.description.substring(0, 50)}${updates.description.length > 50 ? '...' : ''}"`);
          }
        } else {
          batch!.update(doc.ref, {
            ...updates,
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }

      count++;

      // Commit every 100 operations (reduced from 500 for progressive safety - NO BACKUP)
      if (!isDryRun && count % 100 === 0) {
        await batch!.commit();

        // Verification query after each batch (NO BACKUP safety)
        const verifyDoc = await doc.ref.get();
        const verifyData = verifyDoc.data();
        if (verifyData && verifyData.excerpt !== undefined) {
          console.error(`❌ Batch ${count/100} verification failed: ${doc.id} still has excerpt field`);
          throw new Error("Migration verification failed - stopping");
        }

        batch = adminDb.batch();
        console.log(`Migrated ${count}/${snapshot.size} documents (verified batch ${count/100})...`);
      }
    }

    // Commit remaining operations
    if (!isDryRun && count % 100 !== 0) {
      await batch!.commit();
      console.log(`Committed final batch: ${count % 100} documents`);
    }

    if (isDryRun) {
      console.log(`\n✅ DRY RUN complete: ${count} documents would be processed, ${updated} would be updated`);
      console.log("Run without --dry-run flag to execute migration");
    } else {
      console.log(`\n✅ LIVE migration complete: ${count} documents processed, ${updated} updated`);
    }

    return true;
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    console.error("\n⚠️  TO ROLLBACK: Run scripts/rollback-articles.ts");
    return false;
  }
}

migrateArticles()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Migration script failed:", error);
    process.exit(1);
  });
