export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  industry: string;
  outcome: string;
  /** Short proof metric shown on the showcase (replace with real numbers) */
  metric: string;
  blurb: string;
  videoDesktop: string;
  videoMobile: string;
  videoTablet: string;
  accent: string;
};

/** Reliable short sample clips (different per device). Swap for /public/videos later. */
const V = {
  a: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  b: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
  c: "https://www.w3schools.com/html/mov_bbb.mp4",
  d: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  e: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  f: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
};

export const portfolio: PortfolioProject[] = [
  {
    id: "coastal-cafe",
    title: "Coastal Cafe",
    category: "RESTAURANT · MENU SITE",
    industry: "Restaurants",
    outcome: "WhatsApp enquiries up after launch",
    metric: "2× WhatsApp enquiries",
    blurb: "Menu-led cafe site with gallery and one-tap WhatsApp ordering intent.",
    videoDesktop: V.d,
    videoMobile: V.a,
    videoTablet: V.e,
    accent: "#FFF1E4",
  },
  {
    id: "boutique-homestay",
    title: "Boutique Homestay",
    category: "STAYS · DIRECT BOOKING",
    industry: "Villas & Homestays",
    outcome: "More direct stay enquiries",
    metric: "Direct booking intent ↑",
    blurb: "Photo-first property site with availability enquiry and Maps integration.",
    videoDesktop: V.e,
    videoMobile: V.b,
    videoTablet: V.f,
    accent: "#E8F4F2",
  },
  {
    id: "city-dental",
    title: "City Dental Clinic",
    category: "HEALTHCARE · CLINIC",
    industry: "Hospitals & Clinics",
    outcome: "Cleaner appointment enquiries",
    metric: "More appointment forms",
    blurb: "Trust-focused clinic website with treatments, doctors, and enquiry form.",
    videoDesktop: V.f,
    videoMobile: V.c,
    videoTablet: V.d,
    accent: "#EEF2FF",
  },
  {
    id: "hill-view-resort",
    title: "Hill View Resort",
    category: "HOTEL · RESORT",
    industry: "Hotels & Resorts",
    outcome: "Direct booking intent improved",
    metric: "Less OTA-only traffic",
    blurb: "Room showcase site designed to reduce OTA-only dependence.",
    videoDesktop: V.a,
    videoMobile: V.d,
    videoTablet: V.b,
    accent: "#F3F7EA",
  },
  {
    id: "spice-kitchen",
    title: "Spice Cloud Kitchen",
    category: "FOOD · CLOUD KITCHEN",
    industry: "Cloud Kitchens",
    outcome: "Brand presence beyond apps",
    metric: "Bulk order enquiries",
    blurb: "Brand + menu website for corporate and bulk order enquiries.",
    videoDesktop: V.b,
    videoMobile: V.e,
    videoTablet: V.c,
    accent: "#FFF5EB",
  },
  {
    id: "fashion-shop",
    title: "Local Fashion Shop",
    category: "RETAIL · ONLINE STORE",
    industry: "Shops & Ecommerce",
    outcome: "Catalog live with UPI checkout path",
    metric: "UPI-ready catalog",
    blurb: "Mobile catalog with product enquiry and payment-ready structure.",
    videoDesktop: V.c,
    videoMobile: V.f,
    videoTablet: V.a,
    accent: "#F8EEF5",
  },
];
