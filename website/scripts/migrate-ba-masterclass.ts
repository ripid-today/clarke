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
  featured?: boolean;
  articleCount?: number;
  description?: string;
}

interface Article {
  id: string;
  folderId: string;
  folderPath?: string[];
  [key: string]: any;
}

async function findFolders(): Promise<{
  baLarge: Folder | null;
  baSmall: Folder | null;
  business: Folder | null;
}> {
  console.log("📂 Finding folders in Firestore...\n");

  const snapshot = await adminDb.collection("folders").get();
  const folders = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Folder[];

  console.log(`Total folders: ${folders.length}\n`);

  let baLarge: Folder | null = null;
  let baSmall: Folder | null = null;
  let business: Folder | null = null;

  // Find all BA Masterclass and Business folders
  folders.forEach(folder => {
    if (folder.name?.toLowerCase().includes("business analysis masterclass")) {
      const count = folder.articleCount || 0;
      console.log(`Found: "${folder.name}" (${count} articles)`);
      console.log(`  ID: ${folder.id}`);
      console.log(`  Parent: ${folder.parentId || "root"}`);
      console.log();

      if (count >= 90) {
        baLarge = folder;
      } else if (count >= 50) {
        baSmall = folder;
      }
    }

    if (folder.name?.toLowerCase() === "business" && !folder.parentId) {
      console.log(`Found: "Business" (root folder)`);
      console.log(`  ID: ${folder.id}`);
      console.log();
      business = folder;
    }
  });

  return { baLarge, baSmall, business };
}

async function countArticles(folderId: string): Promise<number> {
  const snapshot = await adminDb
    .collection("articles")
    .where("folderId", "==", folderId)
    .count()
    .get();
  return snapshot.data().count;
}

async function moveFolder(
  folderId: string,
  newParentId: string,
  parentPath: string[]
): Promise<void> {
  console.log(`\n📁 Moving folder ${folderId} to parent ${newParentId}...\n`);

  // Get the folder document
  const folderRef = adminDb.collection("folders").doc(folderId);
  const folderSnap = await folderRef.get();

  if (!folderSnap.exists) {
    throw new Error(`Folder not found: ${folderId}`);
  }

  const folderData = folderSnap.data() as Folder;

  // Update folder parentId and path
  const newPath = [...parentPath, folderId];
  await folderRef.update({
    parentId: newParentId,
    path: newPath,
    updatedAt: new Date()
  });

  console.log(`✅ Updated folder: parentId=${newParentId}, path=${JSON.stringify(newPath)}`);

  // Update all articles in this folder to have new folderPath
  const articlesSnapshot = await adminDb
    .collection("articles")
    .where("folderId", "==", folderId)
    .get();

  console.log(`\n📝 Updating ${articlesSnapshot.size} articles' folderPath...\n`);

  let batch = adminDb.batch();
  let batchCount = 0;
  let totalUpdated = 0;

  for (const doc of articlesSnapshot.docs) {
    batch.update(doc.ref, {
      folderPath: newPath,
      updatedAt: new Date()
    });

    batchCount++;
    totalUpdated++;

    if (batchCount % 500 === 0) {
      await batch.commit();
      batch = adminDb.batch();
      batchCount = 0;
      console.log(`  Committed batch: ${totalUpdated} articles updated`);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  Final batch: ${totalUpdated} articles updated`);
  }

  console.log(`\n✅ All articles updated`);
}

async function deleteFolder(folderId: string): Promise<void> {
  console.log(`\n🗑️ Deleting folder ${folderId}...\n`);

  // Get the folder document
  const folderRef = adminDb.collection("folders").doc(folderId);
  const folderSnap = await folderRef.get();

  if (!folderSnap.exists) {
    console.log(`ℹ️ Folder already deleted: ${folderId}`);
    return;
  }

  const folderData = folderSnap.data() as Folder;
  console.log(`Deleting: "${folderData.name}" (ID: ${folderId})`);

  // Get all articles in this folder
  const articlesSnapshot = await adminDb
    .collection("articles")
    .where("folderId", "==", folderId)
    .get();

  console.log(`Found ${articlesSnapshot.size} articles to delete\n`);

  // Delete articles in batches
  let batch = adminDb.batch();
  let batchCount = 0;
  let articlesDeleted = 0;

  for (const doc of articlesSnapshot.docs) {
    batch.delete(doc.ref);
    batchCount++;
    articlesDeleted++;

    if (batchCount % 500 === 0) {
      await batch.commit();
      batch = adminDb.batch();
      batchCount = 0;
      console.log(`  Deleted ${articlesDeleted} articles`);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`\n✅ Deleted ${articlesDeleted} articles`);

  // Delete the folder itself
  await folderRef.delete();
  console.log(`✅ Deleted folder: ${folderId}`);

  // Check and delete search index entries
  const searchSnapshot = await adminDb
    .collection("search_index")
    .where("folderPath", "array-contains", folderId)
    .get();

  if (searchSnapshot.size > 0) {
    console.log(`\n🔍 Cleaning up ${searchSnapshot.size} search index entries...\n`);

    batch = adminDb.batch();
    batchCount = 0;
    let searchDeleted = 0;

    for (const doc of searchSnapshot.docs) {
      batch.delete(doc.ref);
      batchCount++;
      searchDeleted++;

      if (batchCount % 500 === 0) {
        await batch.commit();
        batch = adminDb.batch();
        batchCount = 0;
        console.log(`  Deleted ${searchDeleted} search index entries`);
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    console.log(`\n✅ Deleted ${searchDeleted} search index entries`);
  }
}

async function verify(businessFolder: Folder): Promise<void> {
  console.log("\n\n🔍 VERIFICATION REPORT\n");
  console.log("=".repeat(60));

  // Get all folders under Business
  const foldersSnapshot = await adminDb
    .collection("folders")
    .where("parentId", "==", businessFolder.id)
    .get();

  console.log(`\nFolders under "${businessFolder.name}":`);
  const foldersByPath: { [key: string]: Folder } = {};

  for (const doc of foldersSnapshot.docs) {
    const folder = { id: doc.id, ...doc.data() } as Folder;
    foldersByPath[folder.id!] = folder;
    console.log(`  - "${folder.name}" (ID: ${folder.id})`);
    console.log(`    Parent: ${folder.parentId}`);
    console.log(`    Path: ${JSON.stringify(folder.path)}`);

    const articleCount = await countArticles(folder.id!);
    console.log(`    Articles: ${articleCount}\n`);
  }

  // Check for BA Masterclass
  const baFolder = Object.values(foldersByPath).find(f =>
    f.name?.toLowerCase().includes("business analysis masterclass")
  );

  if (baFolder) {
    console.log(`\n✅ BA Masterclass found under Business folder`);
    console.log(`   Article count: ${baFolder.articleCount || 0}`);
  } else {
    console.log(`\n❌ BA Masterclass NOT found under Business folder`);
  }

  console.log("\n" + "=".repeat(60));
}

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("BA MASTERCLASS MIGRATION SCRIPT");
  console.log("Move 92-article version to Business folder");
  console.log("Delete 52-article duplicate");
  console.log("=".repeat(60) + "\n");

  try {
    // Step 1: Find folders
    const { baLarge, baSmall, business } = await findFolders();

    if (!baLarge) {
      console.error("\n❌ ERROR: BA Masterclass (92 articles) not found");
      process.exit(1);
    }

    if (!business) {
      console.error("\n❌ ERROR: Business folder not found");
      process.exit(1);
    }

    console.log("\n✅ All required folders found\n");

    // Step 2: Move BA Masterclass (92) to Business
    console.log("STEP 1: Moving BA Masterclass to Business folder");
    console.log("-".repeat(60));

    const businessPath = business.path || [business.id!];
    await moveFolder(baLarge.id!, business.id!, businessPath);

    // Step 3: Delete duplicate (52 articles)
    if (baSmall) {
      console.log("\n\nSTEP 2: Deleting duplicate BA Masterclass (52 articles)");
      console.log("-".repeat(60));
      await deleteFolder(baSmall.id!);
    } else {
      console.log("\n\nSTEP 2: No duplicate BA Masterclass found (skipping deletion)");
    }

    // Step 4: Verify
    console.log("\n\nSTEP 3: Verification");
    console.log("-".repeat(60));
    await verify(business);

    console.log("\n\n✅ MIGRATION COMPLETE!");
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n\n❌ MIGRATION FAILED:");
    console.error(error);
    process.exit(1);
  }
}

main();
