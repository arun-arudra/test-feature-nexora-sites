import type { Testimonial, TestimonialTone } from "@/types/testimonial";

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "rohit",
    quote:
      "They rebuilt our slow shop site, fixed product pages, and set up WhatsApp enquiry. Orders picked up within weeks. Very responsive on chat.",
    name: "Rohit N.",
    role: "E-commerce · Bangalore",
    company: "Local shop",
    product: "E-commerce website",
    tone: "cream",
    avatarUrl: null,
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "sneha",
    quote:
      "Restaurant website with digital menu and table enquiry, done quickly. Walk-ins from Google have gone up. Worth every rupee.",
    name: "Sneha I.",
    role: "Restaurant · Mysuru",
    company: "Family restaurant",
    product: "Restaurant website",
    tone: "amber",
    avatarUrl: null,
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "anitha",
    quote:
      "Clean clinic site with appointment enquiry and Maps. A few extra revision rounds, but they fixed everything without fuss.",
    name: "Dr. Anitha R.",
    role: "Healthcare · Hyderabad",
    company: "Clinic",
    product: "Clinic website",
    tone: "teal",
    avatarUrl: null,
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "karthik",
    quote:
      "Homestay site looks premium on mobile. Guests now enquire on WhatsApp instead of only booking on OTAs. Smooth process end to end.",
    name: "Karthik M.",
    role: "Homestay · Coorg",
    company: "Homestay",
    product: "Booking website",
    tone: "sage",
    avatarUrl: null,
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "priya",
    quote:
      "Logo, domain, hosting, and the site — all handled by one team. Fixed price from day one. Exactly what a busy salon needs.",
    name: "Priya S.",
    role: "Beauty · Bangalore",
    company: "Salon",
    product: "Brand + website",
    tone: "blush",
    avatarUrl: null,
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "imran",
    quote:
      "Cloud kitchen finally has a brand presence beyond Swiggy. Bulk order enquiries started coming in the first month.",
    name: "Imran K.",
    role: "Cloud Kitchen · Hubli",
    company: "Cloud kitchen",
    product: "Brand website",
    tone: "ink",
    avatarUrl: null,
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "meena",
    quote:
      "They explained everything in simple terms and launched fast. Our hotel enquiry form and gallery look sharp on phones.",
    name: "Meena D.",
    role: "Hotel · Vizag",
    company: "Boutique hotel",
    product: "Hotel website",
    tone: "amber",
    avatarUrl: null,
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "arjun",
    quote:
      "AMC care after launch is the real win. Menu updates and festival banners without hunting another vendor.",
    name: "Arjun P.",
    role: "Cafe · Mangaluru",
    company: "Cafe",
    product: "Website + AMC",
    tone: "teal",
    avatarUrl: null,
    sortOrder: 8,
    isPublished: true,
  },
];

type DbRow = {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  company: string | null;
  product: string | null;
  tone: string | null;
  avatar_url: string | null;
  sort_order: number | null;
  is_published: boolean | null;
};

const tones = new Set(["cream", "amber", "teal", "sage", "blush", "ink"]);

export function mapTestimonialRow(row: DbRow): Testimonial {
  const tone = (tones.has(row.tone ?? "") ? row.tone : "cream") as TestimonialTone;
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    role: row.role ?? "",
    company: row.company ?? "",
    product: row.product ?? "",
    tone,
    avatarUrl: row.avatar_url,
    sortOrder: row.sort_order ?? 0,
    isPublished: row.is_published ?? true,
  };
}
