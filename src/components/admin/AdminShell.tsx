"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  FileText,
  LogOut,
  MessageSquareQuote,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { createClient } from "@/lib/supabase/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nexora-admin-sidebar-collapsed";

const nav = [
  { href: () => cmsPath(), label: "News", icon: FileText, match: "news" as const },
  {
    href: () => cmsPath("testimonials"),
    label: "Testimonials",
    icon: MessageSquareQuote,
    match: "testimonials" as const,
  },
  {
    href: () => cmsPath("settings"),
    label: "Settings",
    icon: Settings,
    match: "settings" as const,
  },
];

function isNavActive(match: (typeof nav)[number]["match"], pathname: string) {
  if (match === "testimonials") return pathname.includes("/testimonials");
  if (match === "settings") return pathname.includes("/settings");
  return (
    pathname === cmsPath() ||
    pathname === "/admin" ||
    pathname.includes("/review")
  );
}

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    router.replace(cmsPath("login"));
    router.refresh();
  }

  function Sidebar({
    mode,
    onNavigate,
  }: {
    mode: "desktop" | "mobile";
    onNavigate?: () => void;
  }) {
    const narrow = mode === "desktop" && collapsed;

    return (
      <aside
        className={cn(
          "flex h-full flex-col border-r border-border bg-black text-white transition-[width] duration-200",
          mode === "mobile" ? "w-64" : narrow ? "w-20" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 flex-col border-b border-border",
            narrow ? "gap-0 px-2 py-3" : "gap-1 px-3 py-3",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <BrandLogo
                linked={false}
                onDark
                className={narrow ? "h-7 max-w-[2.25rem]" : undefined}
              />
            </div>
            {mode === "desktop" ? (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="shrink-0 rounded-[10px] border border-border p-1.5 text-muted transition hover:border-primary/40 hover:text-white"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand" : "Collapse"}
              >
                {collapsed ? (
                  <ChevronsRight className="h-4 w-4" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
              </button>
            ) : null}
          </div>
          {!narrow ? <p className="text-xs text-muted">Admin</p> : null}
        </div>

        <nav className={cn("min-h-0 flex-1 space-y-1 overflow-y-auto p-2", !narrow && "p-3")}>
          {nav.map((item) => {
            const href = item.href();
            const active = isNavActive(item.match, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={href}
                href={href}
                title={item.label}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-[10px] text-sm font-medium transition",
                  narrow ? "justify-center px-0 py-2.5" : "gap-2.5 px-3 py-2.5",
                  active
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!narrow ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className={cn("shrink-0 border-t border-border", narrow ? "p-2" : "p-3")}>
          {email && !narrow ? (
            <p className="mb-2 truncate px-1 text-xs text-muted" title={email}>
              {email}
            </p>
          ) : null}
          <button
            type="button"
            onClick={signOut}
            title="Sign out"
            className={cn(
              "flex w-full items-center rounded-[10px] text-sm text-muted transition hover:bg-white/5 hover:text-white",
              narrow ? "justify-center px-0 py-2.5" : "gap-2 px-3 py-2.5",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!narrow ? <span>Sign out</span> : null}
          </button>
        </div>
      </aside>
    );
  }

  return (
    <div className="theme-v2 flex h-dvh max-h-dvh overflow-hidden bg-black text-white">
      <div className="relative hidden h-full shrink-0 lg:block">
        <Sidebar mode="desktop" />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full shadow-2xl">
            <Sidebar mode="mobile" onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-[10px] border border-border p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Dashboard
              </p>
              <h1 className="font-heading text-lg font-bold leading-tight text-white">
                Nexora Sites Admin
              </h1>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-black px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition hover:border-primary/40 hover:text-white"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </header>
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
