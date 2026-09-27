import type { Document } from "@contentful/rich-text-types";

export type ProjectStat = {
  label: string;
  value: string;
};

export type ProjectBlock =
  | {
      id: string;
      type: "text";
      eyebrow?: string;
      heading?: string;
      body?: Document | string | null;
    }
  | {
      id: string;
      type: "image";
      src: string;
      caption?: string;
      wide?: boolean;
    }
  | {
      id: string;
      type: "gallery";
      images: string[];
      columns?: number;
    }
  | {
      id: string;
      type: "quote";
      quote: string;
      author?: string;
    }
  | {
      id: string;
      type: "video";
      url: string;
      poster?: string | null;
    }
  | {
      id: string;
      type: "stats";
      items: ProjectStat[];
      heading?: string;
    }
  | {
      id: string;
      type: "twoColumn";
      left?: Document | string | null;
      right?: Document | string | null;
      leftImage?: string | null;
      rightImage?: string | null;
    };

export type WorkProject = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  /** Used for Work page filters — derived from category when CMS has no industry field */
  industry: string;
  excerpt: string;
  blurb: string;
  image: string | null;
  hoverImage: string | null;
  videoUrl: string | null;
  accent: string;
  featured: boolean;
  order: number;
  tags: string[];
  overview: Document | string | null;
  challenge: Document | string | null;
  sections: ProjectBlock[];
  /** Local-fallback metrics (optional) */
  metric?: string;
  outcome?: string;
  videoDesktop?: string;
  videoMobile?: string;
};
