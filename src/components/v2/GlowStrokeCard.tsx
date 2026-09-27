"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowStrokeCardProps = {
  children: ReactNode;
  className?: string;
  /** Visuvate-style pixel-grid hover background (services) */
  particles?: boolean;
  /** Taller content cards (pricing) */
  tall?: boolean;
};

/**
 * Visuvate svc-card:
 * - Idle: flat dark card, thin border
 * - Hover: dense pixel-grid background in an expanding RING (center stays clear
 *   so icon + text sit on the same solid card color and never fight the grid)
 * - Dual conic border shines
 */
export function GlowStrokeCard({
  children,
  className,
  particles = false,
  tall = false,
}: GlowStrokeCardProps) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const active = hovered && !reduceMotion;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group/cell relative isolate grid overflow-hidden rounded-[12px] border border-white/10 bg-[#0a0a0a]",
        tall
          ? "flex h-full min-h-[26rem] flex-col place-items-stretch"
          : "aspect-square place-items-center",
        className,
      )}
    >
      {particles ? <PixelGridShimmer active={active} /> : null}

      <span
        aria-hidden
        className={cn(
          "v2-shine v2-shine-a pointer-events-none absolute inset-0 rounded-[inherit] pointer-coarse:hidden",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "v2-shine v2-shine-b pointer-events-none absolute inset-0 rounded-[inherit] pointer-coarse:hidden",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "relative z-[2] flex h-full w-full flex-col",
          !tall && "items-center justify-center",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Recreates Visuvate hover bg:
 * 1) Canvas paints a dense square pixel matrix (blue/violet tinted)
 * 2) Luminance noise mask drifts across it
 * 3) Parent radial RING mask hides the center so icon/text stay on solid bg
 */
function PixelGridShimmer({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noiseUrl, setNoiseUrl] = useState<string | null>(null);

  useEffect(() => {
    // Soft luminance noise for CSS mask (like their blob mask-image)
    const c = document.createElement("canvas");
    c.width = 320;
    c.height = 160;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(c.width, c.height);
    for (let i = 0; i < img.data.length; i += 4) {
      // Mostly dark with sparse bright specs → speckled grid through mask
      const r = Math.random();
      const v = r > 0.78 ? 255 : r > 0.55 ? 90 : 18;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    setNoiseUrl(c.toDataURL("image/png"));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w < 2 || h < 2) return;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Base — near-black
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      // Dense pixel grid (Visuvate hover look)
      const cell = 3; // tiny squares
      const gap = 1;
      const step = cell + gap;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const n = Math.random();
          // Mix of dim gray + brighter violet/blue pixels
          if (n > 0.72) {
            const a = 0.35 + Math.random() * 0.55;
            if (n > 0.9) {
              ctx.fillStyle = `rgba(180, 165, 255, ${a})`;
            } else if (n > 0.82) {
              ctx.fillStyle = `rgba(140, 190, 255, ${a * 0.85})`;
            } else {
              ctx.fillStyle = `rgba(160, 160, 175, ${a * 0.7})`;
            }
            ctx.fillRect(x, y, cell, cell);
          } else if (n > 0.45) {
            ctx.fillStyle = `rgba(70, 70, 80, ${0.35 + Math.random() * 0.35})`;
            ctx.fillRect(x, y, cell, cell);
          }
        }
      }
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  // Re-paint occasionally while active so the field feels alive (light twinkle)
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const id = window.setInterval(() => {
      // Trigger a light re-seed by dispatching resize paint via fake size nudge
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Twinkle: randomly brighten a few cells without full redraw cost
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = 0; i < 40; i++) {
        const x = Math.floor(Math.random() * (w / 4)) * 4;
        const y = Math.floor(Math.random() * (h / 4)) * 4;
        ctx.fillStyle = `rgba(190, 175, 255, ${0.4 + Math.random() * 0.5})`;
        ctx.fillRect(x, y, 3, 3);
      }
    }, 180);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div
      aria-hidden
      className={cn(
        "v2-shimmer-mask pointer-events-none absolute inset-0 z-[1]",
        active && "is-active",
      )}
    >
      <canvas
        ref={canvasRef}
        className={cn("v2-shimmer size-full", active && "is-running")}
        style={
          noiseUrl
            ? {
                WebkitMaskImage: `url(${noiseUrl})`,
                maskImage: `url(${noiseUrl})`,
                animationDuration: "13.3s",
              }
            : undefined
        }
      />
    </div>
  );
}
