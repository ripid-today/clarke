/**
 * Module 1 Content Update Script
 *
 * Reads BA-Masterclass-Module-1.md, splits into 9 article sections,
 * and updates each article in Firestore with real content.
 *
 * USAGE: tsx website/scripts/update-module1-content.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';

// Load environment variables before importing Firebase
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// Article ID mapping: section index (1-based) -> Firestore document ID
const articleIdMap: Record<number, string> = {
  1: 'ba-foundations-what-is-business-analysis',
  2: 'ba-foundations-the-business-analyst-role',
  3: 'ba-foundations-ba-competency-model-babok-v3',
  4: 'ba-foundations-ba-career-paths-and-specializations',
  5: 'ba-foundations-agile-vs-waterfall-ba-approaches',
  6: 'ba-foundations-business-writing-for-bas',
  7: 'ba-foundations-ba-toolkit-overview',
  8: 'ba-foundations-critical-thinking-for-business-analysts',
  9: 'ba-foundations-ethics-and-professional-standards',
};

function calculateWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

async function updateModule1Content() {
  console.log('Starting Module 1 content update...\n');

  // Read the source file
  const sourceFilePath = 'C:/Users/uyenl/Downloads/Books/BA-Masterclass-Module-1.md';
  console.log(`Reading source file: ${sourceFilePath}`);

  let fileContent: string;
  try {
    fileContent = fs.readFileSync(sourceFilePath, 'utf-8');
    console.log(`File read successfully (${fileContent.length} characters)\n`);
  } catch (err) {
    console.error('Failed to read source file:', err);
    process.exit(1);
  }

  // Split by "## Article" to extract sections
  // First element is the preamble (before Article 1) - skip it
  const rawSections = fileContent.split('## Article');
  const articleSections = rawSections.slice(1); // skip preamble

  console.log(`Found ${articleSections.length} article sections\n`);

  if (articleSections.length !== 9) {
    console.error(`Expected 9 article sections, got ${articleSections.length}`);
    process.exit(1);
  }

  let updatedCount = 0;

  for (let i = 0; i < articleSections.length; i++) {
    const sectionNumber = i + 1;
    const articleId = articleIdMap[sectionNumber];

    // Strip the first line (the "N: Title" header line that follows "## Article")
    const sectionText = articleSections[i];
    const firstNewline = sectionText.indexOf('\n');
    const content = firstNewline !== -1
      ? sectionText.slice(firstNewline + 1).trim()
      : sectionText.trim();

    const wordCount = calculateWordCount(content);
    const readingTime = calculateReadingTime(wordCount);

    console.log(`Updating Article ${sectionNumber}: ${articleId}`);
    console.log(`  Word count: ${wordCount}, Reading time: ${readingTime} min`);

    try {
      await adminDb.collection('articles').doc(articleId).update({
        content: content,
        status: 'published',
        updatedAt: FieldValue.serverTimestamp(),
        'metadata.wordCount': wordCount,
        'metadata.readingTime': readingTime,
        'metadata.lastModifiedBy': 'claude-agent',
      });

      console.log(`  Updated successfully\n`);
      updatedCount++;
    } catch (err) {
      console.error(`  Failed to update ${articleId}:`, err);
    }
  }

  console.log('---');
  console.log(`Module 1 content update complete.`);
  console.log(`Articles updated: ${updatedCount} / 9`);
}

updateModule1Content()
  .then(() => {
    console.log('\nScript completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
