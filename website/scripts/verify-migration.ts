import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";

async function verifyMigration() {
  console.log("🔍 VERIFYING MIGRATION SUCCESS...\n");

  try {
    // Articles collection
    const articlesRef = adminDb.collection("articles");
    const articlesSnapshot = await articlesRef.get();

    const articlesWithDescription = articlesSnapshot.docs.filter(doc =>
      doc.data().description
    ).length;

    const articlesWithExcerpt = articlesSnapshot.docs.filter(doc =>
      doc.data().excerpt !== undefined
    ).length;

    const articlesWithTags = articlesSnapshot.docs.filter(doc =>
      doc.data().tags !== undefined
    ).length;

    console.log("📄 Articles Collection:");
    console.log(`   Total: ${articlesSnapshot.size}`);
    console.log(`   With 'description': ${articlesWithDescription} ${articlesWithDescription === articlesSnapshot.size ? "✅" : "❌"}`);
    console.log(`   With 'excerpt': ${articlesWithExcerpt} ${articlesWithExcerpt === 0 ? "✅" : "❌ (should be 0)"}`);
    console.log(`   With 'tags': ${articlesWithTags} ${articlesWithTags === 0 ? "✅" : "❌ (should be 0)"}\n`);

    // Sample 5 random articles to verify structure
    console.log("📋 Sample Article Verification (5 random articles):\n");
    const sampleDocs = articlesSnapshot.docs
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    sampleDocs.forEach(doc => {
      const data = doc.data();
      console.log(`   ${doc.id}:`);
      console.log(`      title: ${data.title.substring(0, 40)}...`);
      console.log(`      description: ${data.description ? `"${data.description.substring(0, 50)}..." (${data.description.length} chars)` : "❌ MISSING"}`);
      console.log(`      excerpt: ${data.excerpt !== undefined ? `❌ STILL EXISTS` : "✅ removed"}`);
      console.log(`      tags: ${data.tags !== undefined ? `❌ STILL EXISTS` : "✅ removed"}\n`);
    });

    // Validation results
    const success =
      articlesWithDescription === articlesSnapshot.size &&
      articlesWithExcerpt === 0 &&
      articlesWithTags === 0;

    if (success) {
      console.log("════════════════════════════════════════════════════════");
      console.log("✅ MIGRATION VERIFICATION PASSED");
      console.log("════════════════════════════════════════════════════════");
      console.log("All articles migrated successfully:");
      console.log(`  - ${articlesWithDescription} articles have 'description' field`);
      console.log(`  - 0 articles have 'excerpt' field (removed)`);
      console.log(`  - 0 articles have 'tags' field (removed)`);
      console.log("════════════════════════════════════════════════════════\n");
    } else {
      console.log("════════════════════════════════════════════════════════");
      console.log("❌ MIGRATION VERIFICATION FAILED");
      console.log("════════════════════════════════════════════════════════");
      console.log("Please review and re-run migration scripts");
      console.log("⚠️  TO ROLLBACK: Run scripts/rollback-articles.ts\n");
    }

    return success;
  } catch (error) {
    console.error("\n❌ Verification failed:", error);
    return false;
  }
}

verifyMigration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Verification script failed:", error);
    process.exit(1);
  });
