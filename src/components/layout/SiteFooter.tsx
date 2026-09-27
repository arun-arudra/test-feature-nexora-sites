import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LetsTalkLink } from "@/components/brand/LetsTalkLink";
import { Container } from "@/components/ui/LayoutPrimitives";
import { footerNav, mainNav } from "@/config/navigation";
import { getWhatsAppLink, siteConfig } from "@/config/site";

const sitemap = [
  {
    title: "Explore",
    items: mainNav.map((item) => ({ href: item.href, label: item.label })),
  },
  {
    title: "Services",
    items: footerNav.services,
  },
  {
    title: "Industries",
    items: footerNav.industries,
  },
  {
    title: "Company",
    items: footerNav.company,
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-dark text-dark-text">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_0%,rgba(228,160,26,0.12),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(26,85,86,0.28),transparent_50%)]"
      />

      {/* Talk CTA — Catalin-style */}
      <Container className="relative border-b border-white/10 py-12 sm:py-16 md:py-20">
        <p className="text-sm font-medium tracking-[0.04em] text-white/55 sm:text-base">
          Got a business that needs a real website?
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <LetsTalkLink href="/contact" />
          <div className="flex flex-col gap-1 pb-1 sm:items-end">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm font-semibold text-white/80 transition hover:text-accent sm:text-base"
            >
              {siteConfig.email}
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/50 transition hover:text-whatsapp"
            >
              WhatsApp {siteConfig.phone}
            </a>
          </div>
        </div>
      </Container>

      {/* Sitemap */}
      <Container className="relative py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {sitemap.map((column) => (
            <div key={column.title}>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                {column.title}
              </p>
              <ul
                className={
                  column.title === "Industries"
                    ? "grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-1"
                    : "space-y-2.5"
                }
              >
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="group relative inline-flex text-[15px] font-medium text-white/75 transition hover:text-white"
                    >
                      <span>{item.label}</span>
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {siteConfig.address} ·{" "}
            <a
              href={siteConfig.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/65 underline decoration-white/20 underline-offset-2 transition hover:text-accent hover:decoration-accent"
            >
              Maps
            </a>
          </p>
          <p>Serving {siteConfig.serviceAreas.join(" · ")}</p>
        </div>
      </Container>

      {/* Oversized swappable logo */}
      <div className="relative border-t border-white/10">
        <Container className="pb-8 pt-8 sm:pt-10 md:pt-12">
          <BrandLogo variant="footer" linked />
          <div className="mt-6 flex flex-col gap-2 text-xs text-white/40 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p>
              © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
