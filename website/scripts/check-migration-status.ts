import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

import { adminDb } from "../lib/firebase/admin";

async function checkMigrationStatus() {
  const articlesRef = adminDb.collection("articles");
  const snapshot = await articlesRef.get();

  console.log(`Total articles: ${snapshot.size}\n`);

  const categories = {
    migrated: [] as any[],
    needsMigration: [] as any[],
    hasDescriptionAlready: [] as any[]
  };

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    
    if (!data.excerpt && data.description && !data.tags) {
      categories.migrated.push(doc.id);
    } else if (data.excerpt && !data.description) {
      categories.needsMigration.push(doc.id);
    } else if (data.excerpt && data.description) {
      categories.hasDescriptionAlready.push(doc.id);
    }
  });

  console.log(`✅ Migrated (no excerpt, has description, no tags): ${categories.migrated.length}`);
  console.log(`⚠️  Needs migration (has excerpt, no description): ${categories.needsMigration.length}`);
  console.log(`🤔 Has both excerpt and description: ${categories.hasDescriptionAlready.length}\n`);

  if (categories.needsMigration.length > 0) {
    console.log("Sample articles needing migration:");
    categories.needsMigration.slice(0, 3).forEach(id => {
      const doc = snapshot.docs.find(d => d.id === id);
      if (doc) {
        const data = doc.data();
        console.log(`  - ${id}`);
        console.log(`    title: ${data.title}`);
        console.log(`    has excerpt: ${data.excerpt ? 'YES' : 'NO'}`);
        console.log(`    has description: ${data.description ? 'YES' : 'NO'}`);
        console.log(`    has tags: ${data.tags ? 'YES' : 'NO'}`);
      }
    });
  }
}

checkMigrationStatus()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error:", error);
    process.exit(1);
  });
