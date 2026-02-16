import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

import { adminDb } from "../lib/firebase/admin";

async function diagnose() {
  console.log("\n" + "=".repeat(60));
  console.log("DIAGNOSTIC: Article Distribution");
  console.log("=".repeat(60) + "\n");

  try {
    // Get all folders
    const foldersSnapshot = await adminDb.collection("folders").get();
    console.log(`Total folders: ${foldersSnapshot.size}\n`);

    // Get all articles
    const articlesSnapshot = await adminDb.collection("articles").get();
    console.log(`Total articles: ${articlesSnapshot.size}\n`);

    // Group articles by folderId
    const articlesByFolder: { [key: string]: number } = {};
    const folderNames: { [key: string]: string } = {};

    articlesSnapshot.docs.forEach(doc => {
      const folderId = doc.data().folderId;
      articlesByFolder[folderId] = (articlesByFolder[folderId] || 0) + 1;
    });

    // Get folder names
    foldersSnapshot.docs.forEach(doc => {
      folderNames[doc.id] = doc.data().name || 'Unknown';
    });

    console.log("Articles by Folder:");
    console.log("-".repeat(60));

    const sortedFolders = Object.entries(articlesByFolder)
      .sort((a, b) => b[1] - a[1]);

    for (const [folderId, count] of sortedFolders) {
      const folderName = folderNames[folderId] || 'Unknown';
      console.log(`  "${folderName}"`);
      console.log(`    ID: ${folderId}`);
      console.log(`    Articles: ${count}\n`);
    }

    // Check the BA Masterclass folder specifically
    console.log("\n" + "-".repeat(60));
    console.log("BA Masterclass Folder Details:");
    console.log("-".repeat(60) + "\n");

    const baFolder = foldersSnapshot.docs.find(doc =>
      doc.data().name?.toLowerCase().includes("business analysis masterclass")
    );

    if (baFolder) {
      const folderData = baFolder.data();
      console.log(`Folder: "${folderData.name}"`);
      console.log(`ID: ${baFolder.id}`);
      console.log(`Parent: ${folderData.parentId || 'root'}`);
      console.log(`Cached articleCount: ${folderData.articleCount || 0}`);
      console.log(`Actual articles found: ${articlesByFolder[baFolder.id] || 0}\n`);

      if (articlesByFolder[baFolder.id]) {
        console.log("Sample articles in this folder:");
        const sampleArticles = articlesSnapshot.docs
          .filter(doc => doc.data().folderId === baFolder.id)
          .slice(0, 5);

        sampleArticles.forEach(doc => {
          const data = doc.data();
          console.log(`  - "${data.title}" (ID: ${doc.id})`);
        });
      }
    }

    console.log("\n" + "=".repeat(60));
    process.exit(0);
  } catch (error) {
    console.error("\n❌ DIAGNOSTIC FAILED:");
    console.error(error);
    process.exit(1);
  }
}

diagnose();
