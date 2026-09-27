import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  try {
    const supabase = await createClient();
    await supabase.rpc("increment_page_view");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
