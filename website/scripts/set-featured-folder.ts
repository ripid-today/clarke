import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";

async function setFeaturedFolder() {
  const folderId = "KzxINEBTTc9KcM2WzGWB";

  console.log(`Setting folder ${folderId} as featured...\n`);

  try {
    // First, verify the folder exists
    const folderRef = adminDb.collection("folders").doc(folderId);
    const folderDoc = await folderRef.get();

    if (!folderDoc.exists) {
      console.error(`❌ Folder ${folderId} not found!`);
      return false;
    }

    const folderData = folderDoc.data();
    console.log(`Found folder: "${folderData?.name}"`);
    console.log(`Current featured status: ${folderData?.featured || false}\n`);

    // Update to featured: true
    await folderRef.update({
      featured: true,
      updatedAt: new Date()
    });

    console.log("✅ Folder marked as featured successfully!");

    // Verify the update
    const updatedDoc = await folderRef.get();
    const updatedData = updatedDoc.data();
    console.log(`New featured status: ${updatedData?.featured}\n`);

    return true;
  } catch (error) {
    console.error("❌ Error setting featured folder:", error);
    return false;
  }
}

setFeaturedFolder()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
