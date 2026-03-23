# TII Strategy Analysis Reference
## BABOK V3 Knowledge Area 1 — Adapted for The Intelligent Investor

---

## Purpose

This reference governs business strategy analysis for TII — understanding TII's value proposition, content quality objectives, Vietnam market positioning, and how individual features connect to the strategic mission.

**Load when:** Justifying a business case for a new TII feature; assessing whether a proposed change aligns with TII's strategic direction; writing the Business Value section of a PRD.

---

## TII Mission Statement

The Intelligent Investor delivers concise, accurate AI-generated daily investment briefings to Vietnam retail investors, enabling them to make informed decisions without spending hours reading financial news.

---

## TII Strategic Objectives

| Objective | KPI | Target |
|-----------|-----|--------|
| **Delivery reliability** | Pipeline success rate | 100% daily runs succeed |
| **Content timeliness** | Brief publish time | Published by 9am GMT+7 |
| **Content quality** | Brief word count compliance | 100% of briefs 200–300 words |
| **Content freshness** | Duplicate rate | < 5% duplicates per week |
| **User accessibility** | Mobile usability | Homepage usable on 320px width |
| **Content coverage** | Topics covered per day | ≥ 5 distinct investment topics |

---

## Vietnam Market Context

Understanding the target user informs TII requirements:

| Factor | Detail | Requirement Implication |
|--------|--------|------------------------|
| **Mobile usage** | High mobile penetration in Vietnam | Mobile-first UI; cards readable on small screens |
| **Investment experience** | Retail investors (not institutional) | Plain language; avoid deep technical analysis |
| **Time zone** | GMT+7 (Indochina Time) | Pipeline cron must use GMT+7; display dates in local time |
| **Market hours** | Vietnam stock exchange opens 9am | Briefs must be published before market open |
| **Language** | Vietnamese financial media | Brief language clarity; content relevance to Vietnam markets |

---

## Feature Alignment Matrix

Before writing a PRD, confirm the feature aligns with at least one strategic objective:

| Feature Type | Strategic Objective | Value Statement |
|-------------|--------------------|--------------------|
| Pipeline reliability fix | Delivery reliability | Prevents missed daily briefs that break investor trust |
| Brief quality improvement | Content quality | Produces better-calibrated briefs that investors can trust |
| New RSS feed source | Content coverage | Expands topic coverage for Vietnamese investors |
| UI improvement | User accessibility | Makes content more accessible on mobile |
| Dedup improvement | Content freshness | Reduces noise from repeated stories |
| Cron schedule change | Content timeliness | Aligns delivery to before-market-open window |
| Schema migration | Delivery reliability | Enables new data fields without breaking existing pipeline |

**Gate:** If a proposed feature does not align with any strategic objective, escalate to Clarke before writing the PRD.

---

## Business Value Framework for TII PRDs

When writing the Business Value section of a TII PRD, structure it as:

```
**User Impact:** How this benefits Vietnam retail investors
  (e.g., "Investors receive briefs before market open, enabling informed morning trading decisions")

**Business Impact:** How this strengthens TII reliability or scope
  (e.g., "Eliminates daily brief failures caused by word count validation gaps")

**Strategic Alignment:** Which TII objective this serves
  (e.g., "Content Quality: 100% of briefs within 200–300 words")
```

---

## Scope Boundaries

**IN SCOPE for TII:**
- Daily news pipeline (RSS fetch → AI generation → Firestore write)
- TII homepage and article display (`projects/the-intelligent-investor/`)
- Brief quality metrics (word count, dedup, relevance)
- Trigger.dev cron job scheduling
- Vietnam-specific content sources and investment topics

**OUT OF SCOPE for TII:**
- Portfolio tracking (→ Financial Tracker project)
- Real-time market data feeds
- User authentication or personalization
- Payment or subscription features
- The Clarke Knowledge Library content (→ library/ project, website/ app)

---

## Success Criteria Checklist for PRDs

Every TII PRD Business Context section must answer:

- [ ] What specific TII strategic objective does this feature serve?
- [ ] How will success be measured (quantitative KPI preferred)?
- [ ] What is the minimum viable version of this feature?
- [ ] What happens if this feature is NOT built?
- [ ] Does this feature have any negative impact on another TII objective (tradeoff)?
