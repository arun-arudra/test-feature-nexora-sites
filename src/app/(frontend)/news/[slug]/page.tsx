import { notFound } from "next/navigation";
import { NewsArticleView } from "@/components/news/NewsArticleView";
import { getAllNews, getNewsBySlug } from "@/lib/contentful/news";
import { createMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllNews();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  return createMetadata({
    title: item.title,
    description: item.excerpt.replace(/^["“]|["”]$/g, ""),
    path: `/news/${item.slug}`,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <section className="relative min-h-[70vh] overflow-x-clip bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-32 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
      />
      <NewsArticleView item={item} />
    </section>
  );
}
