"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial, TestimonialTone } from "@/types/testimonial";

/** Palette tuned for dark V2 (purple/black) while still readable on V1 cream */
const toneStyles: Record<
  TestimonialTone,
  { card: string; text: string; muted: string; avatar: string; hex: string }
> = {
  cream: {
    card: "border-transparent bg-[var(--color-light,#e4e7f2)]",
    text: "text-[var(--color-light-text,#0a0a0a)]",
    muted: "text-[var(--color-light-muted,#5c5c66)]",
    avatar: "bg-primary text-white",
    hex: "#e4e7f2",
  },
  amber: {
    card: "border-[#b9a3ef] bg-[#d4c4f7]",
    text: "text-[#1a0a3a]",
    muted: "text-[#4a3578]",
    avatar: "bg-[#1a0a3a] text-[#d4c4f7]",
    hex: "#d4c4f7",
  },
  teal: {
    card: "border-primary-mid bg-primary",
    text: "text-white",
    muted: "text-white/70",
    avatar: "bg-white/15 text-white",
    hex: "#4600bb",
  },
  sage: {
    card: "border-[#8f78d4] bg-[#a992e8]",
    text: "text-[#14082e]",
    muted: "text-[#3d2a6a]",
    avatar: "bg-[#14082e] text-[#a992e8]",
    hex: "#a992e8",
  },
  blush: {
    card: "border-[#e8b87a] bg-[#f5d0a9]",
    text: "text-[#2a1810]",
    muted: "text-[#6a4530]",
    avatar: "bg-[#2a1810] text-[#f5d0a9]",
    hex: "#f5d0a9",
  },
  ink: {
    card: "border-border bg-surface",
    text: "text-text",
    muted: "text-muted",
    avatar: "bg-primary text-white",
    hex: "#171717",
  },
};

const CARD_W = 296;
const CARD_GAP = 24;
const STRIDE = CARD_W + CARD_GAP;
const SPEED_PX_PER_MS = 0.045;

/**
 * Timing is driven by the CARDS strip (not the whole section):
 * - Expand: cards 50% → 90% visible → progress 0 → 1
 * - Hold open while mostly on screen
 * - Collapse: after cards top has left, 45% → 30% still visible → 1 → 0
 */
const EXPAND_START = 0.5;
const EXPAND_END = 0.9;
const COLLAPSE_START = 0.45;
const COLLAPSE_END = 0.3;

/** Marquee starts once fan is essentially open; stops only after a real collapse */
const MARQUEE_ON = 0.95;
const MARQUEE_OFF = 0.15;

function cardsFanProgress(rect: DOMRect, vh: number) {
  const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
  const ratio = rect.height > 0 ? visible / rect.height : 0;

  if (rect.top >= 0) {
    // Entering / sitting in view — expand between 50% and 90% card visibility
    return clamp01((ratio - EXPAND_START) / (EXPAND_END - EXPAND_START));
  }

  // Top has scrolled away — stay open until ~45% left, then collapse down to ~30%
  return clamp01((ratio - COLLAPSE_END) / (COLLAPSE_START - COLLAPSE_END));
}

const ALT_TONES: TestimonialTone[] = ["amber", "teal", "blush", "sage", "ink"];

function assignAlternatingTones(items: Testimonial[]): Testimonial[] {
  return items.map((item, i) => {
    if (i === 0) return { ...item, tone: "cream" as TestimonialTone };
    const tone = ALT_TONES[(i - 1) % ALT_TONES.length];
    return { ...item, tone };
  });
}

/** Peel order: bottom of stack first → … → top (white) last */
function dealOrderFromBottom(n: number): number[] {
  const order: number[] = [];
  for (let i = n - 1; i >= 0; i--) order.push(i);
  return order;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function wrapOffset(value: number, half: number) {
  if (half <= 0) return value;
  let next = value;
  while (next <= -half) next += half;
  while (next > 0) next -= half;
  return next;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

/**
 * Scroll-driven reviews deck — fan timing follows the cards strip:
 * expand 50%→80% visible, collapse when only ~10% remains after leaving.
 */
export function TestimonialsDeck({ items }: { items: Testimonial[] }) {
  const testimonials = items.length ? items : [];
  const [active, setActive] = useState<Testimonial | null>(null);
  const [progress, setProgress] = useState(0);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const titleId = useId();

  const colored = useMemo(() => assignAlternatingTones(testimonials), [testimonials]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(1);
      return;
    }

    const el = cardsRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const p = cardsFanProgress(el.getBoundingClientRect(), window.innerHeight);
      setProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  if (!colored.length) return null;

  const expanded = progress >= MARQUEE_ON;

  return (
    <section
      id="reviews"
      data-fan-progress={progress.toFixed(3)}
      className="relative overflow-x-clip bg-bg py-16 text-text sm:py-20"
    >
      {/* Soft primary glows — matches V2 violet, uses theme primary on V1 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-muted">
            <span className="text-accent">[</span> Reviews{" "}
            <span className="text-accent">]</span>
          </p>
          <h2
            id={titleId}
            className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] text-text"
          >
            From the people{" "}
            <span className="text-primary">who launched with us.</span>
          </h2>
          <p className="mt-3 text-sm font-light text-muted">
            {expanded
              ? "Drag to browse · Hover to pause · Click a card to read it."
              : "Scroll to reveal the reviews."}
          </p>
          <span className="neon-line mx-auto mt-5" aria-hidden />
        </div>
      </div>

      <div
        ref={cardsRef}
        className="relative z-10 mt-10 sm:mt-12"
        id="testimonials-marquee"
      >
        <ScrollFanMarquee
          items={colored}
          progress={reduceMotion ? 1 : progress}
          reduceMotion={!!reduceMotion}
          onSelect={setActive}
        />
      </div>

      <AnimatePresence>
        {active ? (
          <TestimonialModal item={active} onClose={() => setActive(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function ScrollFanMarquee({
  items,
  progress,
  reduceMotion,
  onSelect,
}: {
  items: Testimonial[];
  progress: number;
  reduceMotion: boolean;
  onSelect: (item: Testimonial) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef(0);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const pausedRef = useRef(false);
  const pauseArmedRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const movedRef = useRef(false);
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");
  const [viewportW, setViewportW] = useState(1280);
  const [marqueeOn, setMarqueeOn] = useState(false);

  const n = items.length;
  const order = useMemo(() => dealOrderFromBottom(n), [n]);
  const delayByIndex = useMemo(() => {
    const map = new Map<number, number>();
    const span = Math.max(0.35, 1 - 0.12);
    order.forEach((idx, step) => {
      map.set(idx, (step / Math.max(1, n - 1)) * (1 - span));
    });
    return map;
  }, [order, n]);

  const scrollOn = marqueeOn || reduceMotion;

  const applyTransform = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
  }, []);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.children.length < 2) return;
    const first = el.children[0] as HTMLElement;
    const w = first.offsetWidth;
    if (w > 0) halfRef.current = w;
  }, []);

  // Latch marquee on after fan opens; only drop after a real collapse
  useEffect(() => {
    if (reduceMotion) {
      setMarqueeOn(true);
      return;
    }
    if (progress >= MARQUEE_ON) setMarqueeOn(true);
    else if (progress <= MARQUEE_OFF) setMarqueeOn(false);
  }, [progress, reduceMotion]);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, items]);

  // Auto-scroll loop — re-measure, clear accidental hover-pause from scroll-under-cursor
  useEffect(() => {
    if (!marqueeOn || reduceMotion) {
      pauseArmedRef.current = false;
      pausedRef.current = false;
      return;
    }

    offsetRef.current = 0;
    applyTransform();
    measure();
    const measureAgain = requestAnimationFrame(() => {
      measure();
      applyTransform();
    });

    // Don't pause until the pointer intentionally enters after expand settles
    pausedRef.current = false;
    pauseArmedRef.current = false;
    const armPause = window.setTimeout(() => {
      pauseArmedRef.current = true;
    }, 500);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!draggingRef.current && !pausedRef.current) {
        if (halfRef.current <= 0) measure();
        offsetRef.current = wrapOffset(
          offsetRef.current - SPEED_PX_PER_MS * dt,
          halfRef.current,
        );
        applyTransform();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(measureAgain);
      cancelAnimationFrame(raf);
      window.clearTimeout(armPause);
    };
  }, [applyTransform, measure, marqueeOn, reduceMotion]);

  // Reset offset when fully collapsed
  useEffect(() => {
    if (progress > MARQUEE_OFF) return;
    offsetRef.current = 0;
    applyTransform();
  }, [progress, applyTransform]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !scrollOn) return;
    draggingRef.current = true;
    movedRef.current = false;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    setCursor("grabbing");
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 4) movedRef.current = true;
    offsetRef.current = wrapOffset(
      dragStartOffset.current + dx,
      halfRef.current,
    );
    applyTransform();
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setCursor("grab");
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const stackCenterX = viewportW / 2 - CARD_W / 2;
  const staggerSpan = Math.max(0.35, 1 - n * 0.04);

  return (
    <div
      className="group/marquee relative w-full overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      onMouseEnter={() => {
        if (pauseArmedRef.current && scrollOn) pausedRef.current = true;
      }}
      onMouseLeave={() => {
        if (!draggingRef.current) pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max touch-pan-y will-change-transform select-none"
        style={{ cursor: scrollOn ? cursor : "default" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0"
            style={{ gap: CARD_GAP, paddingRight: CARD_GAP }}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {items.map((item, i) => {
              const naturalX = i * STRIDE;
              const stackJitter = (i - (n - 1) / 2) * 5;
              const fromX = stackCenterX - naturalX + stackJitter;
              const fromRotate = (i - (n - 1) / 2) * 2.6;
              const fromY = Math.abs(i - (n - 1) / 2) * 3;
              const delay = delayByIndex.get(i) ?? 0;

              // Duplicate half stays in row (no fan)
              const skipFan = copy === 1 || reduceMotion;
              const local = skipFan
                ? 1
                : easeOutCubic(clamp01((progress - delay) / staggerSpan));

              const x = fromX * (1 - local);
              const y = fromY * (1 - local);
              const rotate = fromRotate * (1 - local);
              const scale = 0.96 + 0.04 * local;

              return (
                <button
                  key={`${copy}-${item.id}`}
                  type="button"
                  tabIndex={copy === 0 ? 0 : -1}
                  onClick={() => {
                    if (movedRef.current || local < 0.95) return;
                    onSelect(item);
                  }}
                  className="shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={`Read review from ${item.name}`}
                  style={{
                    width: CARD_W,
                    transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
                    zIndex: Math.round(10 + local * 10),
                    willChange: "transform",
                  }}
                >
                  <TestimonialCard item={item} />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const tone = toneStyles[item.tone];
  const initials = initialsOf(item.name);

  return (
    <article
      className={cn(
        "flex h-full min-h-[20rem] flex-col rounded-[12px] border p-6 text-left sm:min-h-[21.5rem] sm:p-7",
        tone.card,
      )}
    >
      <p
        className={cn(
          "flex-1 text-left text-[15px] leading-relaxed sm:text-base",
          tone.text,
        )}
      >
        “{item.quote}”
      </p>
      <div className="mt-8 flex items-center justify-start gap-3 text-left">
        {item.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.avatarUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              tone.avatar,
            )}
          >
            {initials}
          </span>
        )}
        <div className="min-w-0 text-left">
          <p className={cn("truncate text-left font-semibold", tone.text)}>
            {item.name}
          </p>
          <p className={cn("truncate text-left text-sm", tone.muted)}>{item.role}</p>
        </div>
      </div>
    </article>
  );
}

function TestimonialModal({
  item,
  onClose,
}: {
  item: Testimonial;
  onClose: () => void;
}) {
  const tone = toneStyles[item.tone];
  const initials = initialsOf(item.name);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Close review"
        className="absolute inset-0 z-0 bg-dark/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-modal-title"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative z-10 w-full max-w-xl rounded-[12px] border p-6 text-left sm:p-8",
          tone.card,
        )}
        style={{ boxShadow: "var(--shadow-dark)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/40 transition hover:bg-white/70",
            tone.text,
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <p
          id="testimonial-modal-title"
          className={cn(
            "pr-10 text-left font-heading text-xl leading-relaxed sm:text-2xl",
            tone.text,
          )}
        >
          “{item.quote}”
        </p>
        {(item.company || item.product) && (
          <p className={cn("mt-3 text-left text-sm", tone.muted)}>
            {[item.product, item.company].filter(Boolean).join(" · ")}
          </p>
        )}
        <div className="mt-8 flex items-center gap-3 text-left">
          {item.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <span
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold",
                tone.avatar,
              )}
            >
              {initials}
            </span>
          )}
          <div className="text-left">
            <p className={cn("text-left font-semibold", tone.text)}>{item.name}</p>
            <p className={cn("text-left text-sm", tone.muted)}>{item.role}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
