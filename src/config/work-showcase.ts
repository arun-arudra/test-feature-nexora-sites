/**
 * Homepage Work / projects showcase — controlled via .env
 *
 * NEXT_PUBLIC_WORK_COLUMNS=2|3|4  → how many cards visible in the viewport
 * NEXT_PUBLIC_WORK_MAX_PROJECTS=N → max projects to show from portfolio
 */

export type WorkColumns = 2 | 3 | 4;

const DEFAULT_COLUMNS: WorkColumns = 2;
const DEFAULT_MAX = 8;
const MIN_MAX = 1;
const MAX_MAX = 24;

export function getWorkShowcaseColumns(): WorkColumns {
  const raw = process.env.NEXT_PUBLIC_WORK_COLUMNS?.trim();
  const n = Number(raw);
  if (n === 3 || n === 4) return n;
  return DEFAULT_COLUMNS;
}

export function getWorkShowcaseMaxProjects(): number {
  const raw = process.env.NEXT_PUBLIC_WORK_MAX_PROJECTS?.trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_MAX;
  return Math.min(MAX_MAX, Math.max(MIN_MAX, Math.round(n)));
}
