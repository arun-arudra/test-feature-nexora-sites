"use client";

import { useEffect, useState } from "react";
import { Loader2, Settings } from "lucide-react";
import { getSiteSettings, saveSiteSettings, fetchContentfulEnvironments } from "@/lib/settings/site-settings.actions";

export function SiteSettingsForm() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [environments, setEnvironments] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getSiteSettings();
      if (res.ok && res.data) {
        setSettings(res.data);
      }
    }
    load();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFetchEnvironments = async () => {
    const spaceId = settings["CONTENTFUL_NEWS_SPACE_ID"];
    const token = settings["CONTENTFUL_NEWS_MANAGEMENT_TOKEN"];
    if (!spaceId || !token) {
      setError("Please provide both Space ID and Management Token to fetch environments.");
      return;
    }
    
    setBusy(true);
    setError(null);
    const res = await fetchContentfulEnvironments(spaceId, token);
    setBusy(false);
    
    if (res.ok && res.environments) {
      setEnvironments(res.environments);
      setMessage("Environments fetched successfully!");
    } else {
      setError(res.error || "Failed to fetch environments.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const res = await saveSiteSettings(settings);
    setBusy(false);

    if (res.ok) {
      setMessage("Settings saved successfully!");
    } else {
      setError(res.error || "Failed to save settings.");
    }
  };

  return (
    <section className="space-y-6 rounded-[12px] border border-border bg-surface p-6 mt-8">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Settings className="h-4 w-4 text-primary" /> App Settings
      </h2>
      
      {message && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">N8N Webhook URL</label>
          <input
            type="url"
            value={settings["N8N_WEBHOOK_URL"] || ""}
            onChange={(e) => handleChange("N8N_WEBHOOK_URL", e.target.value)}
            className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
            placeholder="https://..."
          />
        </div>
        
        <div>
          <label className="block text-xs text-muted mb-1">Google Analytics ID</label>
          <input
            type="text"
            value={settings["GOOGLE_ANALYTICS_ID"] || ""}
            onChange={(e) => handleChange("GOOGLE_ANALYTICS_ID", e.target.value)}
            className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
            placeholder="G-XXXXXX"
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Google Analytics Looker Studio Iframe URL</label>
          <input
            type="url"
            value={settings["GOOGLE_ANALYTICS_IFRAME_URL"] || ""}
            onChange={(e) => handleChange("GOOGLE_ANALYTICS_IFRAME_URL", e.target.value)}
            className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
            placeholder="https://lookerstudio.google.com/embed/reporting/..."
          />
        </div>



        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-sm font-semibold mb-3">Contentful Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1">Space ID</label>
              <input
                type="text"
                value={settings["CONTENTFUL_NEWS_SPACE_ID"] || ""}
                onChange={(e) => handleChange("CONTENTFUL_NEWS_SPACE_ID", e.target.value)}
                className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
              />
            </div>
            
            <div>
              <label className="block text-xs text-muted mb-1">Delivery Token</label>
              <input
                type="text"
                value={settings["CONTENTFUL_NEWS_DELIVERY_TOKEN"] || ""}
                onChange={(e) => handleChange("CONTENTFUL_NEWS_DELIVERY_TOKEN", e.target.value)}
                className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Management Token</label>
              <input
                type="password"
                value={settings["CONTENTFUL_NEWS_MANAGEMENT_TOKEN"] || ""}
                onChange={(e) => handleChange("CONTENTFUL_NEWS_MANAGEMENT_TOKEN", e.target.value)}
                className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
                placeholder="CFPAT-..."
              />
              <button 
                type="button" 
                onClick={handleFetchEnvironments}
                className="mt-2 text-xs bg-secondary px-2 py-1 rounded text-white"
              >
                Fetch Environments
              </button>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1">Environment</label>
              {environments.length > 0 ? (
                <select
                  value={settings["CONTENTFUL_NEWS_ENVIRONMENT"] || "master"}
                  onChange={(e) => handleChange("CONTENTFUL_NEWS_ENVIRONMENT", e.target.value)}
                  className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
                >
                  <option value="">Select an environment...</option>
                  {environments.map(env => (
                    <option key={env} value={env}>{env}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={settings["CONTENTFUL_NEWS_ENVIRONMENT"] || "master"}
                  onChange={(e) => handleChange("CONTENTFUL_NEWS_ENVIRONMENT", e.target.value)}
                  className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
                  placeholder="master"
                />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full mt-4 items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save All Settings"}
        </button>
      </form>
    </section>
  );
}
