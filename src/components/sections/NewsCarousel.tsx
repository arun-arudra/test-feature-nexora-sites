"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { newsItems, type NewsItem } from "@/config/news";
import { cn } from "@/lib/utils";

/**
 * Premier-style news / story carousel:
 * ink band, neon underline under titles, ambient neon dots, glass CTAs.
 */
export function NewsCarousel({ items }: { items?: NewsItem[] }) {
  const list = items?.length ? items : newsItems;
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-news-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.75;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section
      id="news"
      aria-labelledby="news-heading"
      className="band-ink relative overflow-hidden py-14 sm:py-16 md:py-20"
    >
      {/* Ambient neon dots — Premier blurred-violet-dot pattern */}
      <div
        aria-hidden
        className="neon-dot neon-dot-strong -left-24 top-10 h-72 w-72 opacity-70"
      />
      <div
        aria-hidden
        className="neon-dot right-0 top-1/3 h-80 w-80 translate-x-1/3 opacity-50"
      />
      <div
        aria-hidden
        className="neon-dot bottom-0 left-1/3 h-56 w-56 opacity-40"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-neon">
              <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[var(--glow-neon)]" />
              News & notes
            </p>
            <h2
              id="news-heading"
              className="font-heading text-2xl font-bold text-dark-text sm:text-3xl md:text-4xl"
            >
              Stories from the studio
            </h2>
            <span className="neon-line mt-4" aria-hidden />
          </div>

          <Link
            href="/news"
            className="neon-glass inline-flex w-fit items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-semibold text-dark-text transition"
          >
            View all news
          </Link>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        >
          {list.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous stories"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink-elevated text-dark-text transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next stories"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink-elevated text-dark-text transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      data-news-card
      href={item.href}
      className="group w-[min(88vw,380px)] shrink-0 snap-start sm:w-[400px]"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-ink-elevated ring-1 ring-white/10">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-primary-mid via-ink-elevated to-soft-dark"
        />
        <Image
          src={item.image}
          alt=""
          fill
          sizes="400px"
          unoptimized
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {item.category}
        </span>
        {item.duration ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {item.duration}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="font-heading text-lg font-bold text-dark-text sm:text-xl">
          {item.title}
        </p>
        <p className="mt-1 text-sm text-white/55">{item.role}</p>
        <span className="neon-line mt-3" aria-hidden />
        <p className="mt-4 text-[15px] leading-relaxed text-dark-text/90">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}
