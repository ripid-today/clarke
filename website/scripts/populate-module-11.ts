/**
 * Populate Module 11: Applied BA Practices
 *
 * Creates/updates the module-11 folder, 6 sub-module folders, and all 44 articles
 * from the module-11-applied-ba-practices.md content file.
 *
 * USAGE: npx tsx website/scripts/populate-module-11.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Folder definitions ──────────────────────────────────────────────────────

const MODULE_FOLDER = {
  id: 'module-11',
  name: 'Module 11: Applied BA Practices',
  slug: 'module-11',
  parentId: 'business-analysis-masterclass',
  description: 'Practitioner playbooks from Wiegers, Patton, Rubin, Aguanno, Champagne, and PMI — translating BA frameworks into actionable methods across requirements engineering, agile, Scrum, and project management.',
  path: ['business-analysis-masterclass', 'module-11'],
  order: 11,
  featured: false,
};

const SUBMODULE_FOLDERS = [
  {
    id: 'module-11-1',
    name: '11.1 Requirements Engineering Essentials',
    slug: 'module-11-1',
    parentId: 'module-11',
    description: 'Ten articles drawing from Wiegers and Hokanson\'s Software Requirements — the 20 core practices framework covering problem orientation, stakeholder identification, modeling, and change management.',
    path: ['business-analysis-masterclass', 'module-11', 'module-11-1'],
    order: 1,
    articleCount: 10,
  },
  {
    id: 'module-11-2',
    name: '11.2 Agile Business Analysis in Depth',
    slug: 'module-11-2',
    parentId: 'module-11',
    description: 'Ten articles on agile BA from Aguanno & Schibi and Patton — the BA role shift, user stories, story mapping, documentation, planning, reporting, testing, and validated learning.',
    path: ['business-analysis-masterclass', 'module-11', 'module-11-2'],
    order: 2,
    articleCount: 10,
  },
  {
    id: 'module-11-3',
    name: '11.3 Scrum Framework for Business Analysts',
    slug: 'module-11-3',
    parentId: 'module-11',
    description: 'Eight articles on the Scrum framework from Ken Rubin — roles, ceremonies, product backlog, sprint events, estimation, Definition of Done, technical debt, and scaling patterns.',
    path: ['business-analysis-masterclass', 'module-11', 'module-11-3'],
    order: 3,
    articleCount: 8,
  },
  {
    id: 'module-11-4',
    name: '11.4 PMI Requirements Practices',
    slug: 'module-11-4',
    parentId: 'module-11',
    description: 'Six articles on PMI requirements practices — needs assessment, requirements management planning, monitoring and controlling, solution evaluation, business value measurement, and BA stewardship.',
    path: ['business-analysis-masterclass', 'module-11', 'module-11-4'],
    order: 4,
    articleCount: 6,
  },
  {
    id: 'module-11-5',
    name: '11.5 Seven Steps to Mastering BA',
    slug: 'module-11-5',
    parentId: 'module-11',
    description: 'Seven articles on Champagne\'s seven steps to mastering BA — role clarity, audience understanding, project context, business environment, technical environment, analysis techniques, and career growth.',
    path: ['business-analysis-masterclass', 'module-11', 'module-11-5'],
    order: 5,
    articleCount: 7,
  },
  {
    id: 'module-11-6',
    name: '11.6 Agile Tools in Practice',
    slug: 'module-11-6',
    parentId: 'module-11',
    description: 'Three articles on agile tools in practice from Patrick Li — Jira project setup, Scrum and Kanban boards, and reporting and metrics for BA insights.',
    path: ['business-analysis-masterclass', 'module-11', 'module-11-6'],
    order: 6,
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
  // Sub-module 11.1: Requirements Engineering Essentials
  {
    id: '11-1-1-the-20-core-practices-overview',
    title: '11.1.1 The 20 Core Practices Overview',
    slug: 'the-20-core-practices-overview',
    folderId: 'module-11-1',
    order: 1,
    description: 'Wiegers\' framework of 20 essential practices in five clusters, from problem orientation through specification and change management — the minimum structure to prevent costly defects.',
    headerPattern: '### 11.1.1 The 20 Core Practices Overview',
  },
  {
    id: '11-1-2-problem-before-solution',
    title: '11.1.2 Problem Before Solution',
    slug: 'problem-before-solution',
    folderId: 'module-11-1',
    order: 2,
    description: 'The discipline of defining the problem space before proposing solutions: the problem statement as a formal deliverable, the five whys technique, and the problem statement as scope anchor.',
    headerPattern: '### 11.1.2 Problem Before Solution',
  },
  {
    id: '11-1-3-business-objectives-and-boundaries',
    title: '11.1.3 Business Objectives and Boundaries',
    slug: 'business-objectives-and-boundaries',
    folderId: 'module-11-1',
    order: 3,
    description: 'Defining measurable business objectives, project scope boundaries, and scope boundary diagrams — tools to align solution scope with business value and prevent scope creep.',
    headerPattern: '### 11.1.3 Business Objectives and Boundaries',
  },
  {
    id: '11-1-4-stakeholder-identification',
    title: '11.1.4 Stakeholder Identification',
    slug: 'stakeholder-identification',
    folderId: 'module-11-1',
    order: 4,
    description: 'Identifying all classes of stakeholders — direct, indirect, and invisible — and the elicitation and communication strategies for gaining genuine input from each type.',
    headerPattern: '### 11.1.4 Stakeholder Identification',
  },
  {
    id: '11-1-5-usage-centric-requirements',
    title: '11.1.5 Usage-Centric Requirements',
    slug: 'usage-centric-requirements',
    folderId: 'module-11-1',
    order: 5,
    description: 'The usage-centric approach to requirements: use cases, task flows, and event-triggered scenarios that capture what users actually do, not what stakeholders imagine they will do.',
    headerPattern: '### 11.1.5 Usage-Centric Requirements',
  },
  {
    id: '11-1-6-events-data-and-quality-attributes',
    title: '11.1.6 Events, Data, and Quality Attributes',
    slug: 'events-data-and-quality-attributes',
    folderId: 'module-11-1',
    order: 6,
    description: 'Requirements derived from business events, data flow diagrams, and quality attributes — performance, reliability, usability, security — that define how well the system must work.',
    headerPattern: '### 11.1.6 Events, Data, and Quality Attributes',
  },
  {
    id: '11-1-7-analyzing-and-modeling',
    title: '11.1.7 Analyzing and Modeling',
    slug: 'analyzing-and-modeling',
    folderId: 'module-11-1',
    order: 7,
    description: 'Requirements analysis through modeling — context diagrams, data flow diagrams, entity-relationship models, state diagrams — to expose gaps and ambiguities before specification.',
    headerPattern: '### 11.1.7 Analyzing and Modeling',
  },
  {
    id: '11-1-8-prioritization-and-assumptions',
    title: '11.1.8 Prioritization and Assumptions',
    slug: 'prioritization-and-assumptions',
    folderId: 'module-11-1',
    order: 8,
    description: 'Prioritization techniques including MoSCoW, cost-benefit analysis, and stakeholder voting, plus documenting assumptions and constraints that bound the solution space.',
    headerPattern: '### 11.1.8 Prioritization and Assumptions',
  },
  {
    id: '11-1-9-writing-and-organizing-requirements',
    title: '11.1.9 Writing and Organizing Requirements',
    slug: 'writing-and-organizing-requirements',
    folderId: 'module-11-1',
    order: 9,
    description: 'Writing clear, unambiguous, testable requirements using atomic statements, SRS structure, writing templates, and readability guidelines to produce specifications developers can build from.',
    headerPattern: '### 11.1.9 Writing and Organizing Requirements',
  },
  {
    id: '11-1-10-validation-and-change-management',
    title: '11.1.10 Validation and Change Management',
    slug: 'validation-and-change-management',
    folderId: 'module-11-1',
    order: 10,
    description: 'Requirements validation through reviews, walkthroughs, and formal inspections — and change management disciplines of change log, impact analysis, and version control for requirements.',
    headerPattern: '### 11.1.10 Validation and Change Management',
  },

  // Sub-module 11.2: Agile Business Analysis in Depth
  {
    id: '11-2-1-the-agile-ba-role',
    title: '11.2.1 The Agile BA Role',
    slug: 'the-agile-ba-role',
    folderId: 'module-11-2',
    order: 1,
    description: 'How BA responsibilities shift in agile projects: the BA as facilitator, collaborator, and team member — distributed across sprints rather than concentrated in an upfront phase.',
    headerPattern: '### 11.2.1 The Agile BA Role',
  },
  {
    id: '11-2-2-agile-vs-traditional-requirements',
    title: '11.2.2 Agile vs. Traditional Requirements',
    slug: 'agile-vs-traditional-requirements',
    folderId: 'module-11-2',
    order: 2,
    description: 'The structural differences between agile and traditional requirements: just-in-time vs. upfront elaboration, conversation vs. documentation, and the trade-offs each approach demands.',
    headerPattern: '### 11.2.2 Agile vs. Traditional Requirements',
  },
  {
    id: '11-2-3-writing-effective-user-stories',
    title: '11.2.3 Writing Effective User Stories',
    slug: 'writing-effective-user-stories',
    folderId: 'module-11-2',
    order: 3,
    description: 'The anatomy of a user story: role, action, benefit format, the INVEST criteria, acceptance criteria writing, and story splitting techniques from Rubin and Patton.',
    headerPattern: '### 11.2.3 Writing Effective User Stories',
  },
  {
    id: '11-2-4-user-story-mapping',
    title: '11.2.4 User Story Mapping',
    slug: 'user-story-mapping',
    folderId: 'module-11-2',
    order: 4,
    description: 'Jeff Patton\'s user story mapping technique: building the backbone of user activities, filling in the walking skeleton, slicing releases horizontally, and using the map to manage scope.',
    headerPattern: '### 11.2.4 User Story Mapping',
  },
  {
    id: '11-2-5-agile-documentation',
    title: '11.2.5 Agile Documentation',
    slug: 'agile-documentation',
    folderId: 'module-11-2',
    order: 5,
    description: 'What to document in agile: lightweight artifacts including one-page charters, story maps, lean canvases, and the principle that documentation serves the team, not a bureaucracy.',
    headerPattern: '### 11.2.5 Agile Documentation',
  },
  {
    id: '11-2-6-agile-planning-and-estimation',
    title: '11.2.6 Agile Planning and Estimation',
    slug: 'agile-planning-and-estimation',
    folderId: 'module-11-2',
    order: 6,
    description: 'Release planning, sprint planning, story points, planning poker, and velocity — the agile estimation and planning system that replaces upfront project plans with adaptive forecasting.',
    headerPattern: '### 11.2.6 Agile Planning and Estimation',
  },
  {
    id: '11-2-7-agile-reporting-artifacts',
    title: '11.2.7 Agile Reporting Artifacts',
    slug: 'agile-reporting-artifacts',
    folderId: 'module-11-2',
    order: 7,
    description: 'Burndown charts, burnup charts, cumulative flow diagrams, and velocity charts — the visual reporting artifacts that make agile progress transparent to teams and stakeholders.',
    headerPattern: '### 11.2.7 Agile Reporting Artifacts',
  },
  {
    id: '11-2-8-agile-testing-and-evaluation',
    title: '11.2.8 Agile Testing and Evaluation',
    slug: 'agile-testing-and-evaluation',
    folderId: 'module-11-2',
    order: 8,
    description: 'Test-driven development, acceptance test-driven development, behaviour-driven development, and the Definition of Done — integrating testing into agile delivery from day one.',
    headerPattern: '### 11.2.8 Agile Testing and Evaluation',
  },
  {
    id: '11-2-9-ba-and-product-owner',
    title: '11.2.9 BA and Product Owner',
    slug: 'ba-and-product-owner',
    folderId: 'module-11-2',
    order: 9,
    description: 'The relationship between BA and Product Owner: when the roles overlap, when they are separate, and how BAs support Product Owners through backlog refinement and analysis.',
    headerPattern: '### 11.2.9 BA and Product Owner',
  },
  {
    id: '11-2-10-discovery-and-validated-learning',
    title: '11.2.10 Discovery and Validated Learning',
    slug: 'discovery-and-validated-learning',
    folderId: 'module-11-2',
    order: 10,
    description: 'Lean startup principles, hypothesis-driven development, validated learning, and minimum viable products — the discovery approach that tests assumptions before committing to full development.',
    headerPattern: '### 11.2.10 Discovery and Validated Learning',
  },

  // Sub-module 11.3: Scrum Framework for Business Analysts
  {
    id: '11-3-1-scrum-framework-overview',
    title: '11.3.1 Scrum Framework Overview',
    slug: 'scrum-framework-overview',
    folderId: 'module-11-3',
    order: 1,
    description: 'The three pillars of Scrum — transparency, inspection, adaptation — and the Scrum values, roles, artifacts, and events that operationalise empirical process control.',
    headerPattern: '### 11.3.1 Scrum Framework Overview',
  },
  {
    id: '11-3-2-product-owner-and-the-ba',
    title: '11.3.2 Product Owner and the BA',
    slug: 'product-owner-and-the-ba',
    folderId: 'module-11-3',
    order: 2,
    description: 'Product Owner accountabilities in Scrum: product backlog ownership, stakeholder management, prioritisation authority, and where the BA role fits into the Scrum team structure.',
    headerPattern: '### 11.3.2 Product Owner and the BA',
  },
  {
    id: '11-3-3-product-backlog-management',
    title: '11.3.3 Product Backlog Management',
    slug: 'product-backlog-management',
    folderId: 'module-11-3',
    order: 3,
    description: 'Product backlog structure, refinement cadence, ordering criteria, and readiness standards — the disciplines that keep the backlog healthy, prioritised, and ready for sprint planning.',
    headerPattern: '### 11.3.3 Product Backlog Management',
  },
  {
    id: '11-3-4-sprint-events',
    title: '11.3.4 Sprint Events',
    slug: 'sprint-events',
    folderId: 'module-11-3',
    order: 4,
    description: 'Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective — purpose, time-box, format, and BA participation in each event that drives Scrum\'s inspect-and-adapt cycle.',
    headerPattern: '### 11.3.4 Sprint Events',
  },
  {
    id: '11-3-5-estimation-and-velocity',
    title: '11.3.5 Estimation and Velocity',
    slug: 'estimation-and-velocity',
    folderId: 'module-11-3',
    order: 5,
    description: 'Story point sizing, relative estimation, planning poker, velocity tracking, and release forecasting — the estimation system Scrum teams use to plan without false precision.',
    headerPattern: '### 11.3.5 Estimation and Velocity',
  },
  {
    id: '11-3-6-definition-of-done-vs-acceptance-criteria',
    title: '11.3.6 Definition of Done vs. Acceptance Criteria',
    slug: 'definition-of-done-vs-acceptance-criteria',
    folderId: 'module-11-3',
    order: 6,
    description: 'How Definition of Done and acceptance criteria differ, who owns each, and how they interact — and why conflating the two leads to ambiguous quality standards and missed expectations.',
    headerPattern: '### 11.3.6 Definition of Done vs. Acceptance Criteria',
  },
  {
    id: '11-3-7-technical-debt',
    title: '11.3.7 Technical Debt',
    slug: 'technical-debt',
    folderId: 'module-11-3',
    order: 7,
    description: 'What technical debt is, how it accumulates, how it affects velocity, and the BA\'s role in making technical debt visible in the product backlog and stakeholder conversations.',
    headerPattern: '### 11.3.7 Technical Debt',
  },
  {
    id: '11-3-8-scaling-scrum',
    title: '11.3.8 Scaling Scrum',
    slug: 'scaling-scrum',
    folderId: 'module-11-3',
    order: 8,
    description: 'Scaling Scrum beyond a single team: Scrum of Scrums, LeSS, and SAFe overview — the coordination mechanisms that preserve Scrum\'s empirical principles across multiple teams.',
    headerPattern: '### 11.3.8 Scaling Scrum',
  },

  // Sub-module 11.4: PMI Requirements Practices
  {
    id: '11-4-1-needs-assessment',
    title: '11.4.1 Needs Assessment',
    slug: 'needs-assessment',
    folderId: 'module-11-4',
    order: 1,
    description: 'PMI\'s needs assessment process: identifying business needs, conducting gap analysis, and formulating a recommended solution grounded in measurable business outcomes.',
    headerPattern: '### 11.4.1 Needs Assessment',
  },
  {
    id: '11-4-2-requirements-management-planning',
    title: '11.4.2 Requirements Management Planning',
    slug: 'requirements-management-planning',
    folderId: 'module-11-4',
    order: 2,
    description: 'Requirements management planning from the PMI perspective: defining how requirements are documented, traced, prioritised, and controlled throughout the project lifecycle.',
    headerPattern: '### 11.4.2 Requirements Management Planning',
  },
  {
    id: '11-4-3-monitoring-and-controlling',
    title: '11.4.3 Monitoring and Controlling',
    slug: 'monitoring-and-controlling',
    folderId: 'module-11-4',
    order: 3,
    description: 'Monitoring requirements status throughout delivery: traceability matrices, change control processes, configuration management, and the BA\'s oversight role in keeping scope aligned.',
    headerPattern: '### 11.4.3 Monitoring and Controlling',
  },
  {
    id: '11-4-4-solution-evaluation-and-closure',
    title: '11.4.4 Solution Evaluation and Closure',
    slug: 'solution-evaluation-and-closure',
    folderId: 'module-11-4',
    order: 4,
    description: 'Evaluating solution performance against business objectives, defining transition criteria, managing organisational change, and closing out requirements activities at project end.',
    headerPattern: '### 11.4.4 Solution Evaluation and Closure',
  },
  {
    id: '11-4-5-business-value-assessment',
    title: '11.4.5 Business Value Assessment',
    slug: 'business-value-assessment',
    folderId: 'module-11-4',
    order: 5,
    description: 'Measuring and demonstrating business value delivered: benefit realisation metrics, value KPIs, and analytical methods for assessing whether the solution achieved its business case.',
    headerPattern: '### 11.4.5 Business Value Assessment',
  },
  {
    id: '11-4-6-ba-stewardship',
    title: '11.4.6 BA Stewardship',
    slug: 'ba-stewardship',
    folderId: 'module-11-4',
    order: 6,
    description: 'The BA\'s ongoing stewardship responsibilities: requirements quality ownership, stakeholder relationship maintenance, knowledge transfer, and the long-term habits of a trusted BA professional.',
    headerPattern: '### 11.4.6 BA Stewardship',
  },

  // Sub-module 11.5: Seven Steps to Mastering BA
  {
    id: '11-5-1-know-your-role',
    title: '11.5.1 Know Your Role',
    slug: 'know-your-role',
    folderId: 'module-11-5',
    order: 1,
    description: 'Champagne\'s first step: understanding the BA role in full — scope, core responsibilities, career path, and the relationship between BA and adjacent roles including PM, PO, and SME.',
    headerPattern: '### 11.5.1 Know Your Role',
  },
  {
    id: '11-5-2-know-your-audience',
    title: '11.5.2 Know Your Audience',
    slug: 'know-your-audience',
    folderId: 'module-11-5',
    order: 2,
    description: 'Knowing your audience: stakeholder analysis, communication style matching, political awareness, and the skills that transform a technically competent BA into a trusted partner.',
    headerPattern: '### 11.5.2 Know Your Audience',
  },
  {
    id: '11-5-3-know-your-project',
    title: '11.5.3 Know Your Project',
    slug: 'know-your-project',
    folderId: 'module-11-5',
    order: 3,
    description: 'Reading the project: understanding project types, lifecycle models, and methodologies — and adapting BA work to project context rather than applying a fixed template.',
    headerPattern: '### 11.5.3 Know Your Project',
  },
  {
    id: '11-5-4-know-your-business-environment',
    title: '11.5.4 Know Your Business Environment',
    slug: 'know-your-business-environment',
    folderId: 'module-11-5',
    order: 4,
    description: 'Why business environment understanding is the BA\'s most underrated skill and how to develop industry knowledge, process awareness, and organisational fluency.',
    headerPattern: '### 11.5.4 Know Your Business Environment',
  },
  {
    id: '11-5-5-know-your-technical-environment',
    title: '11.5.5 Know Your Technical Environment',
    slug: 'know-your-technical-environment',
    folderId: 'module-11-5',
    order: 5,
    description: 'The technical environment as BA context: architecture basics, the constraints developers operate within, and how understanding technical trade-offs improves requirements quality.',
    headerPattern: '### 11.5.5 Know Your Technical Environment',
  },
  {
    id: '11-5-6-know-your-analysis-techniques',
    title: '11.5.6 Know Your Analysis Techniques',
    slug: 'know-your-analysis-techniques',
    folderId: 'module-11-5',
    order: 6,
    description: 'Champagne\'s guide to core elicitation and analysis techniques — when to use interviews, workshops, observation, document analysis, and prototyping based on project context.',
    headerPattern: '### 11.5.6 Know Your Analysis Techniques',
  },
  {
    id: '11-5-7-increase-your-value',
    title: '11.5.7 Increase Your Value',
    slug: 'increase-your-value',
    folderId: 'module-11-5',
    order: 7,
    description: 'Professional development for business analysts: mentoring, thought leadership, certifications, communities of practice, and the career habits that distinguish exceptional BAs.',
    headerPattern: '### 11.5.7 Increase Your Value',
  },

  // Sub-module 11.6: Agile Tools in Practice
  {
    id: '11-6-1-agile-project-management-with-jira',
    title: '11.6.1 Agile Project Management with Jira',
    slug: 'agile-project-management-with-jira',
    folderId: 'module-11-6',
    order: 1,
    description: 'Jira overview for business analysts: project types, issue hierarchy, workflows, and the BA use cases for epics, stories, tasks, and bugs in agile project management.',
    headerPattern: '### 11.6.1 Agile Project Management with Jira',
  },
  {
    id: '11-6-2-scrum-and-kanban-boards',
    title: '11.6.2 Scrum and Kanban Boards',
    slug: 'scrum-and-kanban-boards',
    folderId: 'module-11-6',
    order: 2,
    description: 'Scrum boards and Kanban boards in Jira: backlog view, sprint view, swimlanes, and WIP limits — and when each board type serves agile BA work best.',
    headerPattern: '### 11.6.2 Scrum and Kanban Boards',
  },
  {
    id: '11-6-3-reporting-and-metrics-in-tools',
    title: '11.6.3 Reporting and Metrics in Tools',
    slug: 'reporting-and-metrics-in-tools',
    folderId: 'module-11-6',
    order: 3,
    description: 'Jira\'s reporting suite for BA insights: burndown charts, velocity charts, cumulative flow diagrams, and using Jira data to surface bottlenecks and inform stakeholder conversations.',
    headerPattern: '### 11.6.3 Reporting and Metrics in Tools',
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
  console.log('🚀 Populating Module 11: Applied BA Practices\n');

  const mdPath = resolve(__dirname, '../../library/content/module-11-applied-ba-practices.md');
  if (!fs.existsSync(mdPath)) {
    console.error('❌ Content file not found:', mdPath);
    process.exit(1);
  }

  const contentMap = parseContent(mdPath);
  console.log(`📄 Parsed ${contentMap.size} article sections from markdown\n`);

  if (contentMap.size !== ARTICLES.length) {
    console.warn(`  ⚠️  Expected ${ARTICLES.length} articles, parsed ${contentMap.size}`);
  }

  // ── Step 1: Create/update module-11 parent folder ─────────────────────────
  console.log('📁 Upserting module-11 folder...');
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
  console.log('  ✓ module-11 folder upserted\n');

  // ── Step 2: Create/update 6 sub-module folders ────────────────────────────
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
  const FOLDER_PATH_BASE = ['business-analysis-masterclass', 'module-11'];

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

  // ── Step 4: Update module-11 article count ───────────────────────────────
  console.log('📁 Updating module-11 article count...');
  await adminDb.collection('folders').doc('module-11').update({
    articleCount: totalCreated,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  ✓ module-11: ${totalCreated} articles\n`);

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

  console.log('🎉 Module 11 population complete!');
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
