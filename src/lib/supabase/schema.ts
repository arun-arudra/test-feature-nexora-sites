import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  isMissingTableError,
  isPermissionDeniedError,
} from "@/lib/supabase/errors";

export type TestimonialsSchemaStatus =
  | { ok: true }
  | {
      ok: false;
      reason: "not_configured" | "missing_tables" | "permission_denied" | "unknown";
      detail?: string;
    };

/** Probe whether testimonials + site_settings are usable via the API. */
export async function getTestimonialsSchemaStatus(): Promise<TestimonialsSchemaStatus> {
  if (!getSupabaseEnv().isConfigured) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const supabase = await createClient();
    const [settings, testimonials] = await Promise.all([
      supabase.from("site_settings").select("key").limit(1),
      supabase.from("testimonials").select("id").limit(1),
    ]);

    const firstError = settings.error || testimonials.error;
    if (!firstError) return { ok: true };

    if (isMissingTableError(settings.error) || isMissingTableError(testimonials.error)) {
      return {
        ok: false,
        reason: "missing_tables",
        detail: firstError.message,
      };
    }

    if (
      isPermissionDeniedError(settings.error) ||
      isPermissionDeniedError(testimonials.error)
    ) {
      return {
        ok: false,
        reason: "permission_denied",
        detail: firstError.message,
      };
    }

    return { ok: false, reason: "unknown", detail: firstError.message };
  } catch (err) {
    return {
      ok: false,
      reason: "unknown",
      detail: err instanceof Error ? err.message : "Schema check failed",
    };
  }
}
