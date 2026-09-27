# Admin + Supabase setup

## Hosting reality (Bluehost shared)

**Copy-pasting `next build` output onto Bluehost shared hosting will not run this app.**

This project is a **Next.js Node server** app (middleware, `/admin` auth + MFA, server components, API routes). Bluehost **shared** hosting is typically Apache + PHP + static files (FTP). It does **not** run `next start`.

| What you want | Works on Bluehost shared? | What to use instead |
|---|---|---|
| Public marketing pages only (no admin) | Only if we switch to a static export (limited; breaks admin) | Or keep Next on Node host |
| `/admin` + Supabase + MFA | **No** | Node host: **Vercel**, Railway, Render, Fly.io, or Bluehost **VPS/Cloud with Node** |
| `/cms` news CMS (Contentful + n8n) | **No** | Same Node host; set `CONTENTFUL_NEWS_MANAGEMENT_TOKEN` + `N8N_WEBHOOK_URL` |
| Database / auth | N/A (not on Bluehost disk) | **Supabase Cloud** (free tier is fine) |
| Domain `nexorasites.com` | DNS only is fine | Point DNS at Vercel (or your Node host) |

**Practical setup we recommend:**
1. Supabase Cloud — DB + Auth + storage  
2. Vercel (or similar) — deploy this Next.js repo; put secrets in project env  
3. Bluehost — keep the domain; change DNS A/CNAME to the Node host (or leave Bluehost only for email)

If you later need “FTP static files only,” we would have to **split** the site: static public site on Bluehost + admin hosted elsewhere. That is a separate architecture change.

---

## Credentials (backend vs browser)

| Variable | Where it lives | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Env on the **server** (and currently also bundled for browser login) | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | Public **anon** key — safe only because **RLS** locks the DB. Still do not treat it as a password. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** (never `NEXT_PUBLIC_`) | Bypasses RLS. Never expose to the browser. |

Today the admin UI still talks to Supabase from the browser for login/MFA and some form saves (using the anon key + your logged-in session). Public homepage testimonials are loaded on the **server**.

To keep URL/keys **off the client bundle entirely**, we need a follow-up: move admin login + CRUD into **server actions / API routes**. Say when you want that done.

---

## 1. Create a Supabase project
1. Go to https://supabase.com and create a project.
2. **Project Settings → API**: copy Project URL, `anon` `public` key, and (for server-only jobs) `service_role` key.
3. Paste into `.env.local` locally, and into **Vercel → Settings → Environment Variables** for production (see `.env.example`).

## 2. Env options
In `.env.local`:

```bash
NEXT_PUBLIC_TESTIMONIALS_VISIBLE_COUNT=8
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin panel URL (default /admin)
NEXT_PUBLIC_CMS_ADMIN_BASE=/admin
CONTENTFUL_NEWS_SPACE_ID=
CONTENTFUL_NEWS_DELIVERY_TOKEN=
CONTENTFUL_NEWS_ENVIRONMENT=master
CONTENTFUL_NEWS_MANAGEMENT_TOKEN=
N8N_WEBHOOK_URL=

# Google Analytics 4 (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

- **`/admin`** — news CMS (Contentful + n8n) + testimonials (Supabase). Unauthenticated visitors are sent to `/admin/login`; signed-in users land on the dashboard.
- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local` / host env to enable GA4 on the public site.

## 3. Run the database migrations
In Supabase **SQL Editor**, run **`supabase/setup.sql`** once (or the two files below in order).

Until these tables exist (and API roles have grants), admin saves fail — the Testimonials page shows a setup banner with a copy button.

1. Prefer `supabase/setup.sql` (tables + grants)
2. If tables already exist but saves still fail with **permission denied**, run `supabase/fix_grants.sql`
3. Or run in order: `001_…sql` then `002_…sql`

This creates:
- `testimonials` table (+ RLS)
- `testimonial-avatars` storage bucket
- `page_views_daily` analytics table
- `site_settings` (visible card count)
- seed sample reviews

## 4. Create an admin user
**Authentication → Users → Add user** (email + password).

## 5. Enable MFA (recommended)
**Authentication → Multi-Factor**: enable TOTP.
On first login at `/admin/login`, the app will:
- prompt for authenticator code if already enrolled, or
- show a QR to enroll, then verify the 6-digit code.

## 6. Use the admin
- `/admin/login` — sign in (+ MFA)
- `/admin` — dashboard, analytics, **cards on homepage** count, View page
- `/admin/testimonials` — list / add / edit / delete, upload profile image, visible count

## 7. News CMS (Contentful + n8n)
- URL: `NEXT_PUBLIC_CMS_ADMIN_BASE` (default `/cms`) — login uses the same Supabase users/MFA
- Env: `CONTENTFUL_NEWS_*` delivery + **`CONTENTFUL_NEWS_MANAGEMENT_TOKEN`**, **`N8N_WEBHOOK_URL`**
- Flow: Generate draft (n8n) → review in queue → edit/publish; management token stays on the server via `/api/cms/*`

Public site: first card is always white; remaining colours alternate. Deck peels from the bottom of the stack (right, left, right…).
