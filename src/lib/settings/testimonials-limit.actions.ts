"use server";

import { revalidatePath } from "next/cache";
import { cmsPath } from "@/lib/cms/admin-path";
import {
  SETTINGS_KEY_VISIBLE,
  clampVisibleCount,
} from "@/lib/settings/testimonials-limit";
import {
  formatSupabaseWriteError,
  isMissingTableError,
} from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export type SaveVisibleCountResult =
  | { ok: true; count: number }
  | { ok: false; error: string; missingTables?: boolean };

export async function saveTestimonialsVisibleCount(
  rawCount: number,
): Promise<SaveVisibleCountResult> {
  if (!getSupabaseEnv().isConfigured) {
    return {
      ok: false,
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const count = clampVisibleCount(rawCount);

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "You must be signed in to save settings." };
    }

    const { error } = await supabase.from("site_settings").upsert(
      {
        key: SETTINGS_KEY_VISIBLE,
        value: String(count),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (error) {
      return {
        ok: false,
        error: formatSupabaseWriteError(error),
        missingTables: isMissingTableError(error),
      };
    }

    revalidatePath(cmsPath("testimonials"));
    revalidatePath("/");
    return { ok: true, count };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseWriteError(err),
      missingTables: isMissingTableError(err),
    };
  }
}
