/**
 * Verify Search Index Migration
 * Checks that search index uses 'description' instead of 'excerpt'
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';

async function verifySearchIndex() {
  console.log('🔍 VERIFYING SEARCH INDEX MIGRATION...\n');

  try {
    const searchRef = adminDb.collection('search_index');
    const snapshot = await searchRef.get();

    console.log(`📋 Search Index Collection:`);
    console.log(`   Total: ${snapshot.size}`);

    let withDescription = 0;
    let withExcerpt = 0;
    let withTags = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.description !== undefined) withDescription++;
      if (data.excerpt !== undefined) withExcerpt++;
      if (data.tags !== undefined) withTags++;
    });

    console.log(`   With 'description': ${withDescription} ${withDescription === snapshot.size ? '✅' : '❌'}`);
    console.log(`   With 'excerpt': ${withExcerpt} ${withExcerpt === 0 ? '✅' : '❌ (should be 0)'}`);
    console.log(`   With 'tags': ${withTags} ${withTags === 0 ? '✅' : '❌ (should be 0)'}`);

    // Sample verification
    console.log(`\n📋 Sample Search Index Verification (5 random docs):\n`);
    const samples = snapshot.docs.slice(0, 5);

    for (const doc of samples) {
      const data = doc.data();
      console.log(`   ${doc.id}:`);
      console.log(`      articleId: ${data.articleId || 'N/A'}`);
      console.log(`      description: ${data.description ? `"${data.description.substring(0, 50)}..." (${data.description.length} chars)` : '❌ MISSING'}`);
      console.log(`      excerpt: ${data.excerpt !== undefined ? '❌ STILL EXISTS' : '✅ removed'}`);
      console.log(`      tags: ${data.tags !== undefined ? '❌ STILL EXISTS' : '✅ removed'}`);
      console.log('');
    }

    if (withDescription === snapshot.size && withExcerpt === 0 && withTags === 0) {
      console.log('════════════════════════════════════════════════════════');
      console.log('✅ SEARCH INDEX VERIFICATION PASSED');
      console.log('════════════════════════════════════════════════════════');
      console.log('All search index documents migrated successfully:');
      console.log(`  - ${snapshot.size} documents have 'description' field`);
      console.log(`  - 0 documents have 'excerpt' field (removed)`);
      console.log(`  - 0 documents have 'tags' field (removed)`);
      console.log('════════════════════════════════════════════════════════');
      return true;
    } else {
      console.log('════════════════════════════════════════════════════════');
      console.log('❌ SEARCH INDEX VERIFICATION FAILED');
      console.log('════════════════════════════════════════════════════════');
      console.log('Please review and re-run search index migration');
      console.log('════════════════════════════════════════════════════════');
      return false;
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

verifySearchIndex()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  });
