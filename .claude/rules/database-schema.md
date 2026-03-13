---
path_scope: "website/app/api/**/*.ts"
description: "Firestore database schemas and constraints for Clarke's Library"
---

# Database Schema

## Folder Collection (`folders`)

```typescript
interface Folder {
  id: string;                    // Auto-generated Firestore document ID
  name: string;                  // Display name (max 100 chars)
  slug: string;                  // URL-safe identifier, pattern: /^[a-z0-9-]+$/
  parentId: string | null;       // Parent folder ID or null for root-level
  description: string;           // Max 300 characters
  path: string[];                // Ancestry path for breadcrumbs
  order: number;                 // Display order (lower = shown first)
  featured: boolean;             // Show on homepage featured section
  articleCount: number;          // Cached count (updated on article create/delete)
  createdAt: Timestamp;          // Firestore Timestamp
  updatedAt: Timestamp;          // Firestore Timestamp
  metadata?: {
    icon?: string;               // Icon identifier (e.g., "book", "folder")
    color?: string;              // Hex color (e.g., "#C15F3C")
    status?: "building" | "review" | "complete";
  };
}
```

**Validation:** name (required, 1-100 chars), slug (required, lowercase/numbers/hyphens), description (required, max 300 chars), order (number, default 0), featured (boolean, default false), articleCount (number, default 0)

## Article Collection (`articles`)

```typescript
interface Article {
  id: string;                    // Auto-generated Firestore document ID
  title: string;                 // Max 200 chars
  slug: string;                  // Pattern: /^[a-z0-9-]+$/
  folderId: string;              // Must reference existing folder
  folderPath: string[];          // Cached folder path for breadcrumbs
  content: string;               // Markdown content (unlimited)
  description: string;           // Max 200 characters (for listings)
  order: number;                 // Display order within folder
  status: string;                // "draft" | "published" | "archived"
  priority: string;              // "low" | "medium" | "high"
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    wordCount?: number;
    readingTime?: number;        // Minutes
    lastModifiedBy?: string;
    version?: number;
  };
}
```

**Validation:** title (required, 1-200 chars), slug (required, lowercase pattern), folderId (required, must exist), description (required, max 200 chars), status (enum, default "draft"), priority (enum, default "medium")

**BREAKING CHANGE (v1.2.0):** Renamed `excerpt` to `description`, removed `tags` field.

## Search Index Collection (`search_index`)

```typescript
interface SearchIndex {
  articleId: string;             // Reference to articles collection
  title: string;                 // Lowercase for case-insensitive search
  description: string;           // Lowercase (max 200 chars)
  folderPath: string[];          // Folder hierarchy for filtering
}
```

**Purpose:** Denormalized, optimized for search. All text fields stored lowercase.

## Batch Operation Limits

- Firestore batch write limit: **500 operations per batch**
- Commit every 500 ops, then start new batch
- Always validate pre-migration assumptions before running scripts

## Migration Pattern

1. Make field optional in TypeScript (both old and new)
2. Deploy code reading BOTH fields (prefer new, fallback old)
3. Run migration script in batches of 500
4. Verify all documents migrated
5. Make new field required, old deprecated
6. Deploy code using only new field
7. Cleanup script to remove old field
