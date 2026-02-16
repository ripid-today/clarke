/**
 * Firebase Database Update Script - Business Analysis Masterclass
 *
 * This script updates the Firestore database with the complete BA Masterclass structure:
 * - 1 main folder (featured)
 * - 11 module folders
 * - 92 articles across all modules
 *
 * USAGE: tsx website/scripts/update-ba-masterclass.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { adminDb } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Main folder data
const mainFolder = {
  id: 'business-analysis-masterclass',
  name: 'Business Analysis Masterclass',
  slug: 'business-analysis-masterclass',
  parentId: null,
  description: 'Complete BA training: requirements, stakeholder engagement, process modeling, agile methods, and real-world case studies. From junior to senior level.',
  path: ['business-analysis-masterclass'],
  order: 1,
  featured: true,
  status: 'complete',
  articleCount: 92,
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
  metadata: {
    learningPath: ['junior', 'mid', 'senior'],
    frameworks: ['BABOK V3', 'PMI', 'Agile', 'Lean Six Sigma'],
    totalModules: 11,
    status: 'complete'
  }
};

// Module folders with their articles
const modules = [
  {
    folder: {
      id: 'ba-foundations',
      name: 'Business Analysis Foundations',
      slug: 'ba-foundations',
      parentId: 'business-analysis-masterclass',
      description: 'Core BA concepts, role definition, competency model, career paths, business writing fundamentals, critical thinking, and professional ethics.',
      path: ['business-analysis-masterclass', 'ba-foundations'],
      order: 1,
      featured: false,
      articleCount: 9,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'What is Business Analysis', description: 'Definition of business analysis, core value proposition, and how BAs bridge business needs with solution delivery across industries.', order: 1 },
      { title: 'The Business Analyst Role', description: 'BA responsibilities, day-to-day activities, key deliverables, and how the role varies across waterfall, agile, and hybrid environments.', order: 2 },
      { title: 'BA Competency Model (BABOK V3)', description: 'Six knowledge areas, underlying competencies, analytical thinking techniques, and behavioral characteristics of effective business analysts.', order: 3 },
      { title: 'BA Career Paths and Specializations', description: 'Career progression from junior to senior BA, domain specializations (process, data, industry), and transition paths to PM, Product Owner, or Architect.', order: 4 },
      { title: 'Agile vs Waterfall BA Approaches', description: 'How BA practices differ between traditional waterfall and agile methodologies, including deliverables, ceremonies, and stakeholder collaboration.', order: 5 },
      { title: 'Business Writing for BAs', description: 'Clear, concise writing principles for requirements documents, emails, presentations, and stakeholder communications. Avoiding jargon and ambiguity.', order: 6 },
      { title: 'BA Toolkit Overview', description: 'Essential tools for requirements management (Jira, Azure DevOps), modeling (Visio, Lucidchart), collaboration (Confluence, Miro), and documentation.', order: 7 },
      { title: 'Critical Thinking for Business Analysts', description: 'Questioning assumptions, root cause analysis, logical reasoning, identifying biases, and making evidence-based recommendations.', order: 8 },
      { title: 'Ethics and Professional Standards', description: 'Ethical principles for BAs, handling confidential information, managing conflicts of interest, and professional certifications (CBAP, PMI-PBA).', order: 9 }
    ]
  },
  {
    folder: {
      id: 'requirements-fundamentals',
      name: 'Requirements Fundamentals',
      slug: 'requirements-fundamentals',
      parentId: 'business-analysis-masterclass',
      description: 'Requirements types, characteristics of good requirements, lifecycle management, documentation formats, traceability matrix, and common pitfalls to avoid.',
      path: ['business-analysis-masterclass', 'requirements-fundamentals'],
      order: 2,
      featured: false,
      articleCount: 9,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'What Are Requirements', description: 'Definition of requirements, purpose in solution delivery, and the difference between needs, wants, and validated requirements.', order: 1 },
      { title: 'Types of Requirements (Business, Stakeholder, Solution, Transition)', description: 'Four requirement levels in BABOK: business requirements (why), stakeholder (who/what), solution (how), and transition (implementation).', order: 2 },
      { title: 'Functional vs Non-Functional Requirements', description: 'Functional requirements (what the system does) vs non-functional (how well it performs), with examples of performance, security, usability.', order: 3 },
      { title: 'Requirements Levels and Abstraction', description: 'Moving from high-level business goals to detailed solution specifications, managing appropriate level of detail for different audiences.', order: 4 },
      { title: 'Requirements Lifecycle', description: 'Lifecycle stages: elicitation, analysis, specification, validation, management, and how requirements evolve throughout the project.', order: 5 },
      { title: 'Characteristics of Good Requirements (IEEE 29148)', description: 'Clear, concise, testable, feasible, unambiguous, verifiable, and traceable. How to write requirements that avoid misinterpretation.', order: 6 },
      { title: 'Requirements Documentation Formats (BRD, FRD, SRS, User Stories)', description: 'When to use Business Requirements Documents, Functional Requirements Documents, Software Requirements Specs, or User Stories.', order: 7 },
      { title: 'Requirements Traceability Matrix', description: 'Linking requirements to business objectives, design elements, test cases, and implementation. Ensuring complete coverage and managing change impact.', order: 8 },
      { title: 'Common Requirements Pitfalls', description: 'Avoiding scope creep, gold plating, ambiguous language, missing non-functionals, inadequate stakeholder validation, and unrealistic constraints.', order: 9 }
    ]
  },
  {
    folder: {
      id: 'stakeholder-engagement',
      name: 'Stakeholder Engagement',
      slug: 'stakeholder-engagement',
      parentId: 'business-analysis-masterclass',
      description: 'Stakeholder identification and analysis, RACI matrices, communication planning, managing difficult stakeholders, conflict resolution, and navigating politics.',
      path: ['business-analysis-masterclass', 'stakeholder-engagement'],
      order: 3,
      featured: false,
      articleCount: 9,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Stakeholder Identification Techniques', description: 'Methods to identify all stakeholders: org charts, brainstorming, onion diagrams, and ensuring no critical stakeholders are overlooked.', order: 1 },
      { title: 'Stakeholder Analysis Framework (Power/Interest Grid)', description: 'Power/Interest matrix to categorize stakeholders (manage closely, keep satisfied, keep informed, monitor), and tailoring engagement strategies.', order: 2 },
      { title: 'RACI Matrix for Requirements', description: 'Defining Responsible, Accountable, Consulted, and Informed roles for requirements activities, avoiding confusion and ensuring clear ownership.', order: 3 },
      { title: 'Communication Planning for BAs', description: 'Creating communication plans: frequency, channels, message types, and adapting communication style for technical vs business stakeholders.', order: 4 },
      { title: 'Managing Difficult Stakeholders', description: 'Strategies for dealing with unresponsive, overly demanding, or hostile stakeholders. Building rapport and finding common ground.', order: 5 },
      { title: 'Conflict Resolution for BAs', description: 'Conflict resolution techniques: active listening, finding win-win solutions, mediation, escalation paths, and maintaining neutral facilitation.', order: 6 },
      { title: 'Navigating Organizational Politics', description: 'Understanding power dynamics, informal networks, building alliances, managing competing agendas, and maintaining professional integrity.', order: 7 },
      { title: 'Facilitation Techniques', description: 'Running effective meetings and workshops: setting agendas, timekeeping, encouraging participation, managing dominant voices, capturing decisions.', order: 8 },
      { title: 'Building Trust and Credibility', description: 'Establishing expertise, delivering on commitments, transparent communication, acknowledging limitations, and earning stakeholder confidence over time.', order: 9 }
    ]
  },
  {
    folder: {
      id: 'requirements-analysis',
      name: 'Requirements Analysis',
      slug: 'requirements-analysis',
      parentId: 'business-analysis-masterclass',
      description: 'Gap analysis, requirements decomposition, MoSCoW prioritization, user story mapping, context diagrams, SWOT analysis, and decision modeling.',
      path: ['business-analysis-masterclass', 'requirements-analysis'],
      order: 4,
      featured: false,
      articleCount: 8,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Requirements Analysis Overview', description: 'Purpose of requirements analysis, transforming stakeholder needs into structured requirements, and identifying gaps, conflicts, and dependencies.', order: 1 },
      { title: 'Gap Analysis (AS-IS vs TO-BE)', description: 'Documenting current state, defining desired future state, identifying gaps, and prioritizing improvement opportunities for solution design.', order: 2 },
      { title: 'Requirements Decomposition', description: 'Breaking down high-level requirements into detailed sub-requirements, functional decomposition, and managing appropriate granularity levels.', order: 3 },
      { title: 'MoSCoW Prioritization', description: 'Must have, Should have, Could have, Won\'t have prioritization framework for managing scope, stakeholder expectations, and release planning.', order: 4 },
      { title: 'User Story Mapping (Jeff Patton)', description: 'Creating user story maps to visualize user journeys, prioritize features by value, plan releases, and identify MVP scope in agile projects.', order: 5 },
      { title: 'Context Diagrams and Scope Models', description: 'Defining system boundaries, external entities, data flows, and visualizing what\'s in-scope vs out-of-scope for the solution.', order: 6 },
      { title: 'SWOT Analysis for Requirements', description: 'Using Strengths, Weaknesses, Opportunities, Threats analysis to evaluate solution options and inform business case development.', order: 7 },
      { title: 'Decision Tables and Trees', description: 'Modeling complex business rules, conditions, and actions using decision tables and decision trees for clarity and completeness.', order: 8 }
    ]
  },
  {
    folder: {
      id: 'elicitation-techniques',
      name: 'Elicitation Techniques',
      slug: 'elicitation-techniques',
      parentId: 'business-analysis-masterclass',
      description: 'Interviews, requirements workshops, observation, surveys, document analysis, brainstorming, prototyping, focus groups, and interface analysis.',
      path: ['business-analysis-masterclass', 'elicitation-techniques'],
      order: 5,
      featured: false,
      articleCount: 10,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Elicitation Planning', description: 'Preparing for elicitation: selecting techniques, scheduling sessions, preparing questions, identifying participants, and setting objectives.', order: 1 },
      { title: 'Interview Techniques', description: 'Conducting effective one-on-one interviews: open vs closed questions, active listening, probing for details, avoiding leading questions.', order: 2 },
      { title: 'Requirements Workshops (JAD, Focus Groups)', description: 'Joint Application Design (JAD) sessions, facilitated workshops to gather requirements collaboratively, and achieving group consensus.', order: 3 },
      { title: 'Observation and Job Shadowing', description: 'Observing users in their work environment to discover unstated needs, pain points, and workflow inefficiencies not captured in interviews.', order: 4 },
      { title: 'Document Analysis', description: 'Reviewing existing documentation (procedures, reports, forms, contracts) to understand current processes and extract implicit requirements.', order: 5 },
      { title: 'Surveys and Questionnaires', description: 'Designing effective surveys for large stakeholder groups, question types, response scales, and analyzing quantitative feedback.', order: 6 },
      { title: 'Brainstorming and Idea Generation', description: 'Facilitated brainstorming sessions, encouraging creative thinking, suspending judgment, and generating innovative solution ideas.', order: 7 },
      { title: 'Prototyping for Requirements Discovery', description: 'Using low-fidelity prototypes, mockups, and proof-of-concepts to elicit feedback, clarify requirements, and validate understanding early.', order: 8 },
      { title: 'Focus Groups', description: 'Conducting focus groups with representative user segments to gather qualitative insights, preferences, and uncover hidden needs.', order: 9 },
      { title: 'Interface Analysis', description: 'Analyzing system interfaces, integration points, and data exchanges between applications to define interface requirements.', order: 10 }
    ]
  },
  {
    folder: {
      id: 'requirements-modeling-visualization',
      name: 'Requirements Modeling & Visualization',
      slug: 'requirements-modeling-visualization',
      parentId: 'business-analysis-masterclass',
      description: 'BPMN process modeling, use case diagrams, user story writing, data modeling with ERDs, state diagrams, sequence diagrams, and wireframing.',
      path: ['business-analysis-masterclass', 'requirements-modeling-visualization'],
      order: 6,
      featured: false,
      articleCount: 8,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Introduction to Requirements Modeling', description: 'Purpose of visual models, when to use diagrams vs text, selecting appropriate modeling techniques, and maintaining model consistency.', order: 1 },
      { title: 'Process Modeling with BPMN', description: 'Business Process Model and Notation (BPMN) for documenting workflows, swimlanes, gateways, events, and standardized process visualization.', order: 2 },
      { title: 'Use Case Modeling (UML)', description: 'UML use case diagrams and descriptions: actors, use cases, relationships, and documenting system behavior from user perspective.', order: 3 },
      { title: 'User Story Writing (INVEST Criteria)', description: 'Writing effective user stories: Independent, Negotiable, Valuable, Estimable, Small, Testable. Format: As a [role], I want [feature] so that [benefit].', order: 4 },
      { title: 'Data Modeling Basics (ERD)', description: 'Entity Relationship Diagrams (ERD) to model data entities, attributes, relationships (one-to-many, many-to-many), and cardinality.', order: 5 },
      { title: 'State Diagrams', description: 'State machine diagrams to model object lifecycles, status transitions, triggers, and valid state changes for entities like orders or tickets.', order: 6 },
      { title: 'Sequence Diagrams', description: 'UML sequence diagrams to model interactions between system components, API calls, message flows, and timing of operations.', order: 7 },
      { title: 'Wireframing and Mockups', description: 'Creating low-fidelity wireframes and high-fidelity mockups to visualize UI requirements, layouts, navigation, and user interactions.', order: 8 }
    ]
  },
  {
    folder: {
      id: 'agile-business-analysis',
      name: 'Agile Business Analysis',
      slug: 'agile-business-analysis',
      parentId: 'business-analysis-masterclass',
      description: 'Agile BA mindset, Scrum role, backlog refinement, story estimation, acceptance criteria with Gherkin, SAFe, Kanban, and sprint ceremonies.',
      path: ['business-analysis-masterclass', 'agile-business-analysis'],
      order: 7,
      featured: false,
      articleCount: 9,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Agile BA Mindset and Principles', description: 'Agile Manifesto principles applied to BA work: embracing change, continuous collaboration, iterative discovery, and working software over documentation.', order: 1 },
      { title: 'The BA Role in Scrum', description: 'How BAs fit into Scrum teams, relationship with Product Owner, participating in sprints, and balancing analysis with delivery cadence.', order: 2 },
      { title: 'Backlog Refinement Best Practices', description: 'Continuous backlog grooming, breaking down epics into stories, adding acceptance criteria, estimating, and keeping the backlog ready for sprint planning.', order: 3 },
      { title: 'Story Estimation and Sizing', description: 'Estimation techniques: story points, planning poker, t-shirt sizing, relative estimation, and right-sizing stories for sprint commitment.', order: 4 },
      { title: 'Acceptance Criteria and Definition of Done (Gherkin)', description: 'Writing testable acceptance criteria using Given-When-Then format (Gherkin), and ensuring stories meet Definition of Done before sprint completion.', order: 5 },
      { title: 'Agile Requirements Documentation', description: 'Lightweight documentation in agile: living backlogs, wiki pages, just-in-time elaboration, and balancing documentation with conversation.', order: 6 },
      { title: 'BA in SAFe (Scaled Agile Framework)', description: 'Business Analyst role in large-scale agile: Program Increment planning, feature definition, solution intent, and coordinating across agile teams.', order: 7 },
      { title: 'Kanban for Requirements Flow', description: 'Using Kanban boards to visualize requirements workflow, WIP limits, managing flow efficiency, and continuous delivery of requirements.', order: 8 },
      { title: 'Sprint Reviews and Retrospectives for BAs', description: 'BA participation in sprint reviews (demo feedback, acceptance), and retrospectives (process improvement, elicitation effectiveness).', order: 9 }
    ]
  },
  {
    folder: {
      id: 'requirements-management-change-control',
      name: 'Requirements Management & Change Control',
      slug: 'requirements-management-change-control',
      parentId: 'business-analysis-masterclass',
      description: 'Requirements versioning, baselining, change request process, traceability management, tools (Jira, Azure DevOps), validation, UAT, and metrics.',
      path: ['business-analysis-masterclass', 'requirements-management-change-control'],
      order: 8,
      featured: false,
      articleCount: 9,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Requirements Management Overview', description: 'Ongoing requirements management activities: maintaining traceability, handling changes, version control, and ensuring requirements remain current.', order: 1 },
      { title: 'Requirements Versioning and Baselining', description: 'Establishing requirement baselines, versioning strategy, tracking changes between versions, and managing approved vs proposed requirements.', order: 2 },
      { title: 'Change Request Process', description: 'Formal change control: change request forms, impact analysis (scope, cost, schedule), CCB approval, and communicating approved changes.', order: 3 },
      { title: 'Requirements Traceability Management', description: 'Maintaining bi-directional traceability from business needs through design, development, testing, and deployment for impact analysis and coverage.', order: 4 },
      { title: 'Requirements Management Tools (Jira, Azure DevOps, DOORS)', description: 'Tool features for requirements lifecycle: Jira for agile, Azure DevOps for ALM, IBM DOORS for complex traceability, and tool selection criteria.', order: 5 },
      { title: 'Metrics for Requirements Quality', description: 'Measuring requirements quality: defect density, volatility, traceability coverage, review effectiveness, and using metrics to improve BA processes.', order: 6 },
      { title: 'Requirements Validation Techniques', description: 'Validating requirements correctness: reviews, walkthroughs, inspections, prototyping, and ensuring requirements meet stakeholder needs before build.', order: 7 },
      { title: 'Acceptance Testing and UAT Planning', description: 'Planning User Acceptance Testing: test scenarios from requirements, UAT environment setup, tester coordination, defect triage, go-live criteria.', order: 8 },
      { title: 'Measuring BA Effectiveness', description: 'KPIs for BA performance: requirements stability, stakeholder satisfaction, defect rates traced to requirements, time-to-market impact.', order: 9 }
    ]
  },
  {
    folder: {
      id: 'business-process-analysis',
      name: 'Business Process Analysis',
      slug: 'business-process-analysis',
      parentId: 'business-analysis-masterclass',
      description: 'Process discovery, AS-IS documentation, TO-BE design, value stream mapping, Lean and Six Sigma frameworks, RPA analysis, and process KPIs.',
      path: ['business-analysis-masterclass', 'business-process-analysis'],
      order: 9,
      featured: false,
      articleCount: 7,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Process Discovery Techniques', description: 'Methods to uncover current processes: interviews, workshops, observation, process mining tools, and documenting as-performed vs as-documented.', order: 1 },
      { title: 'AS-IS Process Documentation', description: 'Documenting current state processes with BPMN, identifying process owners, inputs, outputs, pain points, bottlenecks, and inefficiencies.', order: 2 },
      { title: 'TO-BE Process Design', description: 'Designing future state processes: eliminating waste, automating steps, simplifying handoffs, and ensuring TO-BE addresses AS-IS pain points.', order: 3 },
      { title: 'Value Stream Mapping (Lean)', description: 'Value stream mapping to visualize material and information flow, identify waste (7 wastes of Lean), and optimize for customer value delivery.', order: 4 },
      { title: 'Process Improvement Frameworks (Lean, Six Sigma, DMAIC)', description: 'Lean principles, Six Sigma methodology, DMAIC cycle (Define, Measure, Analyze, Improve, Control) for data-driven process improvement.', order: 5 },
      { title: 'Workflow Automation Analysis (RPA)', description: 'Identifying processes suitable for Robotic Process Automation (RPA), rule-based tasks, cost-benefit analysis, and automation requirements.', order: 6 },
      { title: 'Process Metrics and KPIs', description: 'Defining process performance indicators: cycle time, throughput, error rates, cost per transaction, and using metrics to track improvement.', order: 7 }
    ]
  },
  {
    folder: {
      id: 'data-analysis-for-bas',
      name: 'Data Analysis for BAs',
      slug: 'data-analysis-for-bas',
      parentId: 'business-analysis-masterclass',
      description: 'Data literacy, SQL fundamentals, data quality requirements, reporting and dashboard requirements, analytics techniques, and GDPR/CCPA compliance.',
      path: ['business-analysis-masterclass', 'data-analysis-for-bas'],
      order: 10,
      featured: false,
      articleCount: 6,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Data Literacy for Business Analysts', description: 'Understanding data types, data structures (relational, NoSQL), data warehouses vs data lakes, and interpreting data to inform requirements.', order: 1 },
      { title: 'SQL Fundamentals for BAs', description: 'Basic SQL queries (SELECT, WHERE, JOIN, GROUP BY) to query databases, validate data, and understand data relationships for requirements analysis.', order: 2 },
      { title: 'Data Quality Requirements', description: 'Defining data quality dimensions: accuracy, completeness, consistency, timeliness, validity, and specifying data quality acceptance criteria.', order: 3 },
      { title: 'Reporting and Dashboard Requirements', description: 'Eliciting reporting needs, defining KPIs and metrics, dashboard design principles, data visualization best practices, and report delivery frequency.', order: 4 },
      { title: 'Data Analysis Techniques (Descriptive vs Predictive)', description: 'Descriptive analytics (what happened), diagnostic (why), predictive (what will happen), prescriptive (what to do), and BA role in data-driven decisions.', order: 5 },
      { title: 'Data Privacy and Compliance (GDPR, CCPA)', description: 'Data privacy requirements: GDPR (EU), CCPA (California), consent management, data retention, right to deletion, and compliance impact on requirements.', order: 6 }
    ]
  },
  {
    folder: {
      id: 'applied-ba-case-studies',
      name: 'Applied BA - Case Studies & Lessons Learned',
      slug: 'applied-ba-case-studies',
      parentId: 'business-analysis-masterclass',
      description: 'Real-world case studies demonstrating BA techniques across industries: e-commerce, financial compliance, healthcare, agile transformation, APIs, data migration, process re-engineering, and lessons from failures.',
      path: ['business-analysis-masterclass', 'applied-ba-case-studies'],
      order: 11,
      featured: false,
      articleCount: 8,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: { status: 'complete' }
    },
    articles: [
      { title: 'Case Study: E-commerce Checkout Redesign', description: 'Complete BA walkthrough: stakeholder analysis, usability requirements, A/B testing criteria, payment gateway integration, and measuring conversion lift.', order: 1 },
      { title: 'Case Study: Financial Regulatory Compliance', description: 'SOX compliance project: working with auditors, defining internal controls, traceability to regulations, validation requirements, and audit trail reporting.', order: 2 },
      { title: 'Case Study: Healthcare EMR Integration', description: 'Electronic Medical Records integration: HIPAA compliance, HL7 messaging standards, clinical workflow analysis, and managing physician stakeholders.', order: 3 },
      { title: 'Case Study: Agile Transformation', description: 'Transitioning from waterfall to agile: BA role evolution, backlog creation from BRDs, coaching teams, managing cultural resistance, and lessons learned.', order: 4 },
      { title: 'Case Study: API Platform Requirements', description: 'Technical requirements for API platforms: REST API design, authentication (OAuth), rate limiting, API documentation, versioning, and developer experience.', order: 5 },
      { title: 'Case Study: Data Migration Project', description: 'Legacy system replacement: data mapping requirements, migration scripts, cutover planning, rollback strategy, validation criteria, and parallel run.', order: 6 },
      { title: 'Case Study: Business Process Re-engineering', description: 'End-to-end process redesign using Lean Six Sigma DMAIC: baseline metrics, waste elimination, automation opportunities, and achieving ROI targets.', order: 7 },
      { title: 'Lessons Learned from Failed Projects', description: 'Common failure patterns: inadequate stakeholder engagement, unclear requirements, scope creep, lack of validation, and how to recognize red flags early.', order: 8 }
    ]
  }
];

async function updateFirebaseDatabase() {
  console.log('🔄 Starting Firebase database update...\n');

  try {
    const batch = adminDb.batch();
    let folderCount = 0;
    let articleCount = 0;

    // 1. Create main folder
    console.log('📁 Creating main folder: Business Analysis Masterclass');
    const mainFolderRef = adminDb.collection('folders').doc(mainFolder.id);
    batch.set(mainFolderRef, mainFolder);
    folderCount++;

    // 2. Create module folders and articles
    for (const module of modules) {
      console.log(`\n📂 Module ${module.folder.order}: ${module.folder.name}`);

      // Create module folder
      const moduleFolderRef = adminDb.collection('folders').doc(module.folder.id);
      batch.set(moduleFolderRef, module.folder);
      folderCount++;

      // Create articles for this module
      for (const articleData of module.articles) {
        const slug = generateSlug(articleData.title);
        const articleId = `${module.folder.id}-${slug}`;

        const article = {
          id: articleId,
          title: articleData.title,
          slug: slug,
          folderId: module.folder.id,
          folderPath: module.folder.path,
          content: '', // Empty content for now
          excerpt: articleData.description,
          tags: [],
          order: articleData.order,
          status: 'draft',
          priority: 'medium',
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          metadata: {
            wordCount: 0,
            readingTime: 0
          }
        };

        const articleRef = adminDb.collection('articles').doc(articleId);
        batch.set(articleRef, article);
        articleCount++;

        console.log(`  ✓ Article ${articleData.order}: ${articleData.title}`);
      }
    }

    // Commit the batch
    console.log('\n💾 Committing to Firestore...');
    await batch.commit();

    console.log('\n✅ Database update complete!');
    console.log(`\nSummary:`);
    console.log(`  - Main folder created: 1 (featured: true)`);
    console.log(`  - Module folders created: ${folderCount - 1}`);
    console.log(`  - Total folders: ${folderCount}`);
    console.log(`  - Articles created: ${articleCount}`);
    console.log(`\nThe Business Analysis Masterclass is now available in Firebase!`);

  } catch (error) {
    console.error('\n❌ Error updating database:', error);
    throw error;
  }
}

// Run the update
updateFirebaseDatabase()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
