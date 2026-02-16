import { adminDb } from "../lib/firebase/admin";

interface FolderData {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  path: string[];
  order: number;
  featured: boolean;
  articleCount: number;
}

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  folderId: string;
  folderPath: string[];
  content: string;
  excerpt: string;
  tags: string[];
  order: number;
  status: string;
}

async function exportBAMasterclass() {
  console.log("🔍 Exporting Business Analysis Masterclass content from Firebase...\n");

  try {
    // 1. Find the main Business Analysis Masterclass folder
    const foldersRef = adminDb.collection("folders");
    const allFolders = await foldersRef.get();

    const folders = allFolders.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FolderData[];

    const baFolder = folders.find(f =>
      f.name && f.name.toLowerCase().includes('business') &&
      f.name.toLowerCase().includes('analysis')
    );

    if (!baFolder) {
      console.log("❌ Business Analysis Masterclass folder not found in database.\n");
      console.log("Available folders:");
      folders.forEach(f => console.log(`  - ${f.name} (ID: ${f.id})`));
      return;
    }

    console.log(`✅ Found: ${baFolder.name}`);
    console.log(`   ID: ${baFolder.id}`);
    console.log(`   Description: ${baFolder.description || 'N/A'}`);
    console.log(`   Featured: ${baFolder.featured}`);
    console.log(`   Article Count: ${baFolder.articleCount || 0}\n`);

    // 2. Find all sub-folders (modules)
    const subFolders = folders
      .filter(f => f.parentId === baFolder.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    console.log(`📂 Found ${subFolders.length} sub-folder(s) (modules):\n`);

    if (subFolders.length > 0) {
      subFolders.forEach((module, idx) => {
        console.log(`  ${idx + 1}. ${module.name}`);
        console.log(`     ID: ${module.id}`);
        console.log(`     Slug: ${module.slug}`);
        console.log(`     Description: ${module.description || 'N/A'}`);
        console.log(`     Order: ${module.order}`);
        console.log(`     Article Count: ${module.articleCount || 0}\n`);
      });
    }

    // 3. Get all articles (both direct and in sub-folders)
    const articlesRef = adminDb.collection("articles");
    const allArticles = await articlesRef.get();

    const articles = allArticles.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ArticleData[];

    // Articles directly under BA folder
    const directArticles = articles
      .filter(a => a.folderId === baFolder.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    console.log(`\n📄 Articles directly under "${baFolder.name}": ${directArticles.length}\n`);

    if (directArticles.length > 0) {
      directArticles.forEach((article, idx) => {
        console.log(`  ${idx + 1}. ${article.title}`);
        console.log(`     ID: ${article.id}`);
        console.log(`     Slug: ${article.slug}`);
        console.log(`     Excerpt: ${article.excerpt?.substring(0, 100) || 'N/A'}...`);
        console.log(`     Tags: ${article.tags?.join(', ') || 'None'}`);
        console.log(`     Order: ${article.order}`);
        console.log(`     Status: ${article.status}\n`);
      });
    }

    // 4. Get articles for each sub-folder/module
    console.log("\n═══════════════════════════════════════════════════════");
    console.log("COMPLETE MASTERCLASS STRUCTURE");
    console.log("═══════════════════════════════════════════════════════\n");

    console.log(`\n🎓 ${baFolder.name.toUpperCase()}`);
    console.log(`   Description: ${baFolder.description || 'N/A'}\n`);

    for (const module of subFolders) {
      const moduleArticles = articles
        .filter(a => a.folderId === module.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      console.log(`\n  📂 Module ${module.order}: ${module.name}`);
      console.log(`     Description: ${module.description || 'N/A'}`);
      console.log(`     Articles: ${moduleArticles.length}\n`);

      if (moduleArticles.length > 0) {
        moduleArticles.forEach((article, idx) => {
          console.log(`     ${idx + 1}. ${article.title}`);
          console.log(`        Excerpt: ${article.excerpt?.substring(0, 150) || 'N/A'}...`);
          console.log(`        Tags: ${article.tags?.join(', ') || 'None'}`);
          console.log(`        Status: ${article.status}`);
          console.log(`        Order: ${article.order}\n`);
        });
      } else {
        console.log(`     (No articles in this module)\n`);
      }
    }

    // 5. Summary statistics
    const totalArticles = directArticles.length +
      subFolders.reduce((sum, module) => {
        return sum + articles.filter(a => a.folderId === module.id).length;
      }, 0);

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("SUMMARY STATISTICS");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log(`  Total Modules: ${subFolders.length}`);
    console.log(`  Total Articles: ${totalArticles}`);
    console.log(`  Direct Articles: ${directArticles.length}`);
    console.log(`  Articles in Modules: ${totalArticles - directArticles.length}`);
    console.log(`  Featured: ${baFolder.featured ? 'Yes' : 'No'}\n`);

  } catch (error) {
    console.error("❌ Error exporting masterclass:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}

exportBAMasterclass()
  .then(() => {
    console.log("\n✅ Export complete.");
    process.exit(0);
  })
  .catch(error => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
