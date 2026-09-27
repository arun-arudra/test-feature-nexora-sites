/**
 * News content model + local fallback (used when Contentful env is missing).
 * Full articles come from Contentful CDA at build/request time — see lib/contentful/news.ts
 */

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  role: string;
  excerpt: string;
  image: string;
  href: string;
  duration?: string;
  category: string;
  publishedAt: string;
  tags: string[];
  featured?: boolean;
  /** HTML body from CMS (preferred) */
  bodyHtml?: string;
  /** Plain / markdown body fallback */
  bodyText?: string;
};

/** Placeholder stories — used until Contentful News space is connected */
export const newsItems: NewsItem[] = [
  {
    id: "whatsapp-menus",
    slug: "whatsapp-menus",
    title: "WhatsApp menus that convert",
    role: "Guide · Restaurants",
    excerpt:
      "How coastal cafes turn gallery traffic into one-tap WhatsApp orders without a heavy app.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    href: "/news/whatsapp-menus",
    duration: "4 min",
    category: "Guides",
    publishedAt: "2026-03-15",
    tags: ["WhatsApp", "Restaurants", "Conversion"],
    featured: true,
    bodyText: `## Why WhatsApp beats a heavy app
Most diners already live in WhatsApp. A clear menu link and one-tap order button beats another download.

## What to put on the page
- Food photos that look like your actual plates
- Price and spice level next to each item
- A sticky “Order on WhatsApp” button on mobile

## Closing
Start simple: five bestsellers, one WhatsApp number, one tracking link. Grow from there.`,
  },
  {
    id: "direct-booking",
    slug: "direct-booking",
    title: "Direct booking without OTA tax",
    role: "Case note · Homestays",
    excerpt:
      "Why photo-first property sites still beat marketplace fees when enquiry flow is clear.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    href: "/news/direct-booking",
    duration: "3 min",
    category: "Case notes",
    publishedAt: "2026-03-08",
    tags: ["Homestays", "Booking"],
    bodyText: `## The OTA problem
Marketplaces take a cut every time. Your own site keeps the margin — if guests can enquire fast.

## What works
Strong photos, clear amenities, and a WhatsApp or form CTA above the fold.`,
  },
  {
    id: "clinic-trust",
    slug: "clinic-trust",
    title: "Clinic sites that feel trusted",
    role: "Playbook · Healthcare",
    excerpt:
      "Treatments, doctors, and appointment forms — the three blocks patients actually need.",
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e629?auto=format&fit=crop&w=1200&q=80",
    href: "/news/clinic-trust",
    duration: "5 min",
    category: "Playbooks",
    publishedAt: "2026-02-28",
    tags: ["Healthcare", "Trust"],
    bodyText: `## Patients scan for trust
Show doctors, treatments, and how to book. Hide the fluff.`,
  },
  {
    id: "amc-after-launch",
    slug: "amc-after-launch",
    title: "Don’t go live and get left alone",
    role: "Product · AMC",
    excerpt:
      "Backups, small edits, and uptime checks — what maintenance should mean after launch.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    href: "/news/amc-after-launch",
    duration: "2 min",
    category: "Product",
    publishedAt: "2026-02-20",
    tags: ["AMC", "Maintenance"],
    bodyText: `## After launch
Backups, small content edits, and someone to call when something breaks.`,
  },
  {
    id: "fixed-price-builds",
    slug: "fixed-price-builds",
    title: "Fixed price, no surprise invoices",
    role: "Studio · Process",
    excerpt:
      "How we quote in 24 hours and keep builds on a clear scope for Karnataka & AP businesses.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    href: "/news/fixed-price-builds",
    duration: "3 min",
    category: "Studio",
    publishedAt: "2026-02-10",
    tags: ["Pricing", "Process"],
    bodyText: `## Clear scope
Fixed price only works when the brief is clear. We quote in 24 hours with inclusions written down.`,
  },
];

export function newsItemToSummary(item: NewsItem): NewsItem {
  return item;
}
