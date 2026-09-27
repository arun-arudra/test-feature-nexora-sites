export const DEFAULT_TESTIMONIALS_VISIBLE = 8;
export const MIN_TESTIMONIALS_VISIBLE = 3;
export const MAX_TESTIMONIALS_VISIBLE = 24;
export const SETTINGS_KEY_VISIBLE = "testimonials_visible_count";

export function clampVisibleCount(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_TESTIMONIALS_VISIBLE;
  return Math.min(
    MAX_TESTIMONIALS_VISIBLE,
    Math.max(MIN_TESTIMONIALS_VISIBLE, Math.round(value)),
  );
}

/** Env fallback (used when Supabase setting is missing). */
export function getEnvTestimonialsVisibleCount(): number {
  const raw = process.env.NEXT_PUBLIC_TESTIMONIALS_VISIBLE_COUNT?.trim();
  if (!raw) return DEFAULT_TESTIMONIALS_VISIBLE;
  return clampVisibleCount(Number(raw));
}
