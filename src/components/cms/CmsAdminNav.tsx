"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, MessageSquareQuote, Settings } from "lucide-react";
import { cmsPath } from "@/lib/cms/admin-path";
import { cn } from "@/lib/utils";

const items = [
  { href: () => cmsPath(), label: "News", icon: FileText, match: (p: string) => {
    const base = cmsPath();
    return p === base || p === "/admin" || p.includes("/review");
  }},
  { href: () => cmsPath("testimonials"), label: "Testimonials", icon: MessageSquareQuote, match: (p: string) => p.includes("/testimonials") },
  { href: () => cmsPath("settings"), label: "Settings", icon: Settings, match: (p: string) => p.includes("/settings") },
] as const;

/** Shared top nav for CMS dashboard / review (testimonials use AdminShell sidebar). */
export function CmsAdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const href = item.href();
        const active = item.match(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-primary text-white"
                : "border border-border bg-surface text-muted hover:border-primary/40 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
