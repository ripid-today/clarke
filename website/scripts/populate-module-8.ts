/**
 * Populate Module 8: Underlying Competencies & BA Mindset
 *
 * Reads the module-8 markdown content file, parses articles,
 * and creates them in Firebase with correct metadata.
 *
 * USAGE: npx tsx website/scripts/populate-module-8.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Article definitions ────────────────────────────────────────────────────

interface ArticleDef {
  id: string;           // Firestore doc ID
  title: string;        // Display title
  slug: string;         // Article slug
  folderId: string;     // Parent sub-module folder ID
  order: number;        // Position within folder
  description: string;  // ≤200 chars
  headerPattern: string; // Exact ### header to match in markdown
}

const ARTICLES: ArticleDef[] = [
  // Sub-module 8.1
  { id: '8-1-1-creative-thinking', title: '8.1.1 Creative Thinking', slug: 'creative-thinking', folderId: 'module-8-1', order: 1, description: 'Creative thinking generates new ideas, challenges assumptions, and discovers alternatives that make requirements work transformative rather than merely transactional.', headerPattern: '### 8.1.1 Creative Thinking' },
  { id: '8-1-2-systems-thinking', title: '8.1.2 Systems Thinking', slug: 'systems-thinking', folderId: 'module-8-1', order: 2, description: 'Systems thinking reveals how every change ripples through interconnected people, processes, and technology — preventing solutions that fix one component while breaking the whole.', headerPattern: '### 8.1.2 Systems Thinking' },
  { id: '8-1-3-conceptual-thinking', title: '8.1.3 Conceptual Thinking', slug: 'conceptual-thinking', folderId: 'module-8-1', order: 3, description: 'Conceptual thinking connects disparate information into coherent frameworks that stakeholders can understand, validate, and build on — converting data into shared meaning.', headerPattern: '### 8.1.3 Conceptual Thinking' },
  { id: '8-1-4-decision-making', title: '8.1.4 Decision Making', slug: 'decision-making', folderId: 'module-8-1', order: 4, description: 'Decision making structures the choices stakeholders must make — gathering relevant information, analyzing trade-offs, and documenting rationale — without usurping decision authority.', headerPattern: '### 8.1.4 Decision Making' },
  { id: '8-1-5-problem-solving-frameworks', title: '8.1.5 Problem Solving Frameworks', slug: 'problem-solving-frameworks', folderId: 'module-8-1', order: 5, description: 'Problem solving begins with rigorous definition of root causes and stakeholder objectives before any solution alternatives are generated or evaluated.', headerPattern: '### 8.1.5 Problem Solving Frameworks' },

  // Sub-module 8.2
  { id: '8-2-1-ethics-and-trustworthiness', title: '8.2.1 Ethics and Trustworthiness', slug: 'ethics-and-trustworthiness', folderId: 'module-8-2', order: 1, description: 'Ethics and trustworthiness form the relational foundation that makes honest stakeholder disclosure possible — without them, the BA cannot access the accurate information requirements depend on.', headerPattern: '### 8.2.1 Ethics and Trustworthiness' },
  { id: '8-2-2-personal-accountability', title: '8.2.2 Personal Accountability', slug: 'personal-accountability', folderId: 'module-8-2', order: 2, description: 'Personal accountability converts BA commitments into professional obligations — through planning, follow-through, risk escalation, and decision support.', headerPattern: '### 8.2.2 Personal Accountability' },
  { id: '8-2-3-adaptability-and-growth-mindset', title: '8.2.3 Adaptability and Growth Mindset', slug: 'adaptability-and-growth-mindset', folderId: 'module-8-2', order: 3, description: 'Adaptability is the courage and competence to change techniques, style, and approach in response to stakeholder needs, organizational changes, and unexpected circumstances.', headerPattern: '### 8.2.3 Adaptability and Growth Mindset' },
  { id: '8-2-4-organization-and-time-management', title: '8.2.4 Organization and Time Management', slug: 'organization-and-time-management', folderId: 'module-8-2', order: 4, description: 'Organization and time management determine whether the BA delivers the right work at the right time — with information structured for retrieval and effort focused on highest value.', headerPattern: '### 8.2.4 Organization and Time Management' },

  // Sub-module 8.3
  { id: '8-3-1-business-acumen', title: '8.3.1 Business Acumen', slug: 'business-acumen', folderId: 'module-8-3', order: 1, description: 'Business acumen is the ability to apply knowledge from comparable organizational situations to recognize opportunities, limitations, and risks in the current context.', headerPattern: '### 8.3.1 Business Acumen' },
  { id: '8-3-2-industry-and-domain-knowledge', title: '8.3.2 Industry and Domain Knowledge', slug: 'industry-and-domain-knowledge', folderId: 'module-8-3', order: 2, description: 'Industry knowledge positions the BA within the competitive and regulatory landscape — enabling questions that reveal an organization\'s external reality, not just its internal view.', headerPattern: '### 8.3.2 Industry and Domain Knowledge' },
  { id: '8-3-3-organizational-knowledge', title: '8.3.3 Organizational Knowledge', slug: 'organizational-knowledge', folderId: 'module-8-3', order: 3, description: 'Organizational knowledge encompasses formal structure, informal authority channels, and political dynamics — the real architecture through which decisions are made and change occurs.', headerPattern: '### 8.3.3 Organizational Knowledge' },
  { id: '8-3-4-methodology-knowledge', title: '8.3.4 Methodology Knowledge', slug: 'methodology-knowledge', folderId: 'module-8-3', order: 4, description: 'Methodology knowledge determines when BA activities occur, what artifacts are expected, and what role the BA plays — mismatching approach to methodology creates systematic friction.', headerPattern: '### 8.3.4 Methodology Knowledge' },

  // Sub-module 8.4
  { id: '8-4-1-active-listening', title: '8.4.1 Active Listening', slug: 'active-listening', folderId: 'module-8-4', order: 1, description: 'Active listening is the deliberate cognitive act of understanding meaning beyond words — the most consequential single skill for a BA whose knowledge base is built from stakeholder communication.', headerPattern: '### 8.4.1 Active Listening' },
  { id: '8-4-2-written-communication', title: '8.4.2 Written Communication', slug: 'written-communication', folderId: 'module-8-4', order: 2, description: 'Written communication determines whether BA analysis is understood and acted upon — calibrated to each audience\'s vocabulary, abstraction level, and format expectations.', headerPattern: '### 8.4.2 Written Communication' },
  { id: '8-4-3-verbal-communication', title: '8.4.3 Verbal Communication', slug: 'verbal-communication', folderId: 'module-8-4', order: 3, description: 'Verbal communication combines words, tone, and non-verbal signals into a real-time medium where requirements understanding is built, adjusted, and validated in every conversation.', headerPattern: '### 8.4.3 Verbal Communication' },
  { id: '8-4-4-visual-communication', title: '8.4.4 Visual Communication', slug: 'visual-communication', folderId: 'module-8-4', order: 4, description: 'Visual communication transforms complex system relationships and abstract requirements into forms stakeholders can perceive, discuss, and validate simultaneously.', headerPattern: '### 8.4.4 Visual Communication' },

  // Sub-module 8.5
  { id: '8-5-1-facilitation', title: '8.5.1 Facilitation', slug: 'facilitation', folderId: 'module-8-5', order: 1, description: 'Facilitation structures group interaction so all participants can articulate their views and move collectively toward decisions — the BA\'s neutrality is its essential precondition.', headerPattern: '### 8.5.1 Facilitation' },
  { id: '8-5-2-negotiation-and-conflict-resolution', title: '8.5.2 Negotiation and Conflict Resolution', slug: 'negotiation-and-conflict-resolution', folderId: 'module-8-5', order: 2, description: 'Negotiation resolves requirements conflicts by distinguishing stakeholder interests from stated positions — the interest level reveals solutions that position-level negotiation never finds.', headerPattern: '### 8.5.2 Negotiation and Conflict Resolution' },
  { id: '8-5-3-leadership-and-influencing', title: '8.5.3 Leadership and Influencing', slug: 'leadership-and-influencing', folderId: 'module-8-5', order: 3, description: 'BA leadership is influence-based, not positional — built through analytical excellence, stakeholder understanding, and consistent trustworthiness rather than formal organizational authority.', headerPattern: '### 8.5.3 Leadership and Influencing' },
  { id: '8-5-4-teaching-and-coaching', title: '8.5.4 Teaching and Coaching', slug: 'teaching-and-coaching', folderId: 'module-8-5', order: 4, description: 'Teaching leads stakeholders to clarity in ambiguity — requirements that only the BA understands are requirements that will fail during implementation.', headerPattern: '### 8.5.4 Teaching and Coaching' },

  // Sub-module 8.6
  { id: '8-6-1-ba-tools-landscape', title: '8.6.1 BA Tools Landscape', slug: 'ba-tools-landscape', folderId: 'module-8-6', order: 1, description: 'The BA tools landscape spans office productivity, specialized requirements tools, and collaboration technologies — competency means selecting the right category for each task.', headerPattern: '### 8.6.1 BA Tools Landscape' },
  { id: '8-6-2-requirements-management-tools', title: '8.6.2 Requirements Management Tools', slug: 'requirements-management-tools', folderId: 'module-8-6', order: 2, description: 'Requirements management tools provide workflow, traceability, baseline control, and impact analysis capabilities that office productivity tools cannot replicate at project scale.', headerPattern: '### 8.6.2 Requirements Management Tools' },
  { id: '8-6-3-collaboration-technologies', title: '8.6.3 Collaboration Technologies', slug: 'collaboration-technologies', folderId: 'module-8-6', order: 3, description: 'Collaboration technologies determine the reach of BA elicitation and validation — enabling productive engagement with distributed, asynchronous, and cross-functional stakeholder groups.', headerPattern: '### 8.6.3 Collaboration Technologies' },
];

// ── Article count per sub-module ───────────────────────────────────────────

const SUBMODULE_COUNTS: Record<string, number> = {
  'module-8-1': 5,
  'module-8-2': 4,
  'module-8-3': 4,
  'module-8-4': 4,
  'module-8-5': 4,
  'module-8-6': 3,
};

// ── Parse content file ─────────────────────────────────────────────────────

function parseContent(mdPath: string): Map<string, string> {
  const raw = fs.readFileSync(mdPath, 'utf-8');
  const map = new Map<string, string>();

  for (const article of ARTICLES) {
    const startIdx = raw.indexOf(article.headerPattern);
    if (startIdx === -1) {
      console.warn(`  ⚠️  Header not found: ${article.headerPattern}`);
      continue;
    }

    // Find next article header or end of file
    let endIdx = raw.length;
    for (const other of ARTICLES) {
      if (other.headerPattern === article.headerPattern) continue;
      const idx = raw.indexOf(other.headerPattern, startIdx + 1);
      if (idx !== -1 && idx < endIdx) endIdx = idx;
    }

    // Also stop at ## Key Takeaways (sub-module footer) — but include it in
    // the last article? No: exclude sub-module footers from individual articles.
    const keyTakeawaysIdx = raw.indexOf('\n## Key Takeaways', startIdx + 1);
    if (keyTakeawaysIdx !== -1 && keyTakeawaysIdx < endIdx) {
      endIdx = keyTakeawaysIdx;
    }

    const content = raw.slice(startIdx, endIdx).trimEnd();
    map.set(article.id, content);
  }

  return map;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Populating Module 8: Underlying Competencies & BA Mindset\n');

  const mdPath = resolve(__dirname, '../../library/content/module-8-underlying-competencies-and-ba-mindset.md');
  if (!fs.existsSync(mdPath)) {
    console.error('❌ Content file not found:', mdPath);
    process.exit(1);
  }

  const contentMap = parseContent(mdPath);
  console.log(`📄 Parsed ${contentMap.size} article sections from markdown\n`);

  const FOLDER_PATH = ['business-analysis-masterclass', 'module-8'];
  let totalCreated = 0;

  // Create articles in batches of 400
  let batch = adminDb.batch();
  let batchCount = 0;

  for (const article of ARTICLES) {
    const content = contentMap.get(article.id);
    if (!content) {
      console.error(`❌ No content for ${article.id}`);
      continue;
    }

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / 200);
    const subFolderPath = [...FOLDER_PATH, article.folderId];

    const ref = adminDb.collection('articles').doc(article.id);
    batch.set(ref, {
      title: article.title,
      slug: article.slug,
      folderId: article.folderId,
      folderPath: subFolderPath,
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

    console.log(`  ✓ Queued: ${article.id} (${wordCount} words, ${readingTime} min read)`);
    batchCount++;
    totalCreated++;

    if (batchCount >= 400) {
      await batch.commit();
      batch = adminDb.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) await batch.commit();
  console.log(`\n✅ Created ${totalCreated} articles\n`);

  // Update sub-module folder article counts
  console.log('📂 Updating sub-module folder article counts...');
  const folderBatch = adminDb.batch();
  for (const [folderId, count] of Object.entries(SUBMODULE_COUNTS)) {
    const ref = adminDb.collection('folders').doc(folderId);
    folderBatch.update(ref, {
      articleCount: count,
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ ${folderId}: ${count} articles`);
  }
  await folderBatch.commit();

  // Update Module 8 parent folder
  console.log('\n📁 Updating Module 8 parent folder...');
  await adminDb.collection('folders').doc('module-8').update({
    articleCount: totalCreated,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ module-8: ${totalCreated} total articles`);

  // Update masterclass total
  console.log('\n📚 Updating BA Masterclass total...');
  const masterRef = adminDb.collection('folders').doc('business-analysis-masterclass');
  const masterDoc = await masterRef.get();
  const currentCount = masterDoc.data()?.articleCount || 0;
  const newTotal = currentCount + totalCreated;
  await masterRef.update({
    articleCount: newTotal,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ Masterclass total: ${currentCount} → ${newTotal}`);

  console.log('\n🎉 Module 8 population complete!');
  console.log(`   Articles created: ${totalCreated}`);
  console.log(`   Sub-modules populated: ${Object.keys(SUBMODULE_COUNTS).length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
