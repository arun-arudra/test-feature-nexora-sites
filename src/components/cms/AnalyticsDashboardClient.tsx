"use client";

import { useState } from "react";
import { BarChart, Activity, Globe } from "lucide-react";

export function AnalyticsDashboardClient({
  googleAnalyticsUrl,
}: {
  googleAnalyticsUrl: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"nexora" | "google">("nexora");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-xl border border-border bg-surface p-2">
        <button
          onClick={() => setActiveTab("nexora")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
            activeTab === "nexora"
              ? "bg-primary text-white shadow"
              : "text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <Activity className="h-4 w-4" /> Nexora Analytics
        </button>
        <button
          onClick={() => setActiveTab("google")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
            activeTab === "google"
              ? "bg-blue-600 text-white shadow"
              : "text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <BarChart className="h-4 w-4" /> Google Analytics
        </button>
      </div>

      {activeTab === "nexora" ? (
        <div className="rounded-[12px] border border-border bg-surface p-8 text-center">
          <Globe className="mx-auto h-12 w-12 text-primary/40 mb-4" />
          <h2 className="text-xl font-heading font-semibold text-white">Nexora Native Analytics</h2>
          <p className="mt-2 text-muted max-w-md mx-auto">
            Your website is currently logging page views to Supabase. To view the charts here, 
            please configure your Supabase RPC functions for analytics.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-black p-6">
              <p className="text-sm text-muted">Total Views (All Time)</p>
              <p className="mt-2 text-3xl font-bold text-white">--</p>
            </div>
            <div className="rounded-xl border border-border bg-black p-6">
              <p className="text-sm text-muted">Views (Last 7 Days)</p>
              <p className="mt-2 text-3xl font-bold text-white">--</p>
            </div>
            <div className="rounded-xl border border-border bg-black p-6">
              <p className="text-sm text-muted">Unique Visitors</p>
              <p className="mt-2 text-3xl font-bold text-white">--</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[12px] border border-border bg-surface p-2">
          {googleAnalyticsUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe 
                src={googleAnalyticsUrl}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="py-12 text-center">
              <BarChart className="mx-auto h-12 w-12 text-blue-500/40 mb-4" />
              <h2 className="text-xl font-heading font-semibold text-white">Google Analytics Not Configured</h2>
              <p className="mt-2 text-muted">
                Please add your Google Looker Studio Embed URL in the Settings tab.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
