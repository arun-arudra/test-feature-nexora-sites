"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MAX_TESTIMONIALS_VISIBLE,
  MIN_TESTIMONIALS_VISIBLE,
  clampVisibleCount,
} from "@/lib/settings/testimonials-limit";
import { saveTestimonialsVisibleCount } from "@/lib/settings/testimonials-limit.actions";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function TestimonialsVisibleCountForm({
  initialCount,
  schemaReady = true,
  schemaBlockedReason = null,
}: {
  initialCount: number;
  schemaReady?: boolean;
  schemaBlockedReason?:
    | "missing_tables"
    | "permission_denied"
    | "unknown"
    | null;
}) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const configured = getSupabaseEnv().isConfigured;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    const next = clampVisibleCount(count);
    setCount(next);

    if (!configured) {
      setMessage(
        `Saved locally for this session preview only. Set NEXT_PUBLIC_TESTIMONIALS_VISIBLE_COUNT=${next} in .env.local (and connect Supabase to persist from admin).`,
      );
      return;
    }

    if (!schemaReady) {
      setIsError(true);
      setMessage(
        schemaBlockedReason === "permission_denied"
          ? "Tables exist, but API access is blocked. Run the grants SQL shown above, then refresh."
          : schemaBlockedReason === "missing_tables"
            ? "Database tables are missing. Run the setup SQL shown above, then try again."
            : "Database is not ready for saves yet. Check the notice above, then refresh.",
      );
      return;
    }

    setSaving(true);
    try {
      const result = await saveTestimonialsVisibleCount(next);
      if (!result.ok) {
        setIsError(true);
        setMessage(result.error);
        return;
      }
      setCount(result.count);
      setMessage(`Showing ${result.count} cards on the site.`);
      router.refresh();
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
    >
      <h3 className="font-heading text-lg font-bold">Cards on homepage</h3>
      <p className="mt-1 text-sm text-muted">
        How many published testimonials appear in the Reviews deck. Admin value
        overrides{" "}
        <code className="rounded bg-bg px-1 text-xs">
          NEXT_PUBLIC_TESTIMONIALS_VISIBLE_COUNT
        </code>{" "}
        in env.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Visible count</span>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-36 rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-primary"
          >
            {Array.from(
              { length: MAX_TESTIMONIALS_VISIBLE - MIN_TESTIMONIALS_VISIBLE + 1 },
              (_, i) => MIN_TESTIMONIALS_VISIBLE + i,
            ).map((n) => (
              <option key={n} value={n}>
                {n} cards
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {message ? (
        <p
          className={
            isError
              ? "mt-3 text-sm text-red-300"
              : "mt-3 text-sm text-primary"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
