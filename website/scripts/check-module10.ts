import { adminDb as db } from '../lib/firebase/admin';

async function check() {
  const folders = await db.collection('folders').get();
  const mod10 = folders.docs.filter(d =>
    d.data().name?.includes('Module 10') ||
    d.data().slug?.includes('module-10') ||
    d.data().slug?.includes('ba-perspectives')
  );
  mod10.forEach(d => console.log('FOLDER:', d.id, '|', d.data().name, '| slug:', d.data().slug, '| articles:', d.data().articleCount));

  if (mod10.length > 0) {
    const folderId = mod10[0].id;
    const articles = await db.collection('articles')
      .where('folderId', '==', folderId)
      .orderBy('order', 'asc')
      .get();
    articles.docs.forEach(d => console.log('ART:', d.id, '|', d.data().title, '| order:', d.data().order));
  }
}

check().catch(console.error).finally(() => process.exit(0));
