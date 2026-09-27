"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function CmsAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const configured = getSupabaseEnv().isConfigured;

  useEffect(() => {
    if (!configured) {
      setReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.replace(cmsPath("login"));
          return;
        }
        if (!cancelled) setReady(true);
      } catch {
        router.replace(cmsPath("login"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configured, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
