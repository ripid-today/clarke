# Clarke's Library

A knowledge wiki website for organizing learned knowledge in a modular, searchable format with a Notion-like interface.

## 🎨 Design

- **Background:** Cloud Dancer (#F0EEE9)
- **Text:** Black (#000000)
- **Typography:** Inter font (modern, clean, sans-serif)
- **Interface:** Notion-like with folders on left, content on right
- **Mobile:** Mobile-first responsive design

## 🚀 Quick Start

### Prerequisites

- Bun (v1.2+) or Node.js (v18+)
- Firebase project (free tier)
- Vercel account (for deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure environment variables:**
   
   Copy `.env.local` and fill in your Firebase credentials:
   ```bash
   # Get these from Firebase Console > Project Settings
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ripid-today.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=ripid-today

   # Get these from Firebase Console > Service Accounts
   FIREBASE_ADMIN_PROJECT_ID=ripid-today
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@ripid-today.iam.gserviceaccount.com
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # Generate a secure random string
   LIBRARY_API_KEY=your-secure-api-key-here
   ```

3. **Run development server:**
   ```bash
   bun run dev
   ```

4. **Open browser:**
   
   Navigate to [http://localhost:3000/library](http://localhost:3000/library)

## 📦 Project Structure

```
website/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Root redirect to /library
│   ├── globals.css                # Global styles
│   ├── library/
│   │   ├── layout.tsx             # Library layout with sidebar
│   │   ├── page.tsx               # Library homepage
│   │   ├── [...slug]/page.tsx    # Dynamic folder/article pages
│   │   └── search/page.tsx        # Search results
│   └── api/library/
│       ├── folders/route.ts       # Folders API
│       ├── articles/route.ts      # Articles API
│       ├── search/route.ts        # Search API
│       └── featured/route.ts      # Featured folders API
├── components/library/
│   ├── Sidebar.tsx                # Desktop sidebar navigation
│   ├── ArticleViewer.tsx          # Markdown content renderer
│   ├── FeaturedFolders.tsx        # Homepage folder cards
│   ├── Breadcrumbs.tsx            # Navigation breadcrumbs
│   └── SearchBar.tsx              # Search input
├── lib/firebase/
│   ├── config.ts                  # Firebase client SDK
│   ├── admin.ts                   # Firebase Admin SDK
│   └── firestore.ts               # Firestore helper functions
└── types/
    └── library.ts                 # TypeScript type definitions
```

## 🔥 Firestore Schema

### Collections

**folders:**
```typescript
{
  id: string
  name: string
  slug: string
  parentId: string | null
  description: string
  path: string[]
  order: number
  featured: boolean
  articleCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**articles:**
```typescript
{
  id: string
  title: string
  slug: string
  folderId: string
  folderPath: string[]
  content: string (markdown)
  excerpt: string
  tags: string[]
  order: number
  status: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**search_index:**
```typescript
{
  articleId: string
  title: string (lowercase)
  excerpt: string (lowercase)
  tags: string[]
  folderPath: string[]
}
```

## 🤖 API Endpoints

### For AI Agents

All write endpoints require `Authorization: Bearer YOUR_LIBRARY_API_KEY` header.

**Create Folder:**
```bash
POST /api/library/folders
{
  "name": "Business Analysis",
  "slug": "business-analysis",
  "parentId": null,
  "description": "Business analysis concepts and frameworks",
  "featured": true
}
```

**Create Article:**
```bash
POST /api/library/articles
{
  "title": "Introduction to BA",
  "slug": "intro-to-ba",
  "folderId": "folder-id-here",
  "content": "# Introduction\n\nMarkdown content here...",
  "tags": ["business", "analysis", "fundamentals"]
}
```

### Public Endpoints

**Get Folders:**
```bash
GET /api/library/folders
GET /api/library/folders?parentId=xxx
```

**Get Articles:**
```bash
GET /api/library/articles?folderId=xxx
```

**Search:**
```bash
GET /api/library/search?q=business
```

**Featured Folders:**
```bash
GET /api/library/featured
```

## 🚢 Deployment

### Vercel Setup

1. **Install Vercel CLI:**
   ```bash
   bun add -g vercel
   ```

2. **Link project:**
   ```bash
   cd /c/Users/Nguyen/Clarke
   vercel link
   ```

3. **Set environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add FIREBASE_ADMIN_PROJECT_ID
   vercel env add FIREBASE_ADMIN_CLIENT_EMAIL
   vercel env add FIREBASE_ADMIN_PRIVATE_KEY
   vercel env add LIBRARY_API_KEY
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### GitHub Actions

The `.github/workflows/deploy.yml` automatically deploys on push to `main` or `master` branch.

**Required GitHub Secrets:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `FIREBASE_API_KEY`
- `FIREBASE_PROJECT_ID`

## 📝 Adding Content

### Option 1: Via API (Recommended for AI Agents)

Use the POST endpoints above with your `LIBRARY_API_KEY`.

### Option 2: Firebase Console

Directly add documents to Firestore collections via Firebase Console.

### Option 3: Migration Script

Create a script in `/scripts/migrate-to-firestore.ts` to import existing markdown files.

## 🎯 Features

✅ Notion-like interface with collapsible folder tree  
✅ Mobile-first responsive design  
✅ Markdown content rendering with syntax highlighting  
✅ Basic text search across titles and content  
✅ Download articles as markdown files  
✅ Breadcrumb navigation  
✅ Featured folders on homepage  
✅ API endpoints for AI agent integration  
✅ Cloud Dancer (#F0EEE9) background theme  

## 🔮 Next Steps

1. **Add Firebase credentials** to `.env.local`
2. **Create featured folders** in Firestore
3. **Add articles** via API or Firebase Console
4. **Test locally** at http://localhost:3000/library
5. **Deploy to Vercel** for production

## 📚 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Runtime:** Bun (compatible with Node.js)
- **Database:** Firebase Firestore
- **Styling:** Tailwind CSS + Typography plugin
- **Markdown:** react-markdown + rehype-highlight
- **Icons:** lucide-react
- **Deployment:** Vercel

## 🆘 Troubleshooting

**Build errors:**
- Ensure all environment variables are set
- Check Firebase credentials are valid
- Run `bun install` to reinstall dependencies

**Empty library:**
- Add folders and articles to Firestore
- Mark folders as `featured: true` to show on homepage

**Search not working:**
- Ensure `search_index` collection is populated
- Check article content is indexed when created

## 📄 License

MIT
