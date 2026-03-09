# SWRC Digital Platform – Implementation Plan

This document maps the project concept note to the codebase and outlines implementation steps for the Somaliland Women Research Center (SWRC) digital platform.

---

## 1. Current State

| Component | Status | Location |
|-----------|--------|----------|
| **Frontend** | ✅ React + TypeScript + Vite | `src/` |
| **Styling** | ✅ Tailwind CSS, Framer Motion | `src/App.css`, Tailwind config |
| **Routing** | ✅ React Router | `src/router.tsx` |
| **Public pages** | ✅ Home, About, Programs, Publications (report), Research, Stories, Media, Contact | `src/pages/` |
| **Backend API** | ❌ Not present | — |
| **Database** | ❌ Not present | — |
| **Admin / CMS** | ❌ Not present | — |
| **Auth** | ❌ Not present | — |

All content (publications, research, programs, stories, media) is currently **hardcoded** in page components. The next steps introduce a Node.js API, PostgreSQL + Prisma, and an admin dashboard so content is stored in the database and manageable by staff.

---

## 2. Concept Note → Deliverables

| Concept section | Deliverable |
|-----------------|-------------|
| **Home** | Keep current; optional later: editable highlights via CMS |
| **About Us** | Keep current; optional later: editable mission/vision via CMS |
| **Publications** | API-backed list + PDF upload; admin CRUD |
| **Research** | API-backed list + PDF link; admin CRUD |
| **Programs** | API-backed list; admin CRUD |
| **Stories** | API-backed list + image upload; admin CRUD |
| **Media** | API-backed gallery (video links + photos); admin CRUD |
| **Secure login** | JWT-based auth; role Admin/Editor |
| **Admin dashboard** | `/admin` – content management for all sections |
| **SEO & performance** | Meta tags, responsive (already), optimised build |

---

## 3. Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Public site (React, Vite) – existing + API data fetching        │
│  /, /about, /programs, /publications, /research, /stories,       │
│  /media, /contact                                                │
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST API (JSON)
┌───────────────────────────────▼─────────────────────────────────┐
│  Node.js API (Express) – server/                                 │
│  • Auth: POST /api/auth/login, GET /api/auth/me                  │
│  • Public GET: /api/publications, /api/research, /api/programs,  │
│    /api/stories, /api/media                                      │
│  • Admin CRUD (protected): same resources with POST/PUT/DELETE   │
│  • File uploads: multipart for PDFs and images                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Prisma ORM
┌───────────────────────────────▼─────────────────────────────────┐
│  PostgreSQL – Users, Publications, Research, Programs,           │
│  Stories, MediaItems, (optional: PageContent for CMS)             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema (Prisma)

- **User** – id, email, passwordHash, role (ADMIN | EDITOR), createdAt
- **Publication** – id, title, slug, type, description, year, pages, fileSize, fileUrl, downloadCount, published, createdAt, updatedAt
- **Research** – id, title, slug, authors, year, abstract, methodology, category, keywords (array or JSON), pdfUrl, downloadCount, published, createdAt, updatedAt
- **Program** – id, title, slug, description, iconName, sortOrder, createdAt, updatedAt
- **Story** – id, name, role, category, story, imageUrl, published, createdAt, updatedAt
- **MediaItem** – id, title, type, description, duration, views, date, youtubeId, thumbnailUrl, mediaType (video | photo), sortOrder, createdAt, updatedAt

(Exact field names and types are defined in `server/prisma/schema.prisma`.)

---

## 5. Implementation Phases

### Phase 1 – Backend (Week 1)
- [x] Implementation plan (this document)
- [ ] Create `server/` with Node.js + Express + TypeScript
- [ ] Add Prisma + PostgreSQL schema and migrations
- [ ] Implement auth (login, JWT, role check middleware)
- [ ] Implement public GET APIs for all content types
- [ ] Implement admin CRUD APIs (protected)
- [ ] File upload (PDF for publications/research; images for stories/media)
- [ ] Seed script for initial data (optional)

### Phase 2 – Admin dashboard (Week 2)
- [ ] Admin layout and login page at `/admin`
- [ ] Protected route wrapper (redirect if not authenticated)
- [ ] Dashboard home (stats/links)
- [ ] CRUD UI for Publications, Research, Programs, Stories, Media
- [ ] Upload UI for PDFs and images

### Phase 3 – Frontend integration (Week 3)
- [ ] Replace hardcoded data with API calls (publications, research, programs, stories, media)
- [ ] Loading and error states; optional caching
- [ ] Fix nav: “research” → “Research”; consider route `/publications` (alias or replace `/report`)
- [ ] SEO: meta tags per page (e.g. react-helmet-async or similar)

### Phase 4 – Deployment & docs (Week 4)
- [ ] Environment config (API URL, DB URL) for production
- [ ] Deploy backend and frontend (e.g. Vercel + Railway/Render, or single host)
- [ ] HTTPS; secure env vars
- [ ] Internal documentation for content editors (how to log in, add/edit content, upload PDFs/images)

---

## 6. File Structure (after implementation)

```
SWRC-main/
├── CONCEPT_NOTE.md          # Original concept (if kept)
├── CONCEPT_IMPLEMENTATION.md # This file
├── index.html
├── package.json             # Frontend (existing)
├── src/                     # React app (existing + API client + admin)
│   ├── api/                 # API client & types
│   ├── pages/
│   │   ├── admin/           # Admin dashboard pages
│   │   └── ...              # Public pages (updated to use API)
│   └── ...
├── server/                  # Node.js API
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── index.ts
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── uploads/             # Uploaded PDFs & images (gitignored)
└── ...
```

---

## 7. Sustainability (per Concept Note)

- **Content management:** Staff use the admin dashboard to add/edit/delete content and upload PDFs/images; no code changes required for routine updates.
- **Future expansion:** New content types or sections can be added as new Prisma models and API routes; admin UI can be extended accordingly.
- **Social media:** Links can be added to the frontend and/or managed via CMS later.
- **Capacity building:** Internal documentation (see Phase 4) will describe how to use the admin and what each section is for.

---

## 8. Timeline Summary

| Week | Focus |
|------|--------|
| 1 | Backend setup, database, auth, content APIs, file upload |
| 2 | Admin dashboard and content management UI |
| 3 | Frontend integration, SEO, testing |
| 4 | Deployment, HTTPS, final review, editor documentation |

This plan keeps the existing SWRC frontend and enhances it with a secure, scalable backend and admin experience as described in the concept note.

---

## 9. Getting Started (Development)

### Backend (Node.js API)

1. **Prerequisites:** Node.js 18+, PostgreSQL running locally or a hosted DB (e.g. Neon, Supabase).
2. **Setup:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
3. **Configure `.env`:** Set `DATABASE_URL` (PostgreSQL connection string) and `JWT_SECRET`.
4. **Database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```
   Default seed admin: `admin@swrc.org` / `ChangeMe123!` (set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` to override).
5. **Run API:** `npm run dev` → API at `http://localhost:3001`.

### Frontend (React)

1. **Optional:** Create `.env` in project root with `VITE_API_URL=http://localhost:3001` so the app talks to the local API.
2. **Run:** `npm run dev` from project root → site at `http://localhost:5173`.
3. **Admin:** Open `http://localhost:5173/admin` (or `/admin/login`) and sign in with the seed admin user.

### Summary

- **Public site:** Existing pages (Home, About, Programs, Publications, Research, Stories, Media, Contact). In Phase 3 these will load content from the API instead of hardcoded data.
- **Admin:** `/admin` → login; `/admin/dashboard` and sidebar links list content. Full add/edit/delete forms can be added in Phase 2.
- **API:** `GET /api/publications`, `/api/research`, etc. for public data; `GET /api/.../admin/list` and `POST/PUT/DELETE` for authenticated staff.
