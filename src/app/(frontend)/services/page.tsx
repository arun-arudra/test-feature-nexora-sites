import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Badge, Card, Container, Section } from "@/components/ui/LayoutPrimitives";
import { services } from "@/config/services";
import { getWhatsAppLink } from "@/config/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Logo design, custom website development, domain, hosting, maintenance, AI chatbot, and ecommerce for local businesses.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your business needs to go online — and stay online"
        description="From logo and custom code to domain, hosting, maintenance, and optional AI chatbot."
      >
        <Button href={getWhatsAppLink()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
          Talk on WhatsApp
        </Button>
      </PageHero>
      <Section>
        <Container className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <Card key={service.slug} interactive className="group h-full">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-xl font-bold text-text">{service.title}</h2>
                {service.advanced ? (
                  <Badge className="shrink-0 border-primary/20 bg-primary/10 text-primary">
                    Advanced
                  </Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted">{service.short}</p>
              <ul className="mt-4 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="text-link mt-5 inline-flex items-center gap-1 text-sm"
              >
                Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Card>
          ))}
        </Container>
      </Section>
    </>
  );
}
