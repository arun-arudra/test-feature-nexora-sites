import { V2HomePage } from "@/components/v2/V2HomePage";
import { getNewsSummaries } from "@/lib/contentful/news";
import { getProjectSummaries } from "@/lib/contentful/projects";
import { getPublishedTestimonials } from "@/lib/testimonials/queries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Get a website that sells while you sleep",
  description:
    "Logo, custom-coded website, domain, hosting, and AMC for Karnataka & AP businesses. Fixed price. Free quote in 24 hours.",
  path: "/",
});

/** Main homepage */
export default async function HomePage() {
  const [testimonials, news, projects] = await Promise.all([
    getPublishedTestimonials(),
    getNewsSummaries(8),
    getProjectSummaries(8),
  ]);

  return (
    <V2HomePage
      testimonials={testimonials}
      news={news}
      projects={projects}
    />
  );
}
