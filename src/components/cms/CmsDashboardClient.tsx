"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, Plus } from "lucide-react";
import { cmaFetch } from "@/lib/cms/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { CmsGenerationForm } from "@/components/cms/CmsGenerationForm";
import { CmsContentGrid } from "@/components/cms/CmsContentGrid";

export function CmsDashboardClient() {
  const router = useRouter();
  const [stats, setStats] = useState({ published: 0, drafts: 0 });

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await cmaFetch(
          "entries?content_type=news&select=sys.id,sys.publishedVersion&limit=1000",
        );
        const data = await res.json();
        if (!res.ok || cancelled) return;
        let published = 0;
        let drafts = 0;
        for (const item of data.items || []) {
          if (item.sys?.publishedVersion) published += 1;
          else drafts += 1;
        }
        if (!cancelled) setStats({ published, drafts });
      } catch {
        /* ignore */
      }
    }
    void fetchStats();
    const interval = window.setInterval(fetchStats, 12_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full max-w-full space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <h1 className="flex flex-wrap items-center gap-3 font-heading text-3xl tracking-tight text-white">
            Command Center
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm font-normal text-muted">
              <BarChart2 className="h-4 w-4 text-primary" />
              {stats.published} Published · {stats.drafts} Drafts
            </span>
          </h1>
          <p className="mt-2 text-muted">Contentful + n8n publishing pipeline</p>
        </div>
        <button
          type="button"
          onClick={() => router.push(cmsPath("review", "new"))}
          className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Blank Post
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="min-w-0 xl:col-span-1">
          <CmsGenerationForm />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <CmsContentGrid />
        </div>
      </div>
    </div>
  );
}
