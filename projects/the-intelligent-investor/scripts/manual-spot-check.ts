/**
 * Manual Spot Check - Query 10 Random Articles
 * Final verification that all articles have description, no excerpt/tags
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';

async function spotCheck() {
  console.log('🔍 MANUAL SPOT CHECK - 10 Random Articles\n');

  try {
    const snapshot = await adminDb.collection('articles').get();

    // Get 10 random articles
    const allDocs = snapshot.docs;
    const randomDocs = [];
    const usedIndices = new Set();

    while (randomDocs.length < 10 && usedIndices.size < allDocs.length) {
      const randomIndex = Math.floor(Math.random() * allDocs.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        randomDocs.push(allDocs[randomIndex]);
      }
    }

    console.log('Checking 10 random articles:\n');

    let allPassed = true;

    for (let i = 0; i < randomDocs.length; i++) {
      const doc = randomDocs[i];
      const data = doc.data();

      const hasDescription = data.description !== undefined;
      const hasExcerpt = data.excerpt !== undefined;
      const hasTags = data.tags !== undefined;

      const passed = hasDescription && !hasExcerpt && !hasTags;

      console.log(`${i + 1}. ${data.title || doc.id}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   description: ${hasDescription ? `✅ (${data.description.length} chars)` : '❌ MISSING'}`);
      console.log(`   excerpt: ${hasExcerpt ? '❌ EXISTS' : '✅ removed'}`);
      console.log(`   tags: ${hasTags ? '❌ EXISTS' : '✅ removed'}`);
      console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log('');

      if (!passed) allPassed = false;
    }

    if (allPassed) {
      console.log('════════════════════════════════════════════════════════');
      console.log('✅ SPOT CHECK PASSED - All 10 random articles verified');
      console.log('════════════════════════════════════════════════════════');
    } else {
      console.log('════════════════════════════════════════════════════════');
      console.log('❌ SPOT CHECK FAILED - Some articles not migrated');
      console.log('════════════════════════════════════════════════════════');
    }

    return allPassed;

  } catch (error) {
    console.error('❌ Spot check failed:', error);
    return false;
  }
}

spotCheck()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
