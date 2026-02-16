import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const isDryRun = process.argv.includes("--dry-run");

async function rollbackArticles() {
  console.log("🔄 ROLLING BACK MIGRATION: description → excerpt");
  console.log(`Mode: ${isDryRun ? "DRY RUN (no writes)" : "LIVE (writes enabled)"}\n`);

  if (!isDryRun) {
    console.warn("⚠️  WARNING: LIVE ROLLBACK MODE - Firestore will be modified!");
    console.warn("Press Ctrl+C within 10 seconds to abort...\n");
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  try {
    const articlesRef = adminDb.collection("articles");
    const snapshot = await articlesRef.get();

    console.log(`Found ${snapshot.size} articles to rollback\n`);

    let batch = isDryRun ? null : adminDb.batch();
    let count = 0;
    let updated = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates: any = {};

      // Restore excerpt from description
      if (data.description && !data.excerpt) {
        updates.excerpt = data.description;
        updated++;
      }

      // Remove description field
      if (data.description !== undefined) {
        updates.description = FieldValue.delete();
      }

      // Note: Cannot restore tags (data lost during migration)
      // User must manually restore from backup JSON if needed

      if (Object.keys(updates).length > 0) {
        if (isDryRun) {
          console.log(`[DRY RUN] Would rollback ${doc.id}: ${Object.keys(updates).join(", ")}`);
        } else {
          batch!.update(doc.ref, {
            ...updates,
            updatedAt: FieldValue.serverTimestamp()
          });
        }
      }

      count++;

      // Commit every 100 operations (progressive safety)
      if (!isDryRun && count % 100 === 0) {
        await batch!.commit();

        // Verification query after each batch
        const verifyDoc = await doc.ref.get();
        const verifyData = verifyDoc.data();
        if (verifyData && verifyData.description !== undefined) {
          console.error(`❌ Batch ${count/100} verification failed: ${doc.id} still has description field`);
          throw new Error("Rollback verification failed - stopping");
        }

        batch = adminDb.batch();
        console.log(`Rolled back ${count}/${snapshot.size} documents (verified batch ${count/100})...`);
      }
    }

    // Commit remaining operations
    if (!isDryRun && count % 100 !== 0) {
      await batch!.commit();
      console.log(`Committed final batch: ${count % 100} documents`);
    }

    if (isDryRun) {
      console.log(`\n✅ DRY RUN complete: ${count} documents would be processed, ${updated} would be rolled back`);
      console.log("Run without --dry-run flag to execute rollback");
    } else {
      console.log(`\n✅ LIVE rollback complete: ${count} documents processed, ${updated} rolled back`);
      console.log("\n⚠️  NOTE: Tags cannot be restored automatically.");
      console.log("If you need tags, restore from backup/pre-migration-articles.json manually.");
    }

    return true;
  } catch (error) {
    console.error("\n❌ Rollback failed:", error);
    return false;
  }
}

rollbackArticles()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Rollback script failed:", error);
    process.exit(1);
  });
