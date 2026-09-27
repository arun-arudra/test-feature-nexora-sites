"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadCmsAsset } from "@/lib/cms/client";

type Props = {
  onUploadComplete: (assetId: string) => void;
  label?: string;
};

export function CmsImageUploader({
  onUploadComplete,
  label = "Replace Cover",
}: Props) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || busy.current) return;
    busy.current = true;
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadCmsAsset(file);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Upload failed");
      }
      // Contentful needs a beat to process the file before URL is ready
      await new Promise((r) => setTimeout(r, 1200));
      onUploadComplete(data.sys.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      busy.current = false;
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        id={inputId}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => document.getElementById(inputId)?.click()}
        className="inline-flex w-full items-center justify-center rounded-[10px] border border-border bg-black px-3 py-2.5 text-sm text-muted transition hover:border-primary/40 hover:text-white disabled:opacity-60"
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {label}
      </button>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

/** Poll until asset file URL is available after process. */
export function useAssetUrl(assetId: string | null) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!assetId) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      const { cmaFetch } = await import("@/lib/cms/client");
      while (!cancelled && attempts < 12) {
        attempts += 1;
        try {
          const res = await cmaFetch(`assets/${assetId}`);
          const data = await res.json();
          const raw = data?.fields?.file?.["en-US"]?.url as string | undefined;
          if (raw) {
            const full = raw.startsWith("//") ? `https:${raw}` : raw;
            if (!cancelled) setUrl(full);
            return;
          }
        } catch {
          /* retry */
        }
        await new Promise((r) => setTimeout(r, 800));
      }
    }
    void poll();
    return () => {
      cancelled = true;
    };
  }, [assetId]);

  return url;
}
