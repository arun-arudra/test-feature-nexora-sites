import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.brandName}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Basic terms for using this website and engaging our services."
      />
      <Section>
        <Container className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
          <p>
            By using {siteConfig.brandName}&apos;s website or services, you agree to communicate
            accurate business details and respect project timelines agreed in writing.
          </p>
          <p>
            Website packages, timelines, and deliverables are confirmed per project proposal.
            Domain ownership and source handoff terms are specified in each engagement.
          </p>
          <p>
            Pricing shown on this site is indicative starting ranges and may change based on
            scope. Final commercials are shared before work begins.
          </p>
          <p>
            For questions, contact {siteConfig.email} or WhatsApp {siteConfig.phone}.
          </p>
        </Container>
      </Section>
    </>
  );
}
