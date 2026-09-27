import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { NextResponse } from "next/server";

/** Require logged-in Supabase user for CMS write APIs */
export async function requireCmsSession() {
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Supabase auth is not configured" },
        { status: 503 },
      ),
    };
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        ok: false as const,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }
    return { ok: true as const, user };
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}
