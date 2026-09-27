import { AnalyticsDashboardClient } from "@/components/cms/AnalyticsDashboardClient";
import { getSiteSettings } from "@/lib/settings/site-settings.actions";

export default async function DashboardPage() {
  const res = await getSiteSettings();
  const settings = res.data || {};
  
  const googleAnalyticsUrl = settings["GOOGLE_ANALYTICS_IFRAME_URL"] || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
      </div>
      <AnalyticsDashboardClient googleAnalyticsUrl={googleAnalyticsUrl} />
    </div>
  );
}
