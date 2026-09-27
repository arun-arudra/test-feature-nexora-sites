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
  console.time("getPublishedTestimonials");
  const pTestimonials = getPublishedTestimonials().finally(() => console.timeEnd("getPublishedTestimonials"));
  console.time("getNewsSummaries");
  const pNews = getNewsSummaries(8).finally(() => console.timeEnd("getNewsSummaries"));
  console.time("getProjectSummaries");
  const pProjects = getProjectSummaries(8).finally(() => console.timeEnd("getProjectSummaries"));

  const [testimonials, news, projects] = await Promise.all([pTestimonials, pNews, pProjects]);

  return (
    <V2HomePage
      testimonials={testimonials}
      news={news}
      projects={projects}
    />
  );
}
