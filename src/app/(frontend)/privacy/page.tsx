import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.brandName}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`How ${siteConfig.brandName} handles information you share through this website.`}
      />
      <Section>
        <Container className="prose-sm max-w-3xl space-y-4 text-muted">
          <p>
            We collect information you voluntarily submit through forms, WhatsApp, or email —
            such as name, business type, city, phone number, and message content — to respond
            to enquiries and deliver services.
          </p>
          <p>
            We do not sell your personal information. Data may be processed using standard
            hosting, analytics, and communication tools required to operate the website and
            respond to you.
          </p>
          <p>
            You can request updates or deletion of your enquiry details by emailing{" "}
            {siteConfig.email}.
          </p>
          <p>This policy may be updated periodically. Last updated: September 2026.</p>
        </Container>
      </Section>
    </>
  );
}
