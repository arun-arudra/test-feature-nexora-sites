"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/config/news";
import { getWhatsAppLink } from "@/config/site";
import { cn } from "@/lib/utils";

type TOC = { id: string; title: string; level: number };

function formatDate(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function markdownToHtml(md: string): string {
  if (!md || typeof md !== "string") return "";
  if (/^\s*<[a-zA-Z]/.test(md)) return md;
  let html = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(
    /((?:^[-*] .+\n?)+)/gm,
    (match: string) => {
      const items = match
        .trim()
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `<li>${l.replace(/^[-*]\s+/, "").trim()}</li>`)
        .join("");
      return `<ul>${items}</ul>\n`;
    },
  );
  const blocks = html.split(/\n\n+/);
  return blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (/^<(h[1-6]|ul|ol|blockquote|hr|div|p)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function tocFromHtml(html: string): TOC[] {
  const out: TOC[] = [];
  const matches = html.matchAll(/<h([23])[^>]*>(.*?)<\/h[23]>/gi);
  for (const m of matches) {
    const level = Number(m[1]);
    const title = m[2].replace(/<[^>]+>/g, "").trim();
    out.push({ id: slugify(title), title, level });
  }
  return out;
}

function tocFromMarkdown(md: string): TOC[] {
  const out: TOC[] = [];
  md.split("\n").forEach((line) => {
    if (line.startsWith("## ")) {
      const title = line.replace("## ", "").trim();
      out.push({ id: slugify(title), title, level: 2 });
    } else if (line.startsWith("### ")) {
      const title = line.replace("### ", "").trim();
      out.push({ id: slugify(title), title, level: 3 });
    }
  });
  return out;
}

function renderMarkdownLines(text: string): ReactNode[] {
  return text.split("\n").map((line, index) => {
    if (line.startsWith("## ")) {
      const title = line.replace("## ", "").trim();
      return (
        <h2
          key={index}
          id={slugify(title)}
          className="mt-14 scroll-mt-28 font-heading text-2xl font-bold text-text sm:text-3xl"
        >
          {title}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      const title = line.replace("### ", "").trim();
      return (
        <h3
          key={index}
          id={slugify(title)}
          className="mt-10 scroll-mt-28 font-heading text-xl font-semibold text-text"
        >
          {title}
        </h3>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={index} className="my-2 ml-6 list-disc text-muted">
          {line.replace("- ", "")}
        </li>
      );
    }
    if (line.trim()) {
      return (
        <p key={index} className="my-4 text-lg leading-relaxed text-muted">
          {line}
        </p>
      );
    }
    return null;
  });
}

/**
 * Arun ArticleDetail structure — Nexora theme tokens.
 */
export function NewsArticleView({ item }: { item: NewsItem }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("");
  const [toc, setToc] = useState<TOC[]>([]);

  const isHtml = Boolean(item.bodyHtml);
  const html =
    item.bodyHtml ||
    (item.bodyText && /^\s*</.test(item.bodyText)
      ? item.bodyText
      : item.bodyText
        ? markdownToHtml(item.bodyText)
        : "");

  useEffect(() => {
    if (isHtml || html) setToc(tocFromHtml(html));
    else if (item.bodyText) setToc(tocFromMarkdown(item.bodyText));
    else setToc([]);
  }, [html, isHtml, item.bodyText, item.id]);

  useEffect(() => {
    if (!contentRef.current || !html) return;
    contentRef.current.querySelectorAll("h2, h3").forEach((h) => {
      const title = h.textContent?.trim() || "";
      h.setAttribute("id", slugify(title));
    });
  }, [html]);

  useEffect(() => {
    const onScroll = () => {
      if (!contentRef.current) return;
      const headings = contentRef.current.querySelectorAll("h2, h3");
      const pos = window.scrollY + 150;
      let current = "";
      headings.forEach((h) => {
        const el = h as HTMLElement;
        if (el.offsetTop <= pos) current = el.id;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="transition hover:text-text">
          Home
        </Link>
        <span>/</span>
        <Link href="/news" className="transition hover:text-text">
          News
        </Link>
        <span>/</span>
        <span className="max-w-[240px] truncate text-text">{item.title}</span>
      </div>

      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {item.category}
          </span>
          <h1 className="font-heading text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-text">
            {item.title}
          </h1>
          {item.excerpt ? (
            <p className="mt-4 text-lg text-muted">{item.excerpt}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{formatDate(item.publishedAt)}</span>
            {item.duration ? (
              <>
                <span className="h-1 w-1 rounded-full bg-muted" />
                <span>{item.duration}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[12px]">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            {toc.length > 0 ? (
              <>
                <h4 className="mb-6 text-sm font-bold text-text">
                  In this article
                </h4>
                <nav className="space-y-1 border-l-2 border-border">
                  {toc.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => scrollToSection(t.id)}
                      className={cn(
                        "block w-full border-l-2 py-2 text-left text-sm transition -ml-0.5",
                        t.level === 3 ? "pl-8" : "pl-4",
                        activeSection === t.id
                          ? "border-primary font-medium text-primary"
                          : "border-transparent text-muted hover:border-muted hover:text-text",
                      )}
                    >
                      {t.title}
                    </button>
                  ))}
                </nav>
              </>
            ) : null}
          </div>
        </aside>

        <div className="lg:col-span-3">
          <article ref={contentRef}>
            {html ? (
              <div
                className="news-body space-y-4 text-lg leading-relaxed text-muted [&_a]:text-primary [&_a]:underline [&_h2]:mt-14 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text sm:[&_h2]:text-3xl [&_h3]:mt-10 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-text [&_img]:rounded-[12px] [&_li]:my-1 [&_ol]:ml-6 [&_ol]:list-decimal [&_strong]:text-text [&_ul]:ml-6 [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : item.bodyText ? (
              <div>{renderMarkdownLines(item.bodyText)}</div>
            ) : (
              <p className="text-lg leading-relaxed text-muted">{item.excerpt}</p>
            )}
          </article>

          <div className="mt-16 rounded-[12px] border border-border bg-surface p-8">
            <h4 className="font-heading text-lg font-bold text-text">
              Need a website that sells?
            </h4>
            <p className="mt-2 text-sm text-muted">
              Fixed price, free quote in 24 hours — for restaurants, clinics,
              shops &amp; homestays across Karnataka &amp; AP.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/#quote"
                className="inline-flex rounded-[10px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Get a free quote
              </Link>
              <a
                href={getWhatsAppLink(
                  `Hi, I read “${item.title}” and want a website.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-[10px] border border-border bg-bg px-5 py-2.5 text-sm font-medium text-text transition hover:border-primary/40"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          {item.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
              <span className="text-sm text-muted">Tags:</span>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-muted px-4 py-1.5 text-sm text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
