import type { Document } from "@contentful/rich-text-types";
import { portfolio } from "@/config/portfolio";
import { getContentfulProjectsEnv } from "@/lib/contentful/projects-env";
import type { ProjectBlock, ProjectStat, WorkProject } from "@/types/project";

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
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
    contentType?: { sys?: { id?: string } };
  };
  fields: Record<string, unknown>;
};

type CfCollection = {
  items?: CfEntry[];
  includes?: { Asset?: CfAsset[]; Entry?: CfEntry[] };
};

const ACCENTS = [
  "#FFF1E4",
  "#E8F4F2",
  "#EEF2FF",
  "#F3F7EA",
  "#FFF5EB",
  "#F8EEF5",
  "#EDE7F6",
  "#E3F2FD",
];

function localeValue<T>(v: unknown): T | undefined {
  if (v == null) return undefined;
  if (typeof v === "object" && !Array.isArray(v) && "en-US" in (v as object)) {
    return (v as Record<string, T>)["en-US"];
  }
  return v as T;
}

function assetUrl(
  link: unknown,
  assets: Record<string, CfAsset>,
): string | null {
  if (!link || typeof link !== "object") return null;
  const l = link as { sys?: { id?: string }; url?: string; fields?: CfAsset["fields"] };
  if (typeof l.url === "string") {
    return l.url.startsWith("//") ? `https:${l.url}` : l.url;
  }
  // Already resolved asset object
  if (l.fields?.file?.url) {
    const u = l.fields.file.url;
    return u.startsWith("//") ? `https:${u}` : u;
  }
  const id = l.sys?.id;
  if (id && assets[id]?.fields?.file?.url) {
    const u = assets[id].fields!.file!.url!;
    return u.startsWith("//") ? `https:${u}` : u;
  }
  return null;
}

function firstImage(
  field: unknown,
  assets: Record<string, CfAsset>,
): string | null {
  const v = localeValue(field) ?? field;
  if (Array.isArray(v)) {
    for (const item of v) {
      const u = assetUrl(item, assets);
      if (u) return u;
    }
    return null;
  }
  return assetUrl(v, assets);
}

function accentFor(slug: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i) * (i + 1)) % 997;
  return ACCENTS[(hash + index) % ACCENTS.length];
}

function asRichOrString(v: unknown): Document | string | null {
  const val = localeValue(v) ?? v;
  if (val == null) return null;
  if (typeof val === "string") return val;
  if (typeof val === "object" && val && "nodeType" in (val as object)) {
    return val as Document;
  }
  return null;
}

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    const embed = parts.indexOf("embed");
    if (embed >= 0 && parts[embed + 1]) return parts[embed + 1];
  } catch {
    /* ignore */
  }
  return null;
}

function mapStats(raw: unknown): ProjectStat[] {
  const v = localeValue(raw) ?? raw;
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const label = String(o.label ?? o.title ?? "").trim();
      const value = String(o.value ?? o.metric ?? "").trim();
      if (!label && !value) return null;
      return { label: label || "Result", value: value || "—" };
    })
    .filter(Boolean) as ProjectStat[];
}

function mapBlock(
  entry: CfEntry,
  assets: Record<string, CfAsset>,
): ProjectBlock | null {
  const type = entry.sys.contentType?.sys?.id || "unknown";
  const f = entry.fields;
  const id = entry.sys.id;

  if (type === "blockText") {
    return {
      id,
      type: "text",
      eyebrow: localeValue<string>(f.eyebrow) ? String(localeValue(f.eyebrow)) : undefined,
      heading: localeValue<string>(f.heading) ? String(localeValue(f.heading)) : undefined,
      body: asRichOrString(f.body),
    };
  }

  if (type === "blockImage") {
    const src = firstImage(f.image, assets);
    if (!src) return null;
    return {
      id,
      type: "image",
      src,
      caption: localeValue<string>(f.caption) ? String(localeValue(f.caption)) : undefined,
      wide: Boolean(localeValue(f.wide) ?? localeValue(f.fullBleed)),
    };
  }

  if (type === "blockGallery") {
    const raw = localeValue(f.image) ?? localeValue(f.images) ?? f.image ?? f.images;
    const images: string[] = [];
    if (Array.isArray(raw)) {
      for (const item of raw) {
        const u = assetUrl(item, assets);
        if (u) images.push(u);
      }
    }
    if (!images.length) return null;
    const cols = Number(localeValue(f.columns) ?? 3);
    return {
      id,
      type: "gallery",
      images,
      columns: Number.isFinite(cols) ? Math.min(4, Math.max(2, cols)) : 3,
    };
  }

  // Contentful type id "columns" is used as a quote block in this space
  if (type === "columns" || type === "blockQuote") {
    const quote = String(localeValue(f.quote) ?? "").trim();
    if (!quote) return null;
    return {
      id,
      type: "quote",
      quote,
      author: localeValue<string>(f.author) || localeValue<string>(f.attribution)
        ? String(localeValue(f.author) ?? localeValue(f.attribution))
        : undefined,
    };
  }

  if (type === "blockVideo") {
    const url = String(localeValue(f.url) ?? localeValue(f.videoUrl) ?? "").trim();
    if (!url) return null;
    return {
      id,
      type: "video",
      url,
      poster: firstImage(f.poster, assets),
    };
  }

  if (type === "blockStats") {
    const items = mapStats(f.items ?? f.stats);
    if (!items.length) return null;
    return {
      id,
      type: "stats",
      items,
      heading: localeValue<string>(f.heading) ? String(localeValue(f.heading)) : undefined,
    };
  }

  if (type === "blockTwoColumn") {
    return {
      id,
      type: "twoColumn",
      left: asRichOrString(f.left ?? f.body),
      right: asRichOrString(f.right),
      leftImage: firstImage(f.leftImage ?? f.image, assets),
      rightImage: firstImage(f.rightImage, assets),
    };
  }

  return null;
}

function mapProject(
  entry: CfEntry,
  assets: Record<string, CfAsset>,
  entries: Record<string, CfEntry>,
  index: number,
): WorkProject {
  const f = entry.fields;
  const title = String(localeValue(f.title) ?? "Untitled project");
  const slug = String(localeValue(f.slug) ?? entry.sys.id);
  const category = String(localeValue(f.category) ?? "Project");
  const excerpt = String(localeValue(f.excerpt) ?? "");
  const subtitle = String(localeValue(f.subtitle) ?? excerpt);
  const tagsRaw = localeValue<unknown>(f.tags);
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map(String)
    : category
      ? [category]
      : [];

  const image = firstImage(f.image, assets);
  const hoverImage = firstImage(f.hoverImage, assets);

  const sectionLinks = localeValue<unknown>(f.sections) ?? f.sections;
  const sections: ProjectBlock[] = [];
  if (Array.isArray(sectionLinks)) {
    for (const link of sectionLinks) {
      const id = (link as { sys?: { id?: string } })?.sys?.id;
      if (!id || !entries[id]) continue;
      const block = mapBlock(entries[id], assets);
      if (block) sections.push(block);
    }
  }

  return {
    id: entry.sys.id,
    slug,
    title,
    subtitle,
    category,
    industry: category,
    excerpt,
    blurb: excerpt || subtitle,
    image,
    hoverImage,
    videoUrl: null,
    accent: accentFor(slug, index),
    featured: Boolean(localeValue(f.featured)),
    order: Number(localeValue(f.order) ?? 9999),
    tags,
    overview: asRichOrString(f.overview),
    challenge: asRichOrString(f.challenge),
    sections,
  };
}

function sortProjects(items: WorkProject[]): WorkProject[] {
  return [...items].sort((a, b) => {
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fa !== fb) return fb - fa;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

async function fetchContentfulProjects(slug?: string): Promise<WorkProject[] | null> {
  const { spaceId, token, environment, isConfigured } = getContentfulProjectsEnv();
  if (!isConfigured) return null;

  const params = new URLSearchParams({
    content_type: "project",
    limit: "100",
    include: "3",
    access_token: token,
  });
  if (slug) params.set("fields.slug", slug);

  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?${params}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300, tags: ["contentful-projects"] },
    });
    if (!res.ok) {
      console.error("[contentful/projects]", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as CfCollection;
    const assets: Record<string, CfAsset> = {};
    for (const a of data.includes?.Asset ?? []) assets[a.sys.id] = a;
    const entries: Record<string, CfEntry> = {};
    for (const e of data.includes?.Entry ?? []) entries[e.sys.id] = e;

    return (data.items ?? []).map((e, i) => mapProject(e, assets, entries, i));
  } catch (err) {
    console.error("[contentful/projects] fetch failed", err);
    return null;
  }
}

function localPortfolioAsProjects(): WorkProject[] {
  return portfolio.map((p, i) => ({
    id: p.id,
    slug: p.id,
    title: p.title,
    subtitle: p.blurb,
    category: p.category,
    industry: p.industry,
    excerpt: p.blurb,
    blurb: p.blurb,
    image: null,
    hoverImage: null,
    videoUrl: p.videoDesktop,
    accent: p.accent,
    featured: true,
    order: i + 1,
    tags: p.category.split("·").map((t) => t.trim()).filter(Boolean),
    overview: p.blurb,
    challenge: p.outcome,
    sections: [],
    metric: p.metric,
    outcome: p.outcome,
    videoDesktop: p.videoDesktop,
    videoMobile: p.videoMobile,
  }));
}

/** All projects — Contentful when available, else local portfolio fallback */
export async function getAllProjects(): Promise<WorkProject[]> {
  const remote = await fetchContentfulProjects();
  if (remote && remote.length > 0) return sortProjects(remote);
  return localPortfolioAsProjects();
}

export async function getProjectBySlug(slug: string): Promise<WorkProject | null> {
  const remote = await fetchContentfulProjects(slug);
  if (remote && remote[0]) return remote[0];
  return localPortfolioAsProjects().find((p) => p.slug === slug || p.id === slug) ?? null;
}

export async function getProjectSummaries(limit = 8): Promise<WorkProject[]> {
  const all = await getAllProjects();
  return all.slice(0, limit);
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const id = youtubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
