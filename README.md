# Nexora Sites

Bangalore-based agency website for local businesses across Karnataka & Andhra Pradesh.

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + Zod**
Deploy target: **Vercel**

## Run locally

```bash
cd nexora-sites
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this folder to GitHub/GitLab
2. Import the repo in Vercel
3. Framework preset: Next.js
4. Deploy

Or:

```bash
npx vercel
```

## Replace placeholders (TODO_REPLACE)

Edit `src/config/site.ts`:

- `brandName` / `shortName` / `tagline`
- `url`
- `phone`, `phoneHref`, `whatsapp` (digits only for WhatsApp)
- `email`
- social links

Also update package prices in `src/config/pricing.ts` when ready.

## Features included

- Logo + website + domain/hosting + maintenance messaging
- Industry pages (restaurants, hotels, hospitals, cloud kitchens, shops, villas)
- Pricing packages in INR
- WhatsApp sticky CTA + contact form (validated)
- AI chatbot widget (local FAQ mode, API-ready)
- SEO metadata, sitemap, robots, JSON-LD
- Security headers in `next.config.ts`

## Enable email for contact form later

Add a provider (e.g. Resend) and update `src/app/api/contact/route.ts`.

`.env.example` shows optional keys.

## Enable real AI chatbot later

Set `OPENAI_API_KEY` (or your provider) and extend `src/app/api/chat/route.ts`.
MVP works without keys using FAQ matching.
