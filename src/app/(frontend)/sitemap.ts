import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/services",
    "/services/logo-branding",
    "/services/website-design-development",
    "/services/domain-hosting",
    "/services/maintenance",
    "/services/ai-chatbot",
    "/services/ecommerce",
    "/industries",
    "/industries/restaurants",
    "/industries/hotels-resorts",
    "/industries/hospitals-clinics",
    "/industries/cloud-kitchens",
    "/industries/shops-ecommerce",
    "/industries/villas-homestays",
    "/industries/education",
    "/industries/real-estate",
    "/industries/beauty",
    "/industries/finance",
    "/work",
    "/pricing",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return paths.map((path) => ({
    url: `${siteConfig.url}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}