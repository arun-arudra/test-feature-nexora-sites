import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import { Card, Container, Section } from "@/components/ui/LayoutPrimitives";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "WhatsApp, call, or send an enquiry to get a website package recommendation for your business.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about your business"
        description={`${siteConfig.responseTime}. Serving Karnataka, Andhra Pradesh, and nearby cities.`}
      />
      <Section>
        <Container className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h2 className="font-heading text-xl font-bold">Prefer WhatsApp?</h2>
            <p className="mt-2 text-sm text-muted">
              Fastest way to start. Share your business type and city.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button
                href={getWhatsAppLink()}
                variant="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center"
              >
                WhatsApp us
              </Button>
              <Button href={siteConfig.phoneHref} variant="secondary" className="w-full justify-center">
                Call {siteConfig.phone}
              </Button>
              <Button
                href={`mailto:${siteConfig.email}`}
                variant="ghost"
                className="w-full justify-center break-all sm:break-normal"
              >
                {siteConfig.email}
              </Button>
            </div>
            <div className="mt-8 rounded-2xl border border-border bg-surface-muted/80 p-4 text-sm text-muted">
              <p className="font-semibold text-text">Studio</p>
              <p className="mt-1">{siteConfig.address}</p>
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-semibold text-primary transition hover:text-primary-hover hover:underline"
              >
                Open in Google Maps
              </a>
              <p className="mt-3 font-semibold text-text">Service areas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {siteConfig.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="font-heading text-xl font-bold">Send an enquiry</h2>
            <p className="mt-2 text-sm text-muted">We’ll recommend the right package for your needs.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
}
