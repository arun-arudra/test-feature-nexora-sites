"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { NewsItem } from "@/config/news";
import { cn } from "@/lib/utils";

const PER_PAGE = Math.max(1, Number(process.env.NEXT_PUBLIC_NEWS_PER_PAGE) || 9);

type AdvancedFilters = {
  exact: string;
  has: string;
  exclude: string;
  date: "any" | "24h" | "week" | "month" | "year";
};

const emptyFilters: AdvancedFilters = {
  exact: "",
  has: "",
  exclude: "",
  date: "any",
};

function formatDate(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function withinDate(iso: string, range: AdvancedFilters["date"]) {
  if (range === "any") return true;
  const now = Date.now();
  const diff = now - new Date(iso).getTime();
  const day = 86400000;
  if (range === "24h") return diff <= day;
  if (range === "week") return diff <= 7 * day;
  if (range === "month") return diff <= 30 * day;
  if (range === "year") return diff <= 365 * day;
  return true;
}

/**
 * Arun News.tsx structure — Nexora colors / fonts / tokens.
 */
export function NewsIndexClient({ posts }: { posts: NewsItem[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts],
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AdvancedFilters>(emptyFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const exact = filters.exact.trim().toLowerCase();
    const has = filters.has.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const exclude = filters.exclude
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return posts.filter((post) => {
      if (activeCategory !== "All" && post.category !== activeCategory)
        return false;
      const hay = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (exact && !hay.includes(exact)) return false;
      if (has.length && !has.every((w) => hay.includes(w))) return false;
      if (exclude.length && exclude.some((w) => hay.includes(w))) return false;
      if (!withinDate(post.publishedAt, filters.date)) return false;
      return true;
    });
  }, [posts, activeCategory, searchQuery, filters]);

  const featuredPost = posts.find((p) => p.featured) ?? posts[0];
  const popularPosts = posts.slice(0, 3);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filteredPosts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const resetFilters = () => {
    setFilters(emptyFilters);
    setSearchQuery("");
    setActiveCategory("All");
    setPage(1);
  };

  const activeFilterCount =
    (filters.exact ? 1 : 0) +
    (filters.has ? 1 : 0) +
    (filters.exclude ? 1 : 0) +
    (filters.date !== "any" ? 1 : 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="transition hover:text-text">
          Home
        </Link>
        <span>/</span>
        <span className="text-text">News</span>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <h1 className="font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-tight text-text">
          News
        </h1>
        <p className="max-w-md text-sm text-muted sm:text-base">
          Insights, updates, and stories from the studio — for Karnataka &amp; AP
          businesses.
        </p>
      </div>

      {featuredPost ? (
        <div className="mt-12 grid gap-8 lg:mb-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-xl font-semibold text-text">Featured</h2>
            <Link
              href={featuredPost.href}
              className="group relative block aspect-[16/10] overflow-hidden rounded-[12px]"
            >
              <Image
                src={featuredPost.image}
                alt=""
                fill
                sizes="(max-width:1024px) 100vw, 66vw"
                className="object-cover transition duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="mb-3 inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white">
                  {featuredPost.category}
                </span>
                <p className="mb-2 text-sm text-white/70">
                  {formatDate(featuredPost.publishedAt)}
                </p>
                <h3 className="font-heading text-2xl font-bold text-white transition group-hover:text-accent md:text-3xl">
                  {featuredPost.title}
                </h3>
              </div>
            </Link>
          </div>
          <div>
            <h2 className="mb-6 text-xl font-semibold text-primary">Popular</h2>
            <div className="space-y-4">
              {popularPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={post.href}
                  className={cn(
                    "block rounded-[12px] p-5 transition duration-300",
                    index === 0
                      ? "bg-primary text-white"
                      : "border border-border bg-surface hover:border-primary/40",
                  )}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-xs",
                        index === 0 ? "text-white/70" : "text-muted",
                      )}
                    >
                      {formatDate(post.publishedAt)}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        index === 0
                          ? "bg-white/15 text-white"
                          : "bg-surface-muted text-muted",
                      )}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h4
                    className={cn(
                      "font-semibold leading-snug",
                      index === 0 ? "text-white" : "text-text",
                    )}
                  >
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="relative mb-12 mt-12">
        <div className="flex flex-col items-stretch gap-4 rounded-[12px] border border-border bg-surface p-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition",
              showAdvanced || activeFilterCount > 0
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-text",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          <div className="flex flex-1 flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition",
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "text-muted hover:text-text",
                )}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 sm:w-56"
            />
          </div>
        </div>

        {showAdvanced ? (
          <div className="mt-3 rounded-[12px] border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-text">
                Narrow your search results
              </p>
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="text-muted hover:text-text"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["exact", "Exact phrase"],
                  ["has", "Has words"],
                  ["exclude", "Exclude words"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="text-xs text-muted">
                  {label}
                  <input
                    type="text"
                    value={filters[key]}
                    onChange={(e) => {
                      setFilters({ ...filters, [key]: e.target.value });
                      setPage(1);
                    }}
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </label>
              ))}
              <label className="text-xs text-muted">
                Date
                <select
                  value={filters.date}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      date: e.target.value as AdvancedFilters["date"],
                    });
                    setPage(1);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="any">Any time</option>
                  <option value="24h">Past 24 hours</option>
                  <option value="week">Past week</option>
                  <option value="month">Past month</option>
                  <option value="year">Past year</option>
                </select>
              </label>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-text">All News</h2>
          <p className="text-sm text-muted">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "result" : "results"}
          </p>
        </div>

        {paged.length === 0 ? (
          <div className="py-16 text-center text-muted">
            No posts match your filters.{" "}
            <button
              type="button"
              onClick={resetFilters}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paged.map((post) => (
              <Link key={post.id} href={post.href} className="group">
                <article className="flex h-full flex-col">
                  <div className="relative mb-4 aspect-video overflow-hidden rounded-[12px]">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-xs text-muted">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-text transition group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 flex-1 text-sm text-muted">
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 ? (
        <nav
          className="mb-8 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-border p-2 text-muted transition hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={cn(
                  "min-w-9 h-9 rounded-lg px-3 text-sm font-medium transition",
                  n === currentPage
                    ? "bg-primary text-white"
                    : "border border-border text-muted hover:text-text",
                )}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-border p-2 text-muted transition hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
