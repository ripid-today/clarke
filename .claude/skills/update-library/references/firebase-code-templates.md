# Firebase Code Templates

Reusable TypeScript code templates for Firebase Admin SDK operations in Clarke's Library. Import from `@/lib/firebase/admin`.

---

## Bulk Update Template

```typescript
import { db, FieldValue } from '@/lib/firebase/admin';

async function bulkUpdateArticles(updates: Map<string, Partial<Article>>) {
  const batchSize = 400;
  let batch = db.batch();
  let count = 0;

  for (const [articleId, update] of updates) {
    const ref = db.collection('articles').doc(articleId);
    batch.update(ref, { ...update, updatedAt: FieldValue.serverTimestamp() });
    count++;
    if (count % batchSize === 0) {
      await batch.commit();
      batch = db.batch();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  if (count % batchSize !== 0) await batch.commit();
  console.log(`Bulk update complete: ${count} articles updated`);
}
```

## Create Module Folder

```typescript
await db.collection('folders').doc(moduleSlug).set({
  name, slug: moduleSlug, parentId: masterclassId,
  description, // max 300 chars
  path: [masterclassSlug, moduleSlug],
  order, featured: false, articleCount: 0,
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
  metadata: { status: 'building' }
});
```

## Create Article with Content Lookup

```typescript
const articleId = moduleSlug + '-' + articleSlug;
const content = CONTENT[articleSlug] || `# ${title}\n\n*Content coming soon.*`;
const wordCount = content.split(/\s+/).length;

await db.collection('articles').doc(articleId).set({
  title, slug: articleSlug, folderId: moduleSlug,
  folderPath: [masterclassSlug, moduleSlug],
  content, description, // max 200 chars
  order, status: 'published',
  priority: 'medium',
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
  metadata: { wordCount, readingTime: Math.ceil(wordCount / 200), lastModifiedBy: 'claude-agent', version: 1 }
});
```

## Batch Delete Pattern

```typescript
let batch = db.batch();
let bc = 0;
for (const doc of snapshot.docs) {
  batch.delete(doc.ref);
  bc++;
  if (bc >= 400) { await batch.commit(); batch = db.batch(); bc = 0; }
}
if (bc > 0) await batch.commit();
```

## Firebase Admin SDK Quick Reference

```typescript
// Get document
const doc = await db.collection('articles').doc('id').get();

// Update document
await db.collection('articles').doc('id').update({ field: value });

// Create document (auto ID)
await db.collection('articles').add({ field: value });

// Create document (explicit ID)
await db.collection('articles').doc('my-id').set({ field: value });

// Delete document
await db.collection('articles').doc('id').delete();

// Batch operations
const batch = db.batch();
batch.update(ref1, { field: value });
batch.update(ref2, { field: value });
await batch.commit();

// Query
const snapshot = await db.collection('articles')
  .where('folderId', '==', 'folder-id')
  .orderBy('order', 'asc')
  .get();

// Count
const count = (await db.collection('articles')
  .where('folderId', '==', folderId).count().get()).data().count;
```
