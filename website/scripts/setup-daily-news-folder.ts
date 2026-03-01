import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

async function setup() {
  console.log("Setting up Daily News folder...");

  const existing = await db
    .collection("folders")
    .where("slug", "==", "daily-news")
    .limit(1)
    .get();

  if (!existing.empty) {
    console.log(`Folder already exists: ${existing.docs[0].id}`);
    console.log(`\nGitHub Actions secret to add:`);
    console.log(`DAILY_NEWS_FOLDER_ID=${existing.docs[0].id}`);
    return;
  }

  const folderRef = db.collection("folders").doc();
  await folderRef.set({
    id: folderRef.id,
    name: "Daily News",
    slug: "daily-news",
    parentId: null,
    description: "Daily investment-focused news briefing covering Vietnam and World economics.",
    path: [],
    order: 0,
    featured: false,
    articleCount: 0,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    metadata: {
      icon: "newspaper",
      color: "#C15F3C",
      status: "building",
    },
  });

  console.log(`Created Daily News folder: ${folderRef.id}`);
  console.log(`\nAdd these to GitHub Actions secrets and Vercel environment:`);
  console.log(`DAILY_NEWS_FOLDER_ID=${folderRef.id}`);
}

setup().catch(console.error);
