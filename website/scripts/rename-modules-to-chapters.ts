/**
 * Rename Module → Chapter in BA Masterclass Firestore folders
 *
 * What it does:
 *   1. Fetch ALL folders from Firestore
 *   2. Identify 12 chapter folders (parentId === 'business-analysis-masterclass')
 *   3. Identify sub-chapter folders (parentId is one of the 12 chapter folder IDs)
 *   4. Update names and descriptions: "Module N" → "Chapter N", "Sub-module N.N" → "Sub-chapter N.N"
 *
 * USAGE: cd website && npx tsx scripts/rename-modules-to-chapters.ts
 *
 * Pre-requisite: .env.local must contain FIREBASE_ADMIN_PROJECT_ID,
 * FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { Timestamp } from 'firebase-admin/firestore';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MASTERCLASS_ID = 'business-analysis-masterclass';
const BATCH_LIMIT = 499;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║     Rename Modules → Chapters in BA Masterclass          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  try {
    // Fetch ALL folders (no filter — filter in memory)
    console.log('\nFetching all folders from Firestore...');
    const allFoldersSnap = await adminDb.collection('folders').get();
    const allFolders = allFoldersSnap.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { parentId?: string; name?: string; description?: string }),
    }));
    console.log(`  Found ${allFolders.length} total folders.`);

    // Identify 12 chapter folders: direct children of masterclass
    const chapterFolders = allFolders.filter(f => f.parentId === MASTERCLASS_ID);
    const chapterFolderIds = new Set(chapterFolders.map(f => f.id));
    console.log(`  Identified ${chapterFolders.length} chapter folder(s).`);

    // Identify sub-chapter folders: children of any chapter folder
    const subChapterFolders = allFolders.filter(
      f => f.parentId !== undefined && chapterFolderIds.has(f.parentId)
    );
    console.log(`  Identified ${subChapterFolders.length} sub-chapter folder(s).`);

    if (chapterFolders.length === 0 && subChapterFolders.length === 0) {
      console.log('\nNo folders to update. Exiting.');
      process.exit(0);
    }

    const now = Timestamp.now();
    let batch = adminDb.batch();
    let ops = 0;
    let chapterUpdated = 0;
    let subChapterUpdated = 0;

    // Helper: commit batch when limit is reached, return new batch
    async function flushIfNeeded(label: string): Promise<void> {
      if (ops >= BATCH_LIMIT) {
        await batch.commit();
        console.log(`  ✓ Committed batch: ${label}`);
        batch = adminDb.batch();
        ops = 0;
      }
    }

    // Update chapter folders: "Module N" → "Chapter N"
    console.log('\nUpdating chapter folders...');
    for (const folder of chapterFolders) {
      const updatedName = (folder.name ?? '').replace('Module ', 'Chapter ');
      const updatedDescription = (folder.description ?? '').replace('Module ', 'Chapter ');

      batch.update(adminDb.collection('folders').doc(folder.id), {
        name: updatedName,
        description: updatedDescription,
        updatedAt: now,
      });
      ops++;
      chapterUpdated++;

      await flushIfNeeded(`chapter folders up to ${folder.id}`);
    }

    // Update sub-chapter folders: "Sub-module N.N" → "Sub-chapter N.N", "of Module N" → "of Chapter N"
    console.log('Updating sub-chapter folders...');
    for (const folder of subChapterFolders) {
      const updatedName = (folder.name ?? '').replace('Sub-module ', 'Sub-chapter ');
      const updatedDescription = (folder.description ?? '')
        .replace('Sub-module ', 'Sub-chapter ')
        .replace('of Module ', 'of Chapter ');

      batch.update(adminDb.collection('folders').doc(folder.id), {
        name: updatedName,
        description: updatedDescription,
        updatedAt: now,
      });
      ops++;
      subChapterUpdated++;

      await flushIfNeeded(`sub-chapter folders up to ${folder.id}`);
    }

    // Commit any remaining ops
    if (ops > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch (${ops} ops).`);
    }

    console.log('\n✅ Rename complete!');
    console.log(`  Chapter folders updated:     ${chapterUpdated}`);
    console.log(`  Sub-chapter folders updated: ${subChapterUpdated}`);
  } catch (err) {
    console.error('\n❌ Script failed:', err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }

  process.exit(0);
}

main();
