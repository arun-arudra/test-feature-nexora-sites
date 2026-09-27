import Link from "next/link";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { cmsPath } from "@/lib/cms/admin-path";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { fallbackTestimonials, mapTestimonialRow } from "@/lib/testimonials/fallback";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const configured = getSupabaseEnv().isConfigured;

  let item = fallbackTestimonials.find((t) => t.id === id) ?? null;

  if (configured) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("testimonials")
        .select(
          "id, quote, name, role, company, product, tone, avatar_url, sort_order, is_published",
        )
        .eq("id", id)
        .maybeSingle();
      if (data) item = mapTestimonialRow(data);
    } catch {
      /* keep fallback */
    }
  }

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={cmsPath("testimonials")} className="text-sm text-muted hover:text-primary">
          ← Back to testimonials
        </Link>
        <h2 className="mt-2 font-heading text-2xl font-bold">Edit testimonial</h2>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <TestimonialForm initial={item} />
      </div>
    </div>
  );
}
