import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  fallbackTestimonials,
  mapTestimonialRow,
} from "@/lib/testimonials/fallback";
import { getTestimonialsVisibleCount } from "@/lib/settings/testimonials-limit.server";
import type { Testimonial } from "@/types/testimonial";

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const limit = await getTestimonialsVisibleCount();
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) return fallbackTestimonials.slice(0, limit);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select(
        "id, quote, name, role, company, product, tone, avatar_url, sort_order, is_published",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error || !data?.length) return fallbackTestimonials.slice(0, limit);
    return data.map(mapTestimonialRow);
  } catch {
    return fallbackTestimonials.slice(0, limit);
  }
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "id, quote, name, role, company, product, tone, avatar_url, sort_order, is_published",
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapTestimonialRow);
}
