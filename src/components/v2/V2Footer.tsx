import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LetsTalkLink } from "@/components/brand/LetsTalkLink";
import { footerNav } from "@/config/navigation";
import { getWhatsAppLink, siteConfig } from "@/config/site";

const exploreNav = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#industries", label: "Industries" },
  { href: "/work", label: "Work" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/news", label: "News" },
  { href: "/#faq", label: "FAQ" },
] as const;

const sitemap = [
  { title: "Explore", items: exploreNav },
  { title: "Services", items: footerNav.services },
  { title: "Industries", items: footerNav.industries },
  { title: "Company", items: footerNav.company },
] as const;

/** V1-parity footer: Let’s talk CTA + sitemap (desktop) + brand mark */
export function V2Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_0%,rgba(70,0,187,0.22),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(107,51,201,0.18),transparent_50%)]"
      />

      {/* Talk CTA — always visible (including mobile) */}
      <div className="relative mx-auto max-w-7xl border-b border-border px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <p className="text-sm font-light tracking-[0.04em] text-muted sm:text-base">
          Got a business that needs a real website?
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <LetsTalkLink href="/contact" className="text-white" />
          <div className="flex flex-col gap-1 pb-1 sm:items-end">
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-sm font-normal text-white/80 transition hover:text-accent sm:text-base"
            >
              {siteConfig.email}
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition hover:text-accent"
            >
              WhatsApp {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Sitemap — tablet/desktop only; hide Explore/Services/Industries/Company on mobile */}
      <div className="relative mx-auto hidden max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:block lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {sitemap.map((column) => (
            <div key={column.title}>
              <p className="mb-5 text-[11px] font-normal uppercase tracking-[0.18em] text-muted">
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
                      className="group relative inline-flex text-[15px] font-normal text-white/75 transition hover:text-white"
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
      </div>

      {/* Bottom brand block — always visible */}
      <div className="relative border-t border-border md:border-t-0">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pt-10 md:border-t md:border-border md:pt-12 lg:px-8">
          <div className="flex flex-col gap-3 text-sm text-muted md:mt-0">
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

          <div className="mt-8 sm:mt-10">
            <BrandLogo variant="footer" linked onDark />
          </div>

          <div className="mt-6 flex flex-col gap-2 text-xs text-muted sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p>
              © {new Date().getFullYear()} {siteConfig.brandName}. All rights
              reserved.
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
