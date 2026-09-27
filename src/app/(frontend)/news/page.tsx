import { NewsIndexClient } from "@/components/news/NewsIndexClient";
import { getAllNews } from "@/lib/contentful/news";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = createMetadata({
  title: "News",
  description:
    "Guides, case notes, and studio updates from Nexora Sites — websites that sell for Karnataka & AP businesses.",
  path: "/news",
});

export default async function NewsIndexPage() {
  const posts = await getAllNews();

  return (
    <section className="relative overflow-x-clip bg-black py-10 text-white sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative">
        <NewsIndexClient posts={posts} />
      </div>
    </section>
  );
}
