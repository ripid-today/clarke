import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\n/g, "\n"),
};

// Initialize Admin SDK (server-side only)
const adminApp = getApps().length === 0
  ? initializeApp({ credential: cert(adminConfig as any) })
  : getApps()[0];

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
