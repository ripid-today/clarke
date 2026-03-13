/**
 * List all folders and articles in Firestore
 * USAGE: npx tsx website/scripts/list-all-content.ts
 */
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';

async function listAll() {
  // List all folders
  const foldersSnap = await adminDb.collection('folders').orderBy('order').get();
  console.log(`\n=== FOLDERS (${foldersSnap.size}) ===\n`);
  for (const doc of foldersSnap.docs) {
    const d = doc.data();
    console.log(`ID: ${doc.id} | Name: ${d.name} | Slug: ${d.slug} | ParentID: ${d.parentId || 'ROOT'} | Articles: ${d.articleCount || 0} | Featured: ${d.featured || false} | Order: ${d.order}`);
  }

  // List all articles
  const articlesSnap = await adminDb.collection('articles').orderBy('order').get();
  console.log(`\n=== ARTICLES (${articlesSnap.size}) ===\n`);
  for (const doc of articlesSnap.docs) {
    const d = doc.data();
    const hasContent = d.content && d.content.length > 50;
    console.log(`ID: ${doc.id} | Title: ${d.title} | FolderID: ${d.folderId} | Order: ${d.order} | Status: ${d.status} | HasContent: ${hasContent} | ContentLen: ${d.content?.length || 0}`);
  }

  // List search index
  const searchSnap = await adminDb.collection('search_index').get();
  console.log(`\n=== SEARCH INDEX (${searchSnap.size}) ===\n`);

  process.exit(0);
}

listAll().catch(e => { console.error(e); process.exit(1); });
