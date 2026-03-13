# Module 11: Applied BA Practices

Module 11 shifts from knowledge to mastery. Where earlier modules established the BABOK framework, techniques toolkit, and contextual perspectives, this module translates everything into actionable practice — drawing from the most respected practitioners in the field: Karl Wiegers and Joy Beatrice Hokanson on requirements engineering, Jeff Patton on user story mapping and discovery, Kevin Aguanno and Ori Schibi on agile business analysis, Ken Rubin on the Scrum framework, Barbara Champagne on the seven steps to mastering BA, the PMI on project-based requirements practices, and Patrick Li on agile project management tooling. These are not theoretical frameworks; they are working methods tested by practitioners across thousands of real projects. Read each article as a practitioner's playbook — something to act on, not merely understand.

**Sub-modules:**
- Sub-module 11.1: Requirements Engineering Essentials (10 articles)
- Sub-module 11.2: Agile Business Analysis in Depth (10 articles)
- Sub-module 11.3: Scrum Framework for Business Analysts (8 articles)
- Sub-module 11.4: PMI Requirements Practices (6 articles)
- Sub-module 11.5: Seven Steps to Mastering BA (7 articles)
- Sub-module 11.6: Agile Tools in Practice (3 articles — note: outline shows 3 but listed as 11.6.1–11.6.3)

---

## Sub-module 11.1: Requirements Engineering Essentials

Karl Wiegers and Joy Beatrice Hokanson distilled decades of requirements practice into twenty core practices that span the full project life cycle — from problem framing through change management. This sub-module works through each practice in clusters: practices 1–2 on problem orientation, 3–5 on scope and stakeholders, 6–10 on eliciting functional and non-functional requirements, 11–15 on analysis and modelling, and 16–20 on specification, review, and change. Each article draws directly from *Software Requirements, 3rd Edition* (Wiegers & Hokanson), which observed that projects using structured requirements practices cut rework by as much as 50% and delivered features stakeholders actually used. The practices are not bureaucratic — they are the minimum structure required to avoid the most common and most expensive failures in software development.

---

### 11.1.1 The 20 Core Practices Overview

**Requirements engineering is not a phase — it is a continuous discipline, and the teams that treat it as such deliver better products in less time with fewer costly surprises.** Wiegers and Hokanson, writing in *Software Requirements* (line 57,462), open their framework with a direct challenge to waterfall mythology: requirements are not gathered once and then locked; they are elicited, modelled, validated, baselined, and managed throughout the project. The twenty practices are the minimum set of habits that make this possible.

#### Why Twenty? The Logic of the Framework

The twenty practices are not arbitrary. They map to the complete arc of a project's requirements story: understanding the problem, identifying who is affected, discovering what is needed, modelling what was discovered, specifying it clearly, verifying it is correct, and managing changes when the world shifts. Wiegers and Hokanson (line 57,480) note that most requirements failures trace back to skipping one of these steps — usually the early ones, because teams are impatient to start building.

The practices fall into five clusters:

| Cluster | Practices | Purpose |
|---|---|---|
| Problem Orientation | 1–2 | Understand the real need before proposing solutions |
| Scope and Stakeholders | 3–5 | Bound the effort and identify all affected parties |
| Functional and Quality Requirements | 6–10 | Elicit what the system must do and how well it must do it |
| Analysis and Modelling | 11–15 | Organise and represent requirements analytically |
| Specification and Change Management | 16–20 | Document, review, and manage the requirements baseline |

#### What "Practice" Means in This Context

A practice is a disciplined habit, not a process step. You do not complete Practice 1 and move on. Practice 1 — understand the business problem or opportunity — is something you return to whenever the scope expands, a stakeholder changes, or the solution starts to feel disconnected from the original need. Wiegers and Hokanson (line 57,493) use the word *practice* deliberately: *"The most successful requirements engineers treat these practices as professional habits — things they do routinely, not episodically."*

#### The Cost of Skipping

Requirements defects are the most expensive class of defects to fix. A requirement error caught during elicitation costs roughly one unit to fix; the same error caught in testing costs twenty to fifty units; caught in production, it costs one hundred or more. The twenty practices are, at their core, an investment in defect prevention.

Wiegers and Hokanson (line 57,498) cite IBM studies showing that organisations using structured requirements practices delivered software with 50% fewer defects and 40% less rework. The return on the investment in requirements engineering is not philosophical — it is quantifiable.

#### The Role of the BA Across All Twenty Practices

The business analyst is the practices' primary custodian. Not because the BA owns requirements — no single person does — but because the BA is the one stakeholder with the skill, the scope, and the mandate to ensure that each practice is applied. The BA facilitates the problem analysis, conducts the stakeholder interviews, models the use cases, writes the specification, runs the reviews, and manages the change process. Other team members contribute; the BA organises.

#### Key Takeaways

- The twenty core practices span the full project life cycle and are designed to prevent the most common and costly requirements failures.
- Requirements work is a continuous discipline, not a phase — the practices are applied repeatedly, not once.
- The five clusters move from problem orientation through analysis to specification and change management.
- The BA is the primary custodian of requirements practices, though requirements are the shared responsibility of the full team.
- Investment in requirements quality has a measurable return: studies show 50% fewer defects and 40% less rework for teams with structured requirements practices.

---

### 11.1.2 Problem Before Solution

**The single most dangerous moment in any project is when a solution is named before the problem is understood — and the most valuable skill a BA brings to that moment is the discipline to ask why.** Wiegers and Hokanson (line 57,510) articulate Practice 1 with precision: *"Define the business problem or opportunity before you specify any solution. The solution you implement should directly address the real problem, not a symptom of it."* This is not philosophical advice; it is a structural discipline that prevents teams from building the wrong thing efficiently.

#### The Symptom Trap

Most project requests arrive as solution statements, not problem statements. *"We need a new mobile application."* *"We need to automate the approval workflow."* *"We need a customer portal."* Each of these may be the right solution — but none of them is a problem statement. The BA's first question is always: *what is the business outcome we are trying to achieve, and is this the best path to it?*

Wiegers and Hokanson (line 57,518) introduce the concept of the *problem statement* as a formal deliverable: a structured description of the current state, the desired state, and the gap between them. A well-formed problem statement includes: the problem itself, who is affected, the impact on the organisation, and what a successful solution would accomplish.

| Component | Example |
|---|---|
| The problem | Order confirmation emails take 3–5 days to reach customers |
| Affected parties | Customers, customer service team, fulfilment operations |
| Business impact | 22% customer complaint rate; 15% order cancellation before fulfilment |
| What success looks like | Confirmation delivered within 30 minutes of order placement; complaint rate below 5% |

#### Five Whys as a Practice

When stakeholders resist problem framing and push for immediate solution discussion, the five whys technique (line 57,525) gives the BA a neutral, curiosity-based tool to drill past symptoms. *"Why is the order confirmation delayed? Because the system processes orders in batch overnight. Why does it process in batch? Because the legacy database cannot handle concurrent real-time queries. Why not? Because it was designed in 1998 when the order volume was 10% of today's."* Three why-answers in, the team discovers the real problem: a legacy database architecture that cannot scale. The solution is likely a database replacement or middleware layer — not a new mobile application.

#### The Problem Statement as Scope Anchor

Wiegers and Hokanson (line 57,533) observe that a clear problem statement serves as the project's scope anchor. When scope creep appears — new features that do not connect to the stated problem — the BA can redirect the conversation: *"How does this feature address the problem we defined?"* If it does not, it belongs on a future backlog. The problem statement is the project's north star.

#### Champagne on Problem Focus

Barbara Champagne (*Seven Steps*, line 49,983) reinforces this principle from the practitioner's perspective: *"The project needs to clearly articulate the problem statement before the team begins to work on the solution. Too often a solution is chosen that does not fix the problem and then the project team or vendor is blamed."* Asking *why* early, when it is inexpensive to change direction, is the most cost-effective thing a BA does.

#### Key Takeaways

- Practice 1 requires defining the business problem or opportunity before any solution is specified.
- Most project requests arrive as solution statements — the BA's job is to translate them into problem statements.
- A well-formed problem statement identifies: the problem, affected parties, business impact, and success criteria.
- The five whys technique helps drill from symptoms to root causes.
- The problem statement serves as the project's scope anchor throughout development.

---

### 11.1.3 Business Objectives and Boundaries

**A project without explicit business objectives is a project without success criteria — which means there is no way to know when it is done, whether it was worth doing, or whether it delivered what was needed.** Wiegers and Hokanson (line 57,560) frame Practice 2 as the translation of the problem statement into measurable organisational goals: *"Identify the business objectives — the measurable outcomes the organisation expects to achieve — before defining the product's scope."*

#### From Problem to Objective

The business objective answers the question: *why should the organisation spend money on this?* It is not a feature list or a solution description. It is a statement of the organisational outcome expected from the investment. Wiegers and Hokanson (line 57,567) insist that objectives be SMART: specific, measurable, attainable, relevant, and time-bound.

| Weak Objective | Strong Objective |
|---|---|
| Improve customer satisfaction | Increase Net Promoter Score from 32 to 50 by Q4 |
| Speed up order processing | Reduce order fulfilment cycle time from 5 days to 1 day within 6 months |
| Modernise the system | Reduce system downtime from 8 hours/month to under 30 minutes/month |

The difference is not cosmetic. Weak objectives cannot be tested, which means the project can never be formally closed, and the BA has no basis for prioritising features (does this feature help achieve the objective?) or evaluating proposals (does this architecture support the target SLA?).

#### Solution Scope vs. Project Scope

Wiegers and Hokanson (line 57,578) draw a critical distinction between solution scope and project scope. *Project scope* is the work the team will do. *Solution scope* is the capabilities the finished product will provide. These are related but different. The BA owns solution scope; the project manager owns project scope. Confusing them — especially allowing project scope to constrain solution scope without discussion — is a major source of incomplete products.

The solution scope is typically documented in a *product vision statement* or *business requirements document* early in the project. It defines what the solution will and will not do, which business processes it will and will not touch, and which user communities it will and will not serve.

#### Boundaries as Protection

Champagne (*Seven Steps*, line 49,975) emphasises that defining boundaries is protective work, not limiting work: *"The project goals should be in line with and support enterprise-wide goals."* When the BA draws a clear boundary around the solution scope, stakeholders understand what they are getting. Scope creep — the gradual expansion of scope without corresponding adjustment of resources or schedule — is the direct consequence of unclear boundaries. The BA's boundary work prevents this.

#### The Scope Diagram

Wiegers and Hokanson (line 57,585) recommend the context diagram (also known as a scope diagram) as the primary tool for communicating solution boundaries. It shows the system being built in the centre and all external entities that interact with it around the perimeter — connected by named data flows. Everything inside the boundary is in scope; everything outside it is out of scope. The diagram is simple enough for executives and precise enough for developers.

#### Key Takeaways

- Practice 2 requires defining explicit, measurable business objectives before scoping the product.
- Objectives should be SMART — specific, measurable, attainable, relevant, and time-bound.
- Project scope (the work) and solution scope (the capabilities) are distinct — the BA owns solution scope.
- Explicit boundaries prevent scope creep and ensure stakeholders understand exactly what they are getting.
- The context diagram is the BA's primary tool for communicating solution scope visually.

---

### 11.1.4 Stakeholder Identification

**Every requirement has an owner, and every unstated need has a stakeholder who will surface it in testing or production — which is why the business analyst who skips thorough stakeholder identification always pays for it later, expensively.** Wiegers and Hokanson (line 57,600) frame Practice 3 as a systematic effort to identify all classes of individuals and organisations with an interest in the product's success, failure, or output. The word *systematic* is essential: stakeholder identification is not a brainstorming exercise completed in a single meeting.

#### The Stakeholder Onion

Wiegers and Hokanson (line 57,608) describe a layered stakeholder model. At the centre are direct users — people who interact with the system directly to accomplish their work. Around them are indirect users — people who use the output of the system but not the system itself (such as managers who read reports generated by the system). Beyond them are business stakeholders — people with a financial, regulatory, or strategic interest in the system. And at the outer layer are external entities — regulators, auditors, partner organisations, and customers who interact with the business processes the system supports.

Champagne (*Seven Steps*, line 47,969) expands this picture with a practical taxonomy of the roles a BA encounters:

| Stakeholder Role | Primary Relationship to the BA |
|---|---|
| Business executives | Strategic direction and approval authority |
| Product owners | Vision, prioritisation, and daily decisions |
| Project sponsors | Funding source and success definition |
| Project managers | Schedule, resources, and scope management |
| SMEs and users | Requirements knowledge and validation |
| QA analysts | Testability requirements and validation |
| IT architects | Technical feasibility and constraints |
| Trainers | Transition and change requirements |
| Vendors | Third-party solution constraints and capabilities |

#### User Classes and Representatives

Wiegers and Hokanson (line 57,618) introduce the concept of *user classes* — distinct subgroups of users who have different needs, usage patterns, technical sophistication, or frequencies of interaction. A single product may serve administrators, end users, read-only viewers, power users, and external partners — each with different requirements. Treating all users as a homogeneous group leads to a product that serves no one well.

Each user class should have a *user representative* — a specific person or small group who speaks for that class during elicitation and validation. The BA works with sponsors to identify and assign these representatives early; without them, requirements elicitation is speculative.

#### The Cost of Missing a Stakeholder

Missing a stakeholder is not a minor oversight. When a stakeholder who was not consulted discovers their needs were not addressed, the result is typically: late-stage scope change, expensive rework, or post-deployment enhancement requests that cost multiples of what early consultation would have cost. Wiegers and Hokanson (line 57,627) cite the regulatory stakeholder as the most commonly missed: *"External regulatory requirements... are often discovered late in the project when the business analyst failed to include regulators or compliance officers in the stakeholder analysis."*

Champagne (*Seven Steps*, line 47,934) reinforces why this matters from the trust perspective: *"As a BA, you have very little formal control or supervisory authority over the people with whom you will be working. Your best chance at successful requirements elicitation and solution identification will be your stakeholders' confidence and trust in you."* Comprehensive stakeholder identification is the prerequisite for that trust.

#### Key Takeaways

- Practice 3 requires systematic identification of all stakeholder classes — not a single brainstorm session.
- The stakeholder model has layers: direct users, indirect users, business stakeholders, and external entities.
- User classes — distinct subgroups with different needs — must be identified and represented individually.
- Each user class should have a named representative who participates in elicitation and validation.
- Missing a stakeholder creates expensive late-stage rework; the cost of thorough identification is always less than the cost of the resulting rework.

---

### 11.1.5 Usage-Centric Requirements

**The majority of system failures in production are not technical failures — they are failures of imagination: teams that built exactly what was specified but never asked what users actually needed to do.** Wiegers and Hokanson (line 57,640) define Practice 6 as usage-centric requirements: *"Describe the tasks that users need to perform with the system, not the features the system will provide."* This inversion — task first, feature second — produces requirements that align with real user work and makes it easier to detect gaps, conflicts, and missing functionality.

#### Use Cases and User Stories: The Usage Perspective

The BA has two primary tools for capturing usage-centric requirements: use cases and user stories. Wiegers and Hokanson (line 57,648) describe use cases as structured descriptions of the sequence of interactions between a user (actor) and the system to accomplish a specific goal. User stories (as developed by the agile community and described in Patton, line 65,200) are lightweight placeholders that capture the same intent in conversational form: *"As a [user type], I want to [accomplish something] so that [I achieve this benefit]."*

| Representation | Form | Best Used When |
|---|---|---|
| Use Case | Structured narrative with main flow, alternate flows, exceptions | Formal specifications, complex transactional systems, regulatory contexts |
| User Story | Conversational card — "As a... I want... so that..." | Agile teams, iterative development, discovery contexts |

Both formats answer the same question: *what does the user need to accomplish, and through what sequence of interactions?*

#### Activity Decomposition

Wiegers and Hokanson (line 57,655) introduce activity decomposition as the technique for identifying all usage scenarios from high-level tasks. Starting from a user's primary goal (such as "process an insurance claim"), the BA decomposes it into discrete activities (review claim, verify coverage, calculate benefit, approve or deny), then into specific interactions, then into the system responses those interactions require. This structured decomposition ensures completeness — the BA can see what has been covered and what has not.

#### Actors and Their Goals

The BA begins use case work by identifying the actors — the external entities that interact with the system. An actor is not always a person; it can be a timer, another system, or an external data feed. Wiegers and Hokanson (line 57,662) emphasise that each actor should be associated with goals — things they want to achieve through the system. These actor-goal pairs become the use case inventory. A product with five primary actors and four to six goals each has a use case inventory of twenty to thirty items — a manageable and comprehensive scope definition.

#### The Benefits of Usage-Centric Thinking

Usage-centric requirements produce three benefits that feature-centric requirements do not: (1) they make scope decisions easier — a proposed feature either supports an identified use case or it does not; (2) they drive test case generation directly — each use case becomes one or more test scenarios; and (3) they create natural prioritisation criteria — use cases that affect the most users or the most critical goals are highest priority.

Champagne (*Seven Steps*, line 47,418) affirms the importance of usage-centric framing when defining what a requirement actually is: *"A requirement can be documented and presented as a sentence, structured sentence, table, diagram, model, prototype, storyboard — any format that communicates."* The format is secondary; what matters is that the representation captures what the user needs to do.

#### Key Takeaways

- Practice 6 requires describing user tasks rather than system features — the task comes first, the feature follows from it.
- Use cases and user stories are the two primary representations of usage-centric requirements.
- Activity decomposition breaks high-level user goals into discrete interactions, ensuring completeness.
- Actors are the entities that interact with the system — each actor should be associated with named goals.
- Usage-centric requirements simplify scope decisions, drive test generation, and create natural prioritisation criteria.

---

### 11.1.6 Events, Data, and Quality Attributes

**Every system exists to process events, transform data, and meet quality expectations — and the BA who elicits only functional features while neglecting events, data, and quality attributes is building an incomplete picture that will produce an incomplete product.** Wiegers and Hokanson cover Practices 7, 8, and 9 in sequence because they are complementary: events drive the system's behaviour, data defines what flows through it, and quality attributes define how well it must perform every function.

#### Practice 7: Events and Responses

An event is something that happens in the system's environment that requires a response. Wiegers and Hokanson (line 57,680) categorise events into three types:

| Event Type | Example | System Response |
|---|---|---|
| External event | Customer submits order | Create order record, send confirmation |
| Temporal event | End of business day | Generate daily transaction summary |
| State change event | Stock falls below reorder threshold | Trigger purchase order creation |

The *event-response list* is a simple but powerful technique: enumerate all events the system must respond to, describe the expected response for each, and identify the data required to produce that response. The resulting list is often more complete than a feature list because it captures reactive behaviours — things the system must do when something happens — that feature-based thinking often misses.

#### Practice 8: Data Concepts

Every requirement involves data: data that the user provides, data that the system maintains, data that the system produces. Wiegers and Hokanson (line 57,695) specify that the BA must elicit the data dictionary — the canonical list of data items the system will use, store, and produce, with their definitions, formats, relationships, and business rules.

A data dictionary entry for a customer record, for example, specifies: what constitutes a valid customer ID, what fields are required, what the rules for address format are, how the record is created and deleted, and what other records reference it. Without this precision, developers make assumptions that diverge from business intent — producing subtle defects that surface only in edge cases.

Champagne (*Seven Steps*, line 47,418) frames data requirements as one of the four core requirements components: *"information is data: products for sale, prices, inventory, tax rate."* Without clear data requirements, the other three components — people, processes, and rules — cannot be specified precisely.

#### Practice 9: Quality Attributes (Non-Functional Requirements)

Quality attributes define not what the system does but how well it does it. Wiegers and Hokanson (line 57,710) list the primary quality attribute categories:

| Category | What It Defines | Example Requirement |
|---|---|---|
| Performance | Response time, throughput, capacity | System processes 500 concurrent users with sub-2-second response |
| Reliability | Mean time between failures, availability | System achieves 99.9% uptime during business hours |
| Security | Access control, data protection | All PII encrypted at rest and in transit using AES-256 |
| Usability | Ease of use, learnability | New users complete core workflow in under 10 minutes without training |
| Maintainability | Code quality, documentation standards | System deployed to new environment in under 2 hours |
| Scalability | Capacity growth | System supports 10x current load without architecture change |

Quality attributes are often the most neglected class of requirements and the most frequently cited cause of production failures. A system that does the right things too slowly, unreliably, or insecurely has not fulfilled its requirements.

Champagne (*Seven Steps*, line 53,305) frames the BA's specific responsibility for quality attributes: *"The experienced analyst also considers performance requirements when helping to design a solution — specific performance requirements must be elicited by the analyst even though they will often be difficult for SMEs and users to articulate."* The difficulty of eliciting them is precisely why they are so often missed.

#### Key Takeaways

- Practice 7 requires cataloguing all events the system must respond to and specifying the expected response for each.
- The event-response list captures reactive behaviours that feature-based elicitation often misses.
- Practice 8 requires a data dictionary defining the data items the system uses, stores, and produces with precision.
- Practice 9 requires specifying quality attributes — performance, reliability, security, usability, maintainability, scalability — not just functional features.
- Quality attributes are the most commonly neglected class of requirements and the most frequent cause of production failures.

---

### 11.1.7 Analyzing and Modeling

**Analysis without a model is analysis without a shared language — and when the BA's understanding lives only in notes and memory, the first person who misremembers a detail becomes the source of a defect.** Wiegers and Hokanson (line 57,730) frame Practices 11 through 15 as the analytical heart of requirements engineering: the work of organising, structuring, and visually representing what has been elicited. Models are not documentation overhead; they are thinking tools that reveal gaps, conflicts, and ambiguities that text alone hides.

#### Why Models Are Indispensable

Wiegers and Hokanson (line 57,735) explain the cognitive value of modelling: *"No single representation of requirements reveals everything. Each model illuminates certain aspects of a problem while obscuring others. Using several different models of the same requirement often exposes different issues."*

The five modelling types that Wiegers and Hokanson use most frequently:

| Model Type | What It Reveals | Primary Use |
|---|---|---|
| Use Case Diagram | System boundary, actors, high-level capabilities | Scope definition |
| Flow Diagram (BPMN/Flowchart) | Sequence, decision points, handoffs | Process requirements |
| Entity-Relationship Diagram | Data entities, attributes, relationships | Data requirements |
| State Machine Diagram | System states, transitions, triggering events | Complex object lifecycle |
| Class Diagram | Data structure, behaviour, inheritance | Object-oriented design input |

No project needs all five. The BA selects the models that best illuminate the problem domain. A financial system with complex state transitions (pending, active, suspended, closed) benefits from a state machine. A logistics system with complex data relationships benefits from an ERD. A business process automation project benefits from flow diagrams.

#### Analysis: Looking for Gaps, Conflicts, and Ambiguities

Wiegers and Hokanson (line 57,745) specify three classes of analytical problems the BA is looking for:

1. **Gaps** — requirements that are missing. If a use case for "process refund" exists but there is no requirement for the notification that must go to the customer, there is a gap.
2. **Conflicts** — requirements that contradict each other. Stakeholder A says the system must archive records after 90 days; stakeholder B says the system must retain records for 7 years. These requirements cannot both be satisfied.
3. **Ambiguities** — requirements that are open to interpretation. "The system shall respond quickly" is ambiguous. "The system shall return search results within 1 second for 95% of queries" is not.

#### Requirements Prioritisation

Practice 13 introduces prioritisation as an analytical activity, not just a business preference. Wiegers and Hokanson (line 57,758) describe three dimensions of priority: (1) business value — how much value the requirement delivers; (2) technical risk — how uncertain the implementation approach is; and (3) dependencies — whether other requirements depend on this one. A requirement with high value, high risk, and high dependency should be implemented early; one with low value, low risk, and no dependencies should be deferred or cut.

Champagne (*Seven Steps*, line 55,879) extends this to the BA's daily practice: *"What your manager may value, and therefore prioritise, is probably different than what your project manager will prioritise... Defining the criteria first helps you to keep an objective view."*

#### Key Takeaways

- Practices 11–15 form the analytical heart of requirements engineering — organising, structuring, and modelling what has been elicited.
- Models are thinking tools, not documentation overhead — each type reveals different aspects of the problem.
- The five primary model types are use case diagrams, flow diagrams, ERDs, state machines, and class diagrams — select the types that best illuminate the problem domain.
- Analysis looks for three problem classes: gaps (missing requirements), conflicts (contradictory requirements), and ambiguities (open-to-interpretation requirements).
- Prioritisation requires considering business value, technical risk, and dependencies — not just stakeholder preferences.

---

### 11.1.8 Prioritization and Assumptions

**The requirement that a BA leaves un-prioritised is the requirement that the team builds in the wrong order — and in a project under time or budget pressure, the wrong order means the most valuable features may never be delivered.** Wiegers and Hokanson (line 57,780) treat prioritisation as one of the most consequential analytical skills in the BA's toolkit, because it determines what gets built, in what order, and — when constraints hit — what gets cut.

#### MoSCoW: A Practical Framework

The MoSCoW framework (Must have, Should have, Could have, Won't have this time) gives teams a shared vocabulary for priority that stakeholders can use without needing to understand technical complexity. Wiegers and Hokanson (line 57,787) are careful to distinguish *priority* from *urgency*: some requirements are urgent but not important; some are important but not urgent. The BA's job is to ensure the team is building what is important, not merely what is being asked for loudest.

| Priority Tier | Meaning | Consequence If Excluded |
|---|---|---|
| Must Have | Non-negotiable — without this, the product has no value | Product cannot be released |
| Should Have | High value but could be deferred one release | Significant business impact |
| Could Have | Nice to have — adds value but not critical | Minor inconvenience |
| Won't Have | Explicitly descoped for this release | No impact this release |

#### Assumptions: The Hidden Requirements

Wiegers and Hokanson (line 57,797) introduce assumptions as a category of requirements artefact that most teams ignore until they become defects. An assumption is a belief the team holds about the system's environment that has not been verified. *"Users will have internet access."* *"The external API will return data within 500 milliseconds."* *"The organisation will have completed the database migration before deployment."*

Each assumption is a risk. If the assumption is wrong, the system may fail — not because the code is wrong, but because the world was different from what the team assumed. The BA's practice is to make assumptions explicit, document them, and assign ownership for validating them.

Champagne (*Seven Steps*, line 49,874) reinforces this: *"When you estimate, always document the assumptions upon which you based the estimate. This helps capture the timeliness of your estimate because things can change from the time you do your research to the time a person is reviewing it."*

#### Dependencies: The Requirements Graph

Wiegers and Hokanson (line 57,808) describe requirements dependencies as the network of relationships between requirements: requirement A cannot be tested until requirement B is implemented; requirement C is only useful if requirement D exists. Mapping this network helps the team sequence work correctly and avoid situations where high-priority features cannot be demonstrated because their dependencies were deferred.

#### Key Takeaways

- Prioritisation determines build order and — under constraints — what gets cut; it is one of the most consequential BA skills.
- MoSCoW (Must/Should/Could/Won't) provides a stakeholder-accessible prioritisation vocabulary.
- Priority and urgency are distinct — the BA ensures the team builds what is important, not merely what is loudest.
- Assumptions are hidden requirements — they must be documented, owned, and validated.
- Requirements dependencies form a network that determines the correct sequencing of implementation work.

---

### 11.1.9 Writing and Organizing Requirements

**A requirement that cannot be understood by both the developer who must build it and the tester who must verify it is not a requirement — it is a source of future defects.** Wiegers and Hokanson (line 57,830) devote Practices 16 and 17 to the craft of writing requirements that are unambiguous, complete, verifiable, and consistently structured. This is not pedantry; poorly written requirements are a leading cause of software defects.

#### The Qualities of a Good Requirement

Wiegers and Hokanson (line 57,838) specify the properties every well-written requirement must possess:

| Quality | Definition | Failure Mode |
|---|---|---|
| Correct | Accurately represents stakeholder needs | Builds the wrong thing |
| Unambiguous | Only one valid interpretation | Different stakeholders understand different things |
| Complete | Contains all information needed | Developer invents missing details |
| Consistent | Does not contradict other requirements | Conflicting implementations |
| Verifiable | Can be tested | Cannot determine if requirement is met |
| Traceable | Linked to its origin and its implementation | Cannot determine if all needs are satisfied |
| Modifiable | Can be changed without requiring global rework | Change propagates unpredictably |
| Prioritised | Has explicit priority level | Built in wrong order |

#### Shall vs. Should: Mandatory vs. Optional

Wiegers and Hokanson (line 57,848) are precise about modal verb usage: *"shall"* denotes a mandatory requirement; *"should"* denotes a recommendation; *"may"* denotes a permission or option. Teams that mix these verbs create requirements that are ambiguous about whether they represent obligations or preferences. The BA enforces consistent modal verb usage in all requirements documentation.

#### The Software Requirements Specification Structure

Practice 17 introduces the SRS (Software Requirements Specification) as the primary vehicle for organising requirements. Wiegers and Hokanson (line 57,858) describe its essential structure: introduction and scope, stakeholder profiles, use cases, functional requirements (organised by feature area), data requirements, external interface requirements, quality attribute requirements, and business rules. Not every project needs a formal SRS, but every project needs the *substance* the SRS represents — somewhere, organised and accessible.

Champagne (*Seven Steps*, line 47,398–47,410) acknowledges the format flexibility: *"A requirement can be documented and presented as a sentence, structured sentence, table, diagram, model, prototype, storyboard — any format that communicates."* The format is not the requirement; the need it represents is.

#### Key Takeaways

- Practices 16–17 cover the craft of writing requirements: each requirement must be correct, unambiguous, complete, consistent, verifiable, traceable, modifiable, and prioritised.
- Modal verb discipline — shall (mandatory) vs. should (recommended) vs. may (optional) — prevents ambiguity.
- The SRS structure organises requirements into: scope, stakeholders, use cases, functional requirements, data, interfaces, quality attributes, and business rules.
- Format is a vehicle for communication — the requirement's substance, not its format, is what matters.
- Every project needs the substance of good requirements organisation, even if it does not produce a formal SRS.

---

### 11.1.10 Validation and Change Management

**A requirement that has never been validated with the stakeholders who own it is a guess — and change management without a formal process is just hoping that important changes do not slip through unnoticed.** Wiegers and Hokanson close their twenty practices with Practices 18, 19, and 20: requirements reviews, baselined change control, and requirements management tools. These three practices convert the requirements process from an activity that happens once into a continuous discipline.

Wiegers and Hokanson (line 57,875) frame the stakes of validation directly: *"A requirements defect that is not discovered until implementation costs ten to fifty times more to fix than one discovered during the requirements review. The goal of the review is to find defects, not to validate that the BA did a good job."*

#### Practice 18: Requirements Reviews

Wiegers and Hokanson (line 57,880) specify requirements reviews — structured inspection meetings where stakeholders and developers examine the requirements specification for defects — as the primary quality assurance activity for requirements. Reviews catch errors that individuals miss because of cognitive biases: the author who wrote the requirement tends to read it as they intended it, not as it reads.

A requirements review should include: the author (BA), domain SMEs, QA representatives, and technical leads. Each participant plays a different role: SMEs verify accuracy; QA evaluates testability; technical leads assess feasibility. Wiegers and Hokanson (line 57,888) report that structured requirements reviews find 40–60% of requirements defects before implementation begins — defects that would cost ten to fifty times more to fix later.

#### Practice 19: Baseline and Change Control

Baselined requirements are requirements that have been formally approved and placed under change control. Wiegers and Hokanson (line 57,897) define the baseline as the reference point against which all proposed changes are evaluated. Change control does not mean changes cannot be made — it means changes are deliberate, visible, analysed for impact, and approved by appropriate authority before implementation.

The change request process includes: description of the change, justification, impact analysis (schedule, cost, effort, affected requirements), prioritisation against current backlog, and approval or rejection. The BA is typically responsible for managing this process and presenting impact analyses to the decision-makers.

| Change Control Step | Who Owns It | Key Output |
|---|---|---|
| Change request submission | Any stakeholder | Change request form |
| Impact analysis | BA + technical team | Impact assessment |
| Prioritisation | Product owner / sponsor | Priority recommendation |
| Approval | Change control board | Approval or rejection |
| Implementation tracking | BA + PM | Updated requirements baseline |

#### Practice 20: Requirements Management Tools

Requirements management tools provide traceability, version control, and impact analysis capabilities that manual tracking cannot match beyond a small project. Wiegers and Hokanson (line 57,910) do not prescribe specific tools, but specify the capabilities any adequate tool must provide: requirements storage, hierarchical organisation, attribute tracking (priority, status, owner), traceability links between requirements and tests, change history, and baseline management.

Champagne (*Seven Steps*, line 55,602) reinforces that the governance question must be answered before tools can be selected: *"Will you require formal sign-off and change management of requirements, or will these be constantly reviewed and refined with your stakeholders? Where are you going to put all of this information as you collect and analyse it?"* The tool must match the governance model, not the other way around.

#### Key Takeaways

- Practice 18: requirements reviews catch 40–60% of defects before implementation — structured peer inspection is the primary QA mechanism for requirements.
- Practice 19: baselined change control makes changes deliberate, visible, analysed, and approved — it does not prevent change, it governs it.
- The change request process includes: submission, impact analysis, prioritisation, approval, and tracking.
- Practice 20: requirements management tools provide the traceability, version control, and impact analysis that manual processes cannot sustain beyond small projects.
- The three closing practices convert requirements from a one-time activity into a continuous discipline.

---

## Sub-module 11.2: Agile Business Analysis in Depth

Jeff Patton's *User Story Mapping* (lines 65,096–74,000) and Aguanno & Schibi's *Agile Business Analysis* (lines 74,577–79,211) together constitute the practitioner's canon on agile BA. Patton revolutionised how teams think about backlogs — replacing the flat, one-dimensional list with a two-dimensional map that preserves the user narrative. Aguanno and Schibi systematised the agile BA role, mapping the BA's activities across ceremonies, deliverables, and collaboration patterns in an iterative context. This sub-module treats both sources as practitioner handbooks, not theories.

---

### 11.2.1 The Agile BA Role

**The agile business analyst is not a requirements writer with a sticky note habit — they are the team's narrative guardian, the person who ensures that the conversation about what to build never loses sight of why it matters.** Aguanno and Schibi (line 74,600) open their treatment of the agile BA role with a structural observation: *"Agile business analysis is not simply about replacing traditional requirements artefacts with lighter-weight alternatives. It is about shifting the focus from documentation to conversation, from hand-offs to collaboration, and from specification to understanding."*

#### What the Agile BA Does

Aguanno and Schibi (line 74,615) describe the agile BA's core activities across the iteration lifecycle:

| Activity | When | Purpose |
|---|---|---|
| Backlog preparation | Pre-sprint | Ensure stories are ready for planning |
| Story workshop facilitation | Pre-sprint / mid-sprint | Decompose epics into sprint-ready stories |
| Acceptance criteria authoring | Pre-sprint | Define what done looks like for each story |
| Sprint ceremony participation | Throughout sprint | Keep the team aligned with business intent |
| In-sprint clarification | During sprint | Answer developer and QA questions about intent |
| Demo participation | Sprint review | Ensure business value is demonstrated accurately |
| Retrospective contribution | End of sprint | Identify BA process improvements |

#### BA vs. Product Owner: The Crucial Distinction

Aguanno and Schibi (line 74,628) address the most common role confusion in agile teams: the boundary between the BA and the product owner. The product owner owns the *what* — the vision, the priority, and the business case. The BA owns the *how well it is understood* — the analysis depth, the acceptance criteria precision, and the team's shared picture of what done looks like. These roles are complementary, not competitive.

Champagne (*Seven Steps*, line 48,038) characterises this distinction from the stakeholder perspective: *"Bringing the decision maker information is what the relationship is all about."* The BA brings analysis; the product owner brings authority. Confusing them weakens both.

#### The Proxy Product Owner

When the actual product owner cannot be available to the team full-time — which is common, particularly in large organisations with constrained senior stakeholder time — Aguanno and Schibi (line 74,640) describe the *proxy product owner* role: a BA who represents the product owner in daily team interactions, answering questions about requirements intent, clarifying acceptance criteria, and escalating prioritisation decisions that exceed their authority. The proxy PO reduces developer idle time without replacing the product owner's authority.

#### T-Shaped BA Skills in Agile

Aguanno and Schibi (line 74,655) describe the agile BA as needing T-shaped skills: broad knowledge of the full business domain (the horizontal bar of the T) combined with deep expertise in requirements analysis, user story writing, and stakeholder facilitation (the vertical bar). The breadth allows the BA to connect the dots across business processes; the depth allows them to specify requirements with precision.

#### Key Takeaways

- The agile BA shifts focus from documentation to conversation, from hand-offs to collaboration, from specification to understanding.
- BA activities span the full sprint lifecycle: preparation, planning, daily support, review, and retrospective.
- The BA and product owner are complementary: the BA owns analysis depth and shared understanding; the product owner owns vision and authority.
- The proxy PO role allows the BA to represent the PO in daily interactions without usurping their authority.
- T-shaped BA skills combine broad business domain knowledge with deep requirements analysis expertise.

---

### 11.2.2 Agile vs. Traditional Requirements

**The difference between traditional and agile requirements is not a difference in rigour — it is a difference in timing, form, and the location of the conversation.** Patton (*User Story Mapping*, line 65,200) makes the core point in his characteristically direct way: *"Users are far better critics than they are authors. If you ask a user what they want, they may not be able to answer — or they may give you exactly what they asked for, and when they see it, want something different."* Agile requirements are structured to accommodate this reality; traditional requirements are structured to prevent it — and they fail, because it cannot be prevented.

#### The Documentation Debate

Wiegers and Hokanson approach requirements from a documentation-first orientation; Patton approaches them from a conversation-first orientation. Neither is wrong. Wiegers and Hokanson work in contexts where regulatory compliance, system complexity, or team distribution requires formal specification. Patton works in contexts where working software is the fastest path to validated understanding. The BA must read the context.

| Dimension | Traditional Requirements | Agile Requirements |
|---|---|---|
| Timing | Front-loaded — defined before development | Just-in-time — defined as the team needs them |
| Form | Formal documents — SRS, use cases, BRD | Conversational — stories, acceptance criteria, wireframes |
| Completeness | Complete specification before development | Good enough specification for the next iteration |
| Change process | Formal change control | Backlog re-prioritisation |
| Stakeholder role | Review and approve documents | Continuous conversation with team |

#### What Stays the Same

The conversation between traditional and agile requirements often obscures what does not change. Both approaches require: understanding the business problem, identifying stakeholders, eliciting needs, validating understanding, and managing change. The activities are the same; the frequency, formality, and sequencing differ.

Aguanno and Schibi (line 74,670) note: *"The fundamental activities of business analysis — eliciting, analysing, communicating, and managing requirements — are the same in agile as in traditional development. What changes is when and how those activities occur."*

#### The Waste of Premature Specification

Patton (line 65,210) introduces the waste concept as central to why agile requirements are structured as they are. In a waterfall project, the BA writes a complete specification. Development begins. When requirements change — as they always do — the BA rewrites portions of the specification. The original specification was partially wasted. In agile, the BA writes only what the team needs for the next iteration. Nothing is written that is not immediately usable; nothing is wasted.

Aguanno and Schibi (line 74,678) catalogue the seven types of agile waste: defects, overproduction (building features no one uses), transportation (handoffs), waiting, inventory (unused work products), motion (non-value-adding movement), and over-processing (doing more work than needed). Premature specification is a form of overproduction.

#### Key Takeaways

- The difference between traditional and agile requirements is timing, form, and the location of the conversation — not the underlying activities.
- Traditional requirements front-load specification; agile requirements deliver just-in-time, iteration by iteration.
- Both approaches require: problem understanding, stakeholder identification, need elicitation, validation, and change management.
- Premature specification is a form of overproduction — it produces work products that will be partially discarded or reworked.
- The BA's job in agile is to ensure the team has a shared, accurate, and current understanding — not to produce comprehensive documentation.

---

### 11.2.3 Writing Effective User Stories

**A user story that does not include its acceptance criteria is a birthday wish — it expresses desire without creating the shared understanding that allows a team to know when desire has been satisfied.** Aguanno and Schibi (line 74,700) and Patton (line 65,300) converge on a definition of effective user story writing that combines the structural discipline of the INVEST criteria with the conversational richness of acceptance criteria.

#### The User Story Formula

The standard user story formula — *"As a [type of user], I want [some goal] so that [some reason]"* — is a placeholder for a conversation, not a complete specification. Patton (line 65,305) is explicit: *"The story is a promise to have a conversation about the requirement. The card is the placeholder; the conversation is where understanding lives; the confirmation is how you know the conversation produced shared understanding."*

This three-part model — card, conversation, confirmation — defines the BA's role in story writing. The BA authors the card, facilitates the conversation, and writes the confirmation (acceptance criteria) that records what was agreed.

#### INVEST Criteria in Practice

Aguanno and Schibi (line 74,710) apply the INVEST framework to story quality assessment:

| Criterion | Test | If Failed |
|---|---|---|
| **I**ndependent | Can this story be built and tested without waiting for another? | Restructure to remove dependency |
| **N**egotiable | Is the detail level open to discussion between BA and team? | Remove over-specified details |
| **V**aluable | Does it deliver value to the user or business? | Justify or remove |
| **E**stimable | Can the team estimate the effort required? | Break down or clarify |
| **S**mall | Will it fit within a single sprint? | Split into smaller stories |
| **T**estable | Can an acceptance test be written for it? | Clarify or remove ambiguity |

#### Acceptance Criteria: The Confirmation Layer

Acceptance criteria define the specific conditions a story must satisfy to be considered done. They are the contract between the BA (representing the product owner) and the development team. Rubin (line 25,520) is precise about their purpose: *"Acceptance criteria define the boundaries of a user story and help the team understand what the product owner needs — they allow the team to determine when the work is done."* Well-written acceptance criteria:

- Are written in Given-When-Then format: *"Given [context], When [action], Then [outcome]."*
- Cover the happy path, alternative paths, and edge cases.
- Are testable — a QA analyst can write a test case directly from each criterion.
- Are agreed upon before development begins.

A story without acceptance criteria creates decision space for developers — which means developers make requirements decisions, which is not their role and typically produces technically correct but functionally incomplete implementations.

#### Key Takeaways

- A user story is a promise to have a conversation, not a complete specification — card, conversation, and confirmation are its three components.
- INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable) provide the quality framework for evaluating user stories.
- Acceptance criteria define the conditions that must be satisfied for a story to be done — they are the BA's primary analytical contribution to each story.
- Given-When-Then format produces acceptance criteria that are testable, scenario-based, and directly traceable to test cases.
- Stories without acceptance criteria create developer decision space — which produces technically correct but functionally incomplete implementations.

---

### 11.2.4 User Story Mapping

**The flat backlog is a lie — it presents all features as equal in a sequence that erases the narrative thread connecting them, making it impossible to see what the user is actually trying to do.** Jeff Patton (*User Story Mapping*, line 65,350) developed story mapping specifically to fix this: *"A story map tells the story of the product and how it fits in people's lives. That story provides context for all the individual stories and helps everyone understand how they work together to create something valuable."*

#### The Story Map Structure

A story map is a two-dimensional grid. The horizontal axis represents the user's narrative — their journey through the product, from left to right, in the order they experience it. The vertical axis represents depth and priority — the most essential activities at the top, the enhancements and variations below. This structure allows the team to see the full user story, carve off releases horizontally, and understand why each feature exists.

Patton (line 65,360) uses a specific vocabulary:

| Level | Term | Definition |
|---|---|---|
| Top | User activities | The large-scale things users do (e.g., "Buy a product") |
| Middle | User tasks | The specific things users do within each activity (e.g., "Search", "Select", "Checkout") |
| Bottom | Story details | The specific variations and alternatives (e.g., "Search by name", "Search by colour") |

The activities form the map's *backbone* — the narrative spine. The tasks hang below each activity. The stories hang below each task.

#### The Flat Backlog Problem: Gary's Story

Patton (line 65,375) illustrates the flat backlog problem through "Gary's story": a product manager who organises all his requirements on a flat list, prioritises them, and gives the first sprint's worth to the team. When the sprint is done, the product manager looks at the resulting product and says: *"This doesn't work."* The team built the top-priority items. But the top-priority items, taken without their context, produced a product without a coherent user experience. The map would have shown Gary that the high-priority items were all from the top of the map — without the middle and bottom layers, they were features without a story.

#### Release Planning with Story Maps

Patton (line 65,390) shows how story maps drive release planning: draw a horizontal line through the map at the level of the minimum viable product. Everything above the line is in Release 1; everything below is deferred. This makes the scope decision visible and discussable — rather than arguing about which features are "high priority," teams can see whether their release candidate tells a complete user story.

Rubin (line 30,082–30,098) describes the same concept in Scrum vocabulary: *"At the highest level are the epics, representing the large activities of measurable economic value to the user... Next we think about the sequence or common workflow of user tasks that make up the epic."*

#### Key Takeaways

- Story mapping replaces the flat backlog with a two-dimensional grid: horizontal axis = user narrative; vertical axis = priority depth.
- The map's backbone (user activities) preserves the narrative that flat backlogs erase.
- Story map levels: user activities → user tasks → story details.
- Release planning with story maps: draw a horizontal line at the minimum viable product level; everything above is in scope.
- The flat backlog problem: high-priority features without narrative context produce technically correct but experientially incomplete products.

---

### 11.2.5 Agile Documentation

**Agile does not mean no documentation — it means documentation that serves the team, not the process.** Aguanno and Schibi (line 74,720) address the documentation question directly and pragmatically: *"The appropriate level of documentation in an agile project is determined by asking one question: will this document be used by the team, and when? If the answer is yes, write it. If the answer is no, do not."*

#### What Agile Documentation Looks Like

Agile documentation is typically: lightweight (single page or less for most artefacts), visual (diagrams, sketches, and whiteboard photos preferred over text blocks), current (updated in response to learning, not maintained as a historical record), and collaborative (created with the team, not handed to them).

| Agile Artefact | What It Contains | Who Uses It |
|---|---|---|
| Product Vision Statement | One-page summary of the product's purpose, users, and value | Everyone — aligns all decisions |
| Product Roadmap | Release sequence and high-level feature plan | Product owner, stakeholders |
| User Story | Feature description in user-task format with acceptance criteria | Development team, QA |
| Story Map | Visual representation of all stories in user narrative order | Planning and prioritisation sessions |
| Definition of Done | Checklist of completion criteria for every story | Development team, QA |
| Sprint Goal | One sentence describing the sprint's intended value | Everyone — sprint's north star |

#### The Living Document

Aguanno and Schibi (line 74,730) introduce the concept of the *living document* — a document that is continuously updated as understanding develops. Living documents are not approved and locked; they are continuously refined. The product backlog is the canonical living document in Scrum: it is never complete, always evolving, and its most recent version is always the most authoritative.

Patton (line 65,410) warns against treating documentation as a deliverable rather than a communication tool: *"I've seen teams spend more time writing about the product than building it. Documentation is not the product. The product is the product."*

#### When to Write More

Aguanno and Schibi (line 74,740) specify contexts where more documentation is appropriate in agile: regulated industries (financial services, healthcare, aerospace) where audit trails are mandatory; large distributed teams where synchronous conversation is impractical; complex technical integrations where interface specifications must be precise; and knowledge transfer situations where team turnover creates continuity risk.

#### Key Takeaways

- Agile documentation is determined by a single test: will this document be used by the team, and when?
- Agile artefacts are lightweight, visual, current, and collaborative.
- The product backlog is the canonical living document — continuously evolving, never locked.
- Documentation is a communication tool, not a deliverable.
- More documentation is appropriate in regulated industries, large distributed teams, complex integrations, and knowledge transfer contexts.

---

### 11.2.6 Agile Planning and Estimation

**An estimate is not a commitment — and a team that confuses the two will either sandbag its estimates to protect commitments, or make commitments it cannot keep.** Aguanno and Schibi (line 74,755) and Rubin (line 43,929) converge on the principle that agile estimation is about relative sizing, not absolute time prediction, and that the goal of estimation is velocity prediction, not individual accountability.

#### Story Points: The Agile Estimation Currency

Story points measure the *relative complexity and effort* of a user story, not the time it will take. Rubin (line 43,940) explains: *"Story points are used to measure the complexity or level of effort required to complete a story, not how long it will take. A complex story may have eight story points while a simpler story has only two — this does not mean the complex story will take 8 hours."*

The team estimates each story relative to a reference story (often called the "golden story" — a story of medium complexity that the team has agreed represents a baseline). A story that seems twice as complex as the reference story gets twice the points.

#### Planning Poker: Consensus Estimation

Planning poker is the most common estimation technique in agile teams. Each team member independently selects a card representing their estimate; all cards are revealed simultaneously. Where estimates diverge significantly, the team discusses until convergence. Planning poker leverages diverse perspectives and prevents anchoring (the tendency of later estimators to converge on the first number they hear).

Aguanno and Schibi (line 74,765) note that planning poker produces more accurate estimates than individual estimation — not because the average is better, but because the discussion that resolves divergent estimates surfaces assumptions and misunderstandings that would otherwise remain hidden until development.

#### Velocity: The Planning Unit

Velocity is the number of story points a team completes per sprint, averaged over the last three to five sprints. Rubin (line 43,949) explains its use: *"Once you accurately start predicting your team's velocity, it will become easier to manage the workload for each sprint."* The product owner uses velocity to predict release dates: if the remaining backlog contains 200 story points and the team's velocity is 25 points per sprint, the release is approximately 8 sprints away.

| Estimation Concept | Definition | How Used |
|---|---|---|
| Story points | Relative complexity measure | Individual story sizing |
| Planning poker | Consensus estimation technique | Team estimation sessions |
| Velocity | Story points per sprint (3–5 sprint average) | Release planning, sprint planning |
| Capacity | Available person-hours this sprint | Sprint load planning |

#### Key Takeaways

- Estimates are not commitments — confusing them creates either sandbagging or broken commitments.
- Story points measure relative complexity, not absolute time.
- Planning poker produces more accurate estimates through structured divergence-and-convergence discussion.
- Velocity (story points per sprint, averaged) is the primary release planning unit.
- Capacity (available hours) governs sprint planning; velocity governs release planning.

---

### 11.2.7 Agile Reporting Artifacts

**Burndown charts, velocity charts, and cumulative flow diagrams are not bureaucratic reporting tools — they are the team's real-time health monitoring system, and the BA who can read and interpret them adds a layer of intelligence that raw data alone cannot provide.** Aguanno and Schibi (line 74,780) describe the three primary agile reporting artefacts and their distinct uses in project governance.

#### The Iteration Burndown Chart

The iteration burndown chart shows the remaining work in the sprint (in story points or hours) against the ideal burndown line (equal reduction per day). Aguanno and Schibi (line 74,785) explain its diagnostic value: a burndown that tracks below the ideal line suggests the team is ahead of plan or over-estimated; a burndown that tracks above the ideal suggests under-estimation, scope growth, or impediments. The BA uses the burndown to identify early warning signs and raise them in the daily standup.

#### The Velocity Chart

The velocity chart shows the team's completed story points per sprint over time. Aguanno and Schibi (line 74,792) note that velocity patterns reveal more than just progress — they reveal team stability. A stable velocity (consistent points completed) indicates a healthy, predictable team. Volatile velocity suggests instability: team member changes, scope changes, or process problems. A BA who monitors velocity trends can help the product owner make more accurate release predictions.

#### The Cumulative Flow Diagram (CFD)

The CFD is the most information-rich of the three. It shows the number of stories in each workflow state (to-do, in analysis, in development, in testing, done) over time as stacked bands. Aguanno and Schibi (line 74,800) explain how to read it: *"A steady, parallel flow of bands indicates a healthy workflow. Bands that are widening indicate a bottleneck — work is accumulating in that state faster than it is leaving."* The BA uses CFD data to diagnose workflow problems and facilitate process improvement conversations.

Li (*JIRA Agile Essentials*, line 43,230) reinforces the purpose of these reports: *"Remember that the goal here is not to get it right the first time but to continuously improve your estimates to a point where the team can consistently deliver the same amount of story points' worth of work."* The BA's role is to use report data as a learning loop — each sprint's data informs the next sprint's planning.

| Artefact | Shows | Diagnostic Use |
|---|---|---|
| Iteration Burndown | Remaining work vs. ideal per day | Sprint pacing, scope changes, impediments |
| Velocity Chart | Story points completed per sprint | Team stability, release prediction accuracy |
| Cumulative Flow Diagram | Work in each state over time | Workflow bottlenecks, process health |

#### Key Takeaways

- Agile reporting artefacts are real-time health monitoring tools, not bureaucratic compliance mechanisms.
- The iteration burndown chart shows sprint pacing — deviations from the ideal line indicate scope changes, estimation errors, or impediments.
- The velocity chart shows team stability over time — consistent velocity indicates a healthy, predictable team.
- The cumulative flow diagram shows workflow health — widening bands indicate bottlenecks requiring process intervention.
- The BA adds value by interpreting these artefacts and surfacing insights in daily standups and retrospectives.

---

### 11.2.8 Agile Testing and Evaluation

**In agile, testing is not what you do at the end — it is how you define done before you begin.** Aguanno and Schibi (line 74,810) describe a fundamental reorientation of the testing mindset in agile: the shift from test-after to test-alongside, from finding defects to preventing them, from QA as a gate to QA as a continuous team activity. The BA plays a central role in this shift because acceptance criteria — the BA's primary analytical output per story — are the direct precursors of acceptance tests.

#### Test-Driven Development (TDD): What the BA Needs to Know

TDD is a development practice where developers write tests before they write code. The test defines what the code must do; the code is written to make the test pass. Aguanno and Schibi (line 74,818) note that TDD is most effective when the acceptance criteria are precise: *"The BA's acceptance criteria become the developer's test specifications. Vague acceptance criteria produce vague tests, which produce untestable code."*

#### Acceptance Test-Driven Development (ATDD)

ATDD (also called Behaviour-Driven Development or BDD) extends TDD to the business requirements level. In ATDD, the BA, developer, and QA analyst collaborate to write acceptance tests before development begins — using the Given-When-Then format directly as executable test specifications. Aguanno and Schibi (line 74,826) describe ATDD as *"the closest agile teams get to comprehensive requirements specification — not through formal documentation, but through shared, executable examples that describe the system's required behaviour."*

#### Continuous Integration and the BA

Continuous integration (CI) is the practice of integrating code changes into a shared repository frequently — often multiple times per day — and running automated tests after each integration. The BA's connection to CI is through acceptance criteria: when acceptance criteria are written as automated test cases, CI runs them after every code change, providing immediate feedback on whether the story's requirements are being met.

Aguanno and Schibi (line 74,835) note that the BA who writes precise, automatable acceptance criteria enables faster CI cycles and higher confidence in each build.

#### The Definition of Done

The Definition of Done (DoD) is the team's checklist of what "done" means for every story — not just coded and tested, but potentially shippable. Aguanno and Schibi (line 74,840) recommend that the BA co-own the DoD with the QA lead: the BA contributes the business acceptance criteria; QA contributes the technical quality standards. A story is not done until it meets all criteria in the DoD.

#### Key Takeaways

- In agile, testing is how you define done before you begin — not what you do after you finish.
- The BA's acceptance criteria become the developer's test specifications — vague criteria produce untestable code.
- ATDD (Acceptance Test-Driven Development) uses Given-When-Then acceptance criteria as executable test specifications.
- Continuous integration runs acceptance tests after every code change — precise, automatable acceptance criteria enable faster CI.
- The Definition of Done is the team's shared checklist; the BA co-owns it with QA by contributing business acceptance criteria.

---

### 11.2.9 BA and Product Owner

**The most productive BA-product owner relationships in agile are partnerships of complementary expertise — not competitions for requirements authority.** Aguanno and Schibi (line 74,855) identify the BA-PO relationship as the central dynamic that determines whether agile teams deliver genuine business value or technically excellent features that no one uses. Understanding where the roles complement and where they must stay distinct is essential.

#### The Product Owner's Domain

The product owner owns the product vision, the business case, and the prioritisation authority. They are accountable to stakeholders for the value delivered in each release. Rubin (line 43,702) defines this responsibility: *"The product owner is usually the product or project manager, responsible for owning the overall vision and direction of the product, in charge of the features added to the backlog, the priority of each feature, and planning the delivery of these features through sprints."*

The product owner makes judgment calls about value — which features matter most, which stakeholders to prioritise, which trade-offs to accept. These are authority decisions that require business accountability.

#### The BA's Contribution to the PO's Work

The BA's contribution is intelligence: research, analysis, acceptance criteria, and facilitation that equips the product owner to make better-informed decisions. Aguanno and Schibi (line 74,862) describe the BA as the product owner's *analytical partner*: *"The BA translates the PO's vision into clearly specified, acceptance-criteria-backed stories. The PO decides what to build; the BA ensures the team understands what was decided."*

Champagne (*Seven Steps*, line 48,030) expresses the same principle from a stakeholder perspective: *"Bringing information to the decision maker is what the relationship is all about."*

| Dimension | Product Owner | Business Analyst |
|---|---|---|
| Primary question | What should we build? | How do we know when it is built correctly? |
| Key skill | Business judgment and vision | Requirements analysis and specification |
| Stakeholder relationship | Business accountability | Analytical partnership |
| Backlog role | Prioritisation authority | Story elaboration and acceptance criteria |
| Team relationship | Vision provider | Clarification and intelligence provider |

#### When BA and PO Conflict

Conflict between BA and PO is most common when the PO wants to move faster than the BA thinks the requirements are understood. Aguanno and Schibi (line 74,870) advise the BA to frame this not as resistance but as risk communication: *"I am concerned that if we start development on this story without clear acceptance criteria, we will discover the gap in testing — when the cost of fixing it is ten times higher."*

#### Key Takeaways

- The BA-PO relationship is a partnership of complementary expertise: vision authority (PO) and analytical intelligence (BA).
- The product owner owns the vision, prioritisation, and business accountability; the BA owns analysis depth and shared team understanding.
- The BA is the PO's analytical partner — translating vision into specified, acceptance-criteria-backed stories.
- Conflict between BA and PO is most common around pace; the BA frames requirements gaps as risk, not resistance.
- The goal is a team that builds the right thing correctly — which requires both clear vision and precise specification.

---

### 11.2.10 Discovery and Validated Learning

**Discovery is the practice of treating product decisions as hypotheses and organising work to test those hypotheses as rapidly and cheaply as possible — before committing to full development.** Patton (*User Story Mapping*, line 65,440) describes discovery as the practical alternative to the waterfall assumption that requirements can be fully understood before building begins: *"Instead of trying to get requirements right through analysis, we learn them by building small experiments and observing what happens."*

#### The Build-Measure-Learn Loop

Patton (line 65,445) adapts the lean startup's build-measure-learn loop to product development:

1. **Build** a small, targeted experiment (prototype, wireframe, concierge MVP, or limited feature).
2. **Measure** user response — do they use it? Does it solve the problem? Are they satisfied?
3. **Learn** from the measurement — validate or invalidate the hypothesis. Update the backlog accordingly.

The loop is not sequential — it repeats. Each iteration produces learning that reshapes the next hypothesis. The backlog is not a fixed list of features to build; it is a dynamic queue of hypotheses to test.

#### Validated Learning vs. Demonstrated Completion

Patton (line 65,455) distinguishes between *demonstrated completion* (the team built what was specified) and *validated learning* (the team confirmed that what was built creates the intended value). Traditional project management measures demonstrated completion. Product development should measure validated learning.

Aguanno and Schibi (line 74,880) apply this to the BA's evaluation responsibilities: *"After each release, the business analyst should participate in measuring whether the value hypotheses that drove the sprint backlog were validated by user behaviour."*

#### Minimum Viable Product (MVP)

Patton (line 65,465) treats the MVP not as a stripped-down product but as a *learning vehicle*: the smallest thing that can be built to test the most important hypothesis. An MVP that proves the hypothesis right justifies the investment in the full product. An MVP that proves it wrong saves the investment from being wasted.

The BA's role in MVP thinking is to help the team identify the critical hypothesis — the assumption whose validation would most reduce the project's risk — and design the minimum experiment that could validate it.

#### Key Takeaways

- Discovery treats product decisions as hypotheses and organises work to test them before committing to full development.
- The build-measure-learn loop replaces upfront requirements analysis with iterative experimentation.
- Validated learning (did this create the intended value?) is more important than demonstrated completion (did we build what was specified?).
- The MVP is a learning vehicle — the smallest experiment that tests the most important hypothesis.
- The BA's role in discovery is to identify the critical hypothesis and design the minimum test that validates it.

---

## Sub-module 11.3: Scrum Framework for Business Analysts

Ken Rubin's *Essential Scrum* (lines 25,387–43,031) and Patrick Li's *JIRA Agile Essentials* (lines 43,032–46,076) together provide the practitioner's foundation for understanding Scrum from the BA's perspective. Rubin's treatment is the most widely respected technical resource on Scrum — precise, comprehensive, and grounded in the framework's core principles. Li's Jira guide translates Scrum practice into the most widely used project management toolset. Together, they give the BA both the conceptual depth and the operational knowledge needed to contribute effectively in Scrum environments.

---

### 11.3.1 Scrum Framework Overview

**Scrum is not a methodology for managing software development — it is a framework for managing complex adaptive work in the presence of uncertainty, and the business analyst who understands this distinction will navigate Scrum environments far more effectively than one who treats it as a project management checklist.** Rubin (line 25,395) opens with this distinction: *"Scrum is a framework within which people can address complex adaptive problems while productively and creatively delivering products of the highest possible value."*

#### The Three Pillars: Transparency, Inspection, Adaptation

Rubin (line 25,400) grounds the Scrum framework in three empirical pillars:

| Pillar | What It Requires | How It Manifests |
|---|---|---|
| Transparency | Significant aspects of the process visible to all responsible | Daily standup, sprint review, visible backlog |
| Inspection | Frequent inspection of progress toward sprint goal | Daily standup, sprint review |
| Adaptation | Adjust the plan when inspection reveals deviation | Sprint retrospective, backlog re-prioritisation |

These pillars explain why Scrum ceremonies exist: they are not administrative overhead. They are the mechanisms through which transparency, inspection, and adaptation occur.

#### The Scrum Team Structure

Rubin (line 25,420) describes a self-managing, cross-functional team of three roles:

- **Product owner**: accountable for maximising the value of the product and managing the product backlog.
- **ScrumMaster**: accountable for the team's adoption and effectiveness of Scrum practices.
- **Development team**: accountable for delivering a potentially releasable product increment each sprint.

Li (line 43,698) notes that the delivery team in Scrum *"should consist of cross-functional members required for the project, such as developers, testers, and business analysts."* This is a critical point: BAs are team members, not external contributors.

#### Sprint as the Atomic Unit

The sprint is the heartbeat of Scrum — a time-boxed event (one to four weeks) during which a potentially releasable product increment is created. Rubin (line 25,435) specifies that the sprint goal is determined during sprint planning and remains stable during the sprint. Changes to the sprint goal require cancellation and re-planning.

#### Empiricism vs. Defined Process

Scrum is an empirical process: it does not prescribe a defined sequence of activities but instead creates conditions for regular inspection and adaptation. This is why the ScrumMaster's role is to *protect the process* rather than manage the project — the process itself is the value.

#### Key Takeaways

- Scrum is a framework for managing complex adaptive work — not a project management methodology.
- The three empirical pillars are transparency, inspection, and adaptation — all Scrum ceremonies serve these pillars.
- The Scrum team has three roles: product owner (value maximiser), ScrumMaster (process protector), development team (increment deliverer).
- BAs are development team members, not external contributors.
- The sprint is the atomic unit of Scrum — a time-boxed period ending in a potentially releasable increment.

---

### 11.3.2 Product Owner and the BA

**The product owner role in Scrum concentrates authority that in traditional projects is dispersed across sponsors, business analysts, project managers, and stakeholders — and when a BA operates in Scrum, understanding this concentration is essential for navigating both the relationship and the responsibilities.** Rubin (line 25,460) describes the product owner as the single point of authority for the product: *"The product owner is responsible for clearly expressing product backlog items, ordering the items to best achieve goals, optimising the value of the work the development team performs, and ensuring that the product backlog is visible, transparent, and clear."*

#### Four PO Responsibilities the BA Supports

Rubin (line 25,470) identifies four primary product owner responsibilities:

1. **Expressing** product backlog items clearly — the BA's analytical work directly supports this.
2. **Ordering** (prioritising) backlog items — the BA provides impact analysis that informs prioritisation.
3. **Optimising value** — the BA's acceptance criteria make "value" operationally testable.
4. **Ensuring transparency** — the BA's story elaboration makes the backlog visible and understandable to the team.

#### The BA as PO Enabler

Rubin (line 25,480) notes that most product owners cannot give the development team 100% of their time for backlog elaboration and clarification. The BA fills this gap: *"The product owner will collaborate with key stakeholders, including subject matter experts, end users, and business analysts, to ensure that the product backlog represents the best possible investment of the development team's time."*

This positions the BA not as a competitor to the PO but as a force multiplier — enabling the PO to make better-informed decisions by providing analytical depth and stakeholder synthesis.

#### Avoiding the BA-PO Confusion

The most common dysfunction in teams with both a BA and a PO is role confusion: the BA begins making prioritisation decisions (the PO's authority) or the PO begins writing acceptance criteria (the BA's responsibility). Rubin (line 25,490) is clear: prioritisation authority belongs to the PO; analytical elaboration belongs to the BA. The BA who understands this boundary protects both roles.

#### Key Takeaways

- The product owner concentrates authority that in traditional projects is dispersed — including decisions that BAs sometimes make in non-Scrum contexts.
- The four PO responsibilities that BAs directly support: expressing PBIs, ordering the backlog, optimising value, ensuring transparency.
- The BA is a PO force multiplier — enabling better-informed decisions through analytical depth.
- Prioritisation authority belongs to the PO; analytical elaboration belongs to the BA — clarity on this boundary prevents role dysfunction.

---

### 11.3.3 Product Backlog Management

**The product backlog is not a wish list — it is a living, ordered investment portfolio of everything the team might build, continuously managed to ensure that the highest-value work is always at the top and always ready.** Rubin (line 30,152) describes the product backlog as *"a prioritised list of desired product functionality that provides a centralised and shared understanding of what to build and the order in which to build it."*

#### DEEP: The Characteristics of a Good Backlog

Rubin (line 30,182) introduces the DEEP acronym (co-coined with Roman Pichler) as the quality standard for product backlogs:

| Characteristic | Definition | What It Prevents |
|---|---|---|
| **D**etailed appropriately | Near-term items are small and detailed; distant items are large and rough | Over-specifying work that may never be done |
| **E**mergent | The backlog evolves continuously as new information arrives | Freezing requirements prematurely |
| **E**stimated | All items have size estimates | Inability to plan releases or sprints |
| **P**rioritised | Items ordered from highest to lowest value | Building the wrong things first |

#### Backlog Grooming: The Continuous Process

Grooming (Rubin, line 30,273) is the ongoing work of maintaining a healthy backlog: creating and refining PBIs, estimating them, and re-prioritising them as new information arrives. Rubin (line 30,309) recommends the development team allocate up to 10% of its sprint capacity to grooming — approximately four hours in a two-week sprint.

The BA drives grooming. In practice, this means the BA: writes new user stories when requirements emerge, breaks large epics into sprint-ready stories as they approach the top of the backlog, revises acceptance criteria when understanding changes, and facilitates the grooming session with the PO and team.

Li (line 43,985) describes JIRA's support for this: *"JIRA Agile addresses this by letting you simply drag an issue up and down the list according to its importance, with the more important issues at the top and less important issues at the bottom."*

#### Definition of Ready

Rubin (line 30,383) introduces the Definition of Ready as the companion to the Definition of Done: *"A definition of ready is a checklist of the work that must be completed before a product backlog item can be moved into a sprint."* A typical DoR checklist includes: the story is small enough to complete in a sprint; acceptance criteria are written and reviewed; dependencies are identified; the story is estimated; business value is understood.

The BA is the primary agent for making stories "ready" — writing acceptance criteria, decomposing epics, clarifying ambiguities, and ensuring the team can work without needing to stop for clarification.

#### Key Takeaways

- The product backlog is a living, ordered investment portfolio — continuously managed, never frozen.
- DEEP characteristics: Detailed appropriately, Emergent, Estimated, Prioritised.
- Backlog grooming is a continuous activity — the team allocates up to 10% of sprint capacity to it.
- The BA drives grooming: writing stories, decomposing epics, updating acceptance criteria, facilitating grooming sessions.
- The Definition of Ready is the BA's primary quality standard for each story — stories are not pulled into planning until they meet it.

---

### 11.3.4 Sprint Events

**Scrum's five sprint events are not meeting overhead — they are the precise mechanisms through which the framework's empirical pillars are maintained, and the BA who understands their purpose participates at a qualitatively different level than one who attends them as formality.** Rubin (line 25,500) grounds each event in empirical purpose: *"Each event in Scrum is a formal opportunity to inspect and adapt something. If these events are not attended or taken seriously, they will fail to provide the transparency that Scrum requires."*

#### Sprint Planning: The BA's Preparation Work

Sprint planning (Rubin, line 25,510) determines the sprint goal and the sprint backlog — the stories the team commits to completing this sprint. The BA's contribution begins before the meeting: ensuring the top stories are INVEST-compliant, acceptance criteria are written, and dependencies are identified. During the meeting, the BA answers team questions about story intent and helps decompose stories that are larger than expected.

Li (line 44,022) describes sprint planning from the Jira perspective: *"The sprint planning meeting is where the project team comes together and decides what they should focus and work on next. With JIRA Agile, you will be using the Backlog mode of your board to create and plan the new sprint's scope."*

#### The Daily Scrum: The BA as Observer and Clarifier

The daily scrum (Rubin, line 25,520) is a 15-minute synchronisation event for the development team — not a status report to the BA or PO. The BA may attend as an observer and should be available for immediate clarification questions that emerge, but should not be a voice in the core standup (unless the BA is a development team member).

#### Sprint Review: Demonstrating Value to Stakeholders

The sprint review (Rubin, line 25,530) is the accountability event — the team demonstrates what was built and stakeholders provide feedback. The BA has three roles: (1) ensuring the demonstration reflects the acceptance criteria that were agreed upon; (2) capturing stakeholder feedback for backlog refinement; and (3) helping the PO articulate what was built in terms of business value, not technical features.

#### Sprint Retrospective: Process Improvement

The sprint retrospective (Rubin, line 25,540) focuses on the team's process — what went well, what could be improved, and what changes to make next sprint. Aguanno and Schibi (line 74,900) note that the BA should bring data to retrospectives: requirements changes per sprint, defects traced to acceptance criteria gaps, and story completion rates.

#### Key Takeaways

- The five sprint events serve the empirical pillars: planning (transparency), daily scrum (inspection), review (inspection + adaptation), retrospective (adaptation).
- Sprint planning: BA prepares by ensuring stories are INVEST-compliant with clear acceptance criteria.
- Daily scrum: BA attends as observer, available for immediate clarification.
- Sprint review: BA ensures the demo reflects agreed acceptance criteria and captures stakeholder feedback.
- Sprint retrospective: BA contributes requirements quality data and process improvement observations.

---

### 11.3.5 Estimation and Velocity

**Velocity is not a performance metric — it is a calibration instrument, and the team that treats it as a target to hit will game it in ways that destroy its predictive value.** Rubin (line 43,929) frames the estimation-velocity relationship with precision: the goal of estimation is to support planning, not to measure individual performance. When teams are pressured to hit a velocity target, they inflate estimates to achieve it — making velocity higher on paper while delivering the same amount of work.

#### Story Point Estimation in Practice

Rubin (line 43,940) describes the practical mechanics: the team uses a reference story — usually a historical story of medium complexity — as an anchor. New stories are estimated relative to this anchor. A story that seems twice as complex as the reference story gets twice the points. The numbers are relative, not absolute.

Common story point scales include the Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) — the non-linear spacing reflects the growing uncertainty as stories become larger. A 13-point story is not precisely 13/8ths the size of an 8-point story; it is roughly "bigger and more uncertain than 8 but not as big as 21."

#### Velocity Calculation and Use

Rubin (line 43,949) specifies that velocity is calculated as the average story points completed per sprint over the last three to five sprints. Using an average prevents over-indexing on a single exceptional sprint (good or bad) and provides a stable baseline for planning.

The product owner uses velocity to answer: *"When will we finish the backlog?"* Divide the remaining story points by the team's velocity. A backlog of 200 points with a velocity of 25 produces an estimated 8 sprints to completion.

Li (line 43,948) describes JIRA's velocity chart: *"The velocity chart shows the estimated versus completed story points for each sprint, giving you a quick view of how consistent the team's delivery is."*

#### When Velocity Is Unreliable

Rubin (line 25,560) notes that velocity is unreliable when: the team is new (no historical data); team composition has changed significantly; story size is inconsistent; or the team has changed its definition of done. The BA should flag these conditions when stakeholders are making planning decisions based on velocity.

#### Key Takeaways

- Velocity is a calibration instrument for planning, not a performance target.
- Story points measure relative complexity using a reference story as an anchor.
- Fibonacci scale reflects growing uncertainty with larger stories.
- Velocity = average story points completed per sprint over 3–5 sprints; used to estimate release dates.
- Velocity is unreliable for new teams, after team composition changes, with inconsistent story sizing, or after definition-of-done changes.

---

### 11.3.6 Definition of Done vs. Acceptance Criteria

**Acceptance criteria answer the question "What does this story need to do?" The Definition of Done answers "What does every story need to achieve before it is releasable?" They are not the same thing — and the BA who conflates them produces stories that are individually approved but collectively unreleasable.** Rubin (line 30,384) defines the relationship between the two with precision.

#### Definition of Done: The Quality Floor

The Definition of Done (DoD) is a team-level quality standard that applies to every story — it is not negotiable per-story. Rubin (line 25,560) describes a typical DoD checklist:

| DoD Criterion | What It Ensures |
|---|---|
| Code written and peer-reviewed | Technical quality baseline |
| Unit tests written and passing | Regression protection |
| Acceptance tests passing | Business requirements satisfied |
| Code integrated into main branch | No integration debt |
| Documentation updated | Operational continuity |
| No known critical defects | Releasability |

A story that satisfies its acceptance criteria but does not meet the DoD is not done.

#### Acceptance Criteria: The Story-Level Contract

Acceptance criteria are the story-specific conditions that the development team must satisfy to complete that particular story. They define the boundary between the story's intended behaviour and everything outside it. Aguanno and Schibi (line 74,910) note that *"acceptance criteria are the primary vehicle through which the BA communicates requirements to the development team in agile — they replace the requirements specification."*

#### The BA's Responsibility for Both

The BA owns acceptance criteria per story. The BA co-owns the DoD with QA and the team — contributing the business standards that determine releasability. Rubin (line 25,570) specifies that the DoD should be reviewed and updated at each retrospective: *"The definition of done is not fixed — it evolves as the team matures. Each retrospective is an opportunity to raise the bar on what it means to be truly done."* It evolves as the team's quality standards mature.

#### Key Takeaways

- Definition of Done: team-level quality standard applying to every story — non-negotiable.
- Acceptance criteria: story-specific conditions the team must satisfy for that particular story.
- A story that passes its acceptance criteria but fails the DoD is not done.
- The BA owns acceptance criteria per story and co-owns the DoD with QA and the team.
- The DoD is reviewed and updated at each retrospective as team quality standards evolve.

---

### 11.3.7 Technical Debt

**Technical debt is not a developer problem — it is a business problem, because it is accumulated during business decisions, paid off (or not) through business-funded work, and its interest compounds in the form of slower delivery speed and higher defect rates over time.** Aguanno and Schibi (line 74,920) define technical debt as *"the accumulated cost of shortcuts taken during development — design decisions that were expedient in the short term but create constraints on future development."*

#### What Creates Technical Debt in Agile

Aguanno and Schibi (line 74,928) identify three primary sources in agile teams:

1. **Intentional debt**: the team consciously chooses a simpler implementation to meet a deadline, planning to refactor later.
2. **Unintentional debt**: the team makes design choices that seem correct but turn out to be suboptimal as the system grows.
3. **Environmental debt**: the team inherits legacy systems with architectural constraints that limit clean implementation.

The BA's contribution to technical debt is through acceptance criteria: stories with under-specified acceptance criteria lead to implementations that satisfy the specified behaviour but accumulate design problems — because the developer had to make choices that a better specification would have made for them.

#### The BA's Role in Debt Management

Aguanno and Schibi (line 74,935) specify the BA's role: helping the product owner understand technical debt as a business risk. When the development team surfaces technical debt items, the BA translates the risk into business terms: *"This component's architecture limits our ability to add new features in this area by approximately 30–40%. We estimate it will accumulate interest of 2–3 extra story points per related feature for the next six months unless we refactor."*

#### The Balance Between Speed and Quality

The product owner must balance sprint velocity against technical debt accumulation. A team that sprints without addressing debt moves faster in the short term but slower in the long term. Aguanno and Schibi (line 74,940) note that the BA is well-positioned to help the PO make this trade-off visible — translating technical concerns into business value and risk language.

#### Key Takeaways

- Technical debt is a business problem: it accumulates through business decisions and compounds as slower delivery and higher defect rates.
- Three sources: intentional (expedient shortcuts), unintentional (suboptimal design choices), and environmental (inherited legacy constraints).
- Under-specified acceptance criteria contribute to technical debt by leaving design decisions to developers.
- The BA translates technical debt into business risk terms to help the product owner make informed trade-off decisions.
- Ignoring technical debt accelerates short-term velocity at the cost of long-term delivery speed.

---

### 11.3.8 Scaling Scrum

**Single-team Scrum is a solved problem; multi-team Scrum at scale is where organisations consistently stumble — and the BA who understands the challenges of scaling is the one who can prevent the most expensive coordination failures.** Rubin (line 25,590) frames the core problem with precision: *"The more teams involved, the more coordination is required. The more coordination is required, the more the overhead of coordination consumes the value Scrum was meant to deliver."*

#### The Core Challenge: Coordination Without Bureaucracy

Scrum's power comes from the autonomy of small, cross-functional teams. Scaling introduces coordination needs that, if handled bureaucratically, destroy that autonomy. The BA's role in scaled Scrum is to ensure that coordination happens at the requirements level — through explicit dependency mapping, shared acceptance criteria for integration points, and cross-team backlog alignment — rather than through top-down process control.

Aguanno and Schibi (line 74,950) note the BA's specific contribution: *"In a scaled agile environment, the business analyst's most critical skill is the ability to write requirements precise enough to serve as interfaces — specifications that two or more teams can work against independently without creating incompatible outputs."*

#### SAFe, LeSS, and Scrum@Scale: What the BA Needs to Know

Three primary scaling frameworks address multi-team Scrum differently:

| Framework | Primary Mechanism | BA's Role |
|---|---|---|
| SAFe (Scaled Agile Framework) | Program Increment (PI) planning — all teams plan together | Programme-level BA defines enablers and integration requirements |
| LeSS (Large-Scale Scrum) | One product backlog, multiple teams — no additional roles | BA works within single PO structure; shared backlog |
| Scrum@Scale | Scrum of Scrums — representatives from each team coordinate | BA participates in cross-team dependency resolution |

#### The Integration Story

Rubin (line 25,600) describes integration stories — stories that exist specifically to integrate the work of multiple teams — as the primary coordination artefact in scaled Scrum. The BA defines integration stories with the same rigour as feature stories: user-task format, INVEST-compliant, with precise acceptance criteria that describe the required behaviour of the integration point.

#### Key Takeaways

- Scaling Scrum introduces the primary challenge of dependency management across multiple autonomous teams.
- Bureaucratic coordination destroys Scrum's value; BA-led requirements-level coordination preserves it.
- Three primary scaling frameworks: SAFe (PI planning), LeSS (single backlog), Scrum@Scale (Scrum of Scrums).
- Integration stories — defining the required behaviour of cross-team integration points — are the BA's primary contribution to scaled coordination.
- The BA who can write precise integration requirements with clear acceptance criteria prevents the most expensive integration failures.

---

## Sub-module 11.4: PMI Requirements Practices

The PMI's requirements practice ecosystem spans two primary resources: *Business Analysis for Practitioners: A Practice Guide* (lines 79,212–81,573) and *Requirements Management: A Practice Guide* (lines 81,574–100,968). Together they describe a project-centric model of business analysis — one grounded in the PMBOK framework but extending it with domain expertise specific to business analysis. The five domains of the PMI BA Practice Guide — Business Value Assessment, BA Planning, Solution Refinement, Organisational Transition and Solution Evaluation, and BA Stewardship — provide a comprehensive map of what professional BA looks like across the full project life cycle.

---

### 11.4.1 Needs Assessment

**The most expensive decision an organisation can make is to start a project on a problem that has not been properly understood — and the PMI's needs assessment process exists precisely to prevent that decision.** PMI BA Practitioners (line 79,220) define needs assessment as the work performed before the project life cycle begins to understand what the organisation needs, what it currently has, and what the gap between them represents.

#### The Three Questions of Needs Assessment

PMI Requirements Management (line 82,071) frames needs assessment around three fundamental questions:

1. **What is the business problem or opportunity?** — identifying the situation that motivates action.
2. **What are the current capabilities?** — understanding what the organisation can already do.
3. **What is the desired future state?** — defining where the organisation needs to be.

The gap between current capabilities and desired future state is the *need* — the justification for the project.

#### Needs Assessment at Portfolio, Programme, and Project Levels

PMI Requirements Management (line 82,074) specifies that needs assessment occurs at three levels:

| Level | Scope | Who Performs |
|---|---|---|
| Portfolio | Strategic alignment of all proposed investments | Enterprise architects, senior BAs |
| Programme | Coordination of related projects toward common outcomes | Programme BAs |
| Project | Specific change to be delivered through this project | Project BAs |

The project BA's needs assessment is grounded in the portfolio and programme context — understanding not just the immediate problem but how it fits the organisation's strategic direction.

#### Business Case Development

The primary output of needs assessment is the business case: the documented justification for the investment. Champagne (*Seven Steps*, line 49,781) defines it as *"the justification to do a project to deliver the change."* The business case includes: problem statement, solution options, costs and benefits, risks, and recommended approach.

The BA who develops a business case must separate *what the organisation needs* from *what a stakeholder wants* — and present options, not just the preferred solution. Champagne (line 49,920) recommends: *"Presenting alternatives helps decision makers see the situation more clearly and gives the solution you are recommending more context and credibility."*

#### Key Takeaways

- Needs assessment occurs before the project life cycle begins and establishes the gap between current and desired capability.
- The three needs assessment questions: What is the problem? What are current capabilities? What is the desired future state?
- Needs assessment occurs at portfolio, programme, and project levels — the project BA works within the broader context.
- The business case is the primary output — it documents the gap, solution options, costs, benefits, risks, and recommendation.
- Presenting alternatives in the business case increases credibility and helps decision-makers see the full picture.

---

### 11.4.2 Requirements Management Planning

**Requirements management planning is the work of deciding in advance how requirements will be elicited, documented, validated, changed, and tracked — and a team that skips this planning will invent their requirements management process under pressure, at the worst possible time.** PMI Requirements Management (line 81,574) positions requirements management planning as the first activity after the project is approved: before requirements are written, the team must agree on how they will be managed.

#### The Six Planning Decisions

PMI Requirements Management (lines 81,580–81,590) identifies six decisions that constitute a requirements management plan:

| Decision | Question | Typical Answers |
|---|---|---|
| Elicitation strategy | How will we discover requirements? | Interviews, workshops, observation, surveys |
| Documentation format | How will requirements be recorded? | User stories, use cases, SRS, a hybrid |
| Traceability approach | How will we link requirements to tests and to the product? | Requirements traceability matrix, tool-based links |
| Validation process | How will we confirm requirements are correct? | Review sessions, prototype walkthroughs, UAT |
| Change control | How will we manage changes to approved requirements? | Change request form, impact analysis, approval authority |
| Requirements management tool | What tool will support storage, traceability, and collaboration? | JIRA, Azure DevOps, Confluence, a shared spreadsheet |

#### Integration with the Project Management Plan

PMI (line 81,595) specifies that requirements management planning integrates with the project management plan — the two are co-dependent. The project schedule must allocate time for requirements review; the risk register must include requirements risks; the stakeholder management plan must identify who approves requirements changes.

The BA is the primary author of the requirements management plan and its primary executor. The plan is not a bureaucratic deliverable — it is the BA's operating model for the project.

#### Governance and Change Authority

PMI (line 81,600) addresses change control authority specifically: who can approve requirements changes, at what scope level, and through what process. On smaller projects this may be the sponsor alone. On larger projects a Change Control Board (CCB) — including the sponsor, product owner, project manager, and BA — reviews and approves changes above a certain impact threshold.

Champagne (*Seven Steps*, line 55,602) reinforces: *"Will you require formal sign-off and change management of requirements, or will these be constantly reviewed and refined with your stakeholders? Where are you going to put all of this information as you collect and analyse it?"* These questions should be answered before elicitation begins.

#### Key Takeaways

- Requirements management planning decides in advance how requirements will be elicited, documented, validated, changed, and tracked.
- Six planning decisions: elicitation strategy, documentation format, traceability approach, validation process, change control, and tool selection.
- The requirements management plan integrates with the project management plan — schedule, risks, and stakeholder management.
- The BA is the primary author and executor of the requirements management plan.
- Change authority must be defined before requirements are approved — who can approve changes and through what process.

---

### 11.4.3 Monitoring and Controlling

**Requirements monitoring is not about tracking whether the team is following the process — it is about detecting the early warning signs that the project's requirements foundation is eroding.** PMI Requirements Management describes requirements monitoring and controlling as the ongoing work of ensuring that approved requirements remain accurate, complete, and aligned with the project's objectives as the project progresses.

#### What Monitoring Reveals

Effective requirements monitoring detects four classes of problems: (1) *scope creep* — requirements being added without corresponding adjustment to schedule, budget, or priority; (2) *requirements regression* — approved requirements being inadvertently changed by downstream activities; (3) *coverage gaps* — tests that do not trace to requirements (suggesting missing requirements or dead test coverage); and (4) *requirements volatility* — an unusual number of change requests, suggesting the initial requirements were poorly understood.

PMI Requirements Management specifies that the BA tracks requirements status across four states: proposed, approved, implemented, and verified. An item that is implemented but not verified is a risk — there may be a gap between what was built and what was required.

#### Requirements Traceability Matrix

The requirements traceability matrix (RTM) is the BA's primary monitoring tool. It maps each requirement to: its source (the stakeholder need or business objective it addresses), its design components, its test cases, and its verification status. When a test case fails, the RTM shows which requirement is at risk. When a change request arrives, the RTM shows which test cases and design components will be affected.

Wiegers and Hokanson (line 57,900) describe the RTM as *"the glue that connects the requirements baseline to the delivered product — without it, you cannot know if you built what was required."*

#### Change Control in Practice

PMI Requirements Management describes the change request workflow: submission (stakeholder identifies a need to change a requirement), analysis (BA assesses impact on scope, schedule, cost, and dependent requirements), prioritisation (PO or sponsor weighs value against impact), decision (approval, deferral, or rejection), and implementation (approved change is incorporated into the baseline and communicated to the team).

Champagne (*Seven Steps*, line 55,602) frames the planning question every BA should answer before elicitation begins: *"Will you require formal sign-off and change management of requirements, or will these be constantly reviewed and refined with your stakeholders? Where are you going to put all of this information as you collect and analyse it?"* Monitoring and controlling cannot function if these decisions were never made.

#### Key Takeaways

- Requirements monitoring detects four problems: scope creep, requirements regression, coverage gaps, and excessive volatility.
- Requirements status states: proposed → approved → implemented → verified.
- The RTM maps requirements to sources, design, tests, and verification status.
- An implemented-but-unverified requirement is a risk — there may be a gap between what was built and what was required.
- The change control workflow: submission → impact analysis → prioritisation → decision → implementation.

---

### 11.4.4 Solution Evaluation and Closure

**Solution evaluation is the work a project team should do but rarely does — confirming that the solution delivered what was promised, measuring the benefits that justified the investment, and capturing the lessons that will make the next project better.** PMI BA Practitioners (line 79,500) describe solution evaluation as the final domain: *"Evaluate the performance of the solution to verify that the organisation is receiving the expected value."*

#### The PMI Solution Evaluation Process

PMI BA Practitioners describe four evaluation activities:

1. **Go/No-Go Decision**: Before deployment, the BA confirms that all acceptance criteria have been satisfied and the solution is ready for production.
2. **Post-Deployment Evaluation**: After deployment, the BA measures whether the business objectives identified in the needs assessment have been achieved.
3. **Benefits Realisation**: The BA tracks the agreed benefits (cost savings, revenue increase, efficiency improvement) against actual results over time.
4. **Lessons Learned**: The BA facilitates a structured review of requirements quality, process effectiveness, and team performance.

Champagne (*Seven Steps*, line 53,460) frames post-deployment evaluation as essential continuity work: *"The real proof of whether a system fulfils the needs of the business area will only come as it is being used. This is the final validation."*

#### Benefits Realisation: The Ignored Discipline

PMI BA Practitioners (line 79,510) note that benefits realisation is the most commonly skipped evaluation activity — and the most consequential to skip. When organisations do not measure whether projects delivered their promised benefits, they accumulate a portfolio of projects that were technically delivered but did not create business value. The BA who tracks benefits realisation builds credibility for future business cases by demonstrating that past investments produced what they promised.

#### Project Closure for the BA

At project closure, the BA's specific responsibilities include: ensuring all requirements are in their final verified state, archiving the requirements baseline and traceability matrix, documenting lessons learned, and releasing any temporary requirements governance structures.

#### Key Takeaways

- Solution evaluation confirms that the solution delivered what was promised and measures whether benefits were realised.
- Four evaluation activities: go/no-go decision, post-deployment measurement, benefits realisation, and lessons learned.
- Benefits realisation is the most skipped evaluation activity and the most consequential — it confirms whether the investment was justified.
- Post-deployment user assessment is the BA's final validation — the product in production is the only true test of requirements quality.
- Project closure for the BA: verify final requirements state, archive baseline and RTM, document lessons learned.

---

### 11.4.5 Business Value Assessment

**Business value assessment is the analytical discipline that connects every requirements decision to the organisation's strategic investment logic — and the BA who cannot speak this language will always struggle to influence prioritisation.** PMI BA Practitioners (line 79,215) describe Business Value Assessment as the first domain: *"Understand the situation, find gaps, define the solution."*

#### Understanding the Situation

The BA conducts a structured analysis of the current state using a combination of techniques: SWOT analysis (strengths, weaknesses, opportunities, threats), root cause analysis (drilling from symptoms to causes), capability assessment (what the organisation can and cannot currently do), and stakeholder analysis (who has an interest in the outcome and what their interests are).

Champagne (*Seven Steps*, line 49,969) lists the most common reasons organisations fund projects: to solve a problem, reduce costs, comply with regulations, exploit an opportunity, support marketing, align processes, or deliver strategy. The BA who understands which driver motivates a project can align requirements to it.

#### Defining the Solution

Having understood the situation, the BA defines the solution space — not a specific solution but the boundaries of what solutions could address the identified need. This includes: the expected business outcomes, the success metrics, the solution scope, and the constraints that bound it.

PMI BA Practitioners (line 79,235) specify that the BA presents solution options — typically three: the minimum viable option, the recommended option, and an enhanced option. Each option is evaluated against the business objectives, the costs and benefits, and the risks. The decision-maker chooses; the BA advises.

#### Quantifying Value

PMI BA Practitioners (line 79,240) describe the financial analysis techniques the BA uses to quantify value: Return on Investment (ROI), Net Present Value (NPV), payback period, and cost-benefit ratio. Champagne (*Seven Steps*, line 49,813) frames this for the practitioner: *"Cost/benefit analysis focuses on a financial analysis of the potential solution, using economic calculations to project the potential return on investment and payback period."*

Not all value can be quantified. Champagne (line 49,915) identifies intangible benefits — customer satisfaction, employee engagement, brand reputation — and recommends describing each with possible metrics and articulating how it could benefit the organisation even if it cannot be precisely measured.

#### Key Takeaways

- Business Value Assessment is PMI's first BA domain: understand the situation, find the gaps, define the solution.
- Techniques: SWOT, root cause analysis, capability assessment, stakeholder analysis.
- The BA defines the solution space (boundaries and expected outcomes) — not the specific solution.
- Present three solution options: minimum viable, recommended, and enhanced — let the decision-maker choose.
- Value quantification tools: ROI, NPV, payback period, cost-benefit ratio. Intangible benefits require qualitative articulation with possible metrics.

---

### 11.4.6 BA Stewardship

**BA stewardship is what separates the project-based BA from the enterprise-level analyst — it is the commitment to leave the profession, the practice, and the organisation better than you found them.** PMI BA Practitioners (line 79,550) describe BA Stewardship as the fifth and final domain: *"Promote effectiveness, enhance capability, and lead with integrity."*

#### The Three Stewardship Responsibilities

PMI BA Practitioners (line 79,555) define three stewardship responsibilities:

1. **Promote BA Effectiveness**: Advocate for the value of business analysis within the organisation — helping leaders understand when and how BA involvement improves project outcomes.
2. **Enhance BA Capability**: Develop the BA community of practice, mentor junior analysts, and advance the profession's standards and methods.
3. **Lead with Integrity**: Maintain objectivity, honesty, and ethical standards in all stakeholder engagements — including delivering findings that stakeholders may not want to hear.

Champagne (*Seven Steps*, line 47,341–47,342) frames integrity as the BA's primary trust asset: *"Successful BAs build numerous trusting relationships with people inside and outside of their organisations."* Trust is built through consistent integrity; destroyed by a single ethical compromise.

#### Communities of Practice

PMI BA Practitioners (line 79,560) recommend the BA community of practice (CoP) as the organisational vehicle for capability enhancement: regular gatherings of BAs to share techniques, review challenges, provide peer mentorship, and advance shared standards. Champagne (*Seven Steps*, line 55,574) reinforces: *"Join a business analysis community, such as your local IIBA chapter or your company's business analysis community of practice, and help the group schedule meetings, find speakers, volunteer to mentor new BAs, and give presentations to share your knowledge."*

#### The Long-Term View: Career as Stewardship

PMI BA Practitioners (line 79,565) close the stewardship domain with a long-term framing: the BA who continuously develops their expertise, expands their impact, and contributes to the profession is not merely building a career — they are advancing the organisation's analytical capability and, by extension, its ability to make better decisions.

#### Key Takeaways

- BA Stewardship is PMI's fifth domain: promote effectiveness, enhance capability, lead with integrity.
- Three responsibilities: promoting BA value, developing the BA community, and maintaining ethical standards.
- Trust is the BA's primary stewardship asset — built through consistent integrity across every stakeholder interaction.
- Communities of practice are the organisational vehicle for BA capability enhancement.
- The long-term stewardship view: the BA who continuously develops expertise and contributes to the profession advances organisational analytical capability.

---

## Sub-module 11.5: Seven Steps to Mastering BA

Barbara Champagne's *Seven Steps to Mastering Business Analysis* (lines 46,077–57,461) is one of the most practically grounded books in the BA canon — a practitioner's guide rather than a body-of-knowledge reference, with each chapter structured as a step on the BA's mastery journey. The seven steps are: Know Your Role, Know Your Audience, Know Your Project, Know Your Business Environment, Know Your Technical Environment, Know Your Analysis Techniques, and Increase Your Value. This sub-module treats each step as a discipline of professional practice, drawing from Champagne's rich real-world examples and practitioner-tested guidance.

---

### 11.5.1 Know Your Role

**The business analyst who does not have a precise answer to the question "what do you actually do?" cannot define the value they bring, cannot defend their scope from encroachment, and cannot advocate effectively for the resources their work requires.** Champagne (*Seven Steps*, line 46,200) opens with a definition of the BA role that is deliberately expansive: *"Business analysis involves the identification of business needs and the determination of solutions to business problems."* This breadth is intentional: the BA role extends from IT projects to operational improvement to strategic analysis — and the analyst who understands this breadth can grow into it.

#### Where BAs Come From

Champagne (line 46,250) observes that business analysts come from three distinct backgrounds, each bringing different strengths and different blind spots:

| Background | Strengths | Development Needs |
|---|---|---|
| Business domain expertise | Deep knowledge of processes, stakeholders, and business rules | Technical literacy, modelling techniques |
| IT or technical background | Systems thinking, technical feasibility assessment | Stakeholder management, business acumen |
| Project or process management | Structured thinking, facilitation, governance | Deep domain knowledge, requirements specification |

No background is complete. Every BA who understands their origin story can see where to invest in development.

#### What Makes a Great BA

Champagne (line 46,280) distills the qualities of outstanding BAs: genuine curiosity about how businesses work; analytical precision combined with communication clarity; the ability to hold complexity in mind without simplifying prematurely; and the professional integrity to deliver findings honestly — even when they are not what stakeholders want to hear.

Champagne (line 46,290) offers a BA suitability self-assessment: *"Do you enjoy solving puzzles? Do you like learning about how different businesses work? Do you prefer to understand the whole picture before making recommendations? Are you comfortable challenging assumptions respectfully?"*

#### The IIBA Definition and Its Significance

Champagne (line 47,374) cites the IIBA definition that has become canonical: *"The IIBA defines a requirement as a usable representation of a need."* This definition matters because it frames the BA's core deliverable not as documentation but as communication: a representation that enables someone to act on the need it describes. The format — text, diagram, model, prototype — is secondary to the utility.

#### Key Takeaways

- Knowing your role means having a precise answer to "what do I actually do?" — and being able to articulate the value it creates.
- BAs come from three backgrounds (domain, technical, project management) — each with complementary strengths and development needs.
- Outstanding BAs combine curiosity, analytical precision, communication clarity, and professional integrity.
- The IIBA defines a requirement as a usable representation of a need — the deliverable is communication, not documentation.
- The BA role extends from IT projects to operational improvement to strategic analysis — professional growth means expanding into this breadth.

---

### 11.5.2 Know Your Audience

**Every requirement exists in a relationship — between the BA and the stakeholder, between the need and the solution, between the question asked and the answer given — and the BA who treats all relationships the same will leave value on the table in every one of them.** Champagne (*Seven Steps*, line 47,879) opens Chapter 2 with a claim that is structurally important: *"The heart and soul of a BA is working with people. Some of your most valuable analysis is done with coworkers."*

#### Stakeholder Taxonomy: Who the BA Works With

Champagne (line 47,969) provides a comprehensive stakeholder taxonomy for project-based BAs:

| Stakeholder | Primary Interest | BA Approach |
|---|---|---|
| Business executives | Strategic direction; is the investment aligned? | Brief, high-level; value and risk focused |
| Product owners | Vision and prioritisation; is this the right feature? | Collaborative; analytical partner |
| Project sponsors | Funding and success; is the project on track? | Factual; option-focused; no excuses |
| Project managers | Schedule and scope; what will this impact? | Detailed for dependencies; risk-conscious |
| SMEs and users | Does the solution work for them? | Patient; trust-building; validation-oriented |
| QA analysts | Is the solution testable and correct? | Precise; testability-focused |
| Trainers | Can users be prepared for the change? | Transition-aware; change management |
| Vendors | Is the solution deliverable? | Objective; requirements-controlled |

#### Establishing Trust: The BA's Primary Asset

Champagne (line 47,934) frames trust as the BA's most important professional asset: *"As a BA, you have very little formal control or supervisory authority over the people with whom you will be working. Your best chance at successful requirements elicitation and solution identification will be your stakeholders' confidence and trust in you."*

Trust is established through: keeping promises; behaving with integrity; genuinely serving stakeholders' interests; and delivering honest findings even when they are uncomfortable. Champagne (line 47,943) specifies: *"You gain trust from people not by asking for things from them, but rather by asking what you can do for them."*

#### Working with Challenging SMEs

Champagne (line 48,626) devotes significant space to challenging stakeholder types: the true expert who oversimplifies; the expert who is reluctant to talk; the expert angry about previous project failures; the expert who hates their job. Each type requires a different approach. The common principle: *"approach each with curiosity, not judgment; find the angle that unlocks their expertise; focus on the organisational goal, not the interpersonal difficulty."*

Champagne's advice for the angry expert (line 48,729) is memorable and practically useful: *"I know that you have worked on similar projects in the past that have failed. I am very sorry that your time was wasted. We have learned from those failures and are hoping that you will help us again."* Acknowledging the past disarms the anger more effectively than defending against it.

#### Key Takeaways

- The BA's heart is working with people — stakeholder relationships are the medium through which requirements emerge.
- Different stakeholders require different communication approaches: executives need brevity and value focus; SMEs need trust and patience.
- Trust is the BA's primary professional asset — built through consistency, integrity, and genuine service.
- Challenging stakeholder types (reluctant, angry, disengaged) require specific approaches rooted in empathy and goal focus.
- The key to unlocking a difficult stakeholder: acknowledge their past experience, articulate the goal clearly, and demonstrate genuine interest in their knowledge.

---

### 11.5.3 Know Your Project

**The BA who does not understand why the organisation decided to fund the project is navigating without a destination — eliciting requirements without a reference point for what they must ultimately achieve.** Champagne (*Seven Steps*, line 49,739) frames Step 3 as the BA's orientation work: *"It is critical for the business analyst to thoroughly understand the project to which they are assigned. Without clearly knowing the goals of the project, an analyst will not be able to focus elicitation and analysis activities in the right direction."*

#### The Business Case as the BA's Reference Document

Champagne (line 49,777) instructs the BA to study the business case before beginning elicitation: *"The business case is the justification to do a project to deliver the change."* The business case answers the question the BA must always keep in view: *why is the organisation spending money on this?* Every requirement should trace back to a business objective in the business case. If it does not, it may be scope creep.

Champagne (line 49,814) provides a practical business case template: state the problem or opportunity; assess costs and benefits (both tangible and intangible); address risks and alternatives; and recommend a course of action. Table 3.2 in Seven Steps itemises costs explicitly: hardware, software, networking, training, marketing, ongoing support, and maintenance.

#### Six Reasons Projects Are Funded

Champagne (line 49,969) catalogues six common project drivers:

| Driver | Example | BA's Priority Focus |
|---|---|---|
| Solve a problem | Reduce error rate in order processing | Root cause analysis, process improvement |
| Eliminate costs | Reduce headcount through automation | Process redesign, change management |
| Comply with regulation | Implement GDPR data controls | Regulatory requirements, compliance testing |
| Exploit an opportunity | Launch mobile commerce channel | Market requirements, competitive analysis |
| Support marketing | Re-platform the website | Customer journey, brand requirements |
| Align processes or deliver strategy | Implement ERP system | Enterprise integration, process standardisation |

Understanding which driver motivates the project allows the BA to prioritise requirements that most directly serve that driver and deprioritise requirements that serve other objectives.

#### Strategic Alignment: The Project's North Star

Champagne (line 49,746) reminds the BA that every project supports a piece of the organisation's strategic plan: *"The enterprise strategic plan is the organisation's road map to long-term success. Each individual project supports a piece of the strategic plan."* The BA who understands the strategic plan can distinguish requirements that advance the strategy from those that are merely urgent or politically driven.

#### Key Takeaways

- Step 3 requires understanding why the organisation funded the project — every requirement should trace to the business case.
- The business case is the BA's primary reference document: problem, costs, benefits, risks, alternatives, and recommendation.
- Six common project drivers: problem-solving, cost reduction, regulatory compliance, opportunity exploitation, marketing support, and strategic delivery.
- Understanding the driver allows the BA to prioritise requirements that most directly serve it.
- The organisation's strategic plan provides the ultimate reference point — requirements that do not serve it are candidates for de-prioritisation.

---

### 11.5.4 Know Your Business Environment

**The BA who understands only the project's explicit requirements will miss the environmental constraints, dependencies, and dynamics that will determine whether the solution succeeds in practice.** Champagne (*Seven Steps*, line 51,545) describes Step 4 as the work of developing contextual intelligence: *"Understand the context of a change and what is affected, influenced, and needs to be considered — this helps a BA work with the business to deliver solutions that are long-lasting and impactful."*

#### Context Diagrams: The BA's Environmental Map

Champagne (line 51,553) recommends the context diagram as the primary tool for mapping the business environment: *"Starting off any engagement or even doing your own BA planning work with a context diagram is a great technique to identify what you know and what you do not."* The system being changed sits at the centre; everything that interacts with it — other systems, external agents, data flows — is mapped around the perimeter. The diagram is both an analysis tool (it reveals what you do not yet know) and a communication tool (it creates a shared visual for stakeholders).

#### Elicitation Techniques for Environmental Understanding

Champagne (line 51,589–51,833) describes six elicitation techniques for environmental understanding:

| Technique | Best Used For |
|---|---|
| Interviews | Individual stakeholder perspectives; sensitive topics |
| Context diagrams | System boundaries; external dependencies |
| Surveys and questionnaires | Large stakeholder groups; standardised data collection |
| Facilitated sessions | Multiple viewpoints; shared understanding; conflict resolution |
| Focus groups | External customer feedback; market research |
| Collaboration games | Engagement; creative requirements; breaking groupthink |

Champagne (line 51,641) is precise about facilitated sessions: *"Facilitated sessions are not meetings. They are structured, planned working sessions where every participant is carefully chosen and has a critical role to play."*

#### Understanding the As-Is and the To-Be

Champagne (line 51,933) addresses the fundamental BA question: when should the BA document the current (as-is) state? The answer depends on: whether anyone else needs to understand the current state; whether the as-is documentation will be used for change analysis; and whether alternative solutions need to be compared to the current state. *"Documentation of the current business processes is done to aid the change"* — not as a default activity.

#### Competitive and Market Context

Champagne (line 51,764) extends environmental awareness beyond the organisation: *"BAs should be keenly aware of what the industry is doing, key trends, best practices, and benchmarks of organisations in their industry."* The BA who understands the competitive environment can make better recommendations about solution scope, feature priorities, and make-vs-buy decisions.

#### Key Takeaways

- Step 4 requires developing contextual intelligence: the environmental constraints, dependencies, and dynamics that determine solution success.
- The context diagram maps the system's environment — it is both an analysis tool (revealing unknowns) and a communication tool.
- Six elicitation techniques for environmental understanding: interviews, context diagrams, surveys, facilitated sessions, focus groups, collaboration games.
- Document the as-is state when it will be used: for change analysis, alternative comparison, or stakeholder communication — not as a default.
- Competitive and market awareness allows the BA to make better recommendations about scope, priority, and make-vs-buy decisions.

---

### 11.5.5 Know Your Technical Environment

**The BA does not need to be a developer — but the BA who does not understand the technical constraints of the environment they are working in will specify requirements that are impossible, propose solutions that are incompatible, and miss the non-functional requirements that make or break every system.** Champagne (*Seven Steps*, line 52,995) frames Step 5 as technical literacy for the BA: not programming expertise, but enough architectural understanding to specify solutions that are feasible and ask the questions that reveal the constraints that shape every design choice.

#### IT Architecture Literacy

Champagne (line 53,020) identifies the architectural elements the BA must understand: IT governance (the rules that constrain what solutions are permissible), information architecture (how data is organised and accessed), data architecture (how data is structured and managed), security architecture (access controls and data protection policies), systems architecture (how applications and services interact), and application architecture (how individual applications are designed and deployed).

The BA does not design these architectures. But the BA must understand them well enough to: verify that proposed solutions are compatible with existing architecture; identify architectural constraints that limit solution options; and communicate architecture implications to business stakeholders in business terms.

#### Key Technology Concepts the BA Must Know

Champagne (line 53,083) covers the technology vocabulary the BA needs:

| Technology Concept | What BA Needs to Know |
|---|---|
| Operating systems | Compatibility constraints for software requirements |
| Networking | Connectivity requirements; security constraints for remote access |
| Data management | Data governance, golden source, real-time vs. batch requirements |
| Cloud technologies | Scalability options; hosting models; security trade-offs |
| Virtualization | Deployment flexibility; configuration management |
| Mobile technologies | Platform fragmentation; native vs. responsive design trade-offs |

Champagne (line 53,155) is precise about the BA's orientation: *"BAs focus on what information is being used and by whom... This leads even further into data architecture. Here, BAs focus on how the data needs to be structured so it is not only used but leveraged and reused across the organisation."*

#### Testing: The BA's Technical Accountability

Champagne (line 53,305) positions testing as one of the most important technical responsibilities for the BA: ensuring that requirements are written at the level of testability — specific enough that a test case can be designed, clear enough that the test case and the requirement unambiguously refer to the same thing. *"The experienced analyst also considers performance requirements when helping to design a solution — specific performance requirements must be elicited by the analyst even though they will often be difficult for SMEs and users to articulate."*

Champagne (line 53,363) describes the software testing phases the BA participates in: unit testing (where the BA may review test results), integration testing (where the BA tracks interface requirements), system testing (where the BA confirms requirements coverage), regression testing (where the BA contributes reusable test cases from the requirements baseline), and UAT (where the BA ensures users are testing against their original requirements).

#### Key Takeaways

- Step 5 requires technical literacy — not programming expertise, but enough architectural understanding to specify feasible requirements.
- Six architectural domains the BA must understand: IT governance, information, data, security, systems, and application architecture.
- Key technology concepts: OS compatibility, networking, data management, cloud, virtualisation, mobile.
- Testing is the BA's technical accountability: requirements must be written at the level of testability.
- The BA participates in all testing phases — from unit test result review through UAT facilitation.

---

### 11.5.6 Know Your Analysis Techniques

**The BA who uses only the techniques they already know will consistently get only the information those techniques can surface — and the most important requirements are often the ones that only emerge through techniques the BA has not yet tried.** Champagne (*Seven Steps*, line 55,507) opens Chapter 6 with a principle that should guide every analyst's professional development: *"BAs are most effective when they plan their analysis work and choice of techniques prior to starting, including understanding the approach that the change effort is taking and what level of governance and formality needs to be considered."*

#### The Technique Selection Framework

Champagne (line 55,510) identifies the factors that govern technique selection:

| Factor | How It Influences Selection |
|---|---|
| Project approach | Adaptive projects favour lightweight techniques; predictive projects favour formal ones |
| Stakeholder availability | Dispersed stakeholders favour surveys and async tools; co-located favour workshops |
| Requirements type | Process requirements favour flow diagrams; data requirements favour ERDs |
| Governance formality | Regulated industries favour structured documentation; agile teams favour visual boards |
| Team maturity | Experienced teams can use complex techniques; novice teams need scaffolded techniques |

Champagne (line 55,526) notes that *"the best technique for any situation is the one that works — where requirements are elicited, understood, and validated by a vested group of stakeholders who are excited to help move the change effort forward."*

#### Categories of Analysis Techniques

Champagne maps the major technique categories to their primary purposes:

- **Elicitation techniques**: interviews, facilitated sessions, focus groups, surveys, observation, document analysis — for discovering requirements.
- **Modelling techniques**: process models, data models, state diagrams, use cases, context diagrams — for organising and communicating requirements.
- **Prioritisation techniques**: MoSCoW, time-boxing, story mapping — for ordering requirements by value.
- **Validation techniques**: reviews, walkthroughs, prototyping, UAT — for confirming requirements accuracy.

#### Growing Your Technique Repertoire

Champagne (*Seven Steps*, line 55,810) provides direct professional development advice: *"Try using a variety of analysis techniques on the same problem to see what new information is exposed. Do not ignore tried-and-true techniques just because they have been around for years... Every technique you learn provides another opportunity for you to expand your analysis skills."*

Champagne (line 55,851) describes *systems thinking* as the meta-technique that ties all others together: *"Systems thinking presents the idea that there are behaviours, properties, and components that emerge from different items working together than would be present when analysing each element individually."* The BA who thinks in systems understands how a change to one process affects the entire organisation.

#### Key Takeaways

- Step 6 requires technique selection to be driven by the project's approach, stakeholder availability, requirements type, governance formality, and team maturity.
- The best technique is the one that works — there is no universal hierarchy of analysis techniques.
- Technique categories: elicitation, modelling, prioritisation, and validation — each serving a distinct analytical purpose.
- Professional growth requires actively trying new techniques — every technique learned expands analytical intelligence.
- Systems thinking is the meta-technique: it prevents local optimisation at the cost of systemic degradation.

---

### 11.5.7 Increase Your Value

**The BA who arrives at a new project with exactly the same skills they had at the last one has not improved their value to the organisation — they have maintained it, which in a continuously changing environment is the same as declining.** Champagne (*Seven Steps*, line 55,564) frames Step 7 as the BA's professional development mandate: *"You can increase your value to an organisation by learning new techniques and continuously improving your skills."*

#### BA Planning: The Practice of Self-Reflection

Champagne (line 55,591) introduces *BA planning* — not as project planning but as the BA's personal practice of self-assessment before, during, and after each project. Before beginning: what do I know about this project? Who will I work with? What governance is in place? Where will requirements be stored? During: am I making the decisions that need to be made? Am I missing techniques? After: what did I do well? What should I do differently next time?

Champagne (line 55,681) provides a structured BA assessment framework (Figures 7.1–7.3 in Seven Steps): a 1–5 proficiency scale per task, a target proficiency for the next effort, a specific action to close the gap, and a date for re-assessment. This is not a performance review — it is a professional habit.

#### The 80/20 Principle Applied to BA Work

Champagne (line 55,984) introduces the 80/20 principle for requirements work: *"BAs spend 20% of their time eliciting 80% of the requirements. The other 80% of analysis time is spent collaborating on the other 20% of the requirements."* The 20% of complex, contentious, or ambiguous requirements require the most time and analytical skill — and these are also typically the most critical requirements. The BA who understands this distributes their effort accordingly.

#### Prioritising BA Work: Delivering the Most Value

Champagne (line 55,879) addresses a practical challenge every BA faces: when you are assigned to multiple projects or tasks, how do you allocate your time? The answer: *"Focus on the greatest value to the greatest population. While something may be easy for you, often you will need to learn to prioritise those greater, more challenging tasks as they deliver the most value to your organisation."*

Champagne (line 55,936) introduces time boxing as a personal productivity technique: *"Time boxing aims to prioritise as much work as possible within a predetermined time frame — meaning you will not have time to do everything; but with the time you are given, you determine how much you can accomplish."*

#### Building Relationships: The Long-Term Investment

Champagne (line 55,997) closes with a reminder that relationship building is the compounding investment of a BA's career: *"Building relationships is an important skill of a successful BA. Every day that you interact with other BAs and with your current and potential stakeholders, you can be practising this skill."* Each relationship built is a future source of information, support, and collaboration.

#### Key Takeaways

- Step 7 requires continuous professional development — maintaining existing skills in a changing environment is equivalent to declining.
- BA planning is a personal self-assessment practice: before, during, and after every project.
- The BA skills assessment (1–5 proficiency per task, target, action, date) converts reflection into structured development.
- The 80/20 principle: 20% of requirements take 80% of the time — these are typically the most critical.
- Relationship building is a compounding investment — each relationship creates a future source of intelligence and collaboration.

---

## Sub-module 11.6: Agile Tools in Practice

Patrick Li's *JIRA Agile Essentials* (lines 43,032–46,076) provides the practitioner's introduction to Jira as an agile project management platform. Written for professionals who already understand Scrum and Kanban conceptually, it shows how those frameworks translate into the tool most widely used in professional software development teams. For the business analyst, Jira literacy is not optional — it is the difference between participating in backlog management and watching from the outside.

---

### 11.6.1 Agile Project Management with Jira

**Jira is not an issue tracker with agile features bolted on — it is a configurable platform whose backlog, board, sprint, and velocity views collectively provide the information architecture that makes Scrum and Kanban visible, manageable, and improvable at team scale.** Li (line 43,443) frames Jira's value: *"Atlassian recognises the values agile can bring. It has become a leader in agile software development by coming out with JIRA Agile, a product that adds agile support to JIRA."*

#### The Jira Information Architecture for Scrum

Li (line 43,830) describes the three modes of the Scrum board in Jira:

| Mode | Purpose | What the BA Uses It For |
|---|---|---|
| Backlog | Plan sprints, create and prioritise issues | Story writing, epic creation, prioritisation |
| Active Sprints | Track work in progress during sprint | Monitoring progress, flagging blockers |
| Reports | Track sprint and velocity data | Burndown analysis, velocity trend review |

The backlog mode is the BA's primary workspace. This is where stories are created, acceptance criteria are added (in the description field), epics are defined and organised, stories are linked to epics, and sprint boundaries are drawn.

#### Issue Types and the BA's Vocabulary

Li (line 43,593) describes Jira's issue type hierarchy:

| Issue Type | BA Use |
|---|---|
| Epic | Large feature or theme spanning multiple sprints; BA writes high-level description and links stories |
| Story | User story with acceptance criteria; BA owns the description and criteria |
| Task | Development or analysis task within a story; BA may create analysis tasks |
| Sub-task | Smallest unit of work; primarily for development team use |
| Bug | Defect; BA validates whether defect is a code issue or a missing requirement |

#### Story Points and Estimation in Jira

Li (line 43,960) shows how Jira implements story point estimation: each story has an Estimate field. During planning poker, the team enters the agreed estimate directly in Jira. The board automatically sums story points by sprint and displays them in the sprint planning view, enabling the team to see sprint capacity at a glance.

Li (line 43,940) reminds: *"Story points are used to measure the complexity or level of effort required to complete a story, not how long it will take. A complex story may have eight story points, while a simpler story will have only two."*

#### Key Takeaways

- Jira provides the information architecture that makes Scrum visible: backlog, active sprint board, and reports.
- Three Scrum board modes: backlog (planning), active sprints (tracking), reports (analytics).
- The backlog is the BA's primary workspace: story writing, epic organisation, acceptance criteria, prioritisation.
- Issue types: Epic (theme-level), Story (user task + criteria), Task (work item), Sub-task (smallest unit), Bug (defect).
- Story points are entered per story in the Estimate field; Jira aggregates them for sprint capacity visibility.

---

### 11.6.2 Scrum and Kanban Boards

**The Scrum board and Kanban board in Jira are not aesthetically different versions of the same tool — they encode fundamentally different workflow philosophies, and the BA who understands the difference can recommend the right approach for the right team.** Li (line 43,679) distinguishes them: Scrum *"prescribes the notion of iteration"*; Kanban *"emphasises just-in-time delivery by visualising the workflow and tasks in progress."*

#### The Scrum Board: Sprint-Centric Visibility

The Scrum board in Jira is organised around sprints. Work moves through columns (To Do → In Progress → Done) within the context of a sprint — a time-boxed commitment. Li (line 44,090) describes the active sprint view: the left section contains sprint issues organised by column status; the right section shows the issue detail panel.

For the BA, the Scrum board's most important features are:

- **Swimlanes**: rows that group stories by epic, assignee, or priority — allowing the BA to see, at a glance, whether all stories in an epic are progressing and whether stories are stuck.
- **Sprint goal**: displayed at the top of the board — the BA uses this to evaluate whether in-progress work is aligned with the stated goal.
- **Blocker flags**: Li (line 44,094) notes that stories can be flagged as blocked — the BA should treat a blocker flag as a requirements clarification request.

#### The Kanban Board: Flow-Centric Visibility

The Kanban board is not sprint-bounded. Work flows continuously from backlog through configured columns to done. Li (line 43,679) identifies Kanban as most suitable for operations teams — teams maintaining systems, processing requests, or providing ongoing service rather than building new features in sprints.

The BA's primary role in a Kanban context: ensuring that items entering the queue have clear, testable requirements before they are picked up. Without sprint planning as a forcing function, the BA must build acceptance criteria and clarification into the queue's entry criteria.

#### Column Configuration and Workflow Mapping

Li (line 43,240) describes Jira's column customisation: columns can be mapped to specific Jira workflow statuses, and column constraints (WIP limits) can be set to prevent overloading. For the BA, column configuration is a requirements activity: the columns represent the team's workflow, and the workflow represents requirements about how work should move through the system.

#### Key Takeaways

- Scrum and Kanban boards encode different workflow philosophies: iteration-based (Scrum) vs. flow-based (Kanban).
- Scrum board features for BAs: swimlanes (epic progress visibility), sprint goal alignment, blocker flags as requirements clarification requests.
- Kanban is most suitable for operations teams — continuous flow without sprint time-boxes.
- In Kanban, the BA builds acceptance criteria into queue entry criteria rather than sprint planning.
- Column configuration is a requirements activity: columns represent workflow requirements that the BA co-owns with the team.

---

### 11.6.3 Reporting and Metrics in Tools

**A burndown chart that no one reads, a velocity chart that no one challenges, and a cumulative flow diagram that no one interprets are just pixels on a screen — the BA who can read these reports and surface actionable insights from them transforms data into decisions.** Li (line 43,230) describes the three primary reports in JIRA Agile's Scrum context: the sprint report, the burndown chart, and the velocity chart.

#### The Sprint Report

Li (line 44,229) describes the sprint report: a post-sprint summary of completed stories, incomplete stories, and stories removed from the sprint. For the BA, the sprint report's most important content is the incomplete and removed stories — these represent requirements that were not sufficiently understood, insufficiently sized, or insufficiently prioritised. Patterns across sprint reports reveal systematic BA process gaps.

#### The Burndown Chart in Jira

Li (line 43,230) explains the burndown chart: it shows remaining work (story points) on the Y-axis against time (days) on the X-axis. The ideal line shows equal point reduction per day; the actual line shows the team's real progress. Li notes: *"Remember that the goal here is not to get it right the first time but to continuously improve your estimates to a point where the team can consistently deliver the same amount of story points' worth of work."*

For the BA, a burndown that trends above the ideal line mid-sprint is a signal to investigate: is the scope growing? Were stories under-estimated? Are there unresolved requirements questions blocking development?

#### The Velocity Chart in Jira

Li (line 43,948) shows how Jira's velocity chart displays estimated versus completed story points per sprint. A widening gap between estimated and completed indicates that the team is over-committing — often because stories are not sufficiently detailed or the team's DoR is not being enforced. The BA's response: tighten story elaboration and apply the DoR more rigorously before sprint planning.

#### Confluence Integration: Documentation Within the Workflow

Li (line 43,284) describes JIRA Agile's integration with Confluence — Atlassian's wiki and documentation platform. This integration allows: creating Confluence pages from epics (linking documentation to features); creating user stories from Confluence (turning documentation into backlog items); capturing sprint meeting notes in Confluence linked to the Jira sprint; and creating retrospective reports.

For the BA, Confluence integration is the bridge between lightweight agile documentation and the team's live backlog — ensuring that analysis artefacts, stakeholder research, and decision records are accessible within the workflow.

#### Key Takeaways

- Sprint report: completed vs. incomplete stories — patterns across reports reveal systematic BA process gaps.
- Burndown chart: actual vs. ideal progress — above-ideal tracking mid-sprint signals scope growth, estimation errors, or requirements blockers.
- Velocity chart: estimated vs. completed per sprint — widening gaps indicate over-commitment, often caused by insufficient story elaboration.
- Confluence integration links documentation to the live workflow — analysis artefacts remain accessible within the agile toolchain.
- The BA who can interpret these reports and surface insights transforms data into actionable team decisions.
