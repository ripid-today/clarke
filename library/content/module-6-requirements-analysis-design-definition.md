# Module 6: Requirements Analysis & Design Definition

---

## Sub-module 6.1: Specifying and Modeling Requirements

---

### 6.1.1 Well-Written Requirements

**The Quality of Each Individual Requirement Determines Whether That Requirement Can Be Implemented, Tested, and Delivered — Everything Downstream Depends on Getting This Foundational Craft Right.** Requirements specification is not merely a documentation activity; it is a precision communication discipline. A requirement that is ambiguous will be interpreted differently by different readers. A requirement that conflates two conditions will spawn defects at the intersection. A requirement that is unverifiable will produce debates about acceptance long after delivery. BABOK V3, Section 7.1 frames the Specify and Model Requirements task as the activity by which "the meaning of requirements and designs is analyzed to confirm that they meet the business needs and goals of the stakeholders." That analysis begins with the quality of individual requirement statements.

**What Makes a Requirement Well-Written.** Karl Wiegers, in *Software Requirements*, identifies seven essential characteristics that every well-formed individual requirement must satisfy (Practice #14, pp. 217–228). These characteristics operate at the statement level — they describe whether a single requirement is fit for use, independently of the requirements set around it:

| Characteristic | Definition | Violation Example |
|---|---|---|
| **Complete** | Contains all information necessary to understand and implement it without seeking clarification | "The system shall process orders quickly" (no quantification of "quickly") |
| **Correct** | Accurately describes the capability or condition the stakeholder actually needs | A requirement that reflects the BA's assumption rather than what the stakeholder confirmed |
| **Feasible** | Can be implemented within the technical, financial, and timeline constraints of the project | Requiring real-time processing from a legacy batch system without re-architecture |
| **Necessary** | Traces directly to a stakeholder need, business rule, or business objective | A requirement added by a developer for technical convenience with no business justification |
| **Prioritized** | Has a relative importance assigned relative to other requirements, enabling trade-off decisions | All requirements marked "high priority" — rendering priority meaningless |
| **Unambiguous** | Has exactly one valid interpretation for all readers, including developers and testers | "The system shall support multiple user roles" (how many? with what permissions?) |
| **Verifiable** | A specific, objective test or inspection can determine whether the requirement has been met | "The system shall be user-friendly" — no objective test is possible |

BABOK V3, Section 7.1.4.3 frames individual requirement quality as foundational to the overall specification: a set of well-individually-formed requirements does not automatically produce a high-quality specification, but a specification containing poorly formed requirements cannot be of high quality regardless of its structural organization.

**Common Requirement Writing Defects.** Writing defects are distinguishable patterns of language failure in requirement statements. Wiegers catalogs the most frequent:

**Vague qualifiers and comparative adjectives.** Terms like "fast," "flexible," "easy," "robust," "user-friendly," "appropriate," and "as needed" introduce measurement ambiguity. Every such term requires a specific, testable substitute. "Fast" becomes "responds within two seconds for 95% of transactions under standard load." "User-friendly" becomes "new users can complete core task X in under five minutes without training."

**Compound requirements.** Using "and" or "and/or" to join two distinct conditions into one statement hides multiple requirements inside a single identifier. Each standalone testable condition deserves its own requirement statement and its own identifier.

**Passive constructions without actors.** "Errors shall be logged" does not specify whether the application, the operating system, a monitoring agent, or a database trigger performs the logging. The subject of every requirement should be explicit.

**Negative requirements.** Requirements framed as what the system shall not do ("the system shall not allow unauthorized access") are difficult to verify exhaustively and typically reflect a missing positive requirement ("the system shall authenticate users before granting access to any protected resource").

**Design constraints masquerading as requirements.** Requirements describe what the system must accomplish; designs describe how. A statement like "the system shall use a relational database to store customer records" specifies a design decision, not a capability need. Unless a technology constraint is genuinely imposed by business context (regulatory, compatibility), design decisions belong in the architecture, not in the requirements.

**The Role of a Requirements Glossary.** A requirements glossary is not a supplementary nicety — it is a prerequisite for unambiguous requirements. BABOK V3, Section 7.1.4 notes that business analysts must ensure that terms used in requirements are consistently defined across the specification. A term like "customer" may have three different meanings for three different business units. Without a controlled vocabulary anchored in a glossary, requirement unambiguity is illusory. Every domain-specific term, abbreviation, and acronym used in the requirements package should have a single, authoritative definition in the glossary.

**Anti-Patterns.** Several systematic patterns undermine individual requirement quality. **Requirement inflation** occurs when each requirement is qualified with so many conditions, exceptions, and cross-references that it becomes incomprehensible as a standalone statement — a signal to split, not to clarify. **False precision** quantifies a requirement (satisfying the verifiability criterion) but with a number that has no empirical basis, producing a requirement that passes quality checks but does not reflect a real performance need. **Scope creep by omission** leaves deliberate gaps in requirements to be "figured out later," deferring completeness to the implementation phase where ambiguity is far more expensive to resolve.

## Key Takeaways

- Every individual requirement must be complete, correct, feasible, necessary, prioritized, unambiguous, and verifiable — the absence of any one characteristic creates downstream implementation or testing failure.
- Vague qualifiers, compound requirements, passive voice without actors, and negative requirements are the most common writing defects; each has a specific remedy.
- Design decisions must be separated from requirements; requirements describe what the system must accomplish, not how it must accomplish it.
- A requirements glossary is a prerequisite for unambiguous requirements — without controlled vocabulary, apparent clarity conceals hidden interpretation differences.
- Individual requirement quality is necessary but not sufficient for specification quality; the set-level quality characteristics are addressed separately in verification.

---

### 6.1.2 Selecting Models and Notations

**No Single Model Type Can Capture Every Dimension of a Complex Solution — Selecting the Right Model Categories Is a Core Analytical Judgment, Not a Default Notation Choice.** Requirements models are analytical tools, not documentation templates. The business analyst selects and combines model types based on what must be communicated, to whom, at what level of precision, and at what point in the analysis cycle. BABOK V3, Section 7.1.4.1 establishes five fundamental categories of requirements models, each designed to answer a different class of question about the solution space. Understanding these categories — their purposes, strengths, and appropriate application — enables the BA to construct an integrated, multi-perspective view of requirements that text alone cannot achieve.

**The Five Model Categories.** BABOK V3, Section 7.1.4.1 organizes all requirements models into five categories distinguished by what dimension of the solution each illuminates:

| Category | What It Answers | Primary Model Types | Best For |
|---|---|---|---|
| **Scope models** | What is in and out of the solution boundary? | Context diagram, ecosystem map, feature tree | Early phases; stakeholder alignment on boundaries |
| **Process models** | How does work flow through the system? | BPMN process flow, use case diagram, user story map, swimlane diagram | Business process understanding; user interaction design |
| **Rule models** | What logic governs decisions and behavior? | Decision table, decision tree, business rule catalogue | Complex conditional logic; compliance requirements |
| **Data models** | What data entities exist and how are they related? | Entity-relationship diagram (ERD), data dictionary, class diagram | Data-intensive systems; integration specifications |
| **Interface models** | How will users interact and how will systems communicate? | Wireframe, screen flow, system interface specification, API specification | UI design input; system integration requirements |

**Scope Models.** Scope models establish the boundary of analysis. A **context diagram** — also called a system context diagram — places the solution at the center and shows all external entities (users, systems, organizations) that interact with it, along with the information flows between them. Its primary value is alignment: a context diagram makes the scope of the solution concrete enough that stakeholders who disagree about scope are forced to articulate their disagreement against a shared representation. The **ecosystem map** extends the context diagram to show the broader network of systems, data flows, and relationships in the operating environment. A **feature tree** organizes the solution's capabilities hierarchically, providing a scope model at the functional level.

**Process Models.** Process models are the most universally useful category. Business Process Model and Notation (BPMN) has become the dominant standard for business process modeling because it balances expressiveness with stakeholder accessibility. Process models answer the questions that trigger the most requirements-related confusion: who is responsible for each step, in what sequence do activities occur, what triggers transitions, and what are the exception paths? **Use case diagrams** in UML scope the interactions between actors and the system at the goal level — they are scope models for interaction rather than process flow. **User story maps** organize user stories by user journey, creating a two-dimensional structure that connects high-level activities to the specific stories that implement them.

**Rule Models.** Many requirements encode business logic that is conditional, complex, or likely to change independently of process. Decision tables organize conditions and outcomes in a grid that makes the complete combinatorial logic explicit — a decision table with three binary conditions reveals eight cases, many of which may have been unspecified in natural language. Decision trees provide an alternative visual representation of the same logic that is often more accessible to stakeholders unfamiliar with tabular formats. Business rule catalogues organize rules as standalone statements that can be referenced by multiple processes and requirements.

**Data Models.** Entity-relationship diagrams (ERDs) define the data entities that the solution must create, read, update, and delete, along with the relationships and cardinalities between them. ERDs surface requirements that text-based specifications routinely miss: optionality (is this relationship required or optional?), cardinality (one-to-many or many-to-many?), and the business rules embedded in relationships. A **data dictionary** provides the attribute-level specifications: data type, length, valid values, derivation rules, and business definitions. Together, the ERD and data dictionary constitute a complete data specification that developers and database designers can directly implement.

**Interface Models.** Wireframes and screen flows address the requirements layer that is most visible to users and most frequently contested during acceptance testing. A wireframe is not a design deliverable — it is a requirements tool that makes implicit assumptions about screen layout and navigation explicit. The discussion around a wireframe surfaces requirements that would otherwise remain unstated until the system is built. **System interface specifications** document the technical contracts between the solution and external systems, defining data formats, protocols, timing, error handling, and volume.

**Model Selection Criteria.** Choosing which model types to produce for a given project requires answering four questions: What communication gaps exist — what aspects of the requirements cannot be adequately expressed in text? Who is the audience — business stakeholders comprehend process diagrams far more readily than class diagrams? What is the problem type — a data-intensive integration project requires ERDs; a user-facing workflow requires process models and wireframes? At what phase of analysis — early phases favor scope and process models; later phases require interface and data models.

**Anti-Patterns.** **Notation overload** produces every available diagram type for every project, creating a documentation burden that slows the project without proportionate benefit. **Audience mismatch** uses technical notation (UML class diagrams) to communicate with business stakeholders who cannot read them. **Model-text mismatch** creates models that contradict the text requirements they are meant to clarify, producing irreconcilable specifications.

## Key Takeaways

- BABOK V3 organizes requirements models into five categories: scope, process, rule, data, and interface — each answering a different class of question about the solution.
- Model selection should be driven by communication gaps, audience, problem type, and analysis phase — not by notation preference or project convention.
- Context diagrams and scope models force stakeholder alignment on solution boundaries at the point in the project when realigning is least costly.
- Decision tables make combinatorial business logic exhaustive and explicit, surfacing unspecified conditions that text requirements routinely miss.
- Models are requirements tools, not design deliverables — their value lies in revealing and resolving ambiguity, not in creating documentation.

---

### 6.1.3 Text-Based vs Model-Based Specification

**The Choice Between Natural Language and Visual Notation Is Not a Stylistic Preference — It Determines What the Specification Can Communicate, to Whom, at What Cost.** Every requirements specification combines text and models in some proportion, and the judgment about that proportion reflects conscious trade-offs about expressiveness, audience accessibility, precision, and maintainability. BABOK V3, Section 7.1.4 frames this as the choice of representation — determining the most appropriate form for communicating each type of requirement given its complexity, its audience, and its downstream use. Wiegers, in *Software Requirements* Practice #14, approaches the same question through the lens of requirement patterns and abstraction levels, offering a practical framework for when structured text is sufficient and when visual modeling adds essential precision.

**The Case for Natural Language.** Natural language requirements — declarative sentences that specify what the system must do, have, or support — remain the dominant form of requirements expression because they are universally readable, tool-independent, and directly traceable to acceptance criteria and test cases. A well-formed text requirement can be understood by a business sponsor, a developer, a tester, and a contract manager with no specialized notation training. Text requirements are easy to version, review in standard document tools, and incorporate into contracts. BABOK V3, Section 7.1.4 notes that text requirements are the primary output of the Specify and Model Requirements task — models supplement and clarify text requirements but rarely replace them as the contractual specification of what will be built.

**The Limitations of Natural Language.** The same accessibility that makes text requirements universal also makes them imprecise. Natural language is inherently ambiguous: pronouns, implied subjects, unstated conditions, and implicit logic create requirements that different readers interpret differently. Text requirements struggle to represent complex conditional logic without becoming unwieldy. A business rule with five conditions and twelve outcomes occupies three paragraphs of prose that obscures rather than illuminates. Text requirements cannot visualize relationships between data entities, the sequence of process steps, or the boundaries of a system — spatial and relational information that models convey immediately. Wiegers notes that structured and semi-structured text reduces but does not eliminate these limitations, and that for certain requirement types, models are more precise than any text-based representation (Practice #14).

**Abstraction Levels in Requirements.** BABOK V3, Section 7.1.4 identifies three abstraction levels that govern both the content of requirements and the appropriate representation format:

| Level | Describes | Who Cares | Typical Form |
|---|---|---|---|
| **Conceptual** | What the business needs to do or achieve, independent of technology | Business sponsors, executives, non-technical stakeholders | Natural language; high-level process models |
| **Logical** | What the system must do, independent of specific technology implementation | Business analysts, subject matter experts, solution architects | Formal text requirements; ERDs; use cases; BPMN |
| **Physical** | How the system will implement the requirement using specific technology | Developers, database administrators, infrastructure teams | Technical specifications; class diagrams; API contracts |

The business analyst typically operates at the logical level, producing requirements that are technology-independent but specific enough for developers to design solutions. Conceptual requirements capture the business objective; physical specifications capture the design decision. Mixing levels within a requirements document — embedding physical implementation details in logical requirements — creates requirements that constrain design unnecessarily and become obsolete when technology choices change.

**Requirement Patterns as Structured Text Templates.** Wiegers introduces **requirement patterns** as a powerful technique for producing high-quality text requirements consistently (Practice #14). A requirement pattern is a parameterized template for a common requirement type that the analyst completes with solution-specific values. Examples of requirement pattern categories include:

- **Fundamental requirement patterns**: defining what the system shall do in its basic operational form
- **Information patterns**: specifying what data must be recorded, retrieved, and managed
- **Performance patterns**: defining throughput, response time, and scalability requirements
- **Interface patterns**: specifying interactions with external systems or users

Patterns enforce completeness by ensuring that all dimensions of a requirement type are addressed. A performance pattern template prompts the analyst to specify the operation, the load condition, the response time target, and the measurement point — making it far harder to produce an incomplete performance requirement than an open-form text approach would allow.

**When Models Add Value Over Text.** The decision to create a model for a given requirement type should be triggered by identifiable communication needs: when the requirement involves conditional logic with three or more variables, a decision table is more precise than prose; when the requirement describes a sequence of events or handoffs between actors, a BPMN diagram communicates the requirement more clearly than a numbered list; when the requirement involves multiple data entities and their relationships, an ERD makes cardinality and optionality explicit in a way that text descriptions routinely fail to convey. Models are also more effective than text for reviewing requirements with stakeholders who are visual thinkers, or whose domain expertise makes them uncomfortable with technical prose.

**The Hybrid Approach.** In practice, the most effective specifications combine text and models for the same requirements. Text provides the formal, traceable statement; the model provides the visual context that makes the text unambiguous. A use case is accompanied by a flow diagram that shows the main and alternate flows. A data requirement is accompanied by an ERD showing how the entity relates to others. A business rule is expressed both as a decision table and as individual rule statements that can be individually traced and tested. The investment in maintaining both representations is justified when the audience includes both technical readers who work from text and business readers who require visual context.

**Anti-Patterns.** **Text-model conflict** occurs when the text says one thing and the associated model shows another — typically because they were created at different times or by different people without synchronization. **Model proliferation without text** creates diagrams that are visually impressive but contain insufficient specification detail for implementation. **Physical level bleed** embeds technology decisions in logical requirements, tying requirements to architectural choices that may change.

## Key Takeaways

- Natural language requirements are universally readable and traceable but are inherently ambiguous; models are more precise for certain requirement types but require notation literacy.
- BABOK V3 identifies three abstraction levels — conceptual, logical, physical — and requirements at each level have different audiences, purposes, and appropriate representation forms.
- Requirement patterns provide parameterized text templates that enforce completeness by prompting the analyst to address all required dimensions of a requirement type.
- Models add the most value over text for conditional logic (decision tables), process sequences (BPMN), and data relationships (ERDs) — types of requirements that prose routinely under-specifies.
- The most effective specifications combine text and models for the same requirements, providing both formal traceability and visual context.

---

## Sub-module 6.2: Verifying Requirements

---

### 6.2.1 Quality Characteristics

**A Requirements Set That Is Composed of Individually Well-Written Statements Can Still Fail If the Set as a Whole Is Incomplete, Contradictory, or Disconnected from Stakeholder Priorities.** Verification addresses both dimensions: the quality of individual requirements and the collective quality of the requirements set. BABOK V3, Section 7.2 defines the purpose of Verify Requirements as ensuring "requirements and designs meet the required quality standards and characteristics in order to be useful during the solution development and implementation." Section 7.2.4.1 identifies nine quality characteristics that apply to requirements and requirements sets, providing the business analyst with a systematic evaluative framework applicable throughout the requirements development process.

**The Nine Quality Characteristics.** BABOK V3, Section 7.2.4.1 defines the following characteristics against which requirements are assessed:

**1. Atomic.** Each requirement is a single, discrete statement that can be understood and evaluated independently. An atomic requirement does not bundle multiple conditions, behaviors, or acceptance criteria into a single statement. The test: can this requirement be tested with a single test case? If not, it is not atomic. Atomicity enables unambiguous prioritization, discrete traceability, and independent implementation and testing.

**2. Complete.** A requirement is complete when it contains all information necessary to understand what is required, including conditions, actors, inputs, outputs, and any specific timing or performance constraints. Completeness also applies at the set level: the requirements set is complete when it addresses all the business needs identified in scope without gaps. BABOK V3 distinguishes individual completeness from set completeness: a set can be composed of individually complete requirements while still containing gaps relative to the business need.

**3. Consistent.** Requirements are consistent when they do not contradict one another. Inconsistencies include logical contradictions (two requirements that cannot both be true), conflicting performance targets for the same operation, and conflicting business rule specifications governing the same data. Inconsistency is among the most expensive quality failures because contradictions may not become visible until integration or testing, when resolution cost is highest.

**4. Concise.** A requirement is concise when it expresses what is needed without redundant information, unnecessary elaboration, or content that duplicates other requirements or other sections of the specification. Redundancy creates maintenance burden: every copy of information is a source of inconsistency after future changes. Conciseness is not brevity for its own sake — it is discipline against duplication and verbosity that obscures rather than clarifies.

**5. Feasible.** A requirement is feasible when it can be implemented within the constraints of the project — its technology platform, budget, schedule, and regulatory environment. Feasibility assessment requires collaboration with solution architects and technical leads. A requirement that cannot be feasibly implemented has no value regardless of its other quality characteristics and should be renegotiated, descoped, or deferred. BABOK V3 notes that feasibility can only be assessed relative to a specific context; a requirement that is infeasible given current technology constraints may become feasible with a different solution approach.

**6. Unambiguous.** A requirement is unambiguous when it has exactly one valid interpretation for all readers — business stakeholders, developers, testers, and auditors alike. Ambiguity is the most pervasive quality failure in requirements. The test is not whether the BA believes the requirement is clear, but whether diverse stakeholders reading it independently arrive at the same understanding. Terms with multiple valid meanings, pronoun references without clear antecedents, and conditions stated without all their qualifications are common sources of ambiguity.

**7. Testable.** A requirement is testable when there exists a feasible method — inspection, demonstration, analysis, or test — by which an observer can objectively determine whether the requirement has been satisfied. Testability is the quality characteristic that most directly governs whether the requirement can serve as the basis for acceptance criteria. Untestable requirements — those that reference subjective qualities like "user-friendly" or "appropriate" without measurable criteria — cannot be used to make objective acceptance decisions.

**8. Prioritized.** Every requirement has a relative priority indicating its importance to stakeholder needs and to the success of the solution. Prioritization enables trade-off decisions when scope, time, or budget must be adjusted. A requirements set in which every requirement is equally prioritized has no effective prioritization — it provides no basis for phasing, for scope negotiation, or for risk-driven development sequencing. BABOK V3 notes that prioritization is a characteristic of the requirements set, reflecting stakeholder value judgments rather than BA assessments.

**9. Understandable.** Requirements are understandable when the intended audience — typically a combination of business stakeholders and technical implementers — can read and correctly comprehend them without specialized expertise in the BA's analytical methodology. Understandability is context-dependent: a data dictionary entry written for database administrators may be appropriately technical; the same entry written for business sponsors reviewing requirements for approval must be expressed differently. The BA writes requirements for their audience, not for their own analytical clarity.

**Applying the Nine Characteristics in Practice.** The characteristics are interdependent: a requirement cannot be unambiguous if it is not complete (missing information forces readers to make assumptions). It cannot be testable if it is not unambiguous (multiple interpretations produce multiple test conditions). It cannot be consistent if it is not atomic (compound requirements may contain internally contradictory conditions). The most effective approach treats the nine characteristics as an integrated quality framework applied through systematic review, not as a sequential checklist.

**Anti-Patterns.** **Checklist compliance without substance** applies the nine characteristics as a formal review process but allows requirements to pass with minor wordsmithing rather than genuine quality improvement. **Priority inflation** assigns high priority to all requirements to avoid the difficult conversation about trade-offs, rendering the prioritized characteristic meaningless. **Testability deferral** accepts requirements that lack testability criteria on the assumption that test cases will clarify acceptance conditions — a practice that guarantees ambiguity at the acceptance stage.

## Key Takeaways

- BABOK V3 defines nine quality characteristics for requirements: atomic, complete, consistent, concise, feasible, unambiguous, testable, prioritized, and understandable — each addresses a distinct failure mode.
- The characteristics are interdependent: a requirement cannot be testable if it is not unambiguous; it cannot be consistent if compound requirements bundle conflicting conditions.
- Feasibility is context-relative and requires collaboration with technical leads — a requirement is only infeasible relative to a specific technology and constraint environment.
- Prioritization must produce meaningful differentiation; a requirements set in which all requirements are equally prioritized has no effective prioritization for trade-off decision-making.
- The nine characteristics apply at both the individual requirement level and the requirements set level; completeness and consistency have important set-level dimensions beyond their individual requirement dimensions.

---

### 6.2.2 Reviews and Inspections

**Requirements Verification Through Structured Review Is the Most Cost-Effective Defect Removal Activity Available to the Business Analyst — Defects Found in Requirements Are an Order of Magnitude Less Expensive to Resolve than the Same Defects Found After Implementation.** The empirical case for requirements review is well established. Karl Wiegers, in *Software Requirements* Practice #18, cites industry data showing that inspections can remove 60 to 90 percent of latent defects before development begins, making them the highest-leverage quality activity in the software engineering process. BABOK V3, Section 7.2.4.2 identifies structured walkthroughs and inspection as the primary verification techniques, recognizing that formal review processes improve requirements quality in ways that individual author review cannot replicate. The business analyst must understand the full spectrum of review types — from informal collegial checks to formal Fagan inspections — to select the approach appropriate to the stakes, the schedule, and the quality target.

**The Review Spectrum: Four Types.** Wiegers describes four review types on a continuum from least to most formal (Practice #18). Each point on the continuum offers a different trade-off between review depth, reviewer preparation effort, and defect removal efficiency:

| Review Type | Formality | Participants | Meeting Required | Best Suited For |
|---|---|---|---|---|
| **Peer deskcheck** | Informal | Author + 1 peer | No | Quick spot-check; short sections; time-constrained reviews |
| **Passaround** | Semi-formal | Author + multiple reviewers (async) | No | Distributed teams; early-draft review; moderate-stakes documents |
| **Team review** | Structured | Author + planned review team | Yes | Major specification sections; pre-baseline reviews |
| **Formal inspection** | Rigorous | Defined roles; structured process | Yes | High-stakes specifications; mission-critical requirements |

**Peer Deskcheck.** The peer deskcheck is the lightest-weight review: the author asks one qualified colleague to read a section of requirements and provide informal feedback. No meeting is scheduled; no defect log is maintained; the exchange is conversational. The value of a deskcheck is its accessibility — it costs almost nothing and can be performed on any section at any time. Its limitation is its informality: a single reviewer may miss defects that a wider audience would catch, and the absence of systematic defect recording means patterns cannot be identified across multiple reviews.

**Passaround.** The passaround distributes the requirements document to multiple reviewers who examine it independently and submit written comments. No review meeting is held; the author collects and reconciles the comments offline. Passarounds scale well to distributed teams and remove the scheduling friction of coordinating a synchronous meeting. Their limitation is the absence of discussion: reviewers who independently identify the same ambiguity may each suggest a different resolution, and without a meeting, those conflicting resolutions must be reconciled by the author alone. Passarounds work best for early drafts where the goal is to surface issues rather than resolve them in real time.

**Team Review.** The team review brings a planned group of reviewers together in a structured meeting to examine the requirements collaboratively. Unlike the passaround, reviewers prepare individually before the meeting and then discuss their findings. Defects are recorded and assigned. The team review combines the benefits of multiple perspectives with the collaborative resolution of disagreements, producing a higher-quality outcome than asynchronous review at the cost of scheduling and meeting coordination. BABOK V3, Section 7.2.4.2 identifies structured walkthroughs as a primary verification technique; the team review is the most common implementation of that technique.

**Formal Inspection.** The formal inspection — developed by Michael Fagan at IBM — is the most rigorous review method and the most demanding in terms of preparation and process discipline. BABOK V3, Section 7.2.6 lists inspection as a technique for Verify Requirements. Wiegers identifies five roles in a formal inspection:

| Role | Responsibility |
|---|---|
| **Moderator** | Plans and leads the inspection; ensures process discipline; does not evaluate content |
| **Author** | Created the requirements; answers questions but does not defend decisions |
| **Reader** | Reads or paraphrases the requirements aloud, section by section, during the meeting |
| **Reviewer** | Identifies defects by comparing requirements against source documents, specifications, and quality criteria |
| **Recorder** | Documents defects, questions, and decisions as they arise in the meeting |

The formal inspection process consists of six stages: planning (selecting participants, distributing materials), overview (author explains context), preparation (reviewers examine materials independently), inspection meeting (defects identified and recorded), rework (author addresses defects), and follow-up (moderator verifies rework). Organizations that implement formal inspections consistently report defect removal efficiencies of 70 to 85 percent before implementation begins (Wiegers, Practice #18).

**Selecting the Right Review Type.** The selection criterion is risk-adjusted value: what is the cost of a defect in this section reaching implementation, and what is the cost of the review type required to prevent it? High-stakes specifications — requirements for safety-critical systems, regulatory compliance, or high-value integration contracts — justify formal inspection overhead. Internal working documents and early drafts are better served by passarounds or desk checks that generate input without consuming excessive review capacity.

**Anti-Patterns.** **Rubber stamp reviews** schedule team reviews or inspections but conduct them under schedule pressure without adequate preparation, producing sign-off without genuine defect detection. **Defensive authorship** treats reviews as attacks on the author's work rather than systematic searches for defects, creating a climate where reviewers self-censor. **Inspection overhead without process** applies formal inspection ceremony without the preparation, role discipline, and follow-up that generate its defect removal efficiency.

## Key Takeaways

- Requirements defects removed through reviews are an order of magnitude less expensive to resolve than the same defects discovered after implementation — structured review is the highest-leverage quality activity in the BA process.
- The four review types — peer deskcheck, passaround, team review, and formal inspection — differ in formality, participant count, and defect removal efficiency, requiring selection based on risk and stakes.
- Formal inspection involves five defined roles (moderator, author, reader, reviewer, recorder) and six stages; its process discipline is what generates its superior defect removal efficiency.
- Review type selection should be risk-adjusted: high-stakes, high-consequence specifications warrant formal inspection overhead; early drafts and low-risk sections are adequately served by passaround or deskcheck.
- The cultural prerequisite for effective review is that defect identification is treated as a collaborative quality activity, not a personal critique of the author's work.

---

### 6.2.3 Verification Checklists

**A Requirements Verification Checklist Transforms the Nine Quality Characteristics from Abstract Criteria Into Actionable Reviewer Questions That Systematically Expose the Most Common Requirement Defects.** Without a checklist, reviewers rely on their experience and current attention to identify defects — a method that is inconsistent across reviewers and tends to miss classes of defect that are not salient at the time of review. BABOK V3, Section 7.2.6 identifies inspection as a primary technique for the Verify Requirements task, and inspection in practice depends on checklists to make the review systematic rather than impressionistic. Wiegers, in *Software Requirements* Practice #18, describes checklists as the tool that operationalizes review quality: "reviewing without a checklist is like flying without a preflight checklist — things can still go right, but the odds of missing something decrease substantially when the check is systematic."

**What Belongs on a Requirements Verification Checklist.** A verification checklist is organized around the quality characteristics identified in BABOK V3, Section 7.2.4.1, translated into specific, answerable questions for each characteristic:

**Atomicity checks:**
- Does this requirement contain only one testable condition?
- Is there an "and" or "or" that signals a bundled requirement requiring separation?
- Can this requirement be independently implemented and tested?

**Completeness checks:**
- Are all actors, triggers, inputs, outputs, and conditions explicitly specified?
- Are all exception and error conditions addressed?
- Does this requirement reference terms or entities defined elsewhere in the specification?
- Are all preconditions and postconditions stated?

**Consistency checks:**
- Does this requirement contradict any other requirement in the set?
- Are performance targets consistent with other requirements addressing the same operation?
- Are business rules applied consistently across all requirements that reference them?

**Conciseness checks:**
- Is there duplicate content that appears elsewhere in the specification?
- Is every sentence in this requirement necessary for understanding what is required?

**Feasibility checks:**
- Has a technical lead confirmed that this requirement is implementable within the solution constraints?
- Does this requirement assume capabilities not available in the target technology environment?

**Unambiguity checks:**
- Does every term have a single, consistent definition aligned with the requirements glossary?
- Are all pronouns resolved to explicit referents?
- Are all quantitative thresholds specified with units and measurement conditions?
- Could two readers interpret this requirement differently?

**Testability checks:**
- Is there a specific, observable outcome that confirms this requirement is met?
- Are all conditions under which the requirement must hold specified?
- Are performance requirements stated with specific numerical targets and measurement conditions?

**Priority checks:**
- Is a priority level assigned?
- Is the priority consistent with the business value and risk associated with this requirement?

**Understandability checks:**
- Is this requirement written in language appropriate for its intended audience?
- Are all domain-specific terms defined in the glossary?
- Is the requirement free of jargon that would be inaccessible to its intended readers?

**Checklists by Requirement Type.** A single generic checklist cannot address the specific defect patterns associated with each requirement type. BABOK V3, Section 7.2.6 supports the use of structured review techniques that adapt to the requirement type being verified. Specialized checklists are warranted for:

| Requirement Type | Additional Checklist Items |
|---|---|
| **Business rules** | Is the rule source (regulation, policy, business decision) identified? Are all exceptions stated? Is the rule testable as stated? |
| **Use cases** | Are all primary and alternate flows specified? Is the trigger defined? Are all actors and their roles identified? Are error and exception paths included? |
| **Data requirements** | Are data type, length, format, and valid value ranges specified? Is the entity-relationship context clear? Are derivation rules for calculated fields stated? |
| **Interface requirements** | Are message formats, protocols, error handling, and timing specifications included? Are volume and throughput constraints specified? |
| **Performance requirements** | Is the operation, the load condition, the measurement point, and the acceptable threshold all specified? Is the baseline measurement method defined? |

**Building and Maintaining Checklists.** Checklists improve when they are systematically updated from defect data. After each review cycle, the types and frequencies of defects found should be recorded. Classes of defect that recur across multiple reviews indicate missing checklist items or insufficiently specific checklist questions. BABOK V3, Section 7.2.6 supports continuous improvement in verification processes; in practice, this means maintaining a living checklist that incorporates the lessons from each review cycle. A project-level checklist becomes a team-level asset when it captures organizational learning about which requirement defects are most frequent and most consequential.

**Using Checklists in Reviews.** Wiegers recommends that reviewers use individual checklists during preparation — before the review meeting — not during the meeting itself. The meeting is for discussing and resolving defects, not for discovering them. Preparation-phase checklist use enables reviewers to arrive at the meeting with a clear understanding of what defects they found, categorized by type, allowing the meeting to focus on resolution rather than discovery (Practice #18). Each reviewer's checklist responses also provide a record of what was examined, making the review auditable.

**Anti-Patterns.** **Checklist-as-formality** applies a checklist to satisfy a process gate without genuine examination, producing checked boxes without genuine defect detection. **Generic-only checklists** use the same checklist for every requirement type, missing the type-specific defect patterns that specialized checklists would surface. **Static checklists** freeze the checklist at project initiation and never update it from review defect data, forgoing the organizational learning that makes checklists progressively more effective.

## Key Takeaways

- Verification checklists operationalize the nine quality characteristics into specific, answerable reviewer questions, transforming abstract criteria into systematic defect detection.
- Checklists should be both generic (covering all nine characteristics) and type-specific (addressing the characteristic defect patterns of business rules, use cases, data requirements, interface requirements, and performance requirements).
- Reviewers should use checklists during preparation before the review meeting; the meeting itself is for discussing and resolving defects, not discovering them.
- Checklists improve through systematic post-review defect analysis: recurring defect classes indicate missing or insufficiently specific checklist items.
- A well-maintained requirements checklist is an organizational learning asset that encodes accumulated knowledge about the most frequent and consequential requirement defect patterns.

---

## Sub-module 6.3: Validating Requirements

---

### 6.3.1 Business Value Alignment

**Verification Asks Whether Requirements Are Written Correctly; Validation Asks Whether They Describe the Right Solution — Both Questions Are Necessary, and Confusing Them Produces Requirements That Are Technically Impeccable but Strategically Irrelevant.** This distinction, established in BABOK V3, Section 7.3.1, is one of the most important in the BA discipline. Verification confirms that requirements satisfy quality standards — that they are atomic, consistent, testable, unambiguous. Validation confirms that requirements, if implemented, will satisfy the actual business need and deliver value to stakeholders. It is entirely possible to produce a requirements specification that passes all nine verification quality characteristics but fails validation — the requirements are well-written expressions of the wrong solution. BABOK V3, Section 7.3 frames the Validate Requirements task as ensuring "all requirements and designs align with the business requirements and support the delivery of needed value to the organization."

**The Scope of Validation.** BABOK V3, Section 7.3.4.3 identifies the evaluation of requirements against solution scope as a core element of the validation task. The solution scope — defined during the Define Scope task in Requirements Life Cycle Management — establishes the boundaries of what the solution will and will not include. Validation checks that each requirement is:

- Within the agreed solution scope (not a scope addition)
- Traceable to a business objective or stakeholder need
- Aligned with the future state defined during strategy analysis
- Not a design preference with no business justification

Requirements that fail these checks are not simply well-written requirements that need editing — they are requirements that should not exist. A requirement that cannot be traced to a business need either reflects an undocumented need that should be surfaced and agreed upon, or it reflects individual stakeholder preference, technical design preemption, or scope creep that the BA must surface and manage.

**Identifying and Surfacing Assumptions.** BABOK V3, Section 7.3.4.1 identifies the management of assumptions as a central activity within requirements validation. Assumptions are conditions believed to be true for the purpose of a requirement, but not confirmed. Every requirements specification contains assumptions — about user capabilities, technology environments, data availability, and organizational processes. Unmanaged assumptions become hidden risks: a requirement that assumes the user can log in using single sign-on (SSO) becomes a blocking defect if SSO is not in scope or not available in the target environment.

The BA's role is to make assumptions explicit, record them in the assumptions register, and ensure that each assumption is validated against the project's confirmed technical and business context. BABOK V3, Section 7.3.4.1 notes that the business analyst "identifies and documents assumptions made in the requirements and designs to enable stakeholders to make informed decisions about whether those assumptions are valid." An assumption that cannot be validated against confirmed constraints is itself a requirement gap — either the constraint must change or the requirement must be rewritten.

**The Traceability Test for Value Alignment.** Every requirement that passes validation can be traced through an unbroken chain to a business objective. This traceability chain — from enterprise goals to business objectives to business requirements to stakeholder requirements to solution requirements — is the structural expression of value alignment. A requirement that exists at the end of this chain but cannot be traced back through it is either misplaced (it should be at a different level of abstraction) or unjustified (it serves no business purpose and should be removed). The traceability matrix, introduced in Module 4, is the tool that makes this chain visible. Validation is the moment at which the BA actively examines the chain for each requirement rather than relying on implicit assumptions about alignment.

**When Requirements Conflict with Business Goals.** Validation occasionally reveals requirements that are in direct conflict with business goals. A stakeholder may specify a requirement that, if implemented, would reduce rather than increase the quality of the business outcome — a common pattern when stakeholders confuse their operational preference with the business need the solution is intended to address. The BA's responsibility in this situation is to surface the conflict, trace it to its root cause (misunderstanding of the business goal, legitimate competing stakeholder need, or scope disagreement), and facilitate its resolution with the appropriate authority. BABOK V3, Section 7.3.2 notes that the purpose of requirements validation is to "ensure that all requirements and designs support the delivery of business value" — which requires the BA to challenge requirements that do not, not merely to document them.

**Anti-Patterns.** **Passive validation** treats validation as a stakeholder sign-off activity — the BA presents requirements, stakeholders approve them, and validation is considered complete without any active examination of business value alignment. **Assumption burial** embeds assumptions in requirement statements without making them explicit, preventing validation of the assumptions and creating defects that surface late. **Scope acceptance creep** passes requirements through validation that are outside the agreed solution scope because no stakeholder raises an objection, deferring the scope conflict to implementation where resolution is far more costly.

## Key Takeaways

- Verification confirms that requirements meet quality standards; validation confirms that requirements describe the right solution — both are necessary, and confusing them produces well-written requirements for the wrong outcome.
- Business value alignment validation traces each requirement to a business objective, identifying requirements that reflect scope additions, design preferences, or individual stakeholder interest rather than confirmed business needs.
- Assumptions must be made explicit and validated against confirmed technical and business constraints — unmanaged assumptions are hidden requirements defects.
- The traceability chain from enterprise goals through business and stakeholder requirements to solution requirements is the structural test of value alignment.
- The BA's role in validation is active, not passive — it requires challenging requirements that do not trace to business value, not merely documenting stakeholder sign-off.

---

### 6.3.2 Acceptance Criteria

**Acceptance Criteria Are the Contractual Bridge Between Requirements and Testing — Writing Them During Requirements Analysis, Not During Test Planning, Is the Practice That Ensures Requirements Are Testable Before They Become Commitments.** The practice of defining acceptance criteria at the requirements stage reflects a fundamental insight: if a requirement cannot be expressed as testable acceptance criteria at the time it is written, the requirement itself is inadequate. BABOK V3, Section 7.3.4.2 identifies measurable evaluation criteria as a core element of requirements validation: "the business analyst identifies measurable criteria which indicate whether each requirement has been met." These criteria serve three simultaneous purposes — they define what "done" means for each requirement, they provide the basis for test case design, and they make acceptance decisions objective rather than subjective.

**The Given-When-Then Format.** The most widely adopted format for behavioral acceptance criteria is the Given-When-Then (GWT) pattern, drawn from behavior-driven development (BDD) and documented by Wiegers in *Software Requirements* as a practical approach for making requirements testable (Practice #14). The GWT pattern structures each acceptance criterion as a three-clause conditional:

- **Given** — the precondition or context that must exist for the criterion to apply
- **When** — the action, event, or trigger that initiates the behavior
- **Then** — the expected outcome, response, or system state that confirms the requirement is met

| Clause | Purpose | Example |
|---|---|---|
| **Given** | Establishes the starting state | Given a registered user with an active account |
| **When** | Specifies the triggering action | When the user submits valid credentials on the login page |
| **Then** | States the verifiable outcome | Then the system grants access to the user dashboard within two seconds |

The GWT format's power is its specificity: it forces the analyst to name the actor, the context, the action, and the expected outcome. A requirement that resists translation into GWT form is a requirement with hidden ambiguity — the GWT exercise exposes the gaps. Multiple GWT criteria for a single requirement are normal and expected; they cover the primary path, alternate paths, and exception conditions.

**Measurable Evaluation Criteria at the Solution Level.** Beyond individual requirement acceptance criteria, BABOK V3, Section 7.3.4.2 describes solution-level evaluation criteria — the measurable conditions that determine whether the solution as a whole has met the business need. These differ from requirement-level acceptance criteria in scope: a requirement-level criterion tests whether a specific function works correctly; a solution-level criterion tests whether the solution achieves the intended business outcome.

Solution-level evaluation criteria include:
- Business performance metrics (transaction completion rate, defect reduction percentage, cycle time)
- User experience benchmarks (task completion time for specified workflows, error rate)
- System performance baselines (throughput, availability, response time under load)
- Regulatory compliance thresholds (audit pass rate, data retention compliance percentage)

BABOK V3, Section 7.3.6 identifies measurable evaluation criteria, acceptance and evaluation criteria, and decision analysis as techniques for the Validate Requirements task, reflecting the multi-level nature of requirements validation.

**Writing Acceptance Criteria for Different Requirement Types.** The GWT format is most naturally suited to functional requirements with discrete behavioral outcomes. Other requirement types require adapted acceptance criteria formats:

| Requirement Type | Acceptance Criteria Approach |
|---|---|
| **Functional requirement** | GWT criteria for primary path, alternate paths, and error conditions |
| **Business rule** | Rule execution test: given conditions X and Y, when rule is applied, then outcome Z is produced |
| **Performance requirement** | Load condition, operation, measurement method, and threshold: under X concurrent users, operation Y completes in Z seconds for P% of requests |
| **Data requirement** | Data state verification: given input data set X, when processed, then field F contains value V with format/constraint C |
| **Interface requirement** | Integration test criterion: when system A sends message M, then system B acknowledges within T seconds with response format R |

**The Relationship Between Acceptance Criteria and Test Cases.** Acceptance criteria and test cases are closely related but serve different purposes. Acceptance criteria define *what* outcome must be achieved for a requirement to be considered satisfied — they establish the threshold of acceptance. Test cases define *how* that acceptance threshold will be measured — the specific steps, data inputs, and expected results for a particular test execution. A single acceptance criterion may produce multiple test cases (covering different valid inputs, boundary conditions, and equivalent partitions). The relationship is one-to-many: one criterion, many test cases.

The business analyst is responsible for acceptance criteria; the testing team is responsible for translating acceptance criteria into executable test cases. When acceptance criteria are absent or vague, test teams invent their own interpretation of acceptability, producing test suites that may not reflect stakeholder intent and generating acceptance disputes at delivery.

**Anti-Patterns.** **Post-hoc acceptance criteria** are written after development is complete to match what was built rather than to specify what was needed — they confirm delivery without validating value. **GWT without preconditions** omits the Given clause, creating acceptance criteria that implicitly assume a system state that may not be the relevant test context. **Acceptance criteria at only the requirement level** validates individual functions while leaving the solution-level business outcomes unspecified, enabling a system that passes all requirement tests but fails to deliver the intended business result.

## Key Takeaways

- Acceptance criteria defined at the requirements stage confirm that requirements are testable before they become development commitments — a requirement that cannot be expressed as testable criteria is a defective requirement.
- The Given-When-Then format forces specification of actor, precondition, trigger, and expected outcome, exposing hidden ambiguity in requirements that resist translation into GWT form.
- Requirements validation requires both requirement-level acceptance criteria (does this function work?) and solution-level evaluation criteria (does the solution achieve the business outcome?).
- The relationship between acceptance criteria and test cases is one-to-many: each criterion specifies the threshold of acceptance; test cases specify how that threshold will be tested.
- Acceptance criteria are a BA responsibility, not a testing responsibility; when the BA fails to provide them, test teams substitute their own interpretation of acceptability, creating conditions for acceptance disputes.

---

### 6.3.3 Stakeholder Validation

**Requirements Validation Is Not Complete Until the Stakeholders Who Will Authorize the Solution and Use Its Outputs Have Confirmed That the Requirements Describe What They Actually Need.** Verification and value alignment analysis are analytical activities the BA can perform with requirements documents; validation is a human activity that requires active stakeholder participation. BABOK V3, Section 7.3.2 defines the Validate Requirements task as involving "the active participation of stakeholders as the work product is reviewed and evaluated." The goal is not procedural sign-off — collecting signatures on a requirements document — but substantive confirmation that the requirements reflect what stakeholders actually need, that stakeholders understand what they are approving, and that the gaps and conflicts identified during validation are resolved before requirements become the basis for design decisions.

**Who Participates in Validation.** BABOK V3, Section 7.3.7 identifies the stakeholders involved in requirements validation and the nature of their participation:

| Stakeholder | Validation Role | What They Validate |
|---|---|---|
| **Business sponsors** | Authorize requirements against business strategy and investment intent | Business requirements; solution scope; priority assignments |
| **Subject matter experts** | Confirm technical accuracy and operational completeness | Domain-specific requirements; process requirements; data requirements |
| **Solution developers** | Assess feasibility and identify design implications | Non-functional requirements; technical constraints; interface requirements |
| **End users** | Confirm usability and operational relevance | User interaction requirements; workflow requirements; acceptance criteria |
| **Regulatory or compliance stakeholders** | Confirm regulatory requirements are correctly interpreted | Compliance requirements; audit requirements; data retention requirements |

**Validation Techniques.** BABOK V3, Section 7.3.6 identifies several techniques for validating requirements with stakeholders:

**Structured walkthroughs.** The BA presents requirements to a stakeholder group in a planned session, walking through the requirements systematically and inviting questions and challenges. Structured walkthroughs are more effective than passaround reviews for validation because the collaborative setting surfaces conflicting stakeholder interpretations and enables immediate clarification. The walkthrough agenda should be distributed in advance, with stakeholders asked to prepare specific questions and observations rather than reviewing requirements cold in the session.

**Prototype-based validation.** When requirements describe user interactions, a prototype — even a low-fidelity wireframe — provides a concrete representation that stakeholders can evaluate against their actual needs. BABOK V3, Section 7.1.6 identifies prototyping as a technique applicable to both elicitation and validation. The value of prototype-based validation is that it tests the requirements' translation into a concrete interaction design, exposing misunderstandings that abstract text requirements do not.

**Scenario-based walkthrough.** Rather than reviewing requirements as a list of statements, the BA presents them as a narrative: "Here is how a customer will place an order using the new system..." This approach makes the requirements concrete and sequential, enabling stakeholders to identify gaps, contradictions, and impractical assumptions that they would not notice when reading isolated requirement statements.

**Managing Disagreement During Validation.** Validation frequently surfaces stakeholder disagreements that did not emerge during elicitation. Two business units may discover that their requirements are mutually exclusive. A sponsor may dispute whether a requirement falls within the agreed scope. A technical lead may reject a requirement as infeasible under the agreed constraints. The BA's role in managing these disagreements is facilitative: the BA ensures that disagreements are surfaced and captured, facilitates the conversation toward resolution, escalates when resolution requires authority beyond the BA's scope, and ensures that agreed resolutions are reflected in the requirements before sign-off.

**What Approved Requirements Mean — and Do Not Mean.** BABOK V3, Section 7.3.2 notes that validated requirements represent stakeholder confirmation that the requirements correctly describe what they need, not a guarantee that the solution will deliver value. Approval is conditional: it reflects the stakeholders' best current understanding of their needs, within the constraints of the information available at the time. As analysis, design, and implementation proceed, new information may emerge that requires requirements to be revisited. Approved requirements are a stable working baseline, not an irrevocable contract. The BA maintains this distinction to prevent the requirements baseline from becoming an obstacle to incorporating legitimate new understanding.

**Anti-Patterns.** **Signature collection** conducts validation as a sign-off ritual — stakeholders sign the requirements document without genuinely reviewing its contents, providing no actual quality assurance. **Selective stakeholder participation** validates requirements only with the most accessible or most cooperative stakeholders, producing approval that does not reflect the full scope of stakeholder interests and leaving undiscovered conflicts to surface during implementation. **Validation without preparation** presents requirements to stakeholders who have had no time to review them in advance, producing shallow feedback that misses the deep understanding gaps that careful prior reading would reveal.

## Key Takeaways

- Requirements validation requires active stakeholder participation to confirm that requirements describe actual needs — it is a human activity, not an analytical process that can be completed without stakeholder engagement.
- Sponsors, subject matter experts, developers, end users, and compliance stakeholders each play distinct validation roles, and effective validation includes appropriate participation from all relevant groups.
- Structured walkthroughs, prototype-based validation, and scenario-based walkthroughs are more effective than passaround reviews because they surface disagreements through discussion that isolated document review does not generate.
- The BA's role in managing validation disagreements is facilitative — surfacing conflicts, enabling resolution conversations, and escalating when resolution requires authority beyond the BA's scope.
- Approved requirements represent a stable working baseline based on current understanding, not an irrevocable contract — the distinction prevents sign-off from becoming an obstacle to legitimate requirements evolution.

---

## Sub-module 6.4: Defining Requirements Architecture

---

### 6.4.1 Packages and Structure

**Requirements Architecture Is the Organizing Framework That Makes a Requirements Set Navigable, Maintainable, and Collectively Coherent — Without It, Even Well-Written Individual Requirements Become a Mass of Disconnected Statements with No Visible Relationship to the Problem They Solve.** BABOK V3, Section 7.4.1 defines the purpose of Define Requirements Architecture as ensuring "requirements and designs are organized and related in a way that is consistent with the value the solution delivers to the stakeholders." This goes beyond document organization — it establishes the structural logic that determines which requirements belong together, how they relate to one another, how they will be navigated in review and change processes, and how the full scope of requirements maps to the solution's planned components. The architecture of the requirements set is itself a specification artifact, one that enables stakeholders to understand not just what is required but how the requirements form a coherent specification of a coherent solution.

**Template Architectures.** BABOK V3, Section 7.4.4.2 describes template architectures — standard structural patterns that organize requirements according to a consistent organizing principle. Common template architectures include:

| Template Architecture | Organizing Principle | Best Suited For |
|---|---|---|
| **Feature or function-based** | Requirements grouped by the capability or feature they specify | Product development; feature-driven delivery |
| **Process or workflow-based** | Requirements organized by the business process they support | Business process improvement; ERP implementation |
| **Stakeholder group-based** | Requirements grouped by the stakeholder population whose needs they address | Multi-constituency systems; portals with distinct user types |
| **System or subject area-based** | Requirements divided by technical subsystem or domain area | Integration projects; system replacement |
| **Release-based** | Requirements organized by the release or phase in which they will be implemented | Phased delivery; agile programs with defined release goals |

No single template architecture is universally optimal. The BA selects the architecture that most directly reflects the organizing logic of the solution and the way stakeholders think about their needs. A requirements set organized by feature is natural when stakeholders describe their needs in terms of capabilities they want to have. A requirements set organized by business process is natural when the project is centered on improving or replacing specific workflows.

**Business Requirements Documents and Software Requirements Specifications.** Two traditional structured packages remain widely used in practice. The **Business Requirements Document (BRD)** packages business-level requirements — the business needs, objectives, scope boundaries, and stakeholder requirements — organized to communicate with business decision-makers. The **Software Requirements Specification (SRS)** packages system-level requirements organized to communicate with solution developers and quality assurance professionals. BABOK V3, Section 7.4.4.5 addresses the information architecture of BA deliverables: the BA must ensure that the information needed by each audience is accessible in a form that audience can use, which may mean producing multiple packages at different levels of abstraction from the same underlying requirements.

**Viewpoints and Views.** BABOK V3, Section 7.4.4.1 introduces the concept of viewpoints and views as a mechanism for structuring the requirements architecture. A **viewpoint** is a perspective from which the solution is observed — the end user's perspective, the system administrator's perspective, the regulator's perspective. A **view** is the representation of the solution from a specific viewpoint, showing the requirements that are visible and significant from that perspective. Organizing requirements by viewpoint ensures that the specification addresses the complete set of stakeholder perspectives without conflating them, and that requirements written from one perspective are traceable to requirements written from another.

**Metadata and Package Attributes.** Requirements packages are enriched by metadata that enables navigation, change management, and reporting. Common metadata attributes for requirements packages include:

- **Scope marker**: which solution scope element this package addresses
- **Status**: draft, in review, baselined, approved
- **Version**: current version with change history
- **Owner**: the stakeholder group whose needs the package addresses
- **Review date**: the date of the most recent stakeholder review
- **Dependencies**: links to other packages whose requirements must be satisfied before or alongside this package

BABOK V3, Section 7.4.2 notes that requirements architecture must account for the relationships between packages — a change in one package may cascade to others, and the architecture must make these dependencies explicit enough to manage change effectively.

**Structure as a Change Management Tool.** A well-structured requirements architecture makes change management tractable. When a business objective changes, the requirements that trace to that objective are identifiable. When a stakeholder requests an addition to scope, the BA can locate the package where the addition belongs and assess its impact on adjacent packages. Without structure, change management in a large requirements set becomes a search problem: every change requires exhaustive cross-reference checking to avoid introducing inconsistency.

**Anti-Patterns.** **Structure for structure's sake** creates elaborate hierarchical organization that reflects the BA's analytical preferences rather than the stakeholders' conceptual model of the solution, producing a requirements set that is hard to navigate for its intended audience. **Mixed-level architecture** places business requirements and technical requirements in the same package at the same level, conflating the concerns of business stakeholders with the concerns of technical implementers. **Flat structure** provides no organizational hierarchy at all, producing a linear list of requirements that offers no navigational assistance for a stakeholder looking for specific content.

## Key Takeaways

- Requirements architecture is the structural logic that organizes a requirements set into a coherent, navigable whole — it determines what belongs together, how requirements relate, and how the specification will be maintained.
- BABOK V3 identifies template architectures organized by feature, process, stakeholder group, system area, and release — the appropriate template reflects the solution's organizing logic and the stakeholders' conceptual model.
- Viewpoints and views provide a mechanism for structuring requirements by stakeholder perspective, ensuring that the specification addresses all relevant perspectives without conflating them.
- Requirements packages are enriched by metadata attributes — scope markers, status, version, ownership, dependencies — that enable navigation and systematic change management.
- A well-structured requirements architecture makes change management tractable by making the impact scope of any change identifiable without exhaustive cross-reference searching.

---

### 6.4.2 Relationships and Dependencies

**The Relationships Between Requirements Are as Important as the Requirements Themselves — Hidden Dependencies and Unresolved Conflicts Are Among the Most Expensive Defects in a Requirements Set, and Only Explicit Relationship Analysis Surfaces Them.** Requirements do not exist in isolation. Every requirement in a specification exists in a web of relationships with other requirements: some derive from it, some depend on it, some conflict with it, and some partially overlap with it. BABOK V3, Section 7.4.4.4 establishes that the Define Requirements Architecture task includes the activity of relating and verifying requirements relationships, ensuring that "the related requirements are defined, necessary, correct, unambiguous, and consistent." These five characteristics of well-formed relationships are the quality criteria for the relationships themselves, independent of the quality of the requirements they connect.

**Types of Requirements Relationships.** BABOK V3, Section 7.4.4 identifies several fundamental relationship types that the BA must recognize, document, and manage:

| Relationship Type | Definition | Example |
|---|---|---|
| **Derives** | A lower-level requirement is derived from a higher-level requirement; it elaborates, decomposes, or specifies a more abstract requirement | Business requirement "reduce order cycle time" derives to system requirement "order placement shall be completable in under 3 minutes" |
| **Depends** | Requirement A cannot be implemented or satisfied without Requirement B also being satisfied | An audit logging requirement depends on the user authentication requirement having assigned user identifiers |
| **Conflicts** | Two requirements cannot both be simultaneously satisfied without trade-off or compromise | A performance requirement demanding synchronous processing conflicts with a reliability requirement demanding eventual consistency |
| **Refines** | A requirement provides additional detail or constraint for another requirement without decomposing it | A non-functional security requirement refines a functional data storage requirement |
| **Subset** | A requirement is a component or part of a more comprehensive requirement | Individual data field validation requirements are subsets of a form submission requirement |

**The Five Characteristics of Well-Formed Relationships.** BABOK V3, Section 7.4.4.4 establishes that requirements relationships must satisfy five characteristics to be well-formed:

**Defined.** The relationship must be explicitly documented — not assumed or implied. An assumption that requirement B will be implemented whenever requirement A is implemented is not a defined relationship. Defined relationships are recorded in a traceability matrix, requirements management tool, or structured documentation.

**Necessary.** The relationship must exist for a reason that can be articulated. An unnecessary relationship creates false dependencies that constrain implementation planning without justification.

**Correct.** The relationship must accurately reflect the actual relationship between the requirements. A derivation relationship incorrectly stated as a dependency, or a conflict incorrectly stated as a refinement, will produce erroneous impact analysis when requirements change.

**Unambiguous.** The relationship must have one clear meaning. A traceability link that connects two requirements without specifying the type of relationship is ambiguous — it records that a connection exists but does not explain what that connection means.

**Consistent.** The relationships in the requirements set must not contradict each other. A relationship that claims requirement A depends on requirement B while another relationship claims B depends on A creates a circular dependency that is logically inconsistent.

**Viewpoints and Views as Grouping Mechanisms.** BABOK V3, Section 7.4.4.1 introduces viewpoints and views as a mechanism for grouping requirements by the perspective from which they are relevant. A viewpoint is a particular perspective — the end user's perspective, the system administrator's perspective, the regulatory compliance perspective. Requirements that belong to the same viewpoint address the same aspect of the solution from the same perspective. Organizing requirements by viewpoint makes the set of requirements relevant to each stakeholder group visible and navigable, and it ensures that the relationships between requirements in different viewpoints — particularly conflicts — are explicitly identified and managed.

**Dependency Analysis in Practice.** Dependency analysis — systematically examining each requirement to identify which other requirements it depends on and which requirements depend on it — produces a dependency graph of the requirements set. This graph is essential for implementation planning: requirements at the foundation of the dependency graph (those depended upon by many others) must be implemented first. Requirements at the top of the graph (those that depend on many others) can be deferred if necessary. The dependency graph also identifies the impact scope of changes: when a foundational requirement changes, every requirement that depends on it is potentially affected.

**Conflict Detection and Resolution.** Conflicts between requirements are among the most consequential relationship failures. A conflict discovered during requirements analysis can be resolved through stakeholder discussion; the same conflict discovered during system integration testing requires expensive rework. BABOK V3, Section 7.4.4.4 supports systematic conflict detection as part of requirements architecture. The BA examines requirements pairs for logical contradiction (cannot both be true), performance incompatibility (cannot both be met at the same time), and scope overlap (two requirements attempting to specify the same behavior differently).

**Anti-Patterns.** **Implicit dependencies** assume that developers will recognize and implement dependencies that are not explicitly documented, leading to integration failures when implicit assumptions prove incorrect. **Conflict avoidance** documents conflicting requirements without resolving them, deferring the conflict to design or implementation where resolution is more expensive. **Relationship inflation** links all requirements to all other requirements as a form of completeness, producing a dense network that is too complex to navigate and that obscures genuine dependencies.

## Key Takeaways

- Requirements relationships — derivation, dependency, conflict, refinement, and subset — are as significant as the requirements themselves; hidden dependencies and conflicts are among the most expensive defects in a requirements set.
- BABOK V3 identifies five characteristics of well-formed requirements relationships: defined, necessary, correct, unambiguous, and consistent.
- Dependency analysis produces a dependency graph that is essential for implementation sequencing and for assessing the impact scope of requirements changes.
- Conflict detection during requirements architecture is far less costly than conflict resolution during system integration — the BA must actively search for logical contradictions and performance incompatibilities, not wait for them to surface.
- Viewpoints and views organize requirements by stakeholder perspective, making cross-perspective conflicts visible and enabling navigable presentation to each stakeholder group.

---

### 6.4.3 Functional Decomposition

**Functional Decomposition Is the Technique by Which the Business Analyst Makes Complexity Tractable — Breaking a Complex Capability Into Its Component Parts Until Each Part Is Specific Enough to Specify, Implement, and Test Independently.** Without decomposition, complex capabilities remain at an abstraction level that cannot be directly implemented. "Manage customer relationships" is a business capability that a developer cannot implement from that statement alone. Decomposed into its constituent functions, processes, and tasks, it becomes a structured hierarchy of components, each of which is specific enough to specify with discrete requirements. BABOK V3, Section 7.4.6 identifies decomposition as a technique for the Define Requirements Architecture task, and Section 7.1.4.1 describes capability models as a method for organizing enterprise capabilities hierarchically. Together, these references frame functional decomposition as both an organizational technique and an analytical discipline.

**The Decomposition Hierarchy.** Functional decomposition creates a hierarchical structure that progresses from abstract to concrete across multiple levels. BABOK V3, Section 7.4.4.1 supports the use of viewpoints to organize these hierarchical levels. A common decomposition hierarchy in the context of business analysis is:

| Level | Description | Example |
|---|---|---|
| **Enterprise** | The organization as a whole, with its primary mission | Financial services company |
| **Business area** | A major organizational domain with a distinct purpose | Customer Management |
| **Business function** | A coherent set of activities within a business area | Account Servicing |
| **Business process** | An end-to-end sequence of activities that produces a specific outcome | Process Customer Request |
| **Activity/task** | A discrete unit of work within a process, performed by a single role | Validate Customer Identity |

Each level of the hierarchy is specified at greater granularity than the level above. Requirements are written at the level of granularity at which they can be independently implemented, tested, and verified — typically the process and activity levels for functional requirements.

**The Leaf Node Determination.** A critical judgment in functional decomposition is identifying when to stop decomposing. The "leaf node" — the lowest level of the hierarchy — is reached when:

- The activity can be assigned to a single actor or system component
- The activity has a single, identifiable trigger and a single, identifiable outcome
- The activity can be independently tested
- Further decomposition would produce implementation details rather than requirements

Decomposing below the leaf node produces design details — specifications of how an activity will be implemented — rather than requirements specifications of what must be accomplished. The BA who decomposes into design is making decisions that belong to solution architects and developers. The BA who stops decomposing above the leaf node leaves requirements at an abstraction level too high for implementation.

**Capability Models as a Decomposition Tool.** BABOK V3, Section 7.1.4.1 identifies capability models as a model type within the scope model category, used to organize an enterprise's capabilities hierarchically. A **business capability map** decomposes the enterprise's capabilities into a tree structure that can be directly used as the organizing framework for a requirements decomposition. Each leaf node in the capability map corresponds to a set of discrete functional requirements. Capability-based decomposition has the advantage of being technology-independent: it describes what the enterprise must be able to do without presupposing how technology will enable that capability.

**Functional vs. Process Decomposition.** Functional decomposition and process decomposition are related but distinct:

| Type | What Is Decomposed | Output | Primary Use |
|---|---|---|---|
| **Functional decomposition** | Business capabilities into sub-capabilities and discrete functions | Capability hierarchy; function list | Scoping; requirements organization; gap analysis |
| **Process decomposition** | Business processes into sub-processes, activities, and tasks | Process hierarchy; swimlane diagrams | Process improvement; workflow specification; system design |

Functional decomposition answers "what does this capability include?" Process decomposition answers "how does this work get done?" Both are necessary for a complete requirements specification: functional decomposition scopes the capability; process decomposition specifies its execution.

**Decomposition and the Requirements Work Breakdown.** The decomposition hierarchy directly maps to the work breakdown structure for requirements development. Each node in the decomposition that requires specification becomes a requirements work package. The BA assigns requirements development effort to each node at the appropriate level of granularity. Nodes at higher levels of the hierarchy are specified by business stakeholders; nodes at lower levels are specified in collaboration with solution architects and developers. This assignment of specification work mirrors the division of analytical responsibility across stakeholder groups.

**Anti-Patterns.** **Premature convergence** stops decomposition before reaching the level of granularity required for specification, leaving high-level capability statements that cannot be directly implemented. **Over-decomposition** continues decomposing below the leaf node, producing design decisions embedded in the requirements specification that constrain solution architecture unnecessarily. **Decomposition without architecture connection** produces a decomposition that is not connected to the requirements architecture, creating a capability hierarchy that exists in isolation rather than serving as the organizing structure for the requirements set.

## Key Takeaways

- Functional decomposition makes complex capabilities tractable by breaking them into hierarchical components that can be individually specified, implemented, and tested.
- The decomposition hierarchy progresses from enterprise through business area, function, process, and activity/task — requirements are specified at the level at which they can be independently implemented and tested.
- The leaf node determination — knowing when to stop decomposing — is a critical BA judgment: decomposing above the leaf node leaves requirements too abstract; decomposing below it embeds design decisions in requirements.
- Functional decomposition (what must be done) and process decomposition (how work flows) are complementary — both are needed for a complete specification, but they answer different questions.
- Capability models provide a technology-independent organizing framework for functional decomposition that directly maps to the requirements architecture and the requirements development work breakdown.

---

## Sub-module 6.5: Defining Solution Options

---

### 6.5.1 Identifying Alternatives

**Generating Multiple Solution Alternatives Before Recommending One Is Not Indecision — It Is the Core BA Discipline That Prevents Stakeholders and Organizations from Investing in the Wrong Solution.** The temptation to converge prematurely on a single solution approach is one of the most persistent failure modes in requirements analysis. A vocal sponsor proposes a particular technology. A development team offers a familiar platform. A consultant recommends an approach that has worked elsewhere. In each case, the solution has been identified before the business analyst has systematically examined whether alternatives might better satisfy the requirements at lower cost, lower risk, or higher value. BABOK V3, Section 7.5.1 defines the purpose of Define Solution Options as identifying and assessing "a set of approaches that can potentially meet the business requirements" — a definition that requires multiple approaches to exist before assessment can occur.

**The Three Fundamental Solution Approaches.** BABOK V3, Section 7.5.4.1 establishes that every solution to a business need can be characterized as one of three fundamental approaches, or a hybrid of them:

| Approach | Description | Typical Considerations |
|---|---|---|
| **Create** | Develop a custom solution designed specifically for the organization's requirements | Full requirements fit; maximum flexibility; higher development cost and delivery time; organizational dependency on ongoing maintenance |
| **Purchase** | Acquire a commercial off-the-shelf (COTS) or packaged solution | Lower initial development cost; faster time-to-value; requirements fit is negotiated against package capabilities; organizational adaptation required; vendor dependency |
| **Combination** | Integrate a purchased solution with custom development to address the gap between package capabilities and unique requirements | Balances cost and fit; integration complexity; requires both package configuration expertise and custom development capability |

The selection among these three approaches is not purely technical — it reflects the organization's appetite for development risk, its vendor management capability, the uniqueness of its requirements, and its tolerance for adapting its processes to fit a packaged solution. The BA who presents only one of these approaches has not defined the solution option space; they have selected a solution approach without justification.

**The Do-Nothing Option as a Baseline.** Every options analysis must include the do-nothing alternative — the scenario in which no change is made and the organization continues to operate in its current state. BABOK V3, Section 7.5.4.1 explicitly requires the do-nothing option to be considered as a baseline. The do-nothing option is not always "do nothing literally" — it may represent deferring the investment, accepting the current performance level, or continuing with existing manual workarounds. Its value in the analysis is as a comparison point: every other option must demonstrate that its cost and risk are justified by the value it delivers relative to the do-nothing scenario. An option that is superior to the current state is not automatically worthy of investment; it must also be superior to other available options.

**Identifying Improvement Opportunities.** BABOK V3, Section 7.5.4.2 frames the identification of improvement opportunities as a bridge between requirements and solution options. Improvement opportunities are specific aspects of the current state — performance gaps, process inefficiencies, capability absences — that each solution option could address differently. Mapping each improvement opportunity to each alternative makes the options analysis concrete: rather than comparing options in the abstract, the BA compares them in terms of which improvement opportunities each addresses, how completely, and at what cost and risk.

**Techniques for Generating Alternatives.** The BA uses several techniques to ensure that the solution option space is adequately explored before premature convergence:

**Benchmarking** surveys how peer organizations and industry leaders have addressed similar business needs, surfacing approaches that may not be visible to internal stakeholders. BABOK V3, Section 7.5.5 identifies benchmarking as a guideline and tool for the Define Solution Options task.

**Market research** investigates available commercial solutions and their capabilities, providing the information needed to assess the purchase option and to understand which aspects of the organization's requirements are common enough to be addressed by packaged solutions and which are sufficiently unique to require custom development.

**Brainstorming** with a cross-functional team that includes business stakeholders, solution architects, and subject matter experts generates options that no single participant would have identified individually.

**The BA's Role in Preventing Premature Convergence.** Organizational and political forces consistently push toward premature option convergence. A sponsor who has already committed to a vendor, a development team with deep expertise in a particular technology, a consulting firm with a preferred methodology — each has an incentive to present one option rather than a balanced comparison. The BA's professional responsibility is to ensure that the options analysis reflects a genuine comparison of feasible alternatives, not a justification of a predetermined choice. BABOK V3, Section 7.5 supports this independence: the BA identifies and presents options objectively, providing the analysis that enables informed stakeholder decision-making rather than advocating for a preferred outcome.

**Anti-Patterns.** **Option theater** creates the appearance of options analysis by listing three alternatives, two of which are clearly inferior, to rationalize a predetermined choice. **Analysis without the do-nothing baseline** compares solution options against each other without establishing the baseline of no-change, preventing stakeholders from assessing whether any option justifies its cost and disruption. **Scope-anchored alternatives** generates alternatives all within the same fundamental approach (three variants of custom development, three variants of the same vendor's product) without examining the broader option space.

## Key Takeaways

- Premature convergence on a single solution approach before the option space has been systematically explored is one of the most persistent failure modes in requirements analysis — identifying alternatives is a BA discipline, not a decision delay.
- BABOK V3 defines three fundamental solution approaches: create (custom development), purchase (COTS/package), and a combination of the two — all three must be considered before a recommendation is made.
- The do-nothing option must be explicitly included in every options analysis as a comparison baseline — other options must demonstrate value relative to maintaining the current state.
- Benchmarking, market research, and cross-functional brainstorming are the primary techniques for generating a complete set of alternatives before option assessment begins.
- The BA's role in options definition is to ensure genuine options analysis, not to advocate for a preferred approach — political and organizational pressures toward premature convergence must be actively managed.

---

### 6.5.2 Evaluating Options

**Comparing Solution Alternatives Rigorously Requires Structured Evaluation Criteria Applied Consistently Across All Options — Without This Structure, Options Comparison Devolves Into Advocacy for Individual Preferences.** Once the solution option space has been defined, the business analyst's task shifts from generation to evaluation: systematically assessing each alternative against a set of criteria that reflect the full range of stakeholder values, constraints, and business objectives. BABOK V3, Section 7.5.4.4 describes the activity of describing design options in structured, comparable form, and Section 7.5.4.3 addresses requirements allocation — the distribution of requirements across solution components, releases, or versions — as an integral element of the evaluation process. Together, these activities produce the structured comparison that enables stakeholders to make an informed selection.

**Requirements Allocation.** Before alternatives can be evaluated, the BA must understand how each alternative addresses the requirements. Requirements allocation — the assignment of requirements to solution components, releases, or phases — reveals which requirements each option satisfies completely, which it satisfies partially, and which it does not satisfy at all. BABOK V3, Section 7.5.4.3 describes requirements allocation as determining "which requirements will be addressed by which solution components or which releases." A COTS solution may address 80 percent of requirements out of the box but require custom development for the remaining 20 percent. A fully custom solution may address all requirements but at significantly higher cost and delivery time. Requirements allocation makes this trade-off quantifiable: the coverage gap and the cost of closing it are explicit, comparable data points.

**Evaluation Criteria for Solution Options.** A structured evaluation compares all alternatives against the same criteria. BABOK V3, Section 7.5.5 identifies the guidelines and tools relevant to option evaluation, and Section 7.5.6 identifies techniques including decision analysis and estimation. Evaluation criteria typically include:

| Criterion | Description | Assessment Method |
|---|---|---|
| **Functional coverage** | Percentage of requirements addressed by the option | Requirements allocation analysis |
| **Technical feasibility** | Compatibility with existing architecture, infrastructure, and technical skills | Technical assessment by solution architects |
| **Cost** | Total cost of ownership including development, implementation, licensing, and ongoing operations | Cost estimation; vendor quotes |
| **Risk** | Probability and impact of key risks associated with this option | Risk assessment; risk matrix |
| **Time-to-value** | Speed at which the option can deliver measurable business benefit | Implementation timeline analysis |
| **Organizational fit** | Compatibility with organizational processes, culture, and change capacity | Change impact assessment |
| **Vendor/technology stability** | Longevity and support assurance for purchased components | Vendor due diligence |

**Multi-Criteria Decision Analysis.** When options differ across multiple criteria — as they invariably do — multi-criteria decision analysis provides a structured method for aggregating the comparison into a defensible recommendation. BABOK V3, Section 7.5.6 identifies decision analysis as a technique for the Define Solution Options task. In its simplest form, multi-criteria decision analysis assigns weights to each criterion (reflecting its relative importance to stakeholders) and scores each option on each criterion, producing a weighted total score for each alternative.

The value of the weighted scoring model is not that it produces an objectively correct answer — the weights themselves are value judgments — but that it makes the value judgments explicit and auditable. A stakeholder who disagrees with the recommendation can identify which weighting or scoring assumptions they dispute, enabling a structured conversation about the disagreement rather than an unstructured advocacy debate.

**Trade-off Analysis.** Every real solution option involves trade-offs: higher functional coverage comes at higher cost; faster time-to-value comes with lower long-term flexibility; lower risk comes with reduced capability scope. BABOK V3, Section 7.5.4.4 supports explicit trade-off analysis as a component of option description. The BA documents the trade-offs inherent in each option and ensures that stakeholders understand them when making selection decisions. Trade-offs that are not made explicit during evaluation become complaints after selection: "we didn't know we would have to adapt our processes to the package" or "we didn't realize the custom development would take this long."

**Prototyping and PoC in Option Evaluation.** When key evaluation criteria cannot be assessed through analysis alone — particularly technical feasibility and user experience — a prototype or proof of concept provides empirical evidence. BABOK V3, Section 7.5.5 identifies prototyping as a tool that can support option evaluation by making abstract design options concrete and testable. A proof of concept that demonstrates whether the high-risk integration between two systems is technically achievable transforms a risk assessment from an analytical estimate to an empirical observation.

**Anti-Patterns.** **Post-hoc evaluation** constructs evaluation criteria after the preferred option has been selected, weighting and scoring criteria to produce a score that justifies the selection. **Criteria proliferation** includes so many evaluation criteria that meaningful differentiation is obscured in a matrix of marginally different scores. **False precision** assigns numerical scores to criteria that cannot be objectively measured, creating the appearance of analytical rigor without genuine differentiation.

## Key Takeaways

- Structured option evaluation requires consistent evaluation criteria applied to all alternatives simultaneously — without this structure, options comparison becomes advocacy.
- Requirements allocation — mapping requirements to solution components and releases for each option — quantifies the coverage gap and the cost of closing it, making the core trade-off explicit.
- Multi-criteria decision analysis makes value judgments explicit and auditable, enabling stakeholders who dispute the recommendation to identify the specific assumptions they contest.
- Trade-offs inherent in each option must be explicitly documented; trade-offs discovered after selection become complaints, not informed decisions.
- Prototyping and proof-of-concept activities provide empirical evidence for evaluation criteria — particularly technical feasibility and user experience — that cannot be reliably assessed through analysis alone.

---

### 6.5.3 Prototyping and Proof of Concept

**A Prototype Is Not a Draft of the System — It Is a Focused Investigative Tool Used to Resolve Specific Unknowns Before Those Unknowns Become the Most Expensive Defects in the Project.** This distinction, articulated by Karl Wiegers in *Software Requirements* Practice #12, is the conceptual foundation for using prototypes effectively. When the prototype is treated as an early version of the system — a starting point from which development will continue — it creates lock-in to an approach that was chosen for speed, not quality. When the prototype is treated as an investigative tool with a specific question to answer and a planned fate upon completion of that investigation, it generates genuine insight without creating destructive constraints. BABOK V3, Section 7.1.6 classifies prototyping as both an elicitation and modeling technique, reflecting its dual role in surfacing unknown requirements and in validating proposed designs.

**The Four Purposes of Prototyping.** Wiegers identifies four distinct reasons to build a prototype (Practice #12), each corresponding to a different type of unknown the BA or project team needs to resolve:

| Purpose | Question Answered | Prototype Type |
|---|---|---|
| **Requirements exploration** | What does the user actually need? What have we missed? | Low-fidelity wireframes; paper prototypes |
| **Design validation** | Will this design work for its intended users? | Medium-fidelity interactive prototype |
| **Feasibility demonstration** | Can this capability be built with the available technology? | Vertical PoC; narrow technical spike |
| **Stakeholder alignment** | Do stakeholders share a common understanding of the solution? | High-fidelity demonstration prototype |

**Throwaway vs. Evolutionary Prototypes.** Wiegers distinguishes two fundamentally different prototype fates, and the decision about fate must be made before the prototype is built (Practice #12):

A **throwaway prototype** (also called a disposable or exploratory prototype) is built with the explicit intention of being discarded after it has served its purpose. Throwaway prototypes use the quickest, cheapest representation available — paper sketches, PowerPoint mockups, or rapidly assembled HTML screens with no back-end logic — because their value lies entirely in the information they generate. Investing in code quality, performance, or scalability in a throwaway prototype is waste. The prototype answers its question and is then abandoned; requirements or design decisions informed by the prototype are documented formally and the prototype itself is discarded.

An **evolutionary prototype** begins as a simplification of the final system and is progressively enhanced toward the production solution. Evolutionary prototypes are appropriate when an incremental delivery strategy is planned and when the prototype can be built to production quality standards from the start. They are inappropriate when time pressure drives the team to build the prototype quickly, with the intention of cleaning up the code later — a plan that consistently results in "quick" prototypes becoming permanent technical debt.

**Horizontal vs. Vertical Prototypes.** Wiegers introduces a second dimension of prototype classification that governs scope rather than fate (Practice #12):

A **horizontal prototype** covers a broad slice of the solution at shallow depth — it demonstrates many features across the user interface without implementing any underlying logic. Horizontal prototypes are effective for navigational flow validation, UI layout confirmation, and early stakeholder reaction to the scope and organization of the solution. They cannot demonstrate actual data processing, business rule execution, or system performance.

A **vertical prototype** covers a narrow slice of the solution at full depth — it implements one or two features completely through all layers of the architecture, from user interface through business logic to data storage. Vertical prototypes are effective for demonstrating technical feasibility, validating integration approaches, and providing accurate performance estimates for the implemented capability.

**Proof of Concept vs. Prototype.** The terms "prototype" and "proof of concept" are frequently conflated, but they address different types of unknowns. A prototype addresses requirements or design unknowns — it answers "what does the user need" or "will this design work for users." A **proof of concept (PoC)** addresses technical unknowns — it answers "can this be built" or "will these two systems integrate." A PoC typically involves a narrow, technically focused implementation of the highest-risk technical assumptions underlying a solution option. The goal is not to demonstrate what the solution will look like to users but to confirm or refute the technical feasibility of the approach before significant investment is made in design and development.

**Managing Prototype Fate and Stakeholder Expectations.** The most common failure mode in prototyping is the throwaway prototype that survives. When business stakeholders see a working screen — even a mockup with no real data — they believe the system is nearly complete. When the development team is under schedule pressure, the temptation to build on the prototype rather than discarding it and rebuilding properly is enormous. Wiegers identifies the management of prototype fate as one of the most important responsibilities in the prototyping process (Practice #12). The BA must establish, before the prototype is built and in writing, that the prototype is a learning tool rather than a development asset, and that its purpose is to generate documented requirements or design decisions that will be implemented in a production-quality system.

**Anti-Patterns.** **Prototype-as-specification** uses a working prototype as a substitute for formal requirements documentation, producing a system that matches the prototype but that has no formal, traceable requirements against which acceptance can be assessed. **Production prototype** builds the throwaway prototype with production-level care because "we might keep it," consuming effort proportionate to full development while retaining the exploratory ambiguity of a prototype. **PoC-without-exit** conducts a proof of concept without defined exit criteria, allowing the PoC to expand indefinitely without producing a clear feasibility verdict.

## Key Takeaways

- A prototype is an investigative tool designed to resolve specific unknowns — requirements exploration, design validation, feasibility demonstration, or stakeholder alignment — not a draft of the production system.
- Throwaway prototypes are built for speed, discarded after the investigation is complete, and document their findings in formal requirements; evolutionary prototypes are built to production quality from the start and are appropriate only for incremental delivery.
- Horizontal prototypes cover broad scope at shallow depth (UI flow and layout); vertical prototypes cover narrow scope at full depth (technical feasibility and integration).
- A proof of concept differs from a prototype: a PoC addresses technical feasibility questions; a prototype addresses requirements or design questions.
- The most critical risk in prototyping is the throwaway prototype that survives — managing prototype fate requires explicit upfront agreement about purpose and planned disposal.

---

## Sub-module 6.6: Analyzing Potential Value and Recommending a Solution

---

### 6.6.1 Cost-Benefit and Financial Analysis

**Cost-Benefit Analysis Is the Analytical Framework That Translates the Business Case for a Solution From Abstract Value Claims Into Quantified, Comparable Financial Terms — Without It, Investment Decisions Are Made on Advocacy, Not Evidence.** Every solution to a business need involves costs and produces benefits. The business analyst's role in the Analyze Potential Value and Recommend Solution task — BABOK V3, Section 7.6 — is to ensure that both dimensions are systematically identified and, to the extent possible, quantified before a recommendation is made. BABOK V3, Section 7.6.4.2 frames cost-benefit analysis as the process of identifying and comparing "the expected costs and the expected benefits across solution options," recognizing that "certain types of value are difficult to estimate." The BA must navigate between two failure modes: refusing to quantify anything that cannot be precisely measured, and quantifying everything with false precision that conceals genuine uncertainty.

**Categories of Expected Benefits.** BABOK V3, Section 7.6.4.1 addresses expected benefits as the positive value a solution option is anticipated to produce. A comprehensive benefits enumeration addresses multiple value dimensions:

| Benefit Category | Description | Example |
|---|---|---|
| **Revenue increase** | New revenue streams or improved revenue capture from existing streams | New digital channel enabling sales to previously unreachable market segments |
| **Cost reduction** | Reduction in ongoing operational cost through efficiency improvement or process elimination | Automation of manual data entry reducing FTE costs by 30% |
| **Cost avoidance** | Prevention of costs that would otherwise be incurred | Regulatory compliance preventing potential fines and penalties |
| **Productivity improvement** | More output from the same resources, or same output from fewer resources | Reduced processing time enabling existing staff to handle higher transaction volumes |
| **Quality improvement** | Reduction in errors, rework, or defects | Improved data validation reducing exception handling cost |
| **Strategic value** | Market positioning, competitive differentiation, capability creation for future initiatives | Digital platform capability enabling future product lines and channel partnerships |

**Categories of Expected Costs.** BABOK V3, Section 7.6.4.2 identifies expected costs as the investment and ongoing expenditure required to realize the solution's benefits. A comprehensive cost enumeration must cover the full life cycle:

| Cost Category | Description | Common Omissions |
|---|---|---|
| **Development costs** | Software development, configuration, customization | Test development, integration work, security review |
| **Implementation costs** | Deployment, data migration, user training, change management | Post-go-live hypercare, process redesign for affected departments |
| **License and subscription costs** | Software purchase, annual maintenance, per-user fees | Escalation clauses, future user growth |
| **Infrastructure costs** | Servers, network, cloud hosting, security infrastructure | Disaster recovery capacity, performance headroom |
| **Ongoing operations** | Support staff, monitoring, maintenance, patch management | Increased IT help desk load during transition |
| **Decommissioning costs** | Retirement of replaced systems, data archiving | Often omitted entirely from initial analysis |

**Opportunity Cost.** BABOK V3, Section 7.6.4.2 explicitly includes opportunity cost — the value of the next-best alternative forgone — as a component of the cost analysis. An organization that deploys its development team on Project A cannot simultaneously deploy it on Project B. The opportunity cost of Project A includes the value that Project B would have delivered. Opportunity cost is frequently the most important cost that organizations fail to consider: the cost of choosing one option is not just its direct expenditure but the value of the options not chosen.

**Financial Analysis Measures.** BABOK V3, Section 7.6.6 identifies financial analysis as a technique for the Analyze Potential Value task, with specific measures commonly used to compare solution options:

**Net Present Value (NPV)** discounts future cash flows to their present-day equivalent, recognizing that a benefit realized three years from now is worth less than the same benefit realized today. NPV-positive options generate value; NPV-negative options destroy value relative to the investment. NPV enables comparison of options with different benefit timing profiles.

**Return on Investment (ROI)** expresses the benefit as a ratio of the investment: (Net Benefits / Total Investment) × 100%. ROI is most useful for comparing options with similar investment scales but different benefit levels. Its limitation is that it does not account for the time profile of benefits or the risk that benefits may not materialize as projected.

**Payback period** identifies the time required for cumulative benefits to equal the initial investment. Organizations with high required rates of return or limited patience for long-term investments use payback period as a primary decision criterion. Its limitation is that it ignores the value of benefits beyond the payback point — an option with a shorter payback period but lower total long-term value may appear superior by this measure alone.

**The BA's Role vs. the Finance Team's Role.** The business analyst is responsible for structuring the cost-benefit analysis: identifying the categories of cost and benefit, ensuring the analysis is comprehensive, and providing the assumptions and estimates on which financial calculations are based. The finance team is responsible for validating financial methodology, applying the organization's discount rate, and ensuring that the analysis complies with the organization's investment governance requirements. The BA who bypasses the finance team risks producing a financial analysis that will be rejected during investment governance review.

**Anti-Patterns.** **Benefits amplification** inflates benefit projections by selecting optimistic assumptions without range or uncertainty qualification, producing business cases that consistently over-promise and under-deliver. **Cost underestimation** enumerates only the most visible costs, omitting implementation, training, decommissioning, and ongoing operational costs that are significant but less prominent. **Intangibles avoidance** refuses to quantify any benefit that cannot be precisely measured, leaving strategic and qualitative value absent from the analysis and enabling decisions to be made purely on financial metrics that systematically undervalue strategic investment.

## Key Takeaways

- A comprehensive cost-benefit analysis requires systematic identification of all benefit categories (revenue increase, cost reduction, cost avoidance, productivity, quality, strategic) and all cost categories (development, implementation, license, infrastructure, operations, decommissioning).
- Opportunity cost — the value of the next-best alternative forgone — is a necessary component of the cost side of any investment analysis and is frequently the most significant cost that organizations omit.
- NPV, ROI, and payback period are complementary financial measures with different strengths: NPV accounts for time value of money; ROI expresses benefit-to-investment ratio; payback period reflects speed of cost recovery.
- The BA structures the cost-benefit analysis and provides estimates and assumptions; the finance team validates financial methodology and ensures compliance with investment governance requirements.
- Intangible and strategic benefits must be addressed in the analysis even when they cannot be precisely quantified — omitting them systematically undervalues strategic investments.

---

### 6.6.2 Value Comparison Across Options

**Comparing the Value of Multiple Solution Options Requires More Than Selecting the Option with the Highest Projected Return — It Requires a Framework That Accounts for Uncertainty, Mixed Trade-offs, and the Different Value Profiles That Different Options Present to Different Stakeholders.** BABOK V3, Section 7.6.2 acknowledges a fundamental complexity in value assessment: "value can be difficult to define since what is a cost to one stakeholder could be a benefit to another." An option that reduces headcount delivers financial value to the organization while imposing personal costs on affected employees. An option that consolidates systems delivers operational efficiency while reducing departmental autonomy. Value comparison must acknowledge these tensions rather than collapsing them into a single aggregated figure. BABOK V3, Section 7.6.4.3 identifies the determination of value — both positive and negative — as the analytical activity preceding option assessment, recognizing that complete value analysis includes both the gains and the losses associated with each option.

**Positive and Negative Value Dimensions.** BABOK V3, Section 7.6.4.3 establishes that value assessment encompasses negative as well as positive dimensions. Every solution option creates value in some dimensions while potentially destroying value in others. A comprehensive value assessment maps both:

| Value Dimension | Option A (Custom Build) | Option B (COTS Package) | Option C (Do Nothing) |
|---|---|---|---|
| **Functional fit** | High — requirements fully addressed | Moderate — 80% fit, 20% gap | None |
| **Implementation risk** | High — complex development | Low — packaged product with references | None |
| **Time-to-value** | Long — 18 months to deployment | Short — 6 months to deployment | None (negative: declining performance) |
| **Process adaptation cost** | Low — solution adapts to processes | High — processes must adapt to package | None |
| **Long-term flexibility** | High — custom-built to business requirements | Low — constrained by vendor roadmap | None |

The comparison reveals that no option is dominant across all dimensions — which is the typical situation in practice. Option B may be preferred by stakeholders who value speed; Option A by stakeholders who value long-term flexibility. Making these trade-offs explicit is the essential contribution of value comparison to the decision-making process.

**Handling Uncertainty in Value Projections.** BABOK V3, Section 7.6.2 explicitly acknowledges that value assessment contains irreducible uncertainty: "the process of determining what an organization values and the degree to which it values it is inherently subjective and subject to human judgment." Financial projections are estimates, not facts. Benefits may not materialize at the projected level; costs may be higher than estimated; the implementation timeline may extend, delaying benefits.

Three approaches to uncertainty are valuable in option comparison:

**Range estimates** replace point estimates with ranges reflecting optimistic, realistic, and pessimistic scenarios. A benefit projected at $2M under the realistic scenario might range from $800K (pessimistic) to $3.5M (optimistic). Range estimates communicate uncertainty more honestly than single-point projections and enable stakeholders to make decisions with eyes open to the range of possible outcomes.

**Sensitivity analysis** identifies which assumptions drive the most significant variation in the projected value. If a small change in the implementation timeline estimate produces a large change in the NPV, timeline risk deserves focused attention and mitigation planning. Sensitivity analysis directs stakeholder attention to the assumptions that matter most.

**Scenario analysis** evaluates each option under multiple future scenarios — market growth vs. market contraction, regulatory change vs. no change, rapid adoption vs. slow adoption — producing a robust view of how each option performs across the range of plausible futures.

**Weighted Criteria Scoring Models.** When options differ across many dimensions that cannot be reduced to a single financial metric, a weighted criteria scoring model provides a structured comparison that is transparent and auditable. BABOK V3, Section 7.6.6 identifies decision analysis as a technique for the Analyze Potential Value task; weighted scoring is a common implementation of decision analysis in options comparison.

The model assigns weights to criteria based on stakeholder-agreed relative importance, then scores each option on each criterion. The weighted total score for each option provides a single comparable figure while making the value judgments (the weights) explicit and subject to review. Stakeholders who dispute the recommendation can identify the specific weight or score they challenge, enabling a structured rather than political resolution of disagreements.

**Presenting Value Comparisons to Decision-Makers.** The goal of value comparison communication is to enable informed choice, not to advocate for a specific option. BABOK V3, Section 7.6.4.4 supports the presentation of comparative value assessments to stakeholders in a form that makes the trade-offs clear. Effective value comparison presentations:

- Present all options evaluated, including the do-nothing baseline
- Show both financial and non-financial dimensions for each option
- Make uncertainty explicit through ranges rather than concealing it with point estimates
- Identify the criteria on which each option excels and the criteria on which it is weak
- Acknowledge the value trade-offs rather than minimizing them

**Anti-Patterns.** **Single-metric comparison** reduces all option value to a single financial metric (typically NPV or ROI), omitting dimensions of value that the financial model cannot capture and producing comparisons that systematically disadvantage strategically important but hard-to-quantify options. **False precision in uncertainty** presents ranges that are so narrow they convey false confidence, rather than genuinely reflecting the uncertainty in the underlying assumptions. **Advocacy presentation** structures the comparison to make the preferred option appear superior across all dimensions, omitting or minimizing the criteria on which alternatives are stronger.

## Key Takeaways

- Value comparison across solution options requires mapping both positive and negative value dimensions for each option — no real option is dominant across all dimensions, and making trade-offs explicit is the BA's core analytical contribution.
- BABOK V3 acknowledges that value assessment contains irreducible uncertainty; range estimates, sensitivity analysis, and scenario analysis are the appropriate responses to uncertainty, not false precision.
- Weighted criteria scoring models provide a structured, auditable comparison of options across multiple dimensions, making value judgments explicit and enabling stakeholders to challenge specific assumptions rather than the overall conclusion.
- Sensitivity analysis identifies which assumptions drive the most significant variation in projected value, directing stakeholder attention to the risks that deserve mitigation planning.
- Effective value comparison presentations enable informed choice by presenting all options, showing trade-offs honestly, and acknowledging uncertainty — they are analytical tools, not advocacy documents.

---

### 6.6.3 Making and Presenting Recommendations

**The BA's Recommendation Is the Culminating Deliverable of the Requirements Analysis and Design Definition Knowledge Area — It Is Not the BA's Decision, But It Is the BA's Professional Obligation to Provide the Analysis That Makes a Sound Decision Possible.** This distinction between making a recommendation and making a decision defines the BA's role in BABOK V3, Section 7.6. The business analyst synthesizes the requirements analysis, solution option identification, and potential value assessment into a recommendation that presents the best available evidence for stakeholder decision-making. The decision authority — which option to proceed with, how much to invest, what timeline to accept — belongs to the appropriate sponsors and governance bodies. The BA's obligation is to ensure that the decision is made with full information rather than partial information, and that the recommendation represents a genuine analytical conclusion rather than political accommodation.

**What a Recommendation Must Address.** BABOK V3, Section 7.6.4.4 specifies the content requirements for a well-formed solution recommendation. A recommendation that meets these requirements addresses:

**The recommended option.** A clear statement of which solution option the BA recommends, stated without hedging or ambiguity. A recommendation that presents three options without identifying a preferred one is not a recommendation — it is an analysis report that defers the decision back to stakeholders without analytical guidance.

**The rationale.** The specific reasons why the recommended option is preferred over the alternatives, stated in terms of the evaluation criteria established during options analysis. The rationale connects the recommendation directly to the evidence produced during the analysis rather than relying on general assertions.

**Alternatives considered.** An account of the other options that were evaluated and the specific reasons they were not recommended. This demonstrates that the recommendation was made after genuine consideration of the option space, and it provides stakeholders who favor an alternative option with a clear understanding of why it was not selected.

**Available resources and constraints.** BABOK V3, Section 7.6.4.4 explicitly requires the recommendation to address the resources needed to implement the recommended option — budget, personnel, technology, organizational change capacity — and the constraints within which implementation must occur. A recommendation that does not address resource requirements is incomplete; stakeholders cannot authorize an option whose resource implications they do not understand.

**Dependencies.** The conditions that must be satisfied before or during implementation of the recommended option. Dependencies on other projects, organizational readiness milestones, regulatory decisions, or technology availability must be explicitly identified and incorporated into the recommendation.

**The do-nothing option.** BABOK V3, Section 7.6.4.4 specifically requires the recommendation to address the do-nothing option and its consequences. The explicit evaluation of the do-nothing option forces the recommendation to state not just "option X is good" but "option X is better than not acting, for these specific reasons."

**Structuring the Recommendation Document.** The recommendation document is a business communication artifact, not an analytical working paper. Its structure should be organized for a reader who needs to make a decision, not for a reader who wants to follow the analytical methodology. A decision-oriented structure presents:

1. The recommendation and its rationale (for readers who need the conclusion immediately)
2. The do-nothing baseline and its trajectory
3. The options considered and the evaluation framework applied
4. The comparative value assessment with uncertainty ranges
5. The resource and constraint profile of the recommended option
6. Dependencies and risk summary
7. The analytical appendices (for readers who need the detailed evidence)

**Presenting to Different Audiences.** BABOK V3, Section 7.6.7 identifies the stakeholders involved in the Analyze Potential Value and Recommend Solution task and their different engagement needs. The recommendation must be adapted for different audiences:

| Audience | What They Need | Presentation Emphasis |
|---|---|---|
| **Executive sponsors** | Business case summary; financial measures; strategic alignment | Benefits summary; NPV/ROI; strategic rationale |
| **Governance committee** | Risk profile; resource requirements; trade-offs considered | Risk register summary; resource implications; alternatives analysis |
| **Technical team** | Feasibility assessment; integration requirements; implementation timeline | Technical evaluation; architecture fit; implementation approach |
| **End users** | Impact on their processes; transition requirements; training needs | Process change summary; adoption plan; support provision |

**Handling Contested Recommendations.** Recommendations are sometimes contested by stakeholders who favor an alternative option, who dispute the evaluation criteria or weights, or who disagree with the data underlying the analysis. The BA's response to contestation is to engage analytically rather than defensively: understand the specific basis of the stakeholder's objection, evaluate whether it reveals a genuine gap in the analysis, and either update the recommendation to reflect the new information or explain clearly why the objection does not change the analytical conclusion. A contested recommendation that is maintained after genuine engagement with the objection is more credible than a recommendation that was never challenged.

**Outputs of the Task.** BABOK V3, Section 7.6.8 identifies the outputs of the Analyze Potential Value and Recommend Solution task as solution options — a set of described and evaluated solution alternatives — and a recommendation that can be used as direct input to the decision-making process, the business case development process, and the solution design phase.

**Anti-Patterns.** **Hedge-everything recommendations** present all options without identifying a preferred one, providing no analytical guidance and placing the entire decision burden on stakeholders who authorized the BA engagement precisely to receive an informed recommendation. **Retrospective rationalization** reverse-engineers the analysis to justify a recommendation that has already been made for political reasons, producing a document that has the form of an options analysis but not its substance. **Audience-agnostic presentation** presents the same recommendation document to executive sponsors, governance committees, and implementation teams without adapting the emphasis to each audience's decision-making needs.

## Key Takeaways

- A solution recommendation is the BA's professional obligation to provide the analysis that makes a sound decision possible — the BA recommends, the sponsor decides.
- A complete recommendation addresses the recommended option, its rationale, alternatives considered and why rejected, resource and constraint requirements, dependencies, and the explicit do-nothing option evaluation.
- Recommendation documents are decision communication artifacts organized for readers who need to make a decision, not analytical working papers organized around the BA's methodology.
- Different stakeholder audiences — executive sponsors, governance committees, technical teams, end users — need different aspects of the recommendation emphasized; a single document format serves none of them well.
- Contested recommendations should be engaged analytically: understand the specific objection, evaluate whether it reveals a gap in the analysis, and either update the recommendation or explain why the objection does not change the conclusion.

---
