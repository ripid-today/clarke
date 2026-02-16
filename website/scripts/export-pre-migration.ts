import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";

async function exportCollections() {
  console.log("⚠️  EXPORTING ALL COLLECTIONS BEFORE MIGRATION (NO BACKUP SAFETY)...\n");

  // Create backup directory
  const backupDir = path.join(__dirname, "..", "backup", "pre-migration");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`✅ Created backup directory: ${backupDir}\n`);
  }

  try {
    // Export articles collection
    console.log("📄 Exporting articles collection...");
    const articlesRef = adminDb.collection("articles");
    const articlesSnapshot = await articlesRef.get();
    const articles = articlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    fs.writeFileSync(
      path.join(backupDir, "pre-migration-articles.json"),
      JSON.stringify(articles, null, 2)
    );
    console.log(`   ✅ Exported ${articles.length} articles`);
    console.log(`   📊 File size: ${(fs.statSync(path.join(backupDir, "pre-migration-articles.json")).size / 1024).toFixed(2)} KB\n`);

    // Export folders collection
    console.log("📁 Exporting folders collection...");
    const foldersRef = adminDb.collection("folders");
    const foldersSnapshot = await foldersRef.get();
    const folders = foldersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    fs.writeFileSync(
      path.join(backupDir, "pre-migration-folders.json"),
      JSON.stringify(folders, null, 2)
    );
    console.log(`   ✅ Exported ${folders.length} folders`);
    console.log(`   📊 File size: ${(fs.statSync(path.join(backupDir, "pre-migration-folders.json")).size / 1024).toFixed(2)} KB\n`);

    // Export search_index collection
    console.log("🔍 Exporting search_index collection...");
    const searchRef = adminDb.collection("search_index");
    const searchSnapshot = await searchRef.get();
    const searchDocs = searchSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    fs.writeFileSync(
      path.join(backupDir, "pre-migration-search-index.json"),
      JSON.stringify(searchDocs, null, 2)
    );
    console.log(`   ✅ Exported ${searchDocs.length} search index documents`);
    console.log(`   📊 File size: ${(fs.statSync(path.join(backupDir, "pre-migration-search-index.json")).size / 1024).toFixed(2)} KB\n`);

    // Export 20 sample articles for testing (HIGH-05)
    const sampleArticles = articles.slice(0, 20);
    fs.writeFileSync(
      path.join(backupDir, "sample-articles-for-testing.json"),
      JSON.stringify(sampleArticles, null, 2)
    );
    console.log(`📋 Exported 20 sample articles for testing`);
    console.log(`   📊 File size: ${(fs.statSync(path.join(backupDir, "sample-articles-for-testing.json")).size / 1024).toFixed(2)} KB\n`);

    // Summary
    console.log("════════════════════════════════════════════════════════");
    console.log("✅ ALL COLLECTIONS EXPORTED SUCCESSFULLY");
    console.log("════════════════════════════════════════════════════════");
    console.log(`📂 Backup location: ${backupDir}`);
    console.log(`📄 Articles: ${articles.length} documents`);
    console.log(`📁 Folders: ${folders.length} documents`);
    console.log(`🔍 Search Index: ${searchDocs.length} documents`);
    console.log(`📋 Sample Articles: 20 documents`);
    console.log("════════════════════════════════════════════════════════\n");
    console.log("⚠️  CRITICAL: DO NOT DELETE these files until migration verified successful!");
    console.log("⚠️  These are your ONLY backup since no Firestore backup exists.\n");

    return true;
  } catch (error) {
    console.error("\n❌ EXPORT FAILED:", error);
    console.error("\n⚠️  DO NOT PROCEED WITH MIGRATION - No backup created!");
    return false;
  }
}

exportCollections()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Export script failed:", error);
    process.exit(1);
  });
