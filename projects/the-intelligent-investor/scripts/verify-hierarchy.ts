import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

import { adminDb } from "../lib/firebase/admin";

interface Folder {
  id: string;
  name?: string;
  slug?: string;
  parentId?: string;
  path?: string[];
  articleCount?: number;
  [key: string]: any;
}

async function buildHierarchy() {
  console.log("\n" + "=".repeat(60));
  console.log("HIERARCHY VERIFICATION");
  console.log("=".repeat(60) + "\n");

  try {
    const foldersSnapshot = await adminDb.collection("folders").get();
    const folders = new Map<string, Folder>();

    foldersSnapshot.docs.forEach(doc => {
      folders.set(doc.id, {
        id: doc.id,
        ...doc.data()
      } as Folder);
    });

    // Find Business folder
    const businessFolder = Array.from(folders.values()).find(f =>
      f.name?.toLowerCase() === "business"
    );

    if (!businessFolder) {
      console.log("❌ Business folder not found!");
      process.exit(1);
    }

    console.log(`📂 Business (ID: ${businessFolder.id})`);
    console.log(`   Path: ${JSON.stringify(businessFolder.path)}\n`);

    // Find BA Masterclass under Business
    const baFolder = Array.from(folders.values()).find(f =>
      f.name?.toLowerCase().includes("business analysis masterclass") &&
      f.parentId === businessFolder.id
    );

    if (!baFolder) {
      console.log("❌ BA Masterclass folder not found under Business!");
      process.exit(1);
    }

    console.log(`  📂 ${baFolder.name} (ID: ${baFolder.id})`);
    console.log(`     Parent: ${baFolder.parentId}`);
    console.log(`     Path: ${JSON.stringify(baFolder.path)}`);
    console.log(`     Article Count: ${baFolder.articleCount}\n`);

    // Find modules under BA Masterclass
    const modules = Array.from(folders.values()).filter(f =>
      f.parentId === baFolder.id
    );

    console.log(`  Found ${modules.length} modules:\n`);

    modules.forEach(module => {
      console.log(`    📂 ${module.name} (ID: ${module.id})`);
      console.log(`       Parent: ${module.parentId}`);
      console.log(`       Path: ${JSON.stringify(module.path)}`);
      console.log();
    });

    // Count total articles in all modules
    let totalArticles = 0;
    for (const module of modules) {
      const articlesSnapshot = await adminDb
        .collection("articles")
        .where("folderId", "==", module.id)
        .count()
        .get();
      totalArticles += articlesSnapshot.data().count;
    }

    console.log("-".repeat(60));
    console.log(`✅ VERIFIED HIERARCHY`);
    console.log("-".repeat(60));
    console.log(`Business folder: ✅`);
    console.log(`  └─ BA Masterclass: ✅ (${modules.length} modules, ${totalArticles} articles)`);
    console.log("\n" + "=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ VERIFICATION FAILED:");
    console.error(error);
    process.exit(1);
  }
}

buildHierarchy();
