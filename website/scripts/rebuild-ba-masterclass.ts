/**
 * Rebuild BA Masterclass in Firebase
 *
 * Phases:
 *   1. Delete existing module folders + articles + search_index entries
 *   2. Create 12 Module folders
 *   3. Create 50 Sub-module folders
 *   4. Parse Module 1 content and create 24 articles + search_index entries
 *   5. Update articleCount on all affected folders
 *
 * USAGE: cd website && npx tsx scripts/rebuild-ba-masterclass.ts
 *
 * Pre-requisite: .env.local must contain FIREBASE_ADMIN_PROJECT_ID,
 * FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MASTERCLASS_ID = 'business-analysis-masterclass';
const MASTERCLASS_PATH = ['business', 'business-analysis-masterclass'];
const MODULE1_CONTENT_PATH = resolve(__dirname, '../../library/content/module-1-foundations-of-business-analysis.md');

// Batch write limit
const BATCH_LIMIT = 499;

// ---------------------------------------------------------------------------
// Outline — 12 modules with names and sub-module definitions
// ---------------------------------------------------------------------------

interface SubModuleDef {
  id: string;   // e.g. "module-1-1"
  num: string;  // e.g. "1.1"
  name: string;
}

interface ModuleDef {
  id: string;           // e.g. "module-1"
  num: number;          // e.g. 1
  name: string;
  subModules: SubModuleDef[];
}

const MODULES: ModuleDef[] = [
  {
    id: 'module-1', num: 1,
    name: 'Foundations of Business Analysis',
    subModules: [
      { id: 'module-1-1', num: '1.1', name: 'The BA Profession' },
      { id: 'module-1-2', num: '1.2', name: 'The Business Analysis Core Concept Model (BACCM)' },
      { id: 'module-1-3', num: '1.3', name: 'Business Analysis Principles' },
      { id: 'module-1-4', num: '1.4', name: 'Key Terms & Requirements Classification' },
      { id: 'module-1-5', num: '1.5', name: 'Stakeholders in Business Analysis' },
    ],
  },
  {
    id: 'module-2', num: 2,
    name: 'BA Planning & Monitoring',
    subModules: [
      { id: 'module-2-1', num: '2.1', name: 'Planning the BA Approach' },
      { id: 'module-2-2', num: '2.2', name: 'Planning Stakeholder Engagement' },
      { id: 'module-2-3', num: '2.3', name: 'Planning BA Governance' },
      { id: 'module-2-4', num: '2.4', name: 'Planning BA Information Management' },
      { id: 'module-2-5', num: '2.5', name: 'BA Performance Improvement' },
    ],
  },
  {
    id: 'module-3', num: 3,
    name: 'Elicitation & Collaboration',
    subModules: [
      { id: 'module-3-1', num: '3.1', name: 'Preparing for Elicitation' },
      { id: 'module-3-2', num: '3.2', name: 'Conducting Elicitation' },
      { id: 'module-3-3', num: '3.3', name: 'Confirming Elicitation Results' },
      { id: 'module-3-4', num: '3.4', name: 'Communicating BA Information' },
      { id: 'module-3-5', num: '3.5', name: 'Managing Stakeholder Collaboration' },
    ],
  },
  {
    id: 'module-4', num: 4,
    name: 'Requirements Life Cycle Management',
    subModules: [
      { id: 'module-4-1', num: '4.1', name: 'Tracing Requirements' },
      { id: 'module-4-2', num: '4.2', name: 'Maintaining Requirements' },
      { id: 'module-4-3', num: '4.3', name: 'Prioritizing Requirements' },
      { id: 'module-4-4', num: '4.4', name: 'Assessing Requirements Changes' },
      { id: 'module-4-5', num: '4.5', name: 'Approving Requirements' },
    ],
  },
  {
    id: 'module-5', num: 5,
    name: 'Strategy Analysis',
    subModules: [
      { id: 'module-5-1', num: '5.1', name: 'Analyzing Current State' },
      { id: 'module-5-2', num: '5.2', name: 'Defining Future State' },
      { id: 'module-5-3', num: '5.3', name: 'Assessing Risks' },
      { id: 'module-5-4', num: '5.4', name: 'Defining Change Strategy' },
    ],
  },
  {
    id: 'module-6', num: 6,
    name: 'Requirements Analysis & Design Definition',
    subModules: [
      { id: 'module-6-1', num: '6.1', name: 'Specifying and Modeling Requirements' },
      { id: 'module-6-2', num: '6.2', name: 'Verifying Requirements' },
      { id: 'module-6-3', num: '6.3', name: 'Validating Requirements' },
      { id: 'module-6-4', num: '6.4', name: 'Requirements Architecture' },
      { id: 'module-6-5', num: '6.5', name: 'Defining Design Options' },
      { id: 'module-6-6', num: '6.6', name: 'Analyzing Value & Recommending Solutions' },
    ],
  },
  {
    id: 'module-7', num: 7,
    name: 'Solution Evaluation',
    subModules: [
      { id: 'module-7-1', num: '7.1', name: 'Measuring Solution Performance' },
      { id: 'module-7-2', num: '7.2', name: 'Analyzing Performance' },
      { id: 'module-7-3', num: '7.3', name: 'Assessing Limitations' },
      { id: 'module-7-4', num: '7.4', name: 'Recommending Actions' },
    ],
  },
  {
    id: 'module-8', num: 8,
    name: 'Underlying Competencies & BA Mindset',
    subModules: [
      { id: 'module-8-1', num: '8.1', name: 'Analytical Thinking & Problem Solving' },
      { id: 'module-8-2', num: '8.2', name: 'Behavioral Characteristics' },
      { id: 'module-8-3', num: '8.3', name: 'Business Knowledge' },
      { id: 'module-8-4', num: '8.4', name: 'Communication Skills' },
      { id: 'module-8-5', num: '8.5', name: 'Interaction Skills' },
      { id: 'module-8-6', num: '8.6', name: 'Tools & Technology' },
    ],
  },
  {
    id: 'module-9', num: 9,
    name: 'BA Techniques Toolkit',
    subModules: [
      { id: 'module-9-1', num: '9.1', name: 'Elicitation Techniques' },
      { id: 'module-9-2', num: '9.2', name: 'Modeling & Analysis Techniques' },
      { id: 'module-9-3', num: '9.3', name: 'Strategy & Decision Techniques' },
      { id: 'module-9-4', num: '9.4', name: 'Planning & Management Techniques' },
      { id: 'module-9-5', num: '9.5', name: 'Communication & Documentation Techniques' },
      { id: 'module-9-6', num: '9.6', name: 'Technique Mastery' },
    ],
  },
  {
    id: 'module-10', num: 10,
    name: 'BA Perspectives',
    subModules: [
      { id: 'module-10-1', num: '10.1', name: 'The Agile Perspective' },
      { id: 'module-10-2', num: '10.2', name: 'The Business Intelligence Perspective' },
      { id: 'module-10-3', num: '10.3', name: 'The Information Technology Perspective' },
      { id: 'module-10-4', num: '10.4', name: 'The Business Architecture Perspective' },
      { id: 'module-10-5', num: '10.5', name: 'The Business Process Management Perspective' },
    ],
  },
  {
    id: 'module-11', num: 11,
    name: 'Applied BA Practices',
    subModules: [
      { id: 'module-11-1', num: '11.1', name: 'Requirements Engineering Essentials' },
      { id: 'module-11-2', num: '11.2', name: 'Agile Business Analysis in Depth' },
      { id: 'module-11-3', num: '11.3', name: 'Scrum Framework for Business Analysts' },
      { id: 'module-11-4', num: '11.4', name: 'PMI Requirements Practices' },
      { id: 'module-11-5', num: '11.5', name: 'Seven Steps to Mastering BA' },
      { id: 'module-11-6', num: '11.6', name: 'Agile Tools in Practice' },
    ],
  },
  {
    id: 'module-12', num: 12,
    name: 'ECBA Exam Preparation',
    subModules: [
      { id: 'module-12-1', num: '12.1', name: 'Exam Format & Strategy' },
      { id: 'module-12-2', num: '12.2', name: 'Domain Review Guides' },
      { id: 'module-12-3', num: '12.3', name: 'Practice & Application' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric (keep spaces/hyphens)
    .trim()
    .replace(/[\s-]+/g, '-');        // collapse spaces/hyphens
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

/** Commit a batch and return a new empty batch */
async function commitBatch(batch: FirebaseFirestore.WriteBatch, label: string): Promise<FirebaseFirestore.WriteBatch> {
  await batch.commit();
  console.log(`  ✓ Committed batch: ${label}`);
  return adminDb.batch();
}

// ---------------------------------------------------------------------------
// Phase 1: Delete existing module folders, articles, search_index entries
// ---------------------------------------------------------------------------

async function phase1DeleteExisting(): Promise<void> {
  console.log('\n=== Phase 1: Delete existing module content ===');

  // Find existing direct children of masterclass (the old module folders)
  const moduleSnap = await adminDb.collection('folders')
    .where('parentId', '==', MASTERCLASS_ID)
    .get();

  if (moduleSnap.empty) {
    console.log('  No existing module folders found — skipping deletion.');
    return;
  }

  const moduleIds = moduleSnap.docs.map(d => d.id);
  console.log(`  Found ${moduleIds.length} existing module folder(s): ${moduleIds.join(', ')}`);

  // Collect all article IDs across all old modules
  const articleIds: string[] = [];
  for (const moduleId of moduleIds) {
    const artSnap = await adminDb.collection('articles')
      .where('folderId', '==', moduleId)
      .get();
    artSnap.docs.forEach(d => articleIds.push(d.id));
  }
  console.log(`  Found ${articleIds.length} article(s) to delete.`);

  // Delete articles in batches
  let batch = adminDb.batch();
  let ops = 0;
  for (let i = 0; i < articleIds.length; i++) {
    batch.delete(adminDb.collection('articles').doc(articleIds[i]));
    ops++;
    if (ops >= BATCH_LIMIT) {
      batch = await commitBatch(batch, `delete articles ${i - ops + 2}–${i + 1}`);
      ops = 0;
    }
  }

  // Delete search_index entries for those articles
  for (let i = 0; i < articleIds.length; i++) {
    batch.delete(adminDb.collection('search_index').doc(articleIds[i]));
    ops++;
    if (ops >= BATCH_LIMIT) {
      batch = await commitBatch(batch, `delete search_index ${i - ops + 2}–${i + 1}`);
      ops = 0;
    }
  }

  // Delete the old module folders themselves
  for (const moduleId of moduleIds) {
    batch.delete(adminDb.collection('folders').doc(moduleId));
    ops++;
    if (ops >= BATCH_LIMIT) {
      batch = await commitBatch(batch, `delete module folders`);
      ops = 0;
    }
  }

  if (ops > 0) {
    await commitBatch(batch, 'delete remaining docs');
  }

  console.log(`  Deleted ${articleIds.length} articles, ${articleIds.length} search_index entries, ${moduleIds.length} module folders.`);
}

// ---------------------------------------------------------------------------
// Phase 2: Create 12 Module folders
// ---------------------------------------------------------------------------

async function phase2CreateModuleFolders(): Promise<void> {
  console.log('\n=== Phase 2: Create 12 Module folders ===');

  const now = Timestamp.now();
  let batch = adminDb.batch();
  let ops = 0;

  for (const mod of MODULES) {
    const docRef = adminDb.collection('folders').doc(mod.id);
    batch.set(docRef, {
      name: `Chapter ${mod.num}: ${mod.name}`,
      slug: mod.id,
      parentId: MASTERCLASS_ID,
      description: `Chapter ${mod.num} of the BA Masterclass: ${mod.name}`,
      path: [...MASTERCLASS_PATH, mod.id],
      order: mod.num,
      featured: false,
      articleCount: 0,
      createdAt: now,
      updatedAt: now,
      metadata: { status: 'building' },
    });
    ops++;
  }

  if (ops > 0) {
    await commitBatch(batch, `create ${MODULES.length} module folders`);
  }

  console.log(`  Created ${MODULES.length} module folders.`);
}

// ---------------------------------------------------------------------------
// Phase 3: Create sub-module folders
// ---------------------------------------------------------------------------

async function phase3CreateSubModuleFolders(): Promise<void> {
  console.log('\n=== Phase 3: Create sub-module folders ===');

  const now = Timestamp.now();
  let batch = adminDb.batch();
  let ops = 0;
  let total = 0;

  for (const mod of MODULES) {
    const modPath = [...MASTERCLASS_PATH, mod.id];

    for (const sm of mod.subModules) {
      const docRef = adminDb.collection('folders').doc(sm.id);
      // Parse sub-module number for ordering (e.g. "1.1" → 1)
      const smNum = parseFloat(sm.num.split('.')[1]);

      batch.set(docRef, {
        name: `Sub-chapter ${sm.num}: ${sm.name}`,
        slug: sm.id,
        parentId: mod.id,
        description: `Sub-chapter ${sm.num} of Chapter ${mod.num}: ${sm.name}`,
        path: [...modPath, sm.id],
        order: smNum,
        featured: false,
        articleCount: 0,
        createdAt: now,
        updatedAt: now,
        metadata: { status: 'building' },
      });
      ops++;
      total++;

      if (ops >= BATCH_LIMIT) {
        batch = await commitBatch(batch, `create sub-module folders (batch)`);
        ops = 0;
      }
    }
  }

  if (ops > 0) {
    await commitBatch(batch, `create remaining ${ops} sub-module folders`);
  }

  console.log(`  Created ${total} sub-module folders.`);
}

// ---------------------------------------------------------------------------
// Article parser
// ---------------------------------------------------------------------------

interface ParsedArticle {
  numStr: string;   // e.g. "1.1.1"
  title: string;    // e.g. "What is Business Analysis?"
  content: string;
  description: string;
  slug: string;     // e.g. "1-1-1-what-is-business-analysis"
  subModuleId: string; // e.g. "module-1-1"
  order: number;    // position within sub-module
}

function parseModule1Articles(): ParsedArticle[] {
  const raw = readFileSync(MODULE1_CONTENT_PATH, 'utf-8');
  const lines = raw.split('\n');

  const articles: ParsedArticle[] = [];

  // Detect article headings: ### N.N.N Title
  const headingRe = /^### (\d+\.\d+\.\d+)\s+(.+)$/;

  let currentNum = '';
  let currentTitle = '';
  let contentLines: string[] = [];
  let inArticle = false;

  function flushArticle() {
    if (!inArticle) return;

    const content = contentLines.join('\n').trim();

    // Extract description: first non-empty, non-horizontal-rule paragraph, max 200 chars
    let description = '';
    const paragraphs = content.split(/\n\n+/);
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (trimmed && trimmed !== '---' && !trimmed.startsWith('#')) {
        // Strip markdown bold/inline markers for plain description
        description = trimmed
          .replace(/\*\*(.+?)\*\*/g, '$1')
          .replace(/\*(.+?)\*/g, '$1')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (description.length > 200) {
          description = description.substring(0, 197) + '...';
        }
        break;
      }
    }

    // Build slug: "N.N.N Title" → "n-n-n-title-slug"
    const numParts = currentNum.split('.');  // ["1","1","1"]
    const numPrefix = numParts.join('-');    // "1-1-1"
    const titleSlug = titleToSlug(currentTitle);
    const slug = `${numPrefix}-${titleSlug}`;

    // Sub-module ID: "module-1-1" from first two number parts
    const subModuleId = `module-${numParts[0]}-${numParts[1]}`;

    // Order within sub-module (third number)
    const order = parseInt(numParts[2], 10);

    articles.push({
      numStr: currentNum,
      title: currentTitle,
      content,
      description,
      slug,
      subModuleId,
      order,
    });
  }

  for (const line of lines) {
    const match = line.match(headingRe);
    if (match) {
      flushArticle();
      currentNum = match[1];
      currentTitle = match[2].trim();
      contentLines = [];
      inArticle = true;
    } else if (inArticle) {
      // Stop collecting at a ## heading (sub-module separator)
      if (/^## /.test(line)) {
        flushArticle();
        inArticle = false;
        currentNum = '';
        currentTitle = '';
        contentLines = [];
      } else {
        contentLines.push(line);
      }
    }
  }
  // Flush last article
  flushArticle();

  return articles;
}

// ---------------------------------------------------------------------------
// Phase 4: Create Module 1 articles + search_index entries
// ---------------------------------------------------------------------------

async function phase4CreateModule1Articles(): Promise<Map<string, number>> {
  console.log('\n=== Phase 4: Create 24 Module 1 articles ===');

  const articles = parseModule1Articles();
  console.log(`  Parsed ${articles.length} articles from content file.`);

  const now = Timestamp.now();

  // articleCountPerSubModule: subModuleId → count
  const countPerSubModule = new Map<string, number>();

  let batch = adminDb.batch();
  let ops = 0;

  for (const art of articles) {
    const wc = countWords(art.content);
    const rt = readingTime(wc);

    const subModulePath = [
      'business',
      'business-analysis-masterclass',
      `module-${art.numStr.split('.')[0]}`,
      art.subModuleId,
    ];

    const articleData = {
      title: `${art.numStr} ${art.title}`,
      slug: art.slug,
      folderId: art.subModuleId,
      folderPath: subModulePath,
      content: art.content,
      description: art.description,
      order: art.order,
      status: 'published',
      priority: 'high',
      createdAt: now,
      updatedAt: now,
      metadata: {
        wordCount: wc,
        readingTime: rt,
        version: 1,
      },
    };

    const articleRef = adminDb.collection('articles').doc(art.slug);
    batch.set(articleRef, articleData);
    ops++;

    // search_index entry (all lowercase)
    const searchRef = adminDb.collection('search_index').doc(art.slug);
    batch.set(searchRef, {
      articleId: art.slug,
      title: articleData.title.toLowerCase(),
      description: art.description.toLowerCase(),
      folderPath: subModulePath,
    });
    ops++;

    if (ops >= BATCH_LIMIT) {
      batch = await commitBatch(batch, `create articles (batch)`);
      ops = 0;
    }

    // Track counts
    countPerSubModule.set(art.subModuleId, (countPerSubModule.get(art.subModuleId) ?? 0) + 1);
  }

  if (ops > 0) {
    await commitBatch(batch, `create remaining ${ops / 2} articles`);
  }

  console.log(`  Created ${articles.length} articles and ${articles.length} search_index entries.`);
  return countPerSubModule;
}

// ---------------------------------------------------------------------------
// Phase 5: Update articleCounts
// ---------------------------------------------------------------------------

async function phase5UpdateArticleCounts(countPerSubModule: Map<string, number>): Promise<void> {
  console.log('\n=== Phase 5: Update articleCount fields ===');

  const now = Timestamp.now();
  let batch = adminDb.batch();
  let ops = 0;

  // Sub-module folders
  for (const [smId, count] of Array.from(countPerSubModule.entries())) {
    batch.update(adminDb.collection('folders').doc(smId), {
      articleCount: count,
      updatedAt: now,
    });
    ops++;
  }

  // module-1 total
  const module1Total = Array.from(countPerSubModule.values()).reduce((a, b) => a + b, 0);
  batch.update(adminDb.collection('folders').doc('module-1'), {
    articleCount: module1Total,
    updatedAt: now,
  });
  ops++;

  // masterclass root
  batch.update(adminDb.collection('folders').doc(MASTERCLASS_ID), {
    articleCount: module1Total,
    updatedAt: now,
  });
  ops++;

  if (ops > 0) {
    await commitBatch(batch, `update ${ops} articleCount fields`);
  }

  console.log(`  Updated counts: module-1 = ${module1Total} articles`);
  for (const [smId, count] of Array.from(countPerSubModule.entries())) {
    console.log(`    ${smId}: ${count} articles`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║        Rebuild BA Masterclass — Firebase Script          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  try {
    await phase1DeleteExisting();
    await phase2CreateModuleFolders();
    await phase3CreateSubModuleFolders();
    const countPerSubModule = await phase4CreateModule1Articles();
    await phase5UpdateArticleCounts(countPerSubModule);

    console.log('\n✅ Rebuild complete!');
    console.log('\nVerification:');
    console.log('  npx tsx website/scripts/list-all-content.ts');
    console.log('\nExpected:');
    console.log('  Folders: 12 module folders + 50 sub-module folders (+ existing roots)');
    console.log('  Articles: 24 (Module 1 only; Modules 2–12 pending content)');
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
