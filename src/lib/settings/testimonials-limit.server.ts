import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  SETTINGS_KEY_VISIBLE,
  clampVisibleCount,
  getEnvTestimonialsVisibleCount,
} from "@/lib/settings/testimonials-limit";

/**
 * Admin DB setting wins when present; otherwise env; otherwise default.
 * Server Components / Route Handlers only.
 */
export async function getTestimonialsVisibleCount(): Promise<number> {
  const envFallback = getEnvTestimonialsVisibleCount();
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) return envFallback;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTINGS_KEY_VISIBLE)
      .maybeSingle();

    if (error || data?.value == null) return envFallback;
    const parsed = Number(data.value);
    if (!Number.isFinite(parsed)) return envFallback;
    return clampVisibleCount(parsed);
  } catch {
    return envFallback;
  }
}
