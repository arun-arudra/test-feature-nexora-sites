"use client";

export type IndustryIconType =
  | "ecommerce"
  | "restaurant"
  | "education"
  | "realestate"
  | "tourism"
  | "healthcare"
  | "beauty"
  | "finance";

/** Original GIFs with white background — keep files + uncomment to restore */
// const ICON_SRC: Record<IndustryIconType, string> = {
//   ecommerce: "/icons/ecommerce.gif",
//   restaurant: "/icons/restaurant.gif",
//   education: "/icons/education.gif",
//   realestate: "/icons/realestate.gif",
//   tourism: "/icons/tourism.gif",
//   healthcare: "/icons/healthcare.gif",
//   beauty: "/icons/beauty.gif",
//   finance: "/icons/finance.gif",
// };

/** Transparent WebP (white BG removed) — active */
const ICON_SRC: Record<IndustryIconType, string> = {
  ecommerce: "/icons/ecommerce.webp",
  restaurant: "/icons/restaurant.webp",
  education: "/icons/education.webp",
  realestate: "/icons/realestate.webp",
  tourism: "/icons/tourism.webp",
  healthcare: "/icons/healthcare.webp",
  beauty: "/icons/beauty.webp",
  finance: "/icons/finance.webp",
};

export function AnimatedIndustryIcon({
  type,
  className = "h-14 w-14",
}: {
  type: IndustryIconType;
  className?: string;
}) {
  return (
    // Native <img> preserves animated WebP / GIF playback.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${ICON_SRC[type]}?v=nobg1`}
      alt=""
      className={`pointer-events-none select-none object-contain ${className}`}
      draggable={false}
      aria-hidden
    />
  );
}
