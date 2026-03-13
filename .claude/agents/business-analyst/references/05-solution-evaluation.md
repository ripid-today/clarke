# Solution Evaluation Reference
## BABOK V3 Knowledge Area 7

---

## Purpose

This reference governs how the BA measures deployed solution performance, identifies limitations, and recommends improvements or replacements. Solution evaluation closes the feedback loop — turning production observations into new requirements.

**Load when:** Assessing an existing feature's performance; analyzing user feedback or error reports; recommending whether to improve, replace, or retire a solution component.

---

## Defining Performance Measures

Before evaluating, define what "good" looks like:

### Lagging Indicators (measure outcomes)
- What result should the solution have produced by now?
- Examples: Article view counts, search query volume, user retention

### Leading Indicators (predict future outcomes)
- What early signals predict whether the solution is on track?
- Examples: Search filter usage rate, average queries per session, load time trend

### KPIs Linked to Objectives
Every KPI must trace to a business objective from Strategy Analysis:

| Business Objective | KPI | Threshold | Measurement |
|-------------------|-----|-----------|-------------|
| Improve discoverability | Avg. queries to find target article | ≤3 | Analytics |
| Maintain performance | Lighthouse LCP | ≤2.5s | Lighthouse CI |
| Maintain quality | P0 bug count | 0 | Issue tracker |

---

## Analyzing Performance

### Actual vs. Expected Comparison
| Metric | Expected | Actual | Delta | Interpretation |
|--------|----------|--------|-------|----------------|
| [KPI] | [Target] | [Current] | [Diff] | [On track / Lagging / Exceeding] |

### Root Cause Analysis

**Fishbone (Ishikawa) — for complex multi-factor issues:**
Categories: People, Process, Technology, Data, Environment
Ask "Why?" for each contributing factor until reaching root causes.

**5 Whys — for simpler issues:**
1. "Why is [symptom happening]?" → [Answer]
2. "Why is [answer]?" → [Deeper cause]
3. Continue until root cause is identified (typically 3-5 levels)

**Example for Clarke:**
- Symptom: Search results are slow
- Why 1: Firestore query scans full collection
- Why 2: No composite index on (folderId, title)
- Why 3: Search index was built without folder filtering requirement
- Root cause: Missing requirement at design time → new requirement needed

---

## Assessing Solution Limitations

### Technical Limitations
- Architecture constraints: What does the current implementation prevent?
- Performance ceiling: What is the maximum throughput under current design?
- Integration constraints: What adjacent systems limit the solution?

### Organizational Limitations
- User adoption: Are users using the feature as intended?
- Process fit: Does the solution fit the actual workflow, or require workarounds?
- Knowledge gaps: Do users know how to use the feature effectively?

### Clarke-Specific Evaluation Points
| Component | What to Evaluate |
|-----------|-----------------|
| Search | Query latency, result relevance, filter usage rate |
| Library navigation | Folder depth navigation, breadcrumb accuracy |
| Article rendering | Markdown rendering correctness, image loading |
| API routes | P95 latency, error rate, cache hit rate |

---

## Recommending Actions

### Improve / Replace / Retire Decision Framework

| Condition | Recommendation |
|-----------|----------------|
| Core functionality works; specific gaps identified | **Improve** — targeted requirement additions |
| Architecture limits prevent achieving business objectives | **Replace** — new solution with migration plan |
| Business objective no longer relevant | **Retire** — deprecate with user communication |
| Performance lagging but architecture sound | **Optimize** — performance-focused improvement sprint |

### Recommendation Format
1. **Finding:** [Specific observation with data]
2. **Root cause:** [Why this is happening]
3. **Impact:** [Business impact of current state]
4. **Recommendation:** [Improve / Replace / Retire with rationale]
5. **Success criteria:** [How we'll know the recommendation was effective]
6. **PRD trigger:** [Does this finding generate a new PRD requirement? Reference it.]

---

## Solution Evaluation → PRD Context

Findings from solution evaluation frequently feed back into new PRDs:
- A performance finding → Non-functional requirement in next PRD
- A usability finding → Stakeholder requirement addressing the pain
- An error pattern → Transition requirement for data fix

When writing a problem statement in a new PRD, cite solution evaluation findings as evidence:
> "Analytics show 67% of search queries return zero results when users add folder filters, indicating the search index lacks folder-aware indexing (Solution Evaluation, 2026-Q1)."
