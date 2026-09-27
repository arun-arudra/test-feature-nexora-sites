import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Card, Container, Section } from "@/components/ui/LayoutPrimitives";
import { industries } from "@/config/industries";
import { getWhatsAppLink } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return createMetadata({
    title: `${industry.title} Websites`,
    description: industry.short,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);

  if (!industry) {
    return (
      <Section>
        <Container>
          <h1 className="text-3xl font-bold">Industry not found</h1>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={`${industry.title} websites that get enquiries`}
        description={industry.short}
      >
        <Button
          href={getWhatsAppLink(`Hi, I need a website for my ${industry.title} business.`)}
          variant="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp us
        </Button>
      </PageHero>
      <Section>
        <Container className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-heading text-xl font-bold">Common problems</h2>
            <ul className="mt-4 space-y-3">
              {industry.problems.map((p) => (
                <li key={p} className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-muted">
                  {p}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="font-heading text-xl font-bold">What we build</h2>
            <ul className="mt-4 space-y-2">
              {industry.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-semibold text-primary">{industry.outcome}</p>
            <Button href="/pricing" variant="secondary" className="mt-6">
              See packages
            </Button>
          </Card>
        </Container>
      </Section>
    </>
  );
}
