import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

import { adminDb } from "../lib/firebase/admin";

async function deleteDuplicateFolder() {
  console.log("\n" + "=".repeat(60));
  console.log("CLEANUP: Delete Empty BA Masterclass Duplicate");
  console.log("=".repeat(60) + "\n");

  try {
    const folderId = "KzxINEBTTc9KcM2WzGWB";
    console.log(`🗑️ Deleting empty folder: ${folderId}\n`);

    // Get the folder document
    const folderRef = adminDb.collection("folders").doc(folderId);
    const folderSnap = await folderRef.get();

    if (!folderSnap.exists) {
      console.log("ℹ️ Folder already deleted");
      process.exit(0);
    }

    const folderData = folderSnap.data();
    console.log(`Folder to delete: "${folderData?.name}"`);
    console.log(`Article count: ${folderData?.articleCount || 0}\n`);

    // Delete the folder
    await folderRef.delete();
    console.log(`✅ Folder deleted: ${folderId}\n`);

    console.log("✅ CLEANUP COMPLETE!");
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ CLEANUP FAILED:");
    console.error(error);
    process.exit(1);
  }
}

deleteDuplicateFolder();
