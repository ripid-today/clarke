import { adminDb } from "../lib/firebase/admin";

async function findBusinessAnalysisFolder() {
  console.log("Searching for 'Business Analysis Masterclass' folder in Firestore...\n");

  try {
    const foldersRef = adminDb.collection("folders");
    const snapshot = await foldersRef.get();

    console.log(`Total folders in database: ${snapshot.size}\n`);

    const folders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{ id: string; name?: string; slug?: string; parentId?: string; featured?: boolean; description?: string; articleCount?: number }>;

    // Search for Business Analysis related folders
    const businessFolders = folders.filter(folder =>
      folder.name && folder.name.toLowerCase().includes('business')
    );

    if (businessFolders.length === 0) {
      console.log("❌ No folders found with 'business' in the name.\n");
      console.log("All folders:");
      folders.forEach(f => console.log(`  - ${f.name} (ID: ${f.id}, slug: ${f.slug})`));
      return;
    }

    console.log("✅ Found folders matching 'business':\n");
    businessFolders.forEach(folder => {
      console.log(`Folder: ${folder.name}`);
      console.log(`  ID: ${folder.id}`);
      console.log(`  Slug: ${folder.slug || 'N/A'}`);
      console.log(`  Parent ID: ${folder.parentId || 'null (root-level)'}`);
      console.log(`  Featured: ${folder.featured || false}`);
      console.log(`  Description: ${folder.description || 'N/A'}`);
      console.log(`  Article Count: ${folder.articleCount || 0}`);
      console.log();
    });

    // Check for sub-folders
    const mainFolder = businessFolders.find(f =>
      f.name && f.name.toLowerCase().includes('masterclass')
    );

    if (mainFolder) {
      console.log(`\n📂 Checking for sub-folders under "${mainFolder.name}"...\n`);

      const subFolders = folders.filter(f => f.parentId === mainFolder.id);

      if (subFolders.length === 0) {
        console.log("  No sub-folders found.\n");
      } else {
        console.log(`  Found ${subFolders.length} sub-folder(s):\n`);
        subFolders.forEach(sub => {
          console.log(`  - ${sub.name || 'Unnamed'} (ID: ${sub.id}, slug: ${sub.slug || 'N/A'})`);
        });
      }
    }

  } catch (error) {
    console.error("❌ Error querying Firestore:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
  }
}

findBusinessAnalysisFolder()
  .then(() => {
    console.log("\n✅ Search complete.");
    process.exit(0);
  })
  .catch(error => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
