import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Lazy initialization - only init when credentials are available
let _adminDb: ReturnType<typeof getFirestore> | null = null;

function getAdminDb() {
  if (_adminDb) return _adminDb;

  // Skip initialization if env vars are missing (during build)
  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error("Firebase Admin credentials not configured");
  }

  const adminConfig = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  const adminApp = getApps().length === 0
    ? initializeApp({ credential: cert(adminConfig as any) })
    : getApps()[0];

  _adminDb = getFirestore(adminApp);
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
