# Non-Functional Requirements Reference
## Write PRD Skill — Reference 03

---

## Purpose

Non-functional requirements (NFRs) define quality attributes — how well the system must perform, how secure it must be, how accessible, and how scalable. For Clarke, these are grounded in the Technical Guidelines and WCAG AA standards.

**Load when:** Writing the Non-Functional Requirements section of a PRD; need to specify performance, security, accessibility, or scalability requirements.

---

## Performance Requirements — Clarke Thresholds

### Web Performance (Lighthouse metrics)
| Metric | Threshold | Measurement Tool |
|--------|-----------|-----------------|
| **LCP (Largest Contentful Paint)** | ≤2.5s | Lighthouse CI |
| **FID (First Input Delay)** | ≤100ms | Chrome DevTools |
| **CLS (Cumulative Layout Shift)** | ≤0.1 | Lighthouse CI |
| **Lighthouse Performance Score** | ≥90 | Lighthouse CI |

### API Performance
| Endpoint Type | P95 Threshold | Notes |
|--------------|---------------|-------|
| Search queries | ≤500ms | Includes Firestore query + index lookup |
| Article reads | ≤200ms | Cached reads via ISR |
| Folder listing | ≤200ms | Cached reads |
| Write operations | ≤1000ms | Firestore writes are not cached |

### How to Specify in PRD
**Good:** "Search API P95 response time ≤500ms under normal load (concurrent 10 requests)"
**Bad:** "Search should be fast"

---

## Security Requirements — Clarke-Specific Rules

### Firebase / Server Security
| Rule | Requirement | Where Defined |
|------|-------------|---------------|
| Admin SDK location | Initialize Firebase Admin ONLY in `lib/firebase/admin.ts` | backend-guideline.md |
| Client vs server secrets | Server-only vars: `FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_ADMIN_CLIENT_EMAIL` | api-conventions.md |
| Environment variables | Secrets stored in `.env.local` (local) and Vercel (production) | api-conventions.md |
| Client-safe vars only | `NEXT_PUBLIC_*` prefix ONLY for Firebase client config | api-conventions.md |

### Input Validation
| Requirement | Standard |
|-------------|----------|
| All user input validated at API boundary | Before any database operation |
| Type validation | Explicit type checks before use |
| Length validation | Enforce max chars per schema (100 for names, 200 for descriptions, 300 for folder descriptions) |
| Format validation | Slugs: `/^[a-z0-9-]+$/` |
| Whitelist approach | Reject unexpected fields in POST bodies |

### Content Security
| Requirement | Standard |
|-------------|----------|
| Markdown rendering | Sanitize with rehype-sanitize before rendering |
| Error messages | Generic messages to client; full detail logged server-side only |
| Internal errors | Never expose stack traces or database errors to client |

### How to Specify in PRD
```
**Security:**
- User input validated at API boundary per backend-guideline.md → Input Validation section
- Firebase Admin initialized server-side only; no admin credentials in client code
- Markdown content sanitized with rehype-sanitize before rendering
```

---

## Accessibility Requirements — WCAG AA

### Contrast Ratios — Clarke Palette

| Combination | Ratio | Pass/Fail | Usage |
|-------------|-------|-----------|-------|
| Black (#000) on White (#FFF) | 21:1 | ✅ PASS | Body text on cards |
| Black (#000) on Cloud Dancer (#F0EEE9) | 19:1 | ✅ PASS | Body text on page background |
| Primary (#C15F3C) on Cloud Dancer (#F0EEE9) | 4.6:1 | ✅ PASS (AA) | CTA buttons, active links |
| Secondary (#B1ADA1) on Cloud Dancer (#F0EEE9) | 3.2:1 | ❌ FAIL | Non-text elements only |
| White (#FFF) on Primary (#C15F3C) | 3.8:1 | ❌ FAIL AA (text) | Avoid for text on primary buttons |

### Touch Targets
- Minimum 44×44px for all interactive elements on mobile
- Applies to: buttons, links, filter chips, navigation items

### Focus States (Required on ALL focusable elements)
```
focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2
```

### Keyboard Navigation
- All interactive elements reachable via Tab key
- Enter/Space activates buttons and links
- Escape closes modals and dropdowns
- Focus order follows logical DOM order

### Screen Reader Support
- All images have `alt` text (empty `alt=""` for decorative)
- Form inputs have associated `<label>` with `htmlFor` + matching `id`
- Dynamic content updates use `aria-live` regions
- Icon-only buttons have `aria-label`

### Lighthouse Accessibility Score
**Target:** ≥90

### How to Specify in PRD
```
**Accessibility:**
- All new interactive elements meet WCAG AA contrast (4.5:1 min for text)
- Touch targets ≥44×44px on mobile
- Focus states applied per design-system.md (`focus:ring-2 focus:ring-claude-primary`)
- Lighthouse accessibility score ≥90
```

---

## Scalability Requirements — Clarke Constraints

### Firestore Limits
| Constraint | Value | Implication |
|------------|-------|-------------|
| Batch write limit | 500 operations per batch | All migration scripts must batch at ≤500 ops |
| Document reads | Reads count against quota | Use ISR and caching to minimize direct Firestore reads |

### Caching Patterns
| Pattern | When to Use | Clarke Implementation |
|---------|-------------|----------------------|
| ISR (Incremental Static Regeneration) | Read-heavy pages | `revalidate` in route handlers |
| Firestore read caching | Frequently accessed collections | Cache layer in `lib/firebase/` |
| Static generation | Content that changes rarely | `generateStaticParams` in Next.js |

### How to Specify in PRD
```
**Scalability:**
- Any migration script must batch Firestore writes at ≤500 ops per commit
- New API routes must implement ISR caching per backend-guideline.md → Caching section
```

---

## Reliability Requirements

### Error Response Standards
| Scenario | Required Response |
|----------|-----------------|
| User input error | HTTP 400 with descriptive message (user-facing) |
| Resource not found | HTTP 404 |
| Server/database error | HTTP 500 with generic message; full detail logged server-side |
| Service unavailable | HTTP 503 with user-friendly message |

### Graceful Degradation
- If search index is unavailable, show error state (not blank page)
- If Firestore read fails, return cached version if available; error state if not
- No unhandled promise rejections — all async operations wrapped in try/catch

### Data Integrity
- Firestore document counts must remain consistent (update `articleCount` on article create/delete)
- Slug uniqueness enforced at API level before write
- `updatedAt` timestamp updated on every document modification

---

## NFR Template for PRD Section 2

```
### Non-Functional Requirements

**Performance:**
- [Specific metric with threshold, e.g., "Search API P95 ≤500ms"]
- [Lighthouse score threshold if UI changes involved]

**Security:**
- [Specific security requirement OR "No changes to current security model"]
- [Input validation requirement if new user inputs are added]

**Accessibility:**
- [Contrast ratio requirement if new UI elements added]
- [Touch target / focus state / ARIA requirement]
- Lighthouse accessibility score ≥90

**Scalability:**
- [Batching requirement if migration involved]
- [Caching requirement if new API routes added]

**Reliability:**
- [Error response requirements for new endpoints]
- [Data integrity requirements if schema changes involved]
```
