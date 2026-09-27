"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { mainNav } from "@/config/navigation";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const nav = mainNav;

export function V2Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function goToPage(href: string) {
    setOpen(false);
    // Already on this page (or a child like /news/slug) → scroll to top
    if (
      pathname === href ||
      (href !== "/" && pathname.startsWith(`${href}/`))
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
      return;
    }
    router.push(href);
  }

  function isPageRoute(href: string) {
    return href === "/" || href === "/news" || href === "/work";
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition duration-300",
        mounted && scrolled
          ? "border-b border-border bg-black/80 backdrop-blur-md"
          : "border-b border-transparent bg-black/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="inline-flex shrink-0 items-center"
          aria-label={siteConfig.brandName}
        >
          <BrandLogo variant="mark" linked={false} onDark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (isPageRoute(item.href)) {
                  e.preventDefault();
                  goToPage(item.href);
                } else {
                  setOpen(false);
                }
              }}
              className="rounded-[10px] px-3 py-2 text-sm font-normal text-muted transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className="text-sm font-normal text-muted transition hover:text-white"
          >
            {siteConfig.phone}
          </a>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-btn v2-btn-primary"
          >
            Book a call
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (isPageRoute(item.href)) {
                  e.preventDefault();
                  goToPage(item.href);
                } else {
                  setOpen(false);
                }
              }}
              className="block rounded-[10px] px-3 py-3 text-sm text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-btn v2-btn-primary mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            Book a call
          </a>
        </div>
      ) : null}
    </header>
  );
}
