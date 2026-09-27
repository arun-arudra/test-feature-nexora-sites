"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  MessageSquareQuote,
  Settings,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function CmsUserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function handleLogout() {
    if (getSupabaseEnv().isConfigured) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        /* ignore */
      }
    }
    router.replace(cmsPath("login"));
    router.refresh();
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-white"
      >
        <User className="h-4 w-4" />
        <span className="hidden md:inline">Account</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-[12px] border border-border bg-surface py-1 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(cmsPath("testimonials"));
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted hover:bg-black hover:text-white"
          >
            <MessageSquareQuote className="h-4 w-4" /> Testimonials
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(cmsPath("settings"));
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted hover:bg-black hover:text-white"
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
