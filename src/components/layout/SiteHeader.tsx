"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { mainNav } from "@/config/navigation";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/LayoutPrimitives";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition duration-300",
        scrolled || open
          ? "border-border bg-bg/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-bg/80 backdrop-blur-sm",
      )}
    >
      <Container className="flex h-14 items-center justify-between gap-3 sm:h-16 md:h-[4.25rem]">
        <div onClick={() => setOpen(false)}>
          <BrandLogo variant="mark" />
        </div>

        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2 py-2 text-[13px] font-medium text-muted transition hover:bg-surface-muted hover:text-primary lg:px-3 lg:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex lg:gap-3">
          <a
            href={siteConfig.phoneHref}
            className="text-sm font-semibold text-text transition hover:text-primary"
          >
            {siteConfig.phone}
          </a>
          <Button href={getWhatsAppLink()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            href={getWhatsAppLink()}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden px-3 py-2.5 md:inline-flex lg:hidden"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2.5 text-text transition hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-surface transition-[max-height,opacity] duration-300 ease-out md:hidden",
          open ? "max-h-[min(32rem,80dvh)] opacity-100" : "max-h-0 border-transparent opacity-0",
        )}
      >
        <Container className="flex max-h-[min(32rem,80dvh)] flex-col gap-1 overflow-y-auto py-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-sm font-medium text-text transition hover:bg-surface-muted hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.phoneHref}
            className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-primary transition hover:bg-surface-muted"
            onClick={() => setOpen(false)}
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phone}
          </a>
          <Button
            href={getWhatsAppLink()}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </Button>
        </Container>
      </div>
    </header>
  );
}
