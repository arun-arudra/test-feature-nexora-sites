"use client";

import { useEffect } from "react";

/** Fires once per page load to increment daily views (best-effort). */
export function AnalyticsBeacon() {
  useEffect(() => {
    const key = `nx-view-${new Date().toISOString().slice(0, 10)}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch("/api/analytics/view", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
