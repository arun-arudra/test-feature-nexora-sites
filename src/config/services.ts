export type ServiceItem = {
  slug: string;
  title: string;
  short: string;
  advanced?: boolean;
  href: string;
  includes: string[];
};

export const services: ServiceItem[] = [
  {
    slug: "logo-branding",
    title: "Logo & Brand Identity",
    short: "A clean logo, colors, and fonts that make your business look trusted.",
    href: "/services/logo-branding",
    includes: ["Logo concepts", "Color palette", "Font guidance", "Basic brand usage"],
  },
  {
    slug: "website-design-development",
    title: "Custom Website Design & Development",
    short: "Mobile-first, custom-coded websites built from scratch — not template dumps.",
    href: "/services/website-design-development",
    includes: ["UI/UX design", "Custom code", "Responsive pages", "Enquiry forms"],
  },
  {
    slug: "domain-hosting",
    title: "Domain & Hosting",
    short: "We buy the domain, set DNS, enable SSL, and host your site securely.",
    href: "/services/domain-hosting",
    includes: ["Domain purchase", "DNS setup", "SSL", "Secure hosting"],
  },
  {
    slug: "maintenance",
    title: "Maintenance / AMC",
    short: "Updates, backups, uptime checks, and small content edits after launch.",
    href: "/services/maintenance",
    includes: ["Backups", "Security updates", "Uptime monitoring", "Small edits"],
  },
  {
    slug: "whatsapp-leads",
    title: "WhatsApp & Lead Capture",
    short: "Click-to-call, WhatsApp buttons, and enquiry flows that convert visitors.",
    href: "/services/website-design-development",
    includes: ["WhatsApp CTA", "Prefilled messages", "Forms", "Click-to-call"],
  },
  {
    slug: "local-seo",
    title: "Local SEO Basics",
    short: "Setup that helps customers find you on Google and Maps.",
    href: "/services/website-design-development",
    includes: ["On-page SEO", "Google Business guidance", "Location pages", "Speed basics"],
  },
  {
    slug: "ai-chatbot",
    title: "AI Chatbot",
    short: "Optional chatbot for FAQs, timings, and lead capture — with WhatsApp handoff.",
    advanced: true,
    href: "/services/ai-chatbot",
    includes: ["FAQ answers", "Lead capture", "WhatsApp handoff", "Monthly care option"],
  },
  {
    slug: "ecommerce",
    title: "Ecommerce & Payments",
    short: "Catalog, cart, UPI/Razorpay, and COD-ready flows for local shops.",
    advanced: true,
    href: "/services/ecommerce",
    includes: ["Product catalog", "Razorpay/UPI", "COD options", "Order enquiries"],
  },
  {
    slug: "booking-forms",
    title: "Booking & Appointment Forms",
    short: "Table booking, room enquiry, or clinic appointment intent forms.",
    advanced: true,
    href: "/services/website-design-development",
    includes: ["Custom forms", "WhatsApp alerts", "Calendar-ready structure"],
  },
  {
    slug: "growth-support",
    title: "Ongoing Growth Support",
    short: "Seasonal banners, menu updates, and small improvements when you need them.",
    advanced: true,
    href: "/services/maintenance",
    includes: ["Content updates", "Seasonal changes", "Feature tweaks", "Performance checks"],
  },
];
