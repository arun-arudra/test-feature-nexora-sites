import type { Testimonial, TestimonialTone } from "@/types/testimonial";

/** Colors used after the white front card — neighbors never match */
export const ALTERNATING_TONES: TestimonialTone[] = [
  "amber",
  "teal",
  "sage",
  "blush",
  "ink",
];

/**
 * Keep original order (same as the previous good deck).
 * Card 0 = white front of stack.
 * Cards 1..n-1 alternate colors.
 * Stagger from the back: last card moves first (→ right), then next (→ left side of stack), …
 */
export function prepareTestimonialsForDeck(
  items: Testimonial[],
  visibleCount: number,
): {
  stackFront: Testimonial;
  displayItems: Testimonial[];
  /** display index → stagger step (0 = first to move = last card) */
  staggerStepByDisplayIndex: number[];
} {
  const sliced = items.slice(0, Math.max(1, visibleCount));
  const n = sliced.length;

  const displayItems = sliced.map((item, i) => {
    if (i === 0) return { ...item, tone: "cream" as const };
    const tone = ALTERNATING_TONES[(i - 1) % ALTERNATING_TONES.length];
    return { ...item, tone };
  });

  // Back of stack first: index n-1 step 0, n-2 step 1, … index 0 step n-1
  const staggerStepByDisplayIndex = displayItems.map((_, i) => n - 1 - i);

  return {
    stackFront: displayItems[0],
    displayItems,
    staggerStepByDisplayIndex,
  };
}
