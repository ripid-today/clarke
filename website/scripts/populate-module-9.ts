/**
 * Populate Module 9: BA Techniques Toolkit
 *
 * Creates the module-9 folder, 6 sub-module folders, and all 51 articles
 * from the module-9-ba-techniques-toolkit.md content file.
 *
 * USAGE: npx tsx website/scripts/populate-module-9.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Folder definitions ──────────────────────────────────────────────────────

const MODULE_FOLDER = {
  id: 'module-9',
  name: 'Module 9: BA Techniques Toolkit',
  slug: 'module-9',
  parentId: 'business-analysis-masterclass',
  description: 'Complete BABOK V3 techniques library — 51 articles covering all 50 techniques across elicitation, modeling, strategy, planning, communication, and technique mastery.',
  path: ['business-analysis-masterclass', 'module-9'],
  order: 9,
  featured: false,
};

const SUBMODULE_FOLDERS = [
  {
    id: 'module-9-1',
    name: '9.1 Elicitation Techniques',
    slug: 'module-9-1',
    parentId: 'module-9',
    description: 'Ten core elicitation techniques: Interviews, Workshops, Focus Groups, Observation, Surveys, Document Analysis, Brainstorming, Collaborative Games, Prototyping, Interface Analysis.',
    path: ['business-analysis-masterclass', 'module-9', 'module-9-1'],
    order: 1,
    articleCount: 10,
  },
  {
    id: 'module-9-2',
    name: '9.2 Modeling & Analysis Techniques',
    slug: 'module-9-2',
    parentId: 'module-9',
    description: 'Seventeen modeling and analysis techniques covering process, data, concept, scope, state, sequence, organizational models, use cases, user stories, rules, decisions, and NFRs.',
    path: ['business-analysis-masterclass', 'module-9', 'module-9-2'],
    order: 2,
    articleCount: 17,
  },
  {
    id: 'module-9-3',
    name: '9.3 Strategy & Decision Techniques',
    slug: 'module-9-3',
    parentId: 'module-9',
    description: 'Twelve strategy and decision techniques: Decision Analysis, SWOT, Root Cause, Risk, Financial Analysis, Business Cases, Business Model Canvas, Capability Analysis, Balanced Scorecard, and more.',
    path: ['business-analysis-masterclass', 'module-9', 'module-9-3'],
    order: 3,
    articleCount: 12,
  },
  {
    id: 'module-9-4',
    name: '9.4 Planning & Management Techniques',
    slug: 'module-9-4',
    parentId: 'module-9',
    description: 'Seven planning and management techniques: Backlog Management, Prioritization, Item Tracking, Metrics and KPIs, Reviews, Lessons Learned, and Acceptance and Evaluation Criteria.',
    path: ['business-analysis-masterclass', 'module-9', 'module-9-4'],
    order: 4,
    articleCount: 7,
  },
  {
    id: 'module-9-5',
    name: '9.5 Communication & Documentation Techniques',
    slug: 'module-9-5',
    parentId: 'module-9',
    description: 'Four communication and documentation techniques: Stakeholder List, Map, and Personas; Roles and Permissions Matrix; Mind Mapping; Glossary.',
    path: ['business-analysis-masterclass', 'module-9', 'module-9-5'],
    order: 5,
    articleCount: 4,
  },
  {
    id: 'module-9-6',
    name: '9.6 Technique Mastery',
    slug: 'module-9-6',
    parentId: 'module-9',
    description: 'Technique-to-Task Mapping: the BABOK V3 Appendix B cross-reference of all 50 techniques to the specific BA tasks they support across all six knowledge areas.',
    path: ['business-analysis-masterclass', 'module-9', 'module-9-6'],
    order: 6,
    articleCount: 1,
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
  // Sub-module 9.1: Elicitation Techniques
  { id: '9-1-1-interviews', title: '9.1.1 Interviews', slug: 'interviews', folderId: 'module-9-1', order: 1, description: 'Structured stakeholder conversations that gather requirements through direct exchange, building both knowledge and trust across the initiative lifecycle.', headerPattern: '### 9.1.1 Interviews' },
  { id: '9-1-2-workshops', title: '9.1.2 Workshops', slug: 'workshops', folderId: 'module-9-1', order: 2, description: 'Structured collaborative sessions that bring multiple stakeholders together simultaneously to elicit requirements, resolve conflicts, and build shared understanding.', headerPattern: '### 9.1.2 Workshops' },
  { id: '9-1-3-focus-groups', title: '9.1.3 Focus Groups', slug: 'focus-groups', folderId: 'module-9-1', order: 3, description: 'Moderated discussions with pre-qualified stakeholders that reveal group attitudes, expectations, and preferences that individual interviews cannot surface.', headerPattern: '### 9.1.3 Focus Groups' },
  { id: '9-1-4-observation', title: '9.1.4 Observation', slug: 'observation', folderId: 'module-9-1', order: 4, description: 'Direct observation of work being performed reveals actual practices that differ from documented procedures — the gap that process documentation cannot expose.', headerPattern: '### 9.1.4 Observation' },
  { id: '9-1-5-surveys-and-questionnaires', title: '9.1.5 Surveys and Questionnaires', slug: 'surveys-and-questionnaires', folderId: 'module-9-1', order: 5, description: 'Written question sets that reach large, geographically dispersed populations efficiently, providing both quantitative breadth and comparative consistency.', headerPattern: '### 9.1.5 Surveys and Questionnaires' },
  { id: '9-1-6-document-analysis', title: '9.1.6 Document Analysis', slug: 'document-analysis', folderId: 'module-9-1', order: 6, description: 'Systematic review of existing business and technical documentation to extract requirements and understand current-state context before elicitation begins.', headerPattern: '### 9.1.6 Document Analysis' },
  { id: '9-1-7-brainstorming', title: '9.1.7 Brainstorming', slug: 'brainstorming', folderId: 'module-9-1', order: 7, description: 'Rapid idea generation that produces the full option space by suspending evaluation during generation to prevent premature convergence on the first plausible solution.', headerPattern: '### 9.1.7 Brainstorming' },
  { id: '9-1-8-collaborative-games', title: '9.1.8 Collaborative Games', slug: 'collaborative-games', folderId: 'module-9-1', order: 8, description: 'Structured activities that surface hidden assumptions and build shared understanding in ways that traditional meetings and interviews cannot achieve.', headerPattern: '### 9.1.8 Collaborative Games' },
  { id: '9-1-9-prototyping', title: '9.1.9 Prototyping', slug: 'prototyping', folderId: 'module-9-1', order: 9, description: 'Iterative creation of partial or preliminary solution versions to elicit requirements from stakeholders who cannot articulate needs in abstract terms.', headerPattern: '### 9.1.9 Prototyping' },
  { id: '9-1-10-interface-analysis', title: '9.1.10 Interface Analysis', slug: 'interface-analysis', folderId: 'module-9-1', order: 10, description: 'Identification and definition of all system, process, and human interfaces that must be specified for a solution to function within its environment.', headerPattern: '### 9.1.10 Interface Analysis' },

  // Sub-module 9.2: Modeling & Analysis Techniques
  { id: '9-2-1-process-modelling', title: '9.2.1 Process Modelling', slug: 'process-modelling', folderId: 'module-9-2', order: 1, description: 'Standardized graphical representation of work flow through an organization, making invisible processes visible and providing the foundation for process improvement.', headerPattern: '### 9.2.1 Process Modelling' },
  { id: '9-2-2-process-analysis', title: '9.2.2 Process Analysis', slug: 'process-analysis', folderId: 'module-9-2', order: 2, description: 'Evaluation of existing processes to identify inefficiencies, gaps, and improvement opportunities using SIPOC, value stream mapping, and structured analysis techniques.', headerPattern: '### 9.2.2 Process Analysis' },
  { id: '9-2-3-data-modelling', title: '9.2.3 Data Modelling', slug: 'data-modelling', folderId: 'module-9-2', order: 3, description: 'Visual representation of data structures, attributes, and relationships — the authoritative reference for data-driven solution design and database specification.', headerPattern: '### 9.2.3 Data Modelling' },
  { id: '9-2-4-data-flow-diagrams', title: '9.2.4 Data Flow Diagrams', slug: 'data-flow-diagrams', folderId: 'module-9-2', order: 4, description: 'Graphical models showing how data moves through a system — from external sources through processes to data stores — capturing information flow independent of process detail.', headerPattern: '### 9.2.4 Data Flow Diagrams' },
  { id: '9-2-5-data-dictionary', title: '9.2.5 Data Dictionary', slug: 'data-dictionary', folderId: 'module-9-2', order: 5, description: 'Centralized catalogue of all data elements, their definitions, allowed values, and business rules — the authoritative semantic reference for all solution artifacts.', headerPattern: '### 9.2.5 Data Dictionary' },
  { id: '9-2-6-data-mining', title: '9.2.6 Data Mining', slug: 'data-mining', folderId: 'module-9-2', order: 6, description: 'Analysis of existing data repositories to discover patterns, correlations, and anomalies that reveal hidden requirements and support evidence-based decision making.', headerPattern: '### 9.2.6 Data Mining' },
  { id: '9-2-7-concept-modelling', title: '9.2.7 Concept Modelling', slug: 'concept-modelling', folderId: 'module-9-2', order: 7, description: 'Visual representation of business vocabulary and domain concepts that establishes shared semantic understanding before more formal technical models are developed.', headerPattern: '### 9.2.7 Concept Modelling' },
  { id: '9-2-8-scope-modelling', title: '9.2.8 Scope Modelling', slug: 'scope-modelling', folderId: 'module-9-2', order: 8, description: 'Explicit definition and visualization of what is inside and outside the solution boundary — preventing scope creep by making boundaries visible and agreed by all stakeholders.', headerPattern: '### 9.2.8 Scope Modelling' },
  { id: '9-2-9-state-modelling', title: '9.2.9 State Modelling', slug: 'state-modelling', folderId: 'module-9-2', order: 9, description: 'Representation of all states a business object can occupy and the events that trigger transitions — essential for specifying complex lifecycle behavior in requirements.', headerPattern: '### 9.2.9 State Modelling' },
  { id: '9-2-10-sequence-diagrams', title: '9.2.10 Sequence Diagrams', slug: 'sequence-diagrams', folderId: 'module-9-2', order: 10, description: 'Time-ordered visual models of interactions between system components or actors — the definitive tool for specifying dynamic behavior across system and process boundaries.', headerPattern: '### 9.2.10 Sequence Diagrams' },
  { id: '9-2-11-organizational-modelling', title: '9.2.11 Organizational Modelling', slug: 'organizational-modelling', folderId: 'module-9-2', order: 11, description: 'Representation of roles, responsibilities, and reporting structures within an organization — essential for understanding governance and accountability in change initiatives.', headerPattern: '### 9.2.11 Organizational Modelling' },
  { id: '9-2-12-use-cases-and-scenarios', title: '9.2.12 Use Cases and Scenarios', slug: 'use-cases-and-scenarios', folderId: 'module-9-2', order: 12, description: 'Structured descriptions of system behavior from an actor\'s perspective, documenting all success and failure paths for a complete system interaction.', headerPattern: '### 9.2.12 Use Cases and Scenarios' },
  { id: '9-2-13-user-stories', title: '9.2.13 User Stories', slug: 'user-stories', folderId: 'module-9-2', order: 13, description: 'Brief, conversation-starting descriptions of desired functionality from a user\'s perspective — the primary requirements format in agile and iterative delivery contexts.', headerPattern: '### 9.2.13 User Stories' },
  { id: '9-2-14-functional-decomposition', title: '9.2.14 Functional Decomposition', slug: 'functional-decomposition', folderId: 'module-9-2', order: 14, description: 'Hierarchical breakdown of complex functions into increasingly detailed sub-functions until each is specific enough to analyze, estimate, and implement independently.', headerPattern: '### 9.2.14 Functional Decomposition' },
  { id: '9-2-15-business-rules-analysis', title: '9.2.15 Business Rules Analysis', slug: 'business-rules-analysis', folderId: 'module-9-2', order: 15, description: 'Identification, documentation, and analysis of the rules that govern business behavior — the explicit constraints and policies that solutions must enforce consistently.', headerPattern: '### 9.2.15 Business Rules Analysis' },
  { id: '9-2-16-decision-modelling', title: '9.2.16 Decision Modelling', slug: 'decision-modelling', folderId: 'module-9-2', order: 16, description: 'Structured representation of business decision logic using decision tables, decision trees, and DMN notation — making repeatable operational decisions transparent and auditable.', headerPattern: '### 9.2.16 Decision Modelling' },
  { id: '9-2-17-non-functional-requirements-analysis', title: '9.2.17 Non-Functional Requirements Analysis', slug: 'non-functional-requirements-analysis', folderId: 'module-9-2', order: 17, description: 'Specification of quality, performance, security, and compliance requirements that define how a solution must behave, constraining every functional requirement it accompanies.', headerPattern: '### 9.2.17 Non-Functional Requirements Analysis' },

  // Sub-module 9.3: Strategy & Decision Techniques
  { id: '9-3-1-decision-analysis', title: '9.3.1 Decision Analysis', slug: 'decision-analysis', folderId: 'module-9-3', order: 1, description: 'Formal evaluation of a problem and its alternatives to determine the best course of action under uncertainty using decision trees, weighted matrices, and expected value.', headerPattern: '### 9.3.1 Decision Analysis' },
  { id: '9-3-2-swot-analysis', title: '9.3.2 SWOT Analysis', slug: 'swot-analysis', folderId: 'module-9-3', order: 2, description: 'Assessment of an organization\'s Strengths, Weaknesses, Opportunities, and Threats to inform strategic direction and identify the most viable change options.', headerPattern: '### 9.3.2 SWOT Analysis' },
  { id: '9-3-3-root-cause-analysis', title: '9.3.3 Root Cause Analysis', slug: 'root-cause-analysis', folderId: 'module-9-3', order: 3, description: 'Systematic investigation of the underlying causes of a problem or gap — ensuring solutions address actual root causes rather than symptoms that will recur after implementation.', headerPattern: '### 9.3.3 Root Cause Analysis' },
  { id: '9-3-4-risk-analysis-and-management', title: '9.3.4 Risk Analysis and Management', slug: 'risk-analysis-and-management', folderId: 'module-9-3', order: 4, description: 'Identification, assessment, and management of events that could negatively affect an initiative — the foundation of proactive rather than reactive BA practice.', headerPattern: '### 9.3.4 Risk Analysis and Management' },
  { id: '9-3-5-financial-analysis', title: '9.3.5 Financial Analysis', slug: 'financial-analysis', folderId: 'module-9-3', order: 5, description: 'Quantitative assessment of solution value using ROI, NPV, IRR, and payback period to support investment decisions and business case justification with financial evidence.', headerPattern: '### 9.3.5 Financial Analysis' },
  { id: '9-3-6-business-cases', title: '9.3.6 Business Cases', slug: 'business-cases', folderId: 'module-9-3', order: 6, description: 'Documented justification for organizational change that compares solution alternatives across need, outcomes, feasibility, financial analysis, and a recommended course of action.', headerPattern: '### 9.3.6 Business Cases' },
  { id: '9-3-7-business-model-canvas', title: '9.3.7 Business Model Canvas', slug: 'business-model-canvas', folderId: 'module-9-3', order: 7, description: 'Nine-building-block visual framework for describing, analyzing, and designing how an organization creates, delivers, and captures value for its customer segments.', headerPattern: '### 9.3.7 Business Model Canvas' },
  { id: '9-3-8-business-capability-analysis', title: '9.3.8 Business Capability Analysis', slug: 'business-capability-analysis', folderId: 'module-9-3', order: 8, description: 'Assessment of what an organization does — its abilities and capacities — independent of how those capabilities are executed, enabling strategic gap and investment analysis.', headerPattern: '### 9.3.8 Business Capability Analysis' },
  { id: '9-3-9-balanced-scorecard', title: '9.3.9 Balanced Scorecard', slug: 'balanced-scorecard', folderId: 'module-9-3', order: 9, description: 'Strategic performance framework translating organizational strategy into four dimensions: financial, customer, internal processes, and learning and growth.', headerPattern: '### 9.3.9 Balanced Scorecard' },
  { id: '9-3-10-vendor-assessment', title: '9.3.10 Vendor Assessment', slug: 'vendor-assessment', folderId: 'module-9-3', order: 10, description: 'Structured evaluation of potential vendors against defined criteria to determine whether external solutions can meet organizational requirements and constraints.', headerPattern: '### 9.3.10 Vendor Assessment' },
  { id: '9-3-11-benchmarking-and-market-analysis', title: '9.3.11 Benchmarking and Market Analysis', slug: 'benchmarking-and-market-analysis', folderId: 'module-9-3', order: 11, description: 'Comparison of organizational performance against industry standards and competitive practices to identify improvement targets and strategic innovation opportunities.', headerPattern: '### 9.3.11 Benchmarking and Market Analysis' },
  { id: '9-3-12-estimation', title: '9.3.12 Estimation', slug: 'estimation', folderId: 'module-9-3', order: 12, description: 'Structured forecasting of effort, cost, and duration required to implement a solution — the foundation of credible planning and realistic stakeholder expectations.', headerPattern: '### 9.3.12 Estimation' },

  // Sub-module 9.4: Planning & Management Techniques
  { id: '9-4-1-backlog-management', title: '9.4.1 Backlog Management', slug: 'backlog-management', folderId: 'module-9-4', order: 1, description: 'Ongoing refinement and prioritization of features and requirements awaiting implementation — the primary delivery planning mechanism in agile and iterative contexts.', headerPattern: '### 9.4.1 Backlog Management' },
  { id: '9-4-2-prioritization', title: '9.4.2 Prioritization', slug: 'prioritization', folderId: 'module-9-4', order: 2, description: 'Ranking of requirements by relative importance using structured techniques that create explicit, defensible priority decisions from competing stakeholder demands.', headerPattern: '### 9.4.2 Prioritization' },
  { id: '9-4-3-item-tracking', title: '9.4.3 Item Tracking', slug: 'item-tracking', folderId: 'module-9-4', order: 3, description: 'Systematic monitoring of requirements, defects, and action items through their lifecycle to ensure nothing is lost and all commitments are fulfilled.', headerPattern: '### 9.4.3 Item Tracking' },
  { id: '9-4-4-metrics-and-kpis', title: '9.4.4 Metrics and KPIs', slug: 'metrics-and-kpis', folderId: 'module-9-4', order: 4, description: 'Quantitative measures that define success, track progress, and provide the evidence base for evaluating whether solutions have achieved their intended business value.', headerPattern: '### 9.4.4 Metrics and KPIs' },
  { id: '9-4-5-reviews', title: '9.4.5 Reviews', slug: 'reviews', folderId: 'module-9-4', order: 5, description: 'Structured examination of BA deliverables by stakeholders and subject matter experts to identify defects, gaps, and improvements before artifacts are baselined.', headerPattern: '### 9.4.5 Reviews' },
  { id: '9-4-6-lessons-learned', title: '9.4.6 Lessons Learned', slug: 'lessons-learned', folderId: 'module-9-4', order: 6, description: 'Systematic capture and analysis of what worked and what did not on an initiative — converting experience into organizational knowledge for future improvement.', headerPattern: '### 9.4.6 Lessons Learned' },
  { id: '9-4-7-acceptance-and-evaluation-criteria', title: '9.4.7 Acceptance and Evaluation Criteria', slug: 'acceptance-and-evaluation-criteria', folderId: 'module-9-4', order: 7, description: 'Explicit, measurable conditions a solution must satisfy to be accepted — the contractual bridge between requirements specification and solution validation.', headerPattern: '### 9.4.7 Acceptance and Evaluation Criteria' },

  // Sub-module 9.5: Communication & Documentation Techniques
  { id: '9-5-1-stakeholder-list-map-and-personas', title: '9.5.1 Stakeholder List, Map, and Personas', slug: 'stakeholder-list-map-and-personas', folderId: 'module-9-5', order: 1, description: 'Systematic identification, categorization, and profiling of all parties with an interest in the initiative — the foundation for every collaboration and communication decision.', headerPattern: '### 9.5.1 Stakeholder List, Map, and Personas' },
  { id: '9-5-2-roles-and-permissions-matrix', title: '9.5.2 Roles and Permissions Matrix', slug: 'roles-and-permissions-matrix', folderId: 'module-9-5', order: 2, description: 'Documentation of which roles have what level of access to system functions and data — essential for security design and organizational boundary definition.', headerPattern: '### 9.5.2 Roles and Permissions Matrix' },
  { id: '9-5-3-mind-mapping', title: '9.5.3 Mind Mapping', slug: 'mind-mapping', folderId: 'module-9-5', order: 3, description: 'Radial, non-linear diagrams that capture associations between concepts, supporting brainstorming, scope definition, and requirement organization across all project phases.', headerPattern: '### 9.5.3 Mind Mapping' },
  { id: '9-5-4-glossary', title: '9.5.4 Glossary', slug: 'glossary', folderId: 'module-9-5', order: 4, description: 'Authoritative catalogue of key terms and their agreed definitions that eliminates semantic ambiguity across all requirements artifacts and stakeholder communications.', headerPattern: '### 9.5.4 Glossary' },

  // Sub-module 9.6: Technique Mastery
  { id: '9-6-1-technique-to-task-mapping', title: '9.6.1 Technique-to-Task Mapping', slug: 'technique-to-task-mapping', folderId: 'module-9-6', order: 1, description: 'BABOK V3 Appendix B cross-reference of all 50 techniques to the specific BA tasks they support — the authoritative guide for technique selection across all knowledge areas.', headerPattern: '### 9.6.1 Technique-to-Task Mapping' },
];

// ── Sub-module article counts ───────────────────────────────────────────────

const SUBMODULE_COUNTS: Record<string, number> = {
  'module-9-1': 10,
  'module-9-2': 17,
  'module-9-3': 12,
  'module-9-4': 7,
  'module-9-5': 4,
  'module-9-6': 1,
};

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

    // Find next article header or end of file
    let endIdx = raw.length;
    for (const other of ARTICLES) {
      if (other.headerPattern === article.headerPattern) continue;
      const idx = raw.indexOf(other.headerPattern, startIdx + 1);
      if (idx !== -1 && idx < endIdx) endIdx = idx;
    }

    // Stop at ## Key Takeaways (module footer) — exclude from individual articles
    const keyTakeawaysIdx = raw.indexOf('\n## Key Takeaways', startIdx + 1);
    if (keyTakeawaysIdx !== -1 && keyTakeawaysIdx < endIdx) {
      endIdx = keyTakeawaysIdx;
    }

    const content = raw.slice(startIdx, endIdx).trimEnd();
    map.set(article.id, content);
  }

  return map;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Populating Module 9: BA Techniques Toolkit\n');

  const mdPath = resolve(__dirname, '../../library/content/module-9-ba-techniques-toolkit.md');
  if (!fs.existsSync(mdPath)) {
    console.error('❌ Content file not found:', mdPath);
    process.exit(1);
  }

  const contentMap = parseContent(mdPath);
  console.log(`📄 Parsed ${contentMap.size} article sections from markdown\n`);

  if (contentMap.size !== ARTICLES.length) {
    console.warn(`  ⚠️  Expected ${ARTICLES.length} articles, parsed ${contentMap.size}`);
  }

  // ── Step 1: Create/update module-9 parent folder ─────────────────────────
  console.log('📁 Creating module-9 folder...');
  const moduleRef = adminDb.collection('folders').doc(MODULE_FOLDER.id);
  const moduleExists = (await moduleRef.get()).exists;

  await moduleRef.set({
    name: MODULE_FOLDER.name,
    slug: MODULE_FOLDER.slug,
    parentId: MODULE_FOLDER.parentId,
    description: MODULE_FOLDER.description,
    path: MODULE_FOLDER.path,
    order: MODULE_FOLDER.order,
    featured: MODULE_FOLDER.featured,
    articleCount: 0, // will be updated at the end
    createdAt: moduleExists ? FieldValue.serverTimestamp() : FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    metadata: { status: 'complete' },
  }, { merge: true });
  console.log(`  ✓ module-9 folder ${moduleExists ? 'updated' : 'created'}\n`);

  // ── Step 2: Create/update 6 sub-module folders ───────────────────────────
  console.log('📂 Creating sub-module folders...');
  for (const sm of SUBMODULE_FOLDERS) {
    const smRef = adminDb.collection('folders').doc(sm.id);
    const smExists = (await smRef.get()).exists;
    await smRef.set({
      name: sm.name,
      slug: sm.slug,
      parentId: sm.parentId,
      description: sm.description,
      path: sm.path,
      order: sm.order,
      featured: false,
      articleCount: sm.articleCount,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' },
    }, { merge: true });
    console.log(`  ✓ ${sm.id} (${sm.articleCount} articles) ${smExists ? 'updated' : 'created'}`);
  }
  console.log();

  // ── Step 3: Create articles in batches of 400 ────────────────────────────
  console.log('📝 Creating articles...');
  const FOLDER_PATH_BASE = ['business-analysis-masterclass', 'module-9'];

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

    console.log(`  ✓ ${article.id} (${wordCount} words, ${readingTime} min read)`);
    batchCount++;
    totalCreated++;

    if (batchCount >= 400) {
      await batch.commit();
      batch = adminDb.batch();
      batchCount = 0;
      console.log('  [batch committed]');
    }
  }

  if (batchCount > 0) await batch.commit();
  console.log(`\n✅ Created ${totalCreated} articles${totalSkipped > 0 ? ` (${totalSkipped} skipped)` : ''}\n`);

  // ── Step 4: Update module-9 total article count ──────────────────────────
  console.log('📁 Updating module-9 total article count...');
  await adminDb.collection('folders').doc('module-9').update({
    articleCount: totalCreated,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ module-9: ${totalCreated} total articles\n`);

  // ── Step 5: Update BA Masterclass total ──────────────────────────────────
  console.log('📚 Updating BA Masterclass total...');
  const masterRef = adminDb.collection('folders').doc('business-analysis-masterclass');
  const masterDoc = await masterRef.get();
  const currentCount = masterDoc.data()?.articleCount || 0;
  const newTotal = currentCount + totalCreated;
  await masterRef.update({
    articleCount: newTotal,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ Masterclass total: ${currentCount} → ${newTotal}\n`);

  console.log('🎉 Module 9 population complete!');
  console.log(`   Articles created:     ${totalCreated}`);
  console.log(`   Sub-modules created:  ${SUBMODULE_FOLDERS.length}`);
  console.log(`   Masterclass total:    ${newTotal}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Script failed:', err);
    process.exit(1);
  });
