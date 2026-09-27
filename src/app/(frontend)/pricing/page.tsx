import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Card, Container, Section } from "@/components/ui/LayoutPrimitives";
import { addOns, packages } from "@/config/pricing";
import { getWhatsAppLink } from "@/config/site";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Pricing",
  description:
    "Transparent INR website packages for local businesses in Karnataka and Andhra Pradesh — starter, growth, business, and custom plans.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple packages. Clear INR ranges."
        description="No hidden lock-in to start. Maintenance continues only if you want ongoing care after the included period."
      />
      <Section className="bg-surface-muted/40">
        <Container className="grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg, i) => (
            <article
              key={pkg.id}
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6",
                pkg.popular
                  ? "border-primary shadow-[var(--glow-teal)]"
                  : "border-border/90",
              )}
            >
              {pkg.popular ? (
                <div className="absolute inset-x-0 top-0 bg-primary px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-dark-text">
                  Most popular
                </div>
              ) : null}

              <div className={cn("flex flex-1 flex-col", pkg.popular && "pt-6")}>
                <div
                  aria-hidden
                  className={cn(
                    "h-11 w-11 overflow-hidden rounded-lg border border-border bg-primary-soft",
                    [
                      "bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_3px,transparent_3px,transparent_8px)]",
                      "bg-[radial-gradient(circle_at_30%_30%,var(--color-accent)_0_22%,transparent_23%),radial-gradient(circle_at_70%_70%,var(--color-primary)_0_22%,#e4efef_23%)]",
                      "bg-[linear-gradient(90deg,var(--color-primary)_50%,#e4efef_50%),linear-gradient(0deg,var(--color-primary-mid)_50%,#e4efef_50%)] bg-[length:10px_10px]",
                      "bg-[linear-gradient(135deg,var(--color-primary)_25%,transparent_25%),linear-gradient(225deg,var(--color-primary)_25%,transparent_25%),linear-gradient(45deg,var(--color-primary)_25%,transparent_25%),linear-gradient(315deg,var(--color-primary)_25%,#e4efef_25%)] bg-[length:12px_12px]",
                    ][i % 4],
                  )}
                />

                <h2 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-text">
                  {pkg.name}
                </h2>
                <p className="mt-2 min-h-[2.75rem] text-sm leading-relaxed text-muted">
                  {pkg.bestFor}
                </p>
                <p className="mt-6 font-heading text-[1.85rem] font-extrabold tracking-tight text-primary">
                  {pkg.price}
                </p>
                <p className="mt-1 text-xs text-muted">{pkg.note}</p>

                <Button
                  href={getWhatsAppLink(`Hi, I'm interested in the ${pkg.name} package.`)}
                  variant={pkg.popular ? "dark" : "secondary"}
                  className="mt-5 w-full rounded-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pkg.cta}
                </Button>

                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  Services
                </p>
                <ul className="mt-3 flex-1 space-y-2.5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/45" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </Container>
      </Section>
      <Section className="pt-0">
        <Container>
          <h2 className="font-heading text-2xl font-bold">Add-ons</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {addOns.map((item) => (
              <Card key={item.name} interactive className="flex items-center justify-between gap-4 py-4">
                <p className="text-sm font-semibold text-text">{item.name}</p>
                <p className="shrink-0 text-sm font-medium text-primary">{item.price}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Custom quote available for multi-branch businesses, large villas, and advanced portals.
          </p>
        </Container>
      </Section>
    </>
  );
}
