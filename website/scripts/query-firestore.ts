import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

async function queryFirestore() {
  console.log('Loading Firebase Admin credentials...\n');

  // Check if credentials are loaded
  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    console.error('❌ FIREBASE_ADMIN_PRIVATE_KEY not found in environment');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('FIREBASE')));
    process.exit(1);
  }

  const adminConfig = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };

  console.log('✅ Credentials loaded');
  console.log('Project ID:', adminConfig.projectId);
  console.log('Client Email:', adminConfig.clientEmail);
  console.log('Private Key:', adminConfig.privateKey ? '(present)' : '(missing)');
  console.log();

  // Initialize Firebase Admin
  const adminApp = getApps().length === 0
    ? initializeApp({ credential: cert(adminConfig as any) })
    : getApps()[0];

  const db = getFirestore(adminApp);

  console.log('🔍 Querying Firestore for "Business Analysis Masterclass" folder...\n');

  try {
    const foldersRef = db.collection('folders');
    const snapshot = await foldersRef.where('name', '==', 'Business Analysis Masterclass').get();

    if (snapshot.empty) {
      console.log('❌ No folder found with exact name "Business Analysis Masterclass"');
      console.log('Searching all folders for similar names...\n');

      const allFolders = await foldersRef.get();
      console.log(`Total folders: ${allFolders.size}\n`);

      const businessFolders = allFolders.docs.filter(doc =>
        doc.data().name && doc.data().name.toLowerCase().includes('business')
      );

      if (businessFolders.length > 0) {
        console.log('📁 Folders containing "business":\n');
        businessFolders.forEach(doc => {
          const data = doc.data();
          console.log(`Name: ${data.name}`);
          console.log(`  ID: ${doc.id}`);
          console.log(`  Slug: ${data.slug || 'N/A'}`);
          console.log(`  Parent ID: ${data.parentId || 'null'}`);
          console.log(`  Featured: ${data.featured || false}`);
          console.log(`  Article Count: ${data.articleCount || 0}`);
          console.log(`  Description: ${data.description ? `${data.description.length} chars` : 'N/A'}`);
          console.log();
        });
      }
      return;
    }

    // Found the folder
    const doc = snapshot.docs[0];
    const data = doc.data();

    console.log('✅ FOUND FOLDER: Business Analysis Masterclass\n');
    console.log('='.repeat(60));
    console.log('Document ID:', doc.id);
    console.log('Slug:', data.slug || 'N/A');
    console.log('Parent ID:', data.parentId || 'null (root-level)');
    console.log('Featured:', data.featured !== undefined ? data.featured : 'not set');
    console.log('Article Count:', data.articleCount || 0);
    console.log('Description Length:', data.description ? `${data.description.length} chars` : 'N/A');
    if (data.description) {
      console.log('Description Preview:', data.description.substring(0, 100) + '...');
    }
    console.log('='.repeat(60));
    console.log();

    // Check for sub-folders
    console.log('📂 Checking for sub-folders...\n');
    const subFoldersSnapshot = await foldersRef.where('parentId', '==', doc.id).get();

    if (subFoldersSnapshot.empty) {
      console.log('✅ No sub-folders found (flat structure)');
    } else {
      console.log(`📁 Found ${subFoldersSnapshot.size} sub-folder(s):\n`);
      subFoldersSnapshot.forEach(subDoc => {
        const subData = subDoc.data();
        console.log(`  - ${subData.name}`);
        console.log(`    ID: ${subDoc.id}`);
        console.log(`    Slug: ${subData.slug || 'N/A'}`);
        console.log(`    Article Count: ${subData.articleCount || 0}`);
        console.log();
      });
    }

    // Summary for documentation
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY FOR DOCUMENTATION:');
    console.log('='.repeat(60));
    console.log('Document ID:', doc.id);
    console.log('Slug:', data.slug || 'N/A');
    console.log('Parent ID:', data.parentId || 'null');
    console.log('Featured:', data.featured !== undefined ? data.featured : false);
    console.log('Article Count:', data.articleCount || 0);
    console.log('Description:', data.description ? `${data.description.length} chars (${data.description.length <= 300 ? 'WITHIN' : 'EXCEEDS'} 300 limit)` : 'N/A');
    console.log('Sub-folders:', subFoldersSnapshot.empty ? 'None' : `${subFoldersSnapshot.size} found`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error querying Firestore:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

queryFirestore()
  .then(() => {
    console.log('\n✅ Query complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Query failed:', error);
    process.exit(1);
  });
