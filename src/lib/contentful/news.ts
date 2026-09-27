import { newsItems, type NewsItem } from "@/config/news";
import { getContentfulNewsEnv } from "@/lib/contentful/env";

type CfAsset = {
  sys: { id: string };
  fields?: {
    title?: string;
    file?: {
      url?: string;
      details?: { image?: { width?: number; height?: number } };
    };
  };
};

type CfEntry = {
  sys: { id: string; createdAt: string; updatedAt: string };
  fields: Record<string, unknown>;
};

type CfCollection = {
  items?: CfEntry[];
  includes?: { Asset?: CfAsset[] };
};

function assetUrl(
  link: unknown,
  assets: Record<string, CfAsset>,
): string | null {
  if (!link || typeof link !== "object") return null;
  const l = link as { sys?: { id?: string; linkType?: string }; url?: string };
  if (typeof l.url === "string") {
    return l.url.startsWith("//") ? `https:${l.url}` : l.url;
  }
  if (l.sys?.id && assets[l.sys.id]?.fields?.file?.url) {
    const u = assets[l.sys.id].fields!.file!.url!;
    return u.startsWith("//") ? `https:${u}` : u;
  }
  return null;
}

function localeValue<T>(v: unknown): T | undefined {
  if (v == null) return undefined;
  if (typeof v === "object" && !Array.isArray(v) && "en-US" in (v as object)) {
    return (v as Record<string, T>)["en-US"];
  }
  return v as T;
}

function estimateReadTime(text: string): string {
  const stripped = text.replace(/<[^>]+>/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min`;
}

function mapEntry(entry: CfEntry, assets: Record<string, CfAsset>): NewsItem {
  const f = entry.fields;
  const title = String(localeValue(f.title) ?? "Untitled");
  const slug = String(localeValue(f.slug) ?? entry.sys.id);
  const category = String(localeValue(f.category) ?? "News");
  const excerpt = String(localeValue(f.excerpt) ?? "");
  const tagsRaw = localeValue<unknown>(f.tags);
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map(String)
    : typeof tagsRaw === "string"
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const cover = localeValue(f.coverImage) ?? localeValue(f.image);
  const image =
    assetUrl(cover, assets) ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80";

  const published =
    String(
      localeValue(f.publishedDate) ??
        localeValue(f.publishedAt) ??
        entry.sys.createdAt,
    ).slice(0, 10) || entry.sys.createdAt.slice(0, 10);

  const body = localeValue(f.body);
  let bodyHtml: string | undefined;
  let bodyText: string | undefined;
  if (typeof body === "string") {
    if (/^\s*</.test(body)) bodyHtml = body;
    else bodyText = body;
  } else if (body && typeof body === "object") {
    // Rich text document — stringify lightly for now; HTML preferred from n8n
    bodyText = JSON.stringify(body);
  }

  const roleBits = [category, published].filter(Boolean);
  const duration =
    typeof localeValue(f.readTime) === "string"
      ? String(localeValue(f.readTime))
      : estimateReadTime(bodyHtml || bodyText || excerpt);

  return {
    id: entry.sys.id,
    slug,
    title,
    excerpt,
    image,
    href: `/news/${slug}`,
    category,
    publishedAt: published,
    role: roleBits.join(" · "),
    duration,
    tags,
    featured: Boolean(localeValue(f.featured)),
    bodyHtml,
    bodyText,
  };
}

async function fetchContentfulNews(slug?: string): Promise<NewsItem[] | null> {
  const { spaceId, token, environment, isConfigured } = getContentfulNewsEnv();
  if (!isConfigured) return null;

  const params = new URLSearchParams({
    content_type: "news",
    limit: "100",
    include: "2",
    access_token: token,
    order: "-sys.updatedAt",
  });
  if (slug) params.set("fields.slug", slug);

  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?${params}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300, tags: ["contentful-news"] },
    });
    if (!res.ok) {
      console.error("[contentful/news]", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as CfCollection;
    const assets: Record<string, CfAsset> = {};
    for (const a of data.includes?.Asset ?? []) assets[a.sys.id] = a;
    return (data.items ?? []).map((e) => mapEntry(e, assets));
  } catch (err) {
    console.error("[contentful/news] fetch failed", err);
    return null;
  }
}

/** All news for list / carousel — Contentful when configured, else local fallback */
export async function getAllNews(): Promise<NewsItem[]> {
  const remote = await fetchContentfulNews();
  if (remote && remote.length > 0) {
    return [...remote].sort((a, b) => {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  }
  return newsItems;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const remote = await fetchContentfulNews(slug);
  if (remote && remote[0]) return remote[0];
  return newsItems.find((n) => n.slug === slug || n.id === slug) ?? null;
}

export async function getNewsSummaries(limit = 8): Promise<NewsItem[]> {
  const all = await getAllNews();
  return all.slice(0, limit);
}
