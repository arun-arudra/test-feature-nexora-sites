"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { portfolio, type PortfolioProject } from "@/config/portfolio";
import { Container, SectionHeading } from "@/components/ui/LayoutPrimitives";
import { cn } from "@/lib/utils";

const AUTO_MS = 9000;

export function PortfolioShowcase() {
  const projects = portfolio.slice(0, 6);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduceMotion = useReducedMotion();
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const tabletRef = useRef<HTMLVideoElement>(null);

  const active = projects[index] ?? projects[0];

  const syncVideos = useCallback(
    (mode: "restart" | "playpause") => {
      const videos = [desktopRef.current, mobileRef.current, tabletRef.current];
      for (const video of videos) {
        if (!video) continue;
        if (mode === "restart") video.currentTime = 0;
        if (playing) video.play().catch(() => undefined);
        else video.pause();
      }
    },
    [playing],
  );

  const goTo = useCallback(
    (next: number) => {
      const len = projects.length;
      setIndex(((next % len) + len) % len);
    },
    [projects.length],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!playing || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % projects.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [playing, projects.length, reduceMotion]);

  useEffect(() => {
    syncVideos("restart");
  }, [index, syncVideos]);

  useEffect(() => {
    syncVideos("playpause");
  }, [playing, syncVideos]);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Work"
          title="Real websites we designed & shipped"
          description="Desktop, tablet, and mobile. Every site is built to go live for a real business — and load fast."
        />

        <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-b from-surface-muted to-[#e4ddd2] shadow-[var(--shadow-card-hover)] ring-1 ring-primary/10 sm:mt-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(ellipse 90% 70% at 50% 55%, ${active.accent}, transparent 70%)`,
            }}
          />

          {/* Full-bleed device row — tablet hidden on small screens */}
          <div className="relative px-3 pt-6 sm:px-5 sm:pt-8 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="relative flex w-full items-end justify-center"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-[5%] right-[5%] h-6 rounded-[100%] bg-black/20 blur-2xl"
                />

                {/* Phone — desktop only to avoid tablet crush */}
                <div className="relative z-30 hidden w-[15%] max-w-[170px] shrink-0 origin-bottom -rotate-[8deg] self-end lg:block">
                  <PhoneFrame>
                    <DeviceScreen
                      videoRef={mobileRef}
                      src={active.videoMobile}
                      title={active.title}
                      accent={active.accent}
                      compact
                    />
                  </PhoneFrame>
                </div>

                {/* Laptop — always visible */}
                <div className="relative z-10 w-full min-w-0 flex-[1.35] self-end lg:-mx-[4%]">
                  <LaptopFrame>
                    <DeviceScreen
                      videoRef={desktopRef}
                      src={active.videoDesktop}
                      title={active.title}
                      accent={active.accent}
                    />
                  </LaptopFrame>
                </div>

                {/* Tablet — large screens only */}
                <div className="relative z-20 hidden w-[22%] max-w-[250px] shrink-0 self-end xl:block">
                  <TabletFrame>
                    <DeviceScreen
                      videoRef={tabletRef}
                      src={active.videoTablet}
                      title={active.title}
                      accent={active.accent}
                      compact
                    />
                  </TabletFrame>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-primary/5 bg-surface/85 px-4 py-3 backdrop-blur-md sm:mt-6 sm:px-6">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">
                {active.category}
              </p>
              <p className="truncate font-heading text-base font-bold text-text sm:text-xl">
                {active.title}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-primary sm:text-sm">
                {active.metric}
                <span className="hidden font-normal text-muted sm:inline"> · {active.outcome}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <ControlButton label="Previous project" onClick={prev}>
                <ChevronLeft className="h-4 w-4" />
              </ControlButton>
              <ControlButton
                label={playing ? "Pause slideshow" : "Play slideshow"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </ControlButton>
              <ControlButton label="Next project" onClick={next}>
                <ChevronRight className="h-4 w-4" />
              </ControlButton>
            </div>
          </div>

          {playing && !reduceMotion ? (
            <motion.div
              key={`progress-${active.id}-${index}`}
              className="absolute bottom-0 left-0 h-[3px] origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
              style={{ width: "100%" }}
            />
          ) : null}
        </div>

        <div className="-mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
          {projects.map((project, i) => (
            <Thumbnail
              key={project.id}
              project={project}
              active={i === index}
              onClick={() => {
                setIndex(i);
                setPlaying(true);
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ControlButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm transition hover:border-primary/30 hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
    >
      {children}
    </button>
  );
}

function Thumbnail({
  project,
  active,
  onClick,
}: {
  project: PortfolioProject;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${project.title}`}
      aria-pressed={active}
      className={cn(
        "relative min-w-[8.25rem] flex-1 snap-start overflow-hidden rounded-xl border-2 p-2 transition duration-200 sm:min-w-0",
        active
          ? "border-accent bg-surface shadow-sm"
          : "border-transparent bg-surface-muted/80 opacity-85 hover:border-primary/20 hover:opacity-100",
      )}
    >
      <div
        className="h-12 overflow-hidden rounded-md"
        style={{ background: `linear-gradient(135deg, ${project.accent}, #ddd)` }}
      >
        <video
          src={project.videoDesktop}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="mt-2 truncate text-left text-[11px] font-semibold text-text">
        {project.title}
      </p>
    </button>
  );
}

/** Always shows a site mock under the video so screens are never blank */
function DeviceScreen({
  videoRef,
  src,
  title,
  accent,
  compact,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  src: string;
  title: string;
  accent: string;
  compact?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b0f14]">
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          background: `linear-gradient(165deg, ${accent} 0%, #f7f4ef 45%, #e8e0d4 100%)`,
        }}
      >
        <div
          className={cn(
            "flex items-center justify-between bg-primary text-white",
            compact ? "px-2 py-1.5" : "px-3 py-2",
          )}
        >
          <span className={cn("font-heading font-bold", compact ? "text-[7px]" : "text-[10px]")}>
            {title}
          </span>
          <span className={cn("rounded-full bg-accent", compact ? "h-1 w-5" : "h-1.5 w-8")} />
        </div>
        <div className={cn("flex-1", compact ? "space-y-1 p-1.5" : "space-y-2 p-3")}>
          <div className={cn("rounded bg-white/85", compact ? "h-6" : "h-10")} />
          <div className="grid grid-cols-2 gap-1">
            <div className={cn("rounded bg-white/70", compact ? "h-8" : "h-14")} />
            <div className={cn("rounded bg-white/70", compact ? "h-8" : "h-14")} />
          </div>
          <div className={cn("rounded bg-primary/20", compact ? "h-3" : "h-5")} />
        </div>
      </div>
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
      />
    </div>
  );
};

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      <div className="rounded-t-[10px] border border-b-0 border-[#c8ccd1] bg-gradient-to-b from-[#e2e5e9] to-[#b9bec5] p-[6px] pb-0 shadow-[0_18px_40px_rgba(0,0,0,0.2)] sm:rounded-t-[12px] sm:p-[8px] sm:pb-0">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[6px] bg-black">
          {children}
          <span className="pointer-events-none absolute left-1/2 top-1 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-[#333] sm:h-1.5 sm:w-1.5" />
        </div>
      </div>
      <div className="relative -mx-[3%] h-2 rounded-b-[3px] bg-gradient-to-b from-[#d0d4d9] to-[#a8adb4] sm:h-2.5">
        <div className="absolute left-1/2 top-0 h-0.5 w-[16%] -translate-x-1/2 rounded-b-sm bg-[#9398a0]" />
      </div>
      <div className="mx-[-7%] h-[3px] rounded-b-md bg-gradient-to-b from-[#9aa0a8] to-[#7d828a]" />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative aspect-[9/19.5] w-full"
      style={{ filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.3))" }}
    >
      <span className="absolute -left-[2px] top-[18%] z-20 h-[5%] w-[2px] rounded-l-[1px] bg-[#d4d4d6]" />
      <span className="absolute -left-[2px] top-[26%] z-20 h-[8%] w-[2px] rounded-l-[1px] bg-[#d4d4d6]" />
      <span className="absolute -left-[2px] top-[36%] z-20 h-[8%] w-[2px] rounded-l-[1px] bg-[#d4d4d6]" />
      <span className="absolute -right-[2px] top-[28%] z-20 h-[12%] w-[2px] rounded-r-[1px] bg-[#d4d4d6]" />

      <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-b from-[#f7f7f8] to-[#c9c9cc] p-[4px] sm:rounded-[2rem] sm:p-[5px]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-black sm:rounded-[1.75rem]">
          <div className="absolute inset-[2px] overflow-hidden rounded-[1.4rem] sm:rounded-[1.6rem]">
            {children}
          </div>
          <div className="pointer-events-none absolute left-1/2 top-[2.4%] z-30 h-[3.2%] w-[34%] -translate-x-1/2 rounded-full bg-black" />
          <div className="pointer-events-none absolute bottom-[1.4%] left-1/2 z-30 h-[1%] w-[32%] -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}

function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative aspect-[3/4] w-full"
      style={{ filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.25))" }}
    >
      <div className="absolute inset-0 rounded-[1.15rem] bg-gradient-to-b from-[#f7f7f8] to-[#c6c6c9] p-[7px] sm:rounded-[1.35rem] sm:p-[9px]">
        <div className="relative h-full w-full overflow-hidden rounded-[0.85rem] bg-black sm:rounded-[1rem]">
          {children}
          <span className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-[#2a2a2c]" />
        </div>
      </div>
    </div>
  );
}
