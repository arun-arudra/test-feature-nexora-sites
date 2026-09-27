# Nexora News + Contentful — Session Plan & Checklist

> **Dedicated file.** Do not dump unrelated work here.  
> Tick boxes in this file as we complete items in chat sessions.  
> Reference sources: `arun-arudra/Arun-Arudra-web` branches `n8n-automation` + `dev`.  
> Last updated: 2026-09-24

---

## Decisions (locked for now)

| Topic | Decision |
|---|---|
| Hosting | Bluehost shared (static / build artifacts). No separate Node/VPS for admin **yet**. |
| **Main site** | Single homepage at `/` (black / light / violet, Outfit). No `/v1` `/v2` `/v3` routes. |
| Content write path (now) | **Plan B:** n8n (Render) → Contentful. Humans may also edit in Contentful UI. |
| Content write path (later) | **Plan A (future):** Nexora custom `/admin` writes content — see § Future Plan A. |
| Public site read path (now) | Fetch Contentful at **build / deploy time** (or cached CDN read). Fine if content updates after redeploy / webhook rebuild. |
| News UI | Take layout/UX from Arun repo (`News.tsx` list + `ArticleDetail.tsx`), restyle to **Nexora** colors, fonts, V2 theme. |
| Testimonials (now) | Keep current Nexora approach until a Contentful space is ready; do not block news. |
| This checklist file | `docs/plans/NEWS_CONTENTFUL_SESSION.md` only — no mixing with other feature notes. |

---

## Thoughts: 3–4 Contentful accounts / spaces

**Your idea (one space per content domain) is workable**, with caveats:

### Why it can help
- Free-tier **API rate limits / quotas** are per space (or org). Splitting **news / projects / testimonials / misc** spreads traffic.
- n8n only needs the **News** space credentials → smaller blast radius if a token leaks.
- Clear ownership: “News space = blogs only.”

### Why you may not need 4 on day one
- Plan B + **build-time fetch** means the live site does **not** call Contentful on every visitor. Limits are hit mainly at **build**, n8n writes, and Contentful UI — usually low for a small business site.
- Four free accounts = four logins, four spaces, four env sets, four n8n credential sets → easy to miswire.
- Creating multiple free accounts **only to dodge limits** may conflict with Contentful’s terms — prefer **one org with multiple spaces**, or upgrade one space if you outgrow free tier.

### Recommendation
1. **Start:** **1 Contentful space = News only** (enough for Plan B + n8n).  
2. **Add later if needed:** Projects space, Testimonials space, Misc space.  
3. In code, always use **named env vars per space** so adding account #2–#4 is config-only (see § Env layout).  
4. Prefer **spaces under one org** over four personal free accounts, if Contentful allows it on your plan.

### Env layout (when multi-space)
```bash
# News (required for Plan B)
CONTENTFUL_NEWS_SPACE_ID=
CONTENTFUL_NEWS_DELIVERY_TOKEN=    # CDA — read at build
CONTENTFUL_NEWS_ENVIRONMENT=master

# Optional later
CONTENTFUL_PROJECTS_SPACE_ID=
CONTENTFUL_PROJECTS_DELIVERY_TOKEN=
CONTENTFUL_TESTIMONIALS_SPACE_ID=
CONTENTFUL_TESTIMONIALS_DELIVERY_TOKEN=
CONTENTFUL_MISC_SPACE_ID=
CONTENTFUL_MISC_DELIVERY_TOKEN=

# Never commit; never NEXT_PUBLIC_ for Management tokens
# CONTENTFUL_NEWS_MANAGEMENT_TOKEN=   # only for n8n / future server admin — not browser
```

n8n (Render) holds **Management** token for News space only.  
Website build holds **Delivery** tokens only.

---

## Architecture (Plan B — now)

```
n8n (Render)  --write-->  Contentful News space
                              |
                         Delivery API (CDA)
                              |
                    next build / CI on deploy
                              |
                         static HTML/JS
                              |
                         Bluehost (FTP)
                              |
                         Visitors (no Contentful call per page view*)
```

\*Unless we later add client/ISR fetches; Plan B default = build-time.

**Rebuild when content changes:** Contentful webhook → GitHub Action / Render hook → rebuild → FTP (same pattern as Arun `dev`/`main` CI). Document exact webhook in tasks below.

---

## Main tasks & nested checklist

### 0. Reference & alignment
- [ ] **0.1** Keep Arun repo refs handy: branch `n8n-automation` (Contentful + n8n + admin patterns), branch `dev` (Bluehost/CI polish).
- [ ] **0.2** Confirm n8n workflow on Render: trigger → generate blog → create/publish Contentful `news` entry.
- [ ] **0.3** Confirm Contentful `news` fields match what Nexora will render (title, slug, category, excerpt, image/coverImage, body, tags, publishedDate, featured, SEO fields).
- [ ] **0.4** Decide single News space first vs create all spaces up front (recommend: News first).

### 1. Contentful News space (Plan B)
- [ ] **1.1** Create / select Contentful space for **News only**.
  - [ ] **1.1.1** Create content type `news` (mirror Arun `CONTENTFUL_GUIDE` / SITE_MEMORY fields).
  - [ ] **1.1.2** Create Delivery API token (read-only).
  - [ ] **1.1.3** Create Management API token for **n8n only** (store in Render n8n credentials — not in git, not in browser).
- [ ] **1.2** Seed 2–3 sample posts for UI work (or use fallbacks until connected).
- [ ] **1.3** Document space ID + which account in a **private** password manager (not this repo).

### 2. Nexora news UI (Arun layout → Nexora design system)
- [ ] **2.1** List page `/news`
  - [ ] **2.1.1** Port structure: breadcrumb, Featured + Popular, filters/search/categories, grid, pagination (from Arun `News.tsx`).
  - [ ] **2.1.2** Restyle: Nexora fonts (`font-heading` / Outfit on V2), primary/accent/black-light tokens, no Arun orange/default shadcn look.
  - [ ] **2.1.3** Wire V1 + V2 routes if both themes need news (or share one themed shell).
- [ ] **2.2** Article page `/news/[slug]`
  - [ ] **2.2.1** Port structure: hero title+image, sticky TOC, body, tags, CTA (from Arun `ArticleDetail.tsx`).
  - [ ] **2.2.2** Restyle to Nexora; support HTML and/or rich text body from Contentful.
  - [ ] **2.2.3** SEO metadata from Contentful fields when present.
- [ ] **2.3** Homepage news strip
  - [ ] **2.3.1** Keep/adapt current carousel/cards but data from Contentful news (featured / latest N).
  - [ ] **2.3.2** Match Nexora V2 section styling.

### 3. Data layer (build-time Contentful)
- [ ] **3.1** Add server-only Contentful client for News space (`CONTENTFUL_NEWS_*` env).
- [ ] **3.2** `getAllNews()` / `getNewsBySlug()` used by `/news` and `/news/[slug]` at build (or request time if SSR allowed on host).
  - [ ] **3.2.1** Fallback to local `src/config/news.ts` if env missing (dev without CMS).
- [ ] **3.3** Map Contentful fields → Nexora `NewsItem` type.
- [ ] **3.4** Images: Contentful CDN URLs in `next.config` `images.remotePatterns`.
- [ ] **3.5** Optional: Contentful webhook → CI rebuild (document + implement when deploy pipeline exists).

### 4. n8n (Render) ↔ Contentful News
- [ ] **4.1** Point n8n credentials at **News space** management token.
- [ ] **4.2** Ensure output fields match content type (slug unique, body format HTML or markdown — pick one and stick to it).
- [ ] **4.3** Publish vs draft policy (recommend: draft in Contentful → human approve → publish → rebuild).
- [ ] **4.4** Smoke test: run workflow → entry appears → rebuild → live `/news/[slug]`.

### 5. Bluehost / deploy (Plan B compatible)
- [ ] **5.1** Confirm Nexora deploy path for Bluehost (static export vs Node).  
  - [ ] **5.1.1** If static export: Contentful fetch **must** run at `next build`; no server admin.  
  - [ ] **5.1.2** If full Next on Node later: note in Future Plan A.
- [ ] **5.2** Document rebuild steps after n8n publishes a post.
- [ ] **5.3** Do **not** put Management tokens in client bundle or FTP’d JS.

### 6. Multi-space expansion (only when needed)
- [ ] **6.1** Projects Contentful space + env + fetch helper.
- [ ] **6.2** Testimonials Contentful space + migrate off current source.
- [ ] **6.3** Misc space (FAQs, settings, etc.) if required.
- [ ] **6.4** Update n8n / webhooks per space (separate credentials).

---

## Future Plan A — Custom Nexora admin (do not lose)

> **Started 2026-09-24:** Arun-style CMS panel is available at `NEXT_PUBLIC_CMS_ADMIN_BASE` (default `/cms`). Requires a **Node host**. Bluehost shared alone cannot run it.

### A. Goals
- [x] **A.1** Edit/publish News from Nexora CMS panel (default `/cms`) — Contentful UI optional.
- [x] **A.2** Secrets only on server (env). Management token never in browser (`/api/cms/*` proxy).
- [x] **A.3** Keep n8n as “AI draft” via Generate form; admin reviews/publishes.

### A. Subtasks
- [x] **A.10** Host: Node (Vercel/Railway/etc.) — not shared FTP-only.
- [x] **A.11** API routes: CMA proxy + n8n + upload.
- [x] **A.12** Auth: Supabase MFA (same pattern as `/admin`).
- [x] **A.13** Media uploads through `/api/cms/upload`.
- [ ] **A.14** Feature flag: `ADMIN_CMS_WRITE_ENABLED` — optional harden.
- [ ] **A.15** Migrate checklist from this file into an “Admin CMS” epic without deleting history (append a “Completed Plan B” section below).

### A. What Plan B must not block
- Named env vars per space (already).
- Stable `news` content type schema (already).
- Draft vs published distinction in Contentful.
- No Management tokens in frontend (already a rule).

---

## Session tick log

| Date | Done | Notes |
|---|---|---|
| 2026-09-24 | Plan file created | Branches reviewed: `n8n-automation`, `dev`. Plan B + Future A recorded. |
| 2026-09-24 | Plan B UI + Contentful client shipped | `/news` + `/news/[slug]` Arun layout → Nexora theme; `getAllNews()` with fallback; env `CONTENTFUL_NEWS_*`. n8n stays on Render (unchanged). |
| 2026-09-24 | Plan A CMS panel ported | `/cms` (env-configurable) — login/MFA, generate via n8n, queue, review/publish; V2 theme; CMA via `/api/cms/*`. |

### Quick ticks (Plan B build)
- [x] **2.1 / 2.2** News list + article UI (Nexora styled)
- [x] **3.1 / 3.2 / 3.3** Contentful news client + fallback
- [x] **3.4** `images.ctfassets.net` in next.config
- [ ] **1.x** Paste real `CONTENTFUL_NEWS_SPACE_ID` + delivery token into `.env.local`
- [ ] **4.x** Point existing n8n at same News space (already working on Arun — reuse credentials)
- [ ] **0.3** Confirm Contentful `news` field IDs match mapper in `src/lib/contentful/news.ts`

### Quick ticks (Plan A CMS)
- [x] Port Arun Command Center → `/cms` (V2 theme)
- [x] `NEXT_PUBLIC_CMS_ADMIN_BASE` + rewrite
- [x] `CONTENTFUL_NEWS_MANAGEMENT_TOKEN` + `N8N_WEBHOOK_URL` server env
- [ ] Paste credentials into `.env.local` / host env and smoke-test generate → draft → publish

---

## Out of scope for this file
- Unrelated homepage polish, testimonials motion tweaks, Visuvate cards, etc.  
- Those belong in other docs or chat — **not** here.
