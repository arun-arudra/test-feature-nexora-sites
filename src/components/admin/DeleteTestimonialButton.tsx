"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DeleteTestimonialButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this testimonial?")) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-full border border-coral/30 px-3 py-1 text-xs font-semibold text-coral hover:bg-coral/10 disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
