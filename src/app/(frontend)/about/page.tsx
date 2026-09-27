import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Card, Container, Section } from "@/components/ui/LayoutPrimitives";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description:
    "Bangalore-based website studio building logo, custom-coded sites, hosting, and maintenance for Karnataka and Andhra businesses.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`${siteConfig.brandName} — websites that bring customers`}
        description="Local businesses deserve better than an Instagram page and an outdated brochure site. We build and care for websites that help you get found and get enquiries."
      />
      <Section>
        <Container className="grid gap-6 lg:grid-cols-2">
          <Card interactive>
            <h2 className="font-heading text-xl font-bold">Why we exist</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Restaurants, hotels, clinics, shops, and cloud kitchens across Karnataka and
              Andhra Pradesh often lose customers because they don’t have a clear, fast,
              mobile-friendly website. We created {siteConfig.shortName} to handle the full
              journey — logo, code, domain, hosting, and maintenance — in one place.
            </p>
          </Card>
          <Card interactive>
            <h2 className="font-heading text-xl font-bold">What we’re good at</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>• Frontend & backend development</li>
              <li>• Databases and secure deployments</li>
              <li>• DevOps-backed hosting reliability</li>
              <li>• Logo & basic brand identity</li>
              <li>• Optional AI chatbot and ecommerce features</li>
            </ul>
          </Card>
          <Card interactive>
            <h2 className="font-heading text-xl font-bold">Our values</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Clarity over jargon. Reliability over hype. Long-term care over one-time dumps.
              We speak like business owners understand — and we build like engineers should.
            </p>
          </Card>
          <Card interactive>
            <h2 className="font-heading text-xl font-bold">Based in Bangalore</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {siteConfig.address}. Serving {siteConfig.serviceAreas.join(" · ")}.
            </p>
            <a
              href={siteConfig.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-primary transition hover:text-primary-hover hover:underline"
            >
              Open in Google Maps
            </a>
            <div className="mt-5 h-40 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(232,163,23,0.35),transparent_45%),linear-gradient(145deg,#0f3d3e,#145456_50%,#0b1f2a)]" />
            <p className="mt-3 text-xs text-muted">Studio / team photo coming soon</p>
          </Card>
        </Container>
        <Container className="mt-8">
          <Button href={getWhatsAppLink()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
            Start a conversation
          </Button>
        </Container>
      </Section>
    </>
  );
}
