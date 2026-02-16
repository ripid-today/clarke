import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";

async function testConnection() {
  console.log("Testing Firebase connection...\n");

  try {
    // Try to query folders collection
    const foldersRef = adminDb.collection("folders");
    const snapshot = await foldersRef.limit(1).get();

    console.log("✅ Firebase connection successful!");
    console.log(`   Retrieved ${snapshot.size} document(s) from 'folders' collection`);

    if (snapshot.size > 0) {
      const doc = snapshot.docs[0];
      console.log(`   Sample document ID: ${doc.id}`);
      console.log(`   Sample document has ${Object.keys(doc.data()).length} fields`);
    }

    return true;
  } catch (error) {
    console.error("❌ Firebase connection failed!");
    console.error("Error:", error);
    return false;
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Test script failed:", error);
    process.exit(1);
  });
