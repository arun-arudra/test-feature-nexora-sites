"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  getWorkShowcaseColumns,
  getWorkShowcaseMaxProjects,
} from "@/config/work-showcase";
import type { WorkProject } from "@/types/project";
import { cn } from "@/lib/utils";

const GAP_PX = 28;
const DRAG_THRESHOLD = 10;

export function HomeCaseStudies({
  projects = [],
  tone = "dark",
}: {
  projects?: WorkProject[];
  /** `light` = gray/white band; `dark` = black band */
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  const columns = getWorkShowcaseColumns();
  const maxProjects = getWorkShowcaseMaxProjects();
  const items = projects.slice(0, maxProjects);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const dragRef = useRef({
    active: false,
    dragging: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: -1,
  });

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const styles = getComputedStyle(scroller);
    const padL = parseFloat(styles.paddingLeft) || 0;
    const padR = parseFloat(styles.paddingRight) || 0;
    const inner = scroller.clientWidth - padL - padR;
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const isTablet = window.matchMedia("(max-width: 1023px)").matches;
    const visibleColumns = isMobile ? 1 : isTablet ? Math.min(2, columns) : columns;
    const peek = isMobile ? inner * 0.12 : 0;
    const width = Math.max(
      isMobile ? 260 : 200,
      (inner - peek - GAP_PX * (visibleColumns - 1)) / visibleColumns,
    );
    setCardWidth(width);
  }, [columns]);

  const syncArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    measure();
    syncArrows();
    const el = scrollerRef.current;
    const ro = new ResizeObserver(() => {
      measure();
      syncArrows();
    });
    if (el) ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, syncArrows, items.length]);

  const scrollByCard = useCallback(
    (dir: -1 | 1) => {
      const el = scrollerRef.current;
      if (!el || cardWidth <= 0) return;
      el.scrollBy({ left: dir * (cardWidth + GAP_PX), behavior: "smooth" });
    },
    [cardWidth],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
  };

  // Mouse-only drag. Touch uses native overflow scroll so taps reach Links.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.pointerType === "touch") return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      dragging: false,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - d.startX;
    if (!d.dragging && Math.abs(dx) > DRAG_THRESHOLD) {
      d.dragging = true;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (d.dragging) {
      el.scrollLeft = d.scrollLeft - dx;
    }
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const wasDragging = d.dragging;
    d.active = false;
    d.dragging = false;
    const el = scrollerRef.current;
    if (el && d.pointerId === e.pointerId) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }
    // Keep flag briefly so the synthetic click after a drag is cancelled
    if (wasDragging) {
      dragRef.current.dragging = true;
      requestAnimationFrame(() => {
        dragRef.current.dragging = false;
      });
    }
  };

  const cardStyle =
    cardWidth > 0
      ? ({ "--work-card-w": `${cardWidth}px` } as CSSProperties)
      : undefined;

  const cardClass =
    "group shrink-0 snap-start w-[min(20rem,calc(100vw-3rem))] sm:w-[var(--work-card-w,50%)] sm:min-w-[var(--work-card-w,50%)]";

  if (!items.length) return null;

  return (
    <section
      id="work"
      tabIndex={0}
      aria-labelledby="home-case-studies-title"
      onKeyDown={onKeyDown}
      className={cn(
        "relative scroll-mt-20 overflow-hidden py-16 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:py-20",
        isLight ? "v2-light" : "bg-black text-white",
      )}
    >
      {!isLight ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
          />
        </>
      ) : null}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm",
                isLight ? "text-[var(--color-light-text)]" : "text-white/90",
              )}
            >
              <span className={isLight ? "text-primary" : "text-accent"}>
                [
              </span>{" "}
              Work{" "}
              <span className={isLight ? "text-primary" : "text-accent"}>
                ]
              </span>
            </p>
            <h2
              id="home-case-studies-title"
              className={cn(
                "mt-3 font-heading text-[clamp(2rem,4vw,3.25rem)] tracking-tight",
                isLight
                  ? "text-[var(--color-light-text)]"
                  : "text-white",
              )}
            >
              Selected projects
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2 pb-1">
            <button
              type="button"
              aria-label="Previous projects"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
                isLight ? "border-black/15" : "border-border",
                canPrev
                  ? isLight
                    ? "text-[var(--color-light-text)] hover:border-primary hover:text-primary"
                    : "text-text hover:border-primary hover:text-primary"
                  : "cursor-not-allowed opacity-35",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next projects"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
                isLight ? "border-black/15" : "border-border",
                canNext
                  ? isLight
                    ? "text-[var(--color-light-text)] hover:border-primary hover:text-primary"
                    : "text-text hover:border-primary hover:text-primary"
                  : "cursor-not-allowed opacity-35",
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={syncArrows}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "relative mt-10 flex touch-pan-x overflow-x-auto overflow-y-hidden pb-2",
          "pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8",
          "scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8",
          "mx-auto max-w-7xl",
          "snap-x snap-mandatory",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "cursor-grab active:cursor-grabbing",
        )}
        style={{ gap: GAP_PX }}
      >
        {items.map((project) => {
          const blurb = project.blurb || project.subtitle || project.excerpt;
          return (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              draggable={false}
              onClick={(e) => {
                if (dragRef.current.dragging) {
                  e.preventDefault();
                }
              }}
              className={cardClass}
              style={cardStyle}
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem]"
                style={{ background: project.accent }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(145deg, ${project.accent} 0%, ${project.accent}cc 45%, rgba(0,0,0,0.25) 100%)`,
                  }}
                />
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : project.videoDesktop || project.videoUrl ? (
                  <video
                    src={project.videoDesktop || project.videoUrl || undefined}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute bottom-4 left-4 font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-[-0.05em] text-white/30"
                  >
                    {project.title.slice(0, 1)}
                  </span>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              <div className="mt-4 space-y-1.5 px-0.5">
                <h3
                  className={cn(
                    "font-heading text-lg font-semibold leading-snug tracking-tight line-clamp-2 sm:text-xl",
                    isLight
                      ? "text-[var(--color-light-text)]"
                      : "text-text",
                  )}
                >
                  {project.title}
                </h3>
                {blurb ? (
                  <p
                    className={cn(
                      "text-sm leading-snug line-clamp-2",
                      isLight
                        ? "text-[var(--color-light-muted)]"
                        : "text-muted",
                    )}
                  >
                    {blurb}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}

        {/* Final card — View all (same footprint as project cards) */}
        <Link
          href="/work"
          draggable={false}
          onClick={(e) => {
            if (dragRef.current.dragging) e.preventDefault();
          }}
          className={cardClass}
          style={cardStyle}
          aria-label="View all projects"
        >
          <div className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-border bg-surface p-6 transition group-hover:border-primary/50 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(70,0,187,0.35),transparent_55%)]"
            />
            <span className="relative text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Portfolio
            </span>
            <div className="relative">
              <p className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                View all
                <br />
                projects
              </p>
              <span className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </div>
          {/* Spacer matches project title+blurb height so carousel row stays even */}
          <div className="mt-4 h-[3.75rem] sm:h-[4.25rem]" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
