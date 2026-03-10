import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Lazy initialization - only init when credentials are available
let _adminDb: ReturnType<typeof getFirestore> | null = null;

/**
 * Normalizes a PEM private key to fix formatting issues that cause
 * OpenSSL 3 DECODER failures in Node.js 21+.
 *
 * Issues handled:
 * - Surrounding quotes (e.g. value copy-pasted with enclosing `"` from JSON)
 * - Escaped `\n` characters (common when stored in env vars)
 * - Windows CRLF line endings
 * - Single-line base64 (no line wrapping) — rebuilt at 64-char width
 */
function normalizePrivateKey(raw: string): string {
  // Strip surrounding quotes if the value was copied from JSON (e.g. "-----BEGIN...")
  const unquoted = raw.replace(/^["']|["']$/g, "");
  const key = unquoted.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Re-wrap base64 body at 64 chars to guarantee valid PEM structure
  const match = key.match(/^(-----BEGIN[^-]+-----)([\s\S]*?)(-----END[^-]+-----)[\s\n]*$/);
  if (!match) return key;

  const [, header, body, footer] = match;
  const base64 = body.replace(/\s+/g, "");
  const wrapped = (base64.match(/.{1,64}/g) ?? [base64]).join("\n");
  return `${header}\n${wrapped}\n${footer}\n`;
}

function getAdminDb() {
  if (_adminDb) return _adminDb;

  // Skip initialization if env vars are missing (during build)
  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error("Firebase Admin credentials not configured");
  }

  const adminConfig = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
  };

  const adminApp = getApps().length === 0
    ? initializeApp({ credential: cert(adminConfig as any) })
    : getApps()[0];

  _adminDb = getFirestore(adminApp);
  _adminDb.settings({ preferRest: true });
  return _adminDb;
}

// Export a proxy that lazily initializes
export const adminDb = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(target, prop) {
    const db = getAdminDb();
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  }
});
