/**
 * Populate Module 10: BA Perspectives
 *
 * Creates/updates the module-10 folder, 5 sub-module folders, and all 17 articles
 * from the module-10-ba-perspectives.md content file (source-verified rewrite).
 *
 * USAGE: npx tsx website/scripts/populate-module-10.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Folder definitions ──────────────────────────────────────────────────────

const MODULE_FOLDER = {
  id: 'module-10',
  name: 'Module 10: BA Perspectives',
  slug: 'module-10',
  parentId: 'business-analysis-masterclass',
  description: 'How business analysis adapts across five distinct initiative contexts: Agile, Business Intelligence, Information Technology, Business Architecture, and BPM.',
  path: ['business-analysis-masterclass', 'module-10'],
  order: 10,
  featured: false,
};

const SUBMODULE_FOLDERS = [
  {
    id: 'module-10-1',
    name: '10.1 The Agile Perspective',
    slug: 'module-10-1',
    parentId: 'module-10',
    description: 'Five articles on business analysis in agile contexts: values, BA role, planning, elicitation, and requirements management — all grounded in BABOK V3 §11.1.',
    path: ['business-analysis-masterclass', 'module-10', 'module-10-1'],
    order: 1,
    articleCount: 5,
  },
  {
    id: 'module-10-2',
    name: '10.2 The Business Intelligence Perspective',
    slug: 'module-10-2',
    parentId: 'module-10',
    description: 'Three articles on BA in BI contexts: the BI focus on data-to-insight transformation, descriptive/predictive/prescriptive analytics, and BI stakeholder roles.',
    path: ['business-analysis-masterclass', 'module-10', 'module-10-2'],
    order: 2,
    articleCount: 3,
  },
  {
    id: 'module-10-3',
    name: '10.3 The Information Technology Perspective',
    slug: 'module-10-3',
    parentId: 'module-10',
    description: 'Three articles on BA in IT contexts: the translator role, the five change triggers, BA deliverables, and the seven IT BA role types.',
    path: ['business-analysis-masterclass', 'module-10', 'module-10-3'],
    order: 3,
    articleCount: 3,
  },
  {
    id: 'module-10-4',
    name: '10.4 The Business Architecture Perspective',
    slug: 'module-10-4',
    parentId: 'module-10',
    description: 'Three articles on BA in business architecture: four architectural principles, reference models and techniques, and the ten competencies required of architecture BAs.',
    path: ['business-analysis-masterclass', 'module-10', 'module-10-4'],
    order: 4,
    articleCount: 3,
  },
  {
    id: 'module-10-5',
    name: '10.5 The Business Process Management Perspective',
    slug: 'module-10-5',
    parentId: 'module-10',
    description: 'Three articles on BA in BPM contexts: BPM lifecycle phases, the 15 BPM drivers, four improvement approaches, BA outcomes, and the three BPM BA roles.',
    path: ['business-analysis-masterclass', 'module-10', 'module-10-5'],
    order: 5,
    articleCount: 3,
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
  // Sub-module 10.1: The Agile Perspective
  {
    id: '10-1-1-agile-values-and-principles-for-ba',
    title: '10.1.1 Agile Values and Principles for BA',
    slug: 'agile-values-and-principles-for-ba',
    folderId: 'module-10-1',
    order: 1,
    description: 'Agile mindset, last responsible moment delivery, and the four guiding questions that keep agile BA work focused on value rather than documentation.',
    headerPattern: '### 10.1.1 Agile Values and Principles for BA',
  },
  {
    id: '10-1-2-the-ba-role-in-agile-teams',
    title: '10.1.2 The BA Role in Agile Teams',
    slug: 'the-ba-role-in-agile-teams',
    folderId: 'module-10-1',
    order: 2,
    description: 'How BA activities are distributed across agile teams, the T-shaped skills model, the Product Owner partnership, and the BA outcomes that agile work produces.',
    headerPattern: '### 10.1.2 The BA Role in Agile Teams',
  },
  {
    id: '10-1-3-agile-planning-and-backlog-management',
    title: '10.1.3 Agile Planning and Backlog Management',
    slug: 'agile-planning-and-backlog-management',
    folderId: 'module-10-1',
    order: 3,
    description: 'How agile BA planning adapts iteration-by-iteration, the just-in-time refinement principle, and the emergent product backlog as the authoritative scope register.',
    headerPattern: '### 10.1.3 Agile Planning and Backlog Management',
  },
  {
    id: '10-1-4-elicitation-and-elaboration-in-agile',
    title: '10.1.4 Elicitation and Elaboration in Agile',
    slug: 'elicitation-and-elaboration-in-agile',
    folderId: 'module-10-1',
    order: 4,
    description: 'Progressive elicitation and elaboration throughout agile initiatives, the observation-and-trial-and-error epistemology, and acceptance criteria as the primary elicitation output.',
    headerPattern: '### 10.1.4 Elicitation and Elaboration in Agile',
  },
  {
    id: '10-1-5-requirements-management-in-agile',
    title: '10.1.5 Requirements Management in Agile',
    slug: 'requirements-management-in-agile',
    folderId: 'module-10-1',
    order: 5,
    description: 'User stories as conversation placeholders, continuous scope evolution through the backlog, strategy analysis across iterations, and just-in-time requirements elaboration.',
    headerPattern: '### 10.1.5 Requirements Management in Agile',
  },

  // Sub-module 10.2: The Business Intelligence Perspective
  {
    id: '10-2-1-introduction-to-the-business-intelligence-perspective',
    title: '10.2.1 Introduction to the Business Intelligence Perspective',
    slug: 'introduction-to-the-business-intelligence-perspective',
    folderId: 'module-10-2',
    order: 1,
    description: "BI's focus on transforming data into value-added information, the single point of truth objective, and supply-driven vs. demand-driven BI approaches.",
    headerPattern: '### 10.2.1 Introduction to the Business Intelligence Perspective',
  },
  {
    id: '10-2-2-ba-tasks-in-business-intelligence-projects',
    title: '10.2.2 BA Tasks in Business Intelligence Projects',
    slug: 'ba-tasks-in-business-intelligence-projects',
    folderId: 'module-10-2',
    order: 2,
    description: 'Six BA outcome categories in BI work and the three analytics types — descriptive, predictive, and prescriptive — with verbatim BABOK V3 definitions.',
    headerPattern: '### 10.2.2 BA Tasks in Business Intelligence Projects',
  },
  {
    id: '10-2-3-stakeholder-roles-in-business-intelligence-projects',
    title: '10.2.3 Stakeholder Roles in Business Intelligence Projects',
    slug: 'stakeholder-roles-in-business-intelligence-projects',
    folderId: 'module-10-2',
    order: 3,
    description: 'The four BA roles in BI initiatives and the domain-specific competencies that distinguish BI BAs from general-purpose business analysts.',
    headerPattern: '### 10.2.3 Stakeholder Roles in Business Intelligence Projects',
  },

  // Sub-module 10.3: The Information Technology Perspective
  {
    id: '10-3-1-introduction-to-the-it-perspective',
    title: '10.3.1 Introduction to the IT Perspective',
    slug: 'introduction-to-the-it-perspective',
    folderId: 'module-10-3',
    order: 1,
    description: 'The IT BA as translator between business and technology stakeholders, the design vs. requirements distinction, and the three factors shaping IT BA scope.',
    headerPattern: '### 10.3.1 Introduction to the IT Perspective',
  },
  {
    id: '10-3-2-ba-tasks-in-it-projects',
    title: '10.3.2 BA Tasks in IT Projects',
    slug: 'ba-tasks-in-it-projects',
    folderId: 'module-10-3',
    order: 2,
    description: 'The five IT change triggers and the complete list of IT BA deliverables including requirements, gap analysis, use cases, prototypes, process models, and data models.',
    headerPattern: '### 10.3.2 BA Tasks in IT Projects',
  },
  {
    id: '10-3-3-stakeholder-roles-in-it-projects',
    title: '10.3.3 Stakeholder Roles in IT Projects',
    slug: 'stakeholder-roles-in-it-projects',
    folderId: 'module-10-3',
    order: 3,
    description: 'Seven IT BA role types from business analyst to COTS representative, and the solution impact factors that determine depth of analysis required.',
    headerPattern: '### 10.3.3 Stakeholder Roles in IT Projects',
  },

  // Sub-module 10.4: The Business Architecture Perspective
  {
    id: '10-4-1-introduction-to-business-architecture',
    title: '10.4.1 Introduction to Business Architecture',
    slug: 'introduction-to-business-architecture',
    folderId: 'module-10-4',
    order: 1,
    description: 'Business architecture as enterprise modelling, the four architectural principles (scope, separation of concerns, scenario driven, knowledge based), and architectural value.',
    headerPattern: '### 10.4.1 Introduction to Business Architecture',
  },
  {
    id: '10-4-2-ba-tasks-in-business-architecture',
    title: '10.4.2 BA Tasks in Business Architecture',
    slug: 'ba-tasks-in-business-architecture',
    folderId: 'module-10-4',
    order: 2,
    description: 'Architecture model elements, nine industry reference models (ACORD to Zachman), and eleven business architecture techniques including capability maps and value mapping.',
    headerPattern: '### 10.4.2 BA Tasks in Business Architecture',
  },
  {
    id: '10-4-3-stakeholder-roles-in-business-architecture',
    title: '10.4.3 Stakeholder Roles in Business Architecture',
    slug: 'stakeholder-roles-in-business-architecture',
    folderId: 'module-10-4',
    order: 3,
    description: 'The ten competencies required of business architecture BAs including tolerance for ambiguity, long time-frame thinking, executive interaction, and political acumen.',
    headerPattern: '### 10.4.3 Stakeholder Roles in Business Architecture',
  },

  // Sub-module 10.5: The Business Process Management Perspective
  {
    id: '10-5-1-introduction-to-business-process-management',
    title: '10.5.1 Introduction to Business Process Management',
    slug: 'introduction-to-business-process-management',
    folderId: 'module-10-5',
    order: 1,
    description: 'BPM as management discipline, the four BPM lifecycle phases (designing, modelling, execution and monitoring, optimizing), and BPM as continuous improvement.',
    headerPattern: '### 10.5.1 Introduction to Business Process Management',
  },
  {
    id: '10-5-2-ba-tasks-in-business-process-management-projects',
    title: '10.5.2 BA Tasks in Business Process Management Projects',
    slug: 'ba-tasks-in-business-process-management-projects',
    folderId: 'module-10-5',
    order: 2,
    description: 'The 15 BPM drivers, four process improvement approaches (top-down, bottom-up, people-centric, IT-centric), and five BA outcome categories in BPM work.',
    headerPattern: '### 10.5.2 BA Tasks in Business Process Management Projects',
  },
  {
    id: '10-5-3-stakeholder-roles-in-business-process-management-projects',
    title: '10.5.3 Stakeholder Roles in Business Process Management Projects',
    slug: 'stakeholder-roles-in-business-process-management-projects',
    folderId: 'module-10-5',
    order: 3,
    description: 'Three BPM BA roles (Process Architect, Analyst/Designer, Modeller), change targets including process owner and participants, and the BPM BA competency.',
    headerPattern: '### 10.5.3 Stakeholder Roles in Business Process Management Projects',
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
  console.log('🚀 Populating Module 10: BA Perspectives\n');

  const mdPath = resolve(__dirname, '../../library/content/module-10-ba-perspectives.md');
  if (!fs.existsSync(mdPath)) {
    console.error('❌ Content file not found:', mdPath);
    process.exit(1);
  }

  const contentMap = parseContent(mdPath);
  console.log(`📄 Parsed ${contentMap.size} article sections from markdown\n`);

  if (contentMap.size !== ARTICLES.length) {
    console.warn(`  ⚠️  Expected ${ARTICLES.length} articles, parsed ${contentMap.size}`);
  }

  // ── Step 1: Create/update module-10 parent folder ─────────────────────────
  console.log('📁 Upserting module-10 folder...');
  const moduleRef = adminDb.collection('folders').doc(MODULE_FOLDER.id);
  await moduleRef.set({
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
  console.log('  ✓ module-10 folder upserted\n');

  // ── Step 2: Create/update 5 sub-module folders ───────────────────────────
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
  const FOLDER_PATH_BASE = ['business-analysis-masterclass', 'module-10'];

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

  // ── Step 4: Update module-10 article count ───────────────────────────────
  console.log('📁 Updating module-10 article count...');
  await adminDb.collection('folders').doc('module-10').update({
    articleCount: totalCreated,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ module-10: ${totalCreated} articles\n`);

  // ── Step 5: Update BA Masterclass total ──────────────────────────────────
  console.log('📚 Updating BA Masterclass total...');
  const masterRef = adminDb.collection('folders').doc('business-analysis-masterclass');
  const masterDoc = await masterRef.get();
  const currentCount = masterDoc.data()?.articleCount || 0;

  // Subtract old module-10 count (if any) and add new count
  // Get actual count from old module-10 articles to avoid double-counting
  const oldArticlesSnap = await adminDb.collection('articles')
    .where('folderId', 'in', ['module-10-1', 'module-10-2', 'module-10-3', 'module-10-4', 'module-10-5'])
    .count()
    .get();
  const oldCount = oldArticlesSnap.data().count;
  // oldCount now includes the newly written articles, so net change = totalCreated - oldCount + totalCreated...
  // Simpler: just set masterclass articleCount correctly
  // Count all articles across all modules
  const allArticlesSnap = await adminDb.collection('articles').count().get();
  const newTotal = allArticlesSnap.data().count;

  await masterRef.update({
    articleCount: newTotal,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ Masterclass total: ${currentCount} → ${newTotal}\n`);

  console.log('🎉 Module 10 population complete!');
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
