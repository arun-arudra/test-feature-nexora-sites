"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarCropDialog } from "@/components/admin/AvatarCropDialog";
import { createClient } from "@/lib/supabase/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { formatSupabaseWriteError } from "@/lib/supabase/errors";
import type { Testimonial } from "@/types/testimonial";
import { cn } from "@/lib/utils";

type Props = {
  initial?: Testimonial | null;
};

export function TestimonialForm({ initial }: Props) {
  const router = useRouter();
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [product, setProduct] = useState(initial?.product ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initial?.avatarUrl ?? null,
  );
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPickFile(file: File) {
    setError(null);
    const url = URL.createObjectURL(file);
    setCropSrc(url);
  }

  function closeCrop() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  async function uploadCropped(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("testimonial-avatars")
        .upload(path, file, { upsert: false, contentType: "image/jpeg" });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage
        .from("testimonial-avatars")
        .getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      closeCrop();
    } catch (err) {
      const message = formatSupabaseWriteError(err, "Upload failed");
      setError(message);
      throw new Error(message);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const payload = {
        quote: quote.trim(),
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        product: product.trim(),
        sort_order: sortOrder,
        is_published: isPublished,
        avatar_url: avatarUrl,
      };

      if (initial?.id) {
        const { error: updateError } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", initial.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("testimonials")
          .insert(payload);
        if (insertError) throw insertError;
      }

      router.push(cmsPath("testimonials"));
      router.refresh();
    } catch (err) {
      setError(formatSupabaseWriteError(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  const initials =
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      {cropSrc ? (
        <AvatarCropDialog
          imageSrc={cropSrc}
          onCancel={closeCrop}
          onConfirm={uploadCropped}
        />
      ) : null}

      {error ? (
        <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      ) : null}

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Quote</span>
        <textarea
          required
          rows={5}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-primary"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Role / location</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="E-commerce · Bangalore"
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Company</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Product / work done</span>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="E-commerce website"
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-1">
          <span className="mb-1.5 block font-medium">Sort order</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-primary"
          />
        </label>
        <p className="self-end text-xs text-muted sm:pb-3">
          Card colors are assigned automatically on the site (not editable).
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-bg p-4">
        <p className="text-sm font-medium">Profile picture</p>
        <p className="mt-1 text-xs text-muted">
          Optional. You can crop after selecting. Initials show when empty.
        </p>
        <div className="mt-4 flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {initials}
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-primary-soft">
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) onPickFile(file);
                }}
              />
            </label>
            {avatarUrl ? (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-coral/10"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Published on the website
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || uploading || !!cropSrc}
          className={cn(
            "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60",
          )}
        >
          {saving
            ? "Saving…"
            : initial
              ? "Update testimonial"
              : "Create testimonial"}
        </button>
        <button
          type="button"
          onClick={() => router.push(cmsPath("testimonials"))}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-surface"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
