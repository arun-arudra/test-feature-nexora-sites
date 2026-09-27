export const siteConfig = {
  brandName: "Nexora Sites",
  shortName: "Nexora",
  tagline: "Get a website that sells while you sleep",
  description:
    "Bangalore-based studio for Karnataka & Andhra businesses. Logo, custom-coded website, domain, hosting, and maintenance — built to get you more customers.",
  url: "https://nexorasites.com", // TODO_REPLACE
  location: "Bangalore, Karnataka, India",
  /** Street-level address for trust (update when you have a final office) */
  address: "Bangalore, Karnataka", // TODO_REPLACE e.g. "HSR Layout, Bangalore 560102"
  mapsUrl: "https://maps.google.com/?q=Bangalore,Karnataka,India", // TODO_REPLACE
  serviceAreas: ["Karnataka", "Andhra Pradesh", "Nearby cities"],
  phone: "+91 9XXXXXXXXX", // TODO_REPLACE
  phoneHref: "tel:+919XXXXXXXXX", // TODO_REPLACE
  whatsapp: "919XXXXXXXXX", // TODO_REPLACE digits only for wa.me
  email: "hello@nexorasites.com", // TODO_REPLACE
  chatbotEnabled: true,
  responseTime: "Usually replies within a few hours on business days",
  social: {
    instagram: "", // TODO_REPLACE
    linkedin: "", // TODO_REPLACE
  },
} as const;

export function getWhatsAppLink(message?: string) {
  const text =
    message ??
    "Hi, I want a website for my business. Please guide me.";
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}
