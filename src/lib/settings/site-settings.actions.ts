"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function saveSiteSettings(settings: Record<string, string>) {
  if (!getSupabaseEnv().isConfigured) {
    return { ok: false, error: "Supabase not configured." };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Unauthorized" };

    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("site_settings").upsert(updates, { onConflict: "key" });
    if (error) throw error;

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to save settings" };
  }
}

export async function getSiteSettings() {
  if (!getSupabaseEnv().isConfigured) return { ok: true, data: {} };
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Unauthorized" };

    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;

    const settings = data.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);

    return { ok: true, data: settings };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

export async function fetchContentfulEnvironments(spaceId: string, managementToken: string) {
  if (!spaceId || !managementToken) return { ok: false, error: "Missing Space ID or Management Token" };
  
  try {
    const res = await fetch(`https://api.contentful.com/spaces/${spaceId}/environments`, {
      headers: {
        Authorization: `Bearer ${managementToken}`,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Contentful API error: ${res.statusText}`);
    }
    
    const data = await res.json();
    const environments = data.items.map((item: any) => item.name);
    return { ok: true, environments };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
