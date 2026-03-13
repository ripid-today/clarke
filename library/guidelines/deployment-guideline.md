# Deployment Guideline

**Version:** 1.0.0
**Last Updated:** 2026-02-16
**Purpose:** Enable safe, repeatable deployments with clear rollback procedures for Clarke's Library

---

## 1. Deployment Process

### Git Workflow

Clarke's Library uses **GitHub Flow** for deployments:

```
1. Create feature branch from main
   → git checkout -b feature/your-feature-name

2. Make changes, commit frequently
   → git add .
   → git commit -m "Descriptive commit message"

3. Push to GitHub
   → git push origin feature/your-feature-name

4. Open Pull Request (PR) on GitHub
   → Review changes, request feedback

5. Merge to main branch (after approval)
   → GitHub auto-merges or manual merge

6. Automatic deployment triggered
   → GitHub Actions → Vercel Build → Production Deploy
```

### Deployment Pipeline

```
GitHub Repository (main branch)
    ↓ (push event)
GitHub Actions Workflow
    ↓ (trigger)
Vercel Build Process
    ↓ (compile Next.js app, run TypeScript, optimize)
Vercel Production Deployment
    ↓ (deploy to edge network)
Production URL: https://clarke.ripid.vn
    ↓
Automatic Cache Invalidation
    ↓
Live to Users (30-60 seconds total)
```

**Deployment Timeline:**
- **Build time:** 1-2 minutes (TypeScript compilation, Next.js build, asset optimization)
- **Deploy time:** 30 seconds (upload to Vercel edge network)
- **Total:** ~2-3 minutes from merge to live

**Automatic Triggers:**
- ✅ Push to `main` branch → Deploys to production
- ✅ Push to any branch → Creates preview deployment (test before merge)
- ✅ Pull Request opened → Generates preview URL for review

**Manual Deployment (Rarely Needed):**
```bash
# Via Vercel CLI (if automatic deployment fails)
npm install -g vercel
vercel --prod
```

### Branch Strategy

| Branch | Purpose | Deploys To | Auto-Deploy |
|--------|---------|------------|-------------|
| **main** | Production code | https://clarke.ripid.vn | ✅ Yes (on push) |
| **feature/*** | New features, bug fixes | Preview URL (e.g., https://clarke-git-feature-xyz.vercel.app) | ✅ Yes (on push) |
| **hotfix/*** | Emergency production fixes | Preview URL first, then main | ⚠️ Manual merge |

**Pull Request Process:**
1. Open PR from `feature/*` → `main`
2. Preview deployment generated automatically (check preview URL)
3. Request code review from team
4. Address feedback, push updates (preview re-deploys automatically)
5. Merge to `main` when approved (deploys to production)

---

## 2. Pre-Deployment Checklist

### Code Quality

- [ ] **TypeScript compiles:** `npm run build` succeeds with zero errors
- [ ] **ESLint passes:** `npm run lint` shows no errors (warnings OK)
- [ ] **No console errors:** Check browser DevTools console on preview deployment
- [ ] **Environment variables set:** All required env vars configured in Vercel dashboard

### Testing

- [ ] **Manual QA completed:** Test all affected pages on preview deployment
- [ ] **Cross-browser testing:** Chrome (latest), Firefox (latest), Safari (latest)
- [ ] **Mobile responsive:** Test on real device or Chrome DevTools device emulation (320px, 768px, 1024px)
- [ ] **Accessibility check:** Run Lighthouse accessibility audit (score ≥90)

### Database (If Schema Changes)

- [ ] **Firestore backup verified:** Check Firebase Console → Firestore → Backups (must have backup from today or yesterday)
- [ ] **Migration tested:** Run migration script on local Firestore emulator first
- [ ] **Rollback procedure documented:** Write down exact rollback steps before deploying
- [ ] **Pre-migration validation:** Run validation scripts to check assumptions (e.g., field lengths, data types)

### Performance

- [ ] **Lighthouse performance:** Score ≥90 on preview deployment
- [ ] **Page load time:** <2 seconds on 3G network (Chrome DevTools throttling)
- [ ] **Image optimization:** All images use Next.js Image component with proper sizing
- [ ] **Font loading:** Fonts use `font-display: swap` to prevent FOIT

### Communication

- [ ] **Stakeholders notified:** Product Owner aware of deployment window
- [ ] **Breaking changes documented:** If API changes, notify any external consumers (if applicable)
- [ ] **Changelog updated:** `CHANGELOG.md` or release notes prepared

**Example Checklist Message:**
```
Pre-Deployment Checklist for [Feature Name]
✅ TypeScript builds successfully
✅ ESLint passes
✅ Manual QA completed on preview: https://clarke-git-feature-design-system.vercel.app
✅ Cross-browser tested (Chrome, Firefox, Safari)
✅ Mobile responsive verified (iPhone 13, iPad)
✅ Lighthouse performance: 94/100, accessibility: 100/100
✅ Firestore backup exists (2026-02-16 08:00 AM)
✅ Product Owner notified

Ready to merge and deploy to production.
```

---

## 3. Rollback Procedures

### Rollback Decision Tree

```
Is production site functional?
├─ NO (Site completely down, white screen, 500 errors)
│   → IMMEDIATE ROLLBACK (Priority: restore service)
│   → Follow Git Rollback steps below
│   → Total time: 3-5 minutes
│
└─ YES (Site loads but has bugs)
    Is bug CRITICAL?
    ├─ YES (Data loss, security issue, >50% functionality broken)
    │   → IMMEDIATE ROLLBACK
    │   → Follow Git Rollback steps below
    │
    └─ NO (Minor bug, <30% functionality affected)
        → HOTFIX instead of rollback
        → Fix bug in new branch, deploy hotfix
```

**Rollback Criteria (When to Rollback):**
1. Site down for >5 minutes
2. Critical functionality broken (search, navigation, article loading all fail)
3. Data loss detected (articles missing, content corrupted)
4. Security vulnerability introduced
5. >30% of users reporting issues (if user feedback channel exists)

### Git Rollback Steps (Code Revert)

**Step 1: Identify commit to revert**
```bash
# Show recent commits
git log --oneline -10

# Example output:
# abc1234 feat: Implement Claude design system
# def5678 fix: Update article description field
# ghi9012 refactor: Improve search performance
```

**Step 2: Revert the problematic commit**
```bash
# Revert creates a NEW commit that undoes changes (safe, preserves history)
git revert abc1234

# If multiple commits need revert, revert in reverse order:
git revert abc1234
git revert def5678

# Resolve conflicts if any, then:
git add .
git revert --continue
```

**Step 3: Push to trigger redeployment**
```bash
git push origin main

# Vercel automatically detects push and redeploys
# Monitor deployment: https://vercel.com/dashboard
```

**Step 4: Verify rollback successful**
```bash
# Visit production URL
curl https://clarke.ripid.vn

# Check Vercel deployment logs
vercel logs --prod
```

**Total Time:** 3-5 minutes (git revert + push + Vercel redeploy)

### Database Rollback Steps (Firestore Data Revert)

**⚠️ CRITICAL:** Database rollbacks are more complex than code rollbacks. Always verify backup exists BEFORE running migrations.

**Option 1: Point-in-Time Restore (Firebase Blaze Plan, <7 days ago)**
1. Go to Firebase Console → Firestore → Backups
2. Identify backup timestamp BEFORE migration (e.g., 2026-02-16 08:00 AM)
3. Contact Firebase Support: https://support.google.com/firebase
4. Request point-in-time restore to specific timestamp
5. Wait for restore completion (can take 2-6 hours for large databases)
6. Verify data integrity after restore

**Option 2: Manual Revert (if <100 documents affected)**
1. Open Firestore Console: https://console.firebase.google.com/project/[project-id]/firestore
2. Navigate to affected collection (e.g., `articles`)
3. For each document:
   - Click document ID
   - Click "Edit field"
   - Restore field value from backup (if you documented pre-migration values)
4. Verify all documents reverted

**Option 3: Reverse Migration Script (Recommended for >100 documents)**
```typescript
// scripts/rollback-description-migration.ts
import { db } from '../lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

async function rollbackArticles() {
  const articlesRef = db.collection('articles');
  const snapshot = await articlesRef.get();

  console.log(`Rolling back ${snapshot.size} articles...`);

  let batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates: any = {};

    // Restore excerpt from description
    if (data.description && !data.excerpt) {
      updates.excerpt = data.description;
    }

    // Remove description field
    if (data.description !== undefined) {
      updates.description = FieldValue.delete();
    }

    if (Object.keys(updates).length > 0) {
      batch.update(doc.ref, updates);
    }

    count++;

    if (count % 500 === 0) {
      await batch.commit();
      batch = db.batch();
      console.log(`Rolled back ${count} documents...`);
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✅ Rollback complete: ${count} documents processed`);
}

rollbackArticles().catch(console.error);
```

**Total Time:**
- Manual revert (<100 docs): 10-30 minutes
- Reverse migration script: 2-5 minutes
- Point-in-time restore: 2-6 hours

### Rollback Communication

**Immediate Notification (within 5 minutes of rollback decision):**
```
Subject: Production Rollback - [Feature Name]

Production has been rolled back to previous version.

Reason: [Brief description of issue]
Rollback time: [HH:MM AM/PM]
Current status: [Site functional / Data verified / Investigating root cause]

Next steps:
1. Root cause analysis
2. Fix in development
3. Re-test on preview deployment
4. Reschedule production deployment

Product Owner: [Name]
```

---

## 4. Environment Configuration

### Local Development (.env.local)

**Never commit .env.local to Git!** (Already in `.gitignore`)

```bash
# .env.local (for local development)

# Firebase Client SDK (public - safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=clarke-library.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=clarke-library
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=clarke-library.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK (private - server-side only)
FIREBASE_ADMIN_PROJECT_ID=clarke-library
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXXX\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@clarke-library.iam.gserviceaccount.com

# API Security (if needed)
LIBRARY_API_KEY=your-secret-api-key-here
```

**How to Get Firebase Credentials:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project (clarke-library)
3. **Client SDK (NEXT_PUBLIC_*):**
   - Click Settings (⚙️) → Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy config object values
4. **Admin SDK (FIREBASE_ADMIN_*):**
   - Click Settings (⚙️) → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download JSON file
   - Extract `project_id`, `private_key`, `client_email` to .env.local

### Vercel Environment Variables (Production)

**How to Add Environment Variables in Vercel:**

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select Clarke's Library project
3. Click "Settings" → "Environment Variables"
4. Add each variable:

| Variable Name | Value | Environment | Encrypted |
|---------------|-------|-------------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | AIzaSy... | Production, Preview, Development | No |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | clarke-library | Production, Preview, Development | No |
| `FIREBASE_ADMIN_PRIVATE_KEY` | -----BEGIN PRIVATE KEY----- | Production, Preview, Development | ✅ Yes |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | firebase-adminsdk@... | Production, Preview, Development | No |

**Important:**
- ✅ `NEXT_PUBLIC_*` variables: Safe to expose to browser (will be bundled in client JS)
- ❌ Variables without `NEXT_PUBLIC_`: Server-side only (never exposed to browser)
- ✅ Mark sensitive variables as "Encrypted" (Vercel encrypts at rest)

**After Adding Variables:**
- Variables take effect on NEXT deployment (not retroactive)
- Trigger new deployment: `git commit --allow-empty -m "Update env vars" && git push`

### Variable Types

| Prefix | Visibility | Usage | Example |
|--------|-----------|-------|---------|
| `NEXT_PUBLIC_*` | Client-side (browser) | Firebase client config, public API endpoints | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| No prefix | Server-side only | API keys, private keys, database credentials | `FIREBASE_ADMIN_PRIVATE_KEY` |

**Security Rule:**
```
IF variable contains secret/password/private key
THEN do NOT use NEXT_PUBLIC_ prefix
ELSE IF variable needed in browser (Firebase client config)
THEN use NEXT_PUBLIC_ prefix
```

---

## 5. Monitoring & Validation

### Post-Deployment Checklist (within 10 minutes of deploy)

**Functional Validation:**
- [ ] Visit production URL: https://clarke.ripid.vn
- [ ] Homepage loads successfully (no white screen, no 500 errors)
- [ ] Featured folders display correctly
- [ ] Click through 3-5 articles (verify article content loads)
- [ ] Test search functionality (enter query, verify results)
- [ ] Test navigation (sidebar, breadcrumbs, folder tree)

**Technical Validation:**
- [ ] Open browser DevTools → Console (check for JavaScript errors)
- [ ] Open DevTools → Network (check for failed requests, 404s, 500s)
- [ ] Run Lighthouse audit (Performance ≥90, Accessibility ≥90)
- [ ] Check mobile responsiveness (real device or Chrome DevTools 320px/768px)

**Performance Validation:**
- [ ] Page load time <2 seconds (use DevTools Network tab)
- [ ] Largest Contentful Paint (LCP) ≤2.5 seconds (Lighthouse)
- [ ] First Input Delay (FID) ≤100ms (test interaction)
- [ ] Cumulative Layout Shift (CLS) ≤0.1 (no layout jumping)

### Error Detection

**Vercel Logs (Check for Server Errors):**
```bash
# View production logs
vercel logs --prod

# Or via Vercel Dashboard:
# https://vercel.com/dashboard → Project → Deployments → Latest → Logs
```

**Look for:**
- ❌ 500 errors (server-side failures)
- ❌ Unhandled exceptions (JavaScript errors)
- ❌ Firestore connection failures
- ⚠️ Slow API responses (>1 second)

**Browser Console (Check for Client Errors):**
```
Open https://clarke.ripid.vn
Open DevTools (F12) → Console tab

Look for:
- ❌ Red errors (JavaScript exceptions, failed requests)
- ⚠️ Yellow warnings (deprecation notices, performance warnings)
```

**Firebase Metrics (Check Database Health):**
```
Go to Firebase Console → Firestore → Usage

Monitor:
- Read operations spike (normal after deploy as cache rebuilds)
- Write operations spike (abnormal - investigate)
- Error rate >1% (investigate)
```

### Monitoring Tools

| Tool | What It Monitors | How to Access | Alert Threshold |
|------|------------------|---------------|-----------------|
| **Vercel Analytics** | Page views, performance, errors | Vercel Dashboard → Analytics | Error rate >5% |
| **Firebase Console** | Firestore reads/writes, errors | Firebase Console → Firestore → Usage | Error rate >1% |
| **Lighthouse CI** | Performance, accessibility scores | Chrome DevTools → Lighthouse | Performance <90 |
| **Browser DevTools** | Client-side errors, network requests | F12 in browser | Any console errors |

### Success Metrics

**Deployment is successful if:**
- ✅ All functional validation tests pass
- ✅ Zero console errors on homepage and 3+ articles
- ✅ Lighthouse performance ≥90, accessibility ≥90
- ✅ Page load time <2 seconds
- ✅ No 500 errors in Vercel logs (first 10 minutes)
- ✅ Firestore error rate <1% (first hour)

**If any metric fails:**
1. Investigate root cause (check logs, console, network)
2. Assess severity (minor bug vs critical failure)
3. Decide: Hotfix (quick fix) vs Rollback (restore previous version)

---

## 6. Emergency Contacts & Escalation

### Contact List

| Role | Name | Contact | Responsibility | Escalation Level |
|------|------|---------|----------------|------------------|
| **Product Owner** | [User Name] | [Email/Phone] | Final deployment approval, rollback decisions | Level 1: All incidents |
| **Developer** | Web Developer Agent | Internal | Code changes, debugging, rollback execution | Level 1: Technical issues |
| **Firebase Support** | Google Cloud Support | https://support.google.com/firebase | Database issues, backup restore | Level 2: Firestore failures |
| **Vercel Support** | Vercel Team | https://vercel.com/support | Deployment failures, infrastructure issues | Level 2: Build/deploy failures |

### Escalation Path

**Level 1: First Response (Developer)**
1. Detect issue (monitoring alerts, user reports, post-deploy validation)
2. Assess severity:
   - **Critical:** Site down, data loss, security issue → Immediate rollback
   - **High:** Major functionality broken (>30% affected) → Evaluate rollback
   - **Medium:** Minor bug, <30% affected → Hotfix or defer to next release
3. If rollback needed: Execute Git rollback steps (3-5 minutes)
4. Notify Product Owner immediately (via email/phone)

**Level 2: Product Owner Notification**
1. Product Owner receives incident notification
2. Acknowledges rollback decision (or approves alternative)
3. Communicates to stakeholders if needed
4. Approves post-incident review meeting

**Level 3: Platform Support (if rollback fails)**
1. Contact Firebase Support (if database issue)
   - Scenario: Rollback script fails, Firestore backup needed
   - Response time: 2-6 hours
2. Contact Vercel Support (if deployment issue)
   - Scenario: Automatic deployment fails, manual deployment fails
   - Response time: 1-4 hours (depends on plan tier)

**Level 4: Post-Incident Review**
1. Schedule meeting within 24 hours of incident
2. Document timeline: What happened, when, who was notified
3. Root cause analysis: Why did it happen?
4. Prevention measures: How to prevent recurrence?
5. Update procedures: What needs to change in this guideline?

### Incident Response Template

```
INCIDENT REPORT: [Brief Title]

Date/Time: 2026-02-16 14:30 PM
Severity: [Critical | High | Medium | Low]
Status: [Investigating | Rollback In Progress | Resolved]

IMPACT:
- Users affected: [All users | Specific feature users | ~X% of users]
- Duration: [Started HH:MM, Ended HH:MM, Total: X minutes]
- Data loss: [Yes - describe | No]

TIMELINE:
- 14:30 PM: Deployment completed
- 14:32 PM: User reports search broken
- 14:35 PM: Developer confirms issue (search API returning 500 errors)
- 14:37 PM: Rollback decision made
- 14:40 PM: Git revert pushed, Vercel redeploying
- 14:43 PM: Rollback complete, search functional
- 14:45 PM: Product Owner notified

ROOT CAUSE:
[Brief description of what went wrong]

RESOLUTION:
[What was done to fix it - rollback, hotfix, configuration change]

PREVENTION:
[What will prevent this in the future - added test, updated checklist, new validation]

FOLLOW-UP:
- [ ] Post-incident review meeting scheduled
- [ ] Update pre-deployment checklist with new validation
- [ ] Update this guideline with lessons learned
```

---

## Summary

This Deployment Guideline ensures:
- ✅ **Predictable deployments** (GitHub → Vercel, 2-3 minutes, automatic)
- ✅ **Pre-deployment validation** (comprehensive checklist prevents common issues)
- ✅ **Fast rollback** (3-5 minutes Git revert, clear decision criteria)
- ✅ **Environment safety** (secrets in Vercel, never in Git)
- ✅ **Post-deploy monitoring** (Lighthouse, Vercel logs, Firebase metrics)
- ✅ **Clear escalation** (who to contact, when, how)

**When to Reference:**
- Before deploying → Section 2 (Pre-Deployment Checklist)
- Production issue → Section 3 (Rollback Procedures) decision tree
- Setting up env vars → Section 4 (Environment Configuration)
- After deployment → Section 5 (Monitoring & Validation) checklist
- Emergency situation → Section 6 (Emergency Contacts) escalation path
