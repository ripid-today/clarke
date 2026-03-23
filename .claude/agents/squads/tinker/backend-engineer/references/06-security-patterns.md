# Security Patterns — TII Backend Reference

## Firebase Admin SDK Server-Side Isolation

### The Core Rule
`lib/firebase/admin.ts` must ONLY be imported in server-side contexts:
- Server Components (`app/page.tsx`, `app/layout.tsx`, any component without `'use client'`)
- Route Handlers (`app/api/**/route.ts`)
- Trigger.dev tasks (`trigger/*.ts`)
- Server utility modules (`lib/firebase/firestore.ts`, `lib/utils/*.ts`)

**NEVER import in:**
- Client Components (any file with `'use client'` at the top)
- Files under `app/` that could be bundled client-side
- Any file that imports a Client Component

### Why This Matters
Firebase Admin SDK contains server-only Node.js APIs (`firebase-admin/app`, `firebase-admin/firestore`). If bundled into client-side JavaScript, it will:
1. Fail at runtime (Node.js APIs not available in browser)
2. Expose the Firebase Admin private key to anyone who inspects the bundle
3. Cause a Next.js build error with message: "You're importing a component that imports a module only available in a Node.js environment"

### How to Verify No Client Leaks

Run this grep before any deployment:
```bash
# From projects/the-intelligent-investor/
grep -r "from.*lib/firebase/admin" app/components/ --include="*.tsx" --include="*.ts"
# Should return 0 results
```

Check for any Client Component importing admin:
```bash
grep -rl "use client" . --include="*.tsx" | xargs grep -l "firebase/admin" 2>/dev/null
# Should return 0 results
```

### TII Architecture: Keeping Admin Server-Side
```
Server Component (app/page.tsx)
  → imports lib/firebase/firestore.ts
      → imports lib/firebase/admin.ts  ✓ (server-side module chain)

Client Component (components/news/NewsReadTracker.tsx)
  'use client'
  → does NOT import any lib/ modules
  → calls /api/ endpoints if it needs data  ✓
```

---

## Environment Variable Naming Rules

### The NEXT_PUBLIC_ Rule
Variables prefixed with `NEXT_PUBLIC_` are embedded in the client-side JavaScript bundle at build time. They are visible to anyone who views the browser's source code or network requests.

```
# SAFE to prefix NEXT_PUBLIC_ — Firebase client SDK keys (designed to be public):
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# NEVER prefix NEXT_PUBLIC_ — these are secrets:
FIREBASE_ADMIN_PRIVATE_KEY=...       # Private key — server only
FIREBASE_ADMIN_CLIENT_EMAIL=...      # Service account — server only
ANTHROPIC_API_KEY=...                # AI API key — server only
DAILY_NEWS_FOLDER_ID=...             # Internal ID — server only
```

**Verification:**
```bash
grep "NEXT_PUBLIC_FIREBASE_ADMIN" .env.local .env.production 2>/dev/null
# Should return 0 results
```

### TII Environment Variables

| Variable | Where Used | Public? |
|----------|-----------|---------|
| `FIREBASE_ADMIN_PROJECT_ID` | admin.ts | No |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | admin.ts | No |
| `FIREBASE_ADMIN_PRIVATE_KEY` | admin.ts | No (sensitive) |
| `ANTHROPIC_API_KEY` | trigger/daily-news.ts | No |
| `DAILY_NEWS_FOLDER_ID` | page.tsx, trigger/daily-news.ts | No (internal) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | lib/firebase/config.ts (if used) | Yes — client SDK |

---

## Secret Storage

### Local Development (.env.local)
```bash
# projects/the-intelligent-investor/.env.local
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
ANTHROPIC_API_KEY=sk-ant-...
DAILY_NEWS_FOLDER_ID=firestore-document-id
```

`.env.local` is gitignored by default in Next.js. Verify:
```bash
cat .gitignore | grep env.local
# Should show: .env.local (or .env*)
```

**Never commit `.env.local` to git.** If you accidentally commit it:
1. Immediately rotate all affected API keys and service account credentials
2. Use `git filter-branch` or BFG Repo Cleaner to purge from history
3. Force-push to all branches (coordinate with team)

### Production (Vercel)
All environment variables are configured in the Vercel dashboard under "Settings → Environment Variables".

Trigger.dev tasks run in Trigger.dev's cloud, not Vercel. Configure the same variables separately in the Trigger.dev dashboard under "Environment Variables".

### Private Key Formatting
Firebase Admin private keys are multiline PEM strings. They must be stored correctly in environment variables:

In `.env.local`:
```
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEo...\n-----END RSA PRIVATE KEY-----\n"
```

In Vercel dashboard: paste the raw key (including BEGIN/END lines) with actual newlines — Vercel handles the encoding.

TII's `admin.ts` includes `normalizePrivateKey()` which handles common formatting issues (escaped `\n`, quotes, CRLF). This covers most storage methods.

---

## Firestore Security Rules and Admin SDK

### Admin SDK Bypasses Firestore Security Rules
The Firebase Admin SDK (`firebase-admin` package) has full read/write access to Firestore regardless of the security rules defined in the Firebase console. This is intentional — Admin SDK is for trusted server-side code.

**Implication:** When using `adminDb` in server-side code, you are responsible for validating inputs. Firestore rules will NOT protect you from bad writes. Validate everything before writing.

### Client SDK Respects Security Rules
The Firebase client SDK (`firebase/app`, `firebase/firestore`) respects Firestore security rules. TII currently uses Admin SDK exclusively — no client-side Firestore reads.

If a future feature requires client-side Firestore (real-time updates with `onSnapshot`):
1. Configure Firestore security rules to restrict access appropriately
2. Use the Firebase client config from `lib/firebase/config.ts`
3. Do NOT use `adminDb` on the client side

---

## API Security Checklist

For every new Route Handler:

- [ ] All user inputs validated (type, length, format, whitelist)
- [ ] No secret values in response body (no env vars, no admin credentials)
- [ ] Error messages are generic for 500 responses (full error only in server logs)
- [ ] `adminDb` imported — verify the route file is NOT a Client Component
- [ ] No `NEXT_PUBLIC_` prefix on server-only env vars accessed in this route

---

## Anti-Patterns to Avoid

### 1. Logging Secrets
```ts
// WRONG — private key in logs
console.log("Using key:", process.env.FIREBASE_ADMIN_PRIVATE_KEY);

// CORRECT — log only what's safe
console.log("Admin SDK initialized for project:", process.env.FIREBASE_ADMIN_PROJECT_ID);
```

### 2. Returning Internal Errors to Client
```ts
// WRONG — exposes internal error details
return NextResponse.json({ error: error.message }, { status: 500 });
// "error.message" might say "Firebase quota exceeded" or reveal internal structure

// CORRECT — generic to client, detailed in server logs
console.error("Firestore write failed", { error: error.message, stack: error.stack });
return NextResponse.json({ error: "Internal server error" }, { status: 500 });
```

### 3. Using Admin SDK in Client Component
```tsx
// WRONG — admin.ts imported in a 'use client' file
'use client';
import { adminDb } from "@/lib/firebase/admin"; // Build error + security risk
```

### 4. NEXT_PUBLIC_ on a Secret
```bash
# WRONG — key is now in the browser bundle
NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----

# CORRECT — server-only (no NEXT_PUBLIC_ prefix)
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
```

### 5. Trusting User Input for Doc IDs
```ts
// WRONG — user-controlled articleId used directly in Firestore path
const { articleId } = params;
await adminDb.collection("articles").doc(articleId).delete(); // No validation

// CORRECT — validate the ID exists and user has permission before acting
const doc = await adminDb.collection("articles").doc(articleId).get();
if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
// Then proceed
```
