/**
 * Populate Module 12: ECBA Exam Preparation
 *
 * Creates/updates the module-12 folder, 3 sub-module folders, and all 16 articles
 * from the module-12-ecba-exam-preparation.md content file.
 *
 * USAGE: npx tsx website/scripts/populate-module-12.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Folder definitions ──────────────────────────────────────────────────────

const MODULE_FOLDER = {
  id: 'module-12',
  name: 'Module 12: ECBA Exam Preparation',
  slug: 'module-12',
  parentId: 'business-analysis-masterclass',
  description: 'Complete ECBA exam preparation: exam format, all 9 domain review guides with traps and key terms, and scenario-based practice questions across BACCM, technique selection, and competency domains.',
  path: ['business-analysis-masterclass', 'module-12'],
  order: 12,
  featured: false,
};

const SUBMODULE_FOLDERS = [
  {
    id: 'module-12-1',
    name: '12.1 Exam Format & Strategy',
    slug: 'module-12-1',
    parentId: 'module-12',
    description: 'Three articles on ECBA exam strategy — exam format and eligibility, the 9 exam domains mapped to BABOK V3, and a structured study strategy guide.',
    path: ['business-analysis-masterclass', 'module-12', 'module-12-1'],
    order: 1,
    articleCount: 3,
  },
  {
    id: 'module-12-2',
    name: '12.2 Domain Review Guides',
    slug: 'module-12-2',
    parentId: 'module-12',
    description: 'Nine domain review guides covering each ECBA exam domain — what is tested, common traps, key terms to define, and cross-references to modules where each domain is taught in depth.',
    path: ['business-analysis-masterclass', 'module-12', 'module-12-2'],
    order: 2,
    articleCount: 9,
  },
  {
    id: 'module-12-3',
    name: '12.3 Practice & Application',
    slug: 'module-12-3',
    parentId: 'module-12',
    description: 'Four practice and application articles — BACCM scenario questions, technique selection scenarios, competency and mindset scenarios, and a full technique-to-task cross-reference table.',
    path: ['business-analysis-masterclass', 'module-12', 'module-12-3'],
    order: 3,
    articleCount: 4,
  },
];

// ── Article definitions ─────────────────────────────────────────────────────

interface ArticleDef {
  id: string;
  title: string;
  slug: string;
  folderId: string;
  order: number;
  description: string;
  headerPattern: string;
}

const ARTICLES: ArticleDef[] = [
  // Sub-module 12.1: Exam Format & Strategy
  {
    id: '12-1-1-ecba-exam-format',
    title: '12.1.1 ECBA Exam Format',
    slug: 'ecba-exam-format',
    folderId: 'module-12-1',
    order: 1,
    description: 'ECBA exam structure: 85 questions, 2-hour time limit, online proctored format, ~65% passing score, eligibility requirements, and the application process for the IIBA entry-level certification.',
    headerPattern: '### 12.1.1 ECBA Exam Format',
  },
  {
    id: '12-1-2-the-9-exam-domains-mapped',
    title: '12.1.2 The 9 Exam Domains Mapped',
    slug: 'the-9-exam-domains-mapped',
    folderId: 'module-12-1',
    order: 2,
    description: 'The 9 ECBA exam domains mapped to BABOK V3 knowledge areas — domain names, percentage weights, primary BABOK sources, and the key tasks tested in each domain.',
    headerPattern: '### 12.1.2 The 9 Exam Domains Mapped',
  },
  {
    id: '12-1-3-study-strategy',
    title: '12.1.3 Study Strategy',
    slug: 'study-strategy',
    folderId: 'module-12-1',
    order: 3,
    description: 'A structured approach to ECBA study: reading sequence, how to use BABOK V3 effectively, leveraging the BA Masterclass modules, practice question strategy, and exam-day preparation.',
    headerPattern: '### 12.1.3 Study Strategy',
  },

  // Sub-module 12.2: Domain Review Guides
  {
    id: '12-2-1-understanding-business-analysis-20',
    title: '12.2.1 Understanding Business Analysis (20%)',
    slug: 'understanding-business-analysis-20',
    folderId: 'module-12-2',
    order: 1,
    description: 'Exam review for the Understanding BA domain (20%): the BACCM, the 6 core concepts, the BA role and responsibilities, BABOK structure — with exam traps and key terms.',
    headerPattern: '### 12.2.1 Understanding Business Analysis (20%)',
  },
  {
    id: '12-2-2-mindset-for-effective-ba-14',
    title: '12.2.2 Mindset for Effective BA (14%)',
    slug: 'mindset-for-effective-ba-14',
    folderId: 'module-12-2',
    order: 2,
    description: 'Exam review for the Mindset for Effective BA domain (14%): BABOK Underlying Competencies — analytical thinking, communication skills, business knowledge — with exam traps.',
    headerPattern: '### 12.2.2 Mindset for Effective BA (14%)',
  },
  {
    id: '12-2-3-implementing-ba-6',
    title: '12.2.3 Implementing BA (6%)',
    slug: 'implementing-ba-6',
    folderId: 'module-12-2',
    order: 3,
    description: 'Exam review for the Implementing BA domain (6%): BA Planning and Monitoring tasks — Plan BA Approach, Stakeholder Engagement, Governance, Information Management — with exam traps.',
    headerPattern: '### 12.2.3 Implementing BA (6%)',
  },
  {
    id: '12-2-4-change-10',
    title: '12.2.4 Change (10%)',
    slug: 'change-10',
    folderId: 'module-12-2',
    order: 4,
    description: 'Exam review for the Change domain (10%): Strategy Analysis tasks — Analyze Current State, Define Future State, Assess Risks, Define Change Strategy — with exam traps and key terms.',
    headerPattern: '### 12.2.4 Change (10%)',
  },
  {
    id: '12-2-5-need-10',
    title: '12.2.5 Need (10%)',
    slug: 'need-10',
    folderId: 'module-12-2',
    order: 5,
    description: 'Exam review for the Need domain (10%): needs assessment in Strategy Analysis and BA Planning — business need identification, gap analysis, and solution framing — with exam traps.',
    headerPattern: '### 12.2.5 Need (10%)',
  },
  {
    id: '12-2-6-solution-10',
    title: '12.2.6 Solution (10%)',
    slug: 'solution-10',
    folderId: 'module-12-2',
    order: 6,
    description: 'Exam review for the Solution domain (10%): RADD and Solution Evaluation tasks — solution requirements, design definition, and performance measurement — with exam traps.',
    headerPattern: '### 12.2.6 Solution (10%)',
  },
  {
    id: '12-2-7-stakeholder-10',
    title: '12.2.7 Stakeholder (10%)',
    slug: 'stakeholder-10',
    folderId: 'module-12-2',
    order: 7,
    description: 'Exam review for the Stakeholder domain (10%): Elicitation and Collaboration and RCLM tasks — stakeholder identification, engagement planning, and collaboration — with exam traps.',
    headerPattern: '### 12.2.7 Stakeholder (10%)',
  },
  {
    id: '12-2-8-value-10',
    title: '12.2.8 Value (10%)',
    slug: 'value-10',
    folderId: 'module-12-2',
    order: 8,
    description: 'Exam review for the Value domain (10%): Solution Evaluation tasks — measure performance, analyze measures, assess limitations, recommend actions — with exam traps and key terms.',
    headerPattern: '### 12.2.8 Value (10%)',
  },
  {
    id: '12-2-9-context-10',
    title: '12.2.9 Context (10%)',
    slug: 'context-10',
    folderId: 'module-12-2',
    order: 9,
    description: 'Exam review for the Context domain (10%): the context core concept from BABOK, enterprise environment, project and solution context, and how context shapes every BA decision.',
    headerPattern: '### 12.2.9 Context (10%)',
  },

  // Sub-module 12.3: Practice & Application
  {
    id: '12-3-1-baccm-scenario-practice',
    title: '12.3.1 BACCM Scenario Practice',
    slug: 'baccm-scenario-practice',
    folderId: 'module-12-3',
    order: 1,
    description: 'Eight scenario-based practice questions testing the BA Core Concept Model — each with four answer options, correct answer, explanation of all options, and BABOK V3 reference.',
    headerPattern: '### 12.3.1 BACCM Scenario Practice',
  },
  {
    id: '12-3-2-technique-selection-practice',
    title: '12.3.2 Technique Selection Practice',
    slug: 'technique-selection-practice',
    folderId: 'module-12-3',
    order: 2,
    description: 'Eight scenario-based practice questions on BA technique selection — when to use brainstorming, interviews, workshops, prototyping, process modeling, and use cases.',
    headerPattern: '### 12.3.2 Technique Selection Practice',
  },
  {
    id: '12-3-3-competency-and-mindset-practice',
    title: '12.3.3 Competency and Mindset Practice',
    slug: 'competency-and-mindset-practice',
    folderId: 'module-12-3',
    order: 3,
    description: 'Eight scenario-based practice questions on BABOK Underlying Competencies — analytical thinking, communication, behavioral characteristics, and business knowledge in action.',
    headerPattern: '### 12.3.3 Competency and Mindset Practice',
  },
  {
    id: '12-3-4-full-technique-to-task-cross-reference',
    title: '12.3.4 Full Technique-to-Task Cross-Reference',
    slug: 'full-technique-to-task-cross-reference',
    folderId: 'module-12-3',
    order: 4,
    description: 'A master table mapping all BABOK techniques to knowledge area tasks and ECBA exam domains, plus narrative guidance on the most commonly tested technique-to-task associations.',
    headerPattern: '### 12.3.4 Full Technique-to-Task Cross-Reference',
  },
];

// ── Parse content file ──────────────────────────────────────────────────────

function parseContent(mdPath: string): Map<string, string> {
  const raw = fs.readFileSync(mdPath, 'utf-8');
  const map = new Map<string, string>();

  for (const article of ARTICLES) {
    const startIdx = raw.indexOf(article.headerPattern);
    if (startIdx === -1) {
      console.warn(`  ⚠️  Header not found: ${article.headerPattern}`);
      continue;
    }

    let endIdx = raw.length;
    for (const other of ARTICLES) {
      if (other.headerPattern === article.headerPattern) continue;
      const idx = raw.indexOf(other.headerPattern, startIdx + 1);
      if (idx !== -1 && idx < endIdx) endIdx = idx;
    }

    const content = raw.slice(startIdx, endIdx).trimEnd();
    map.set(article.id, content);
  }

  return map;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Populating Module 12: ECBA Exam Preparation\n');

  const mdPath = resolve(__dirname, '../../library/content/module-12-ecba-exam-preparation.md');
  if (!fs.existsSync(mdPath)) {
    console.error('❌ Content file not found:', mdPath);
    process.exit(1);
  }

  const contentMap = parseContent(mdPath);
  console.log(`📄 Parsed ${contentMap.size} article sections from markdown\n`);

  if (contentMap.size !== ARTICLES.length) {
    console.warn(`  ⚠️  Expected ${ARTICLES.length} articles, parsed ${contentMap.size}`);
  }

  // ── Step 1: Create/update module-12 parent folder ─────────────────────────
  console.log('📁 Upserting module-12 folder...');
  await adminDb.collection('folders').doc(MODULE_FOLDER.id).set({
    name: MODULE_FOLDER.name,
    slug: MODULE_FOLDER.slug,
    parentId: MODULE_FOLDER.parentId,
    description: MODULE_FOLDER.description,
    path: MODULE_FOLDER.path,
    order: MODULE_FOLDER.order,
    featured: MODULE_FOLDER.featured,
    articleCount: 0,
    updatedAt: FieldValue.serverTimestamp(),
    metadata: { status: 'complete' },
  }, { merge: true });
  console.log('  ✓ module-12 folder upserted\n');

  // ── Step 2: Create/update 3 sub-module folders ────────────────────────────
  console.log('📂 Upserting sub-module folders...');
  for (const sm of SUBMODULE_FOLDERS) {
    await adminDb.collection('folders').doc(sm.id).set({
      name: sm.name,
      slug: sm.slug,
      parentId: sm.parentId,
      description: sm.description,
      path: sm.path,
      order: sm.order,
      featured: false,
      articleCount: sm.articleCount,
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' },
    }, { merge: true });
    console.log(`  ✓ ${sm.id} (${sm.articleCount} articles)`);
  }
  console.log();

  // ── Step 3: Create/update articles in batches ────────────────────────────
  console.log('📝 Writing articles...');
  const FOLDER_PATH_BASE = ['business-analysis-masterclass', 'module-12'];

  let batch = adminDb.batch();
  let batchCount = 0;
  let totalCreated = 0;
  let totalSkipped = 0;

  for (const article of ARTICLES) {
    const content = contentMap.get(article.id);
    if (!content) {
      console.error(`  ❌ No content for ${article.id} — skipping`);
      totalSkipped++;
      continue;
    }

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / 200);
    const folderPath = [...FOLDER_PATH_BASE, article.folderId];

    const ref = adminDb.collection('articles').doc(article.id);
    batch.set(ref, {
      title: article.title,
      slug: article.slug,
      folderId: article.folderId,
      folderPath,
      content,
      description: article.description,
      order: article.order,
      status: 'published',
      priority: 'medium',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: {
        wordCount,
        readingTime,
        lastModifiedBy: 'claude-agent',
        version: 1,
      },
    });

    console.log(`  ✓ ${article.id} (${wordCount} words, ${readingTime} min)`);
    batchCount++;
    totalCreated++;

    if (batchCount >= 400) {
      await batch.commit();
      batch = adminDb.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) await batch.commit();
  console.log(`\n✅ Wrote ${totalCreated} articles${totalSkipped > 0 ? ` (${totalSkipped} skipped)` : ''}\n`);

  // ── Step 4: Update module-12 article count ───────────────────────────────
  console.log('📁 Updating module-12 article count...');
  await adminDb.collection('folders').doc('module-12').update({
    articleCount: totalCreated,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ module-12: ${totalCreated} articles\n`);

  // ── Step 5: Update BA Masterclass total ──────────────────────────────────
  console.log('📚 Updating BA Masterclass total...');
  const masterRef = adminDb.collection('folders').doc('business-analysis-masterclass');
  const masterDoc = await masterRef.get();
  const currentCount = masterDoc.data()?.articleCount || 0;

  const allArticlesSnap = await adminDb.collection('articles').count().get();
  const newTotal = allArticlesSnap.data().count;

  await masterRef.update({
    articleCount: newTotal,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ Masterclass total: ${currentCount} → ${newTotal}\n`);

  console.log('🎉 Module 12 population complete!');
  console.log(`   Articles written:     ${totalCreated}`);
  console.log(`   Sub-modules:          ${SUBMODULE_FOLDERS.length}`);
  console.log(`   Masterclass total:    ${newTotal}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
