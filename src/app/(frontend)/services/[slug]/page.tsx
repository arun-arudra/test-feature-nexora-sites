import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Card, Container, Section } from "@/components/ui/LayoutPrimitives";
import { getWhatsAppLink } from "@/config/site";
import { createMetadata } from "@/lib/seo";

type ServiceDetail = {
  title: string;
  description: string;
  who: string;
  includes: string[];
  process: string[];
};

const details: Record<string, ServiceDetail> = {
  "logo-branding": {
    title: "Logo & Brand Identity",
    description:
      "A clear logo and simple brand system so your restaurant, clinic, shop, or hotel looks consistent everywhere.",
    who: "Local businesses launching online for the first time, or refreshing an outdated brand.",
    includes: ["Logo concepts", "Primary color palette", "Font guidance", "Basic usage rules", "Files for web & print"],
    process: ["Understand your business", "Mood & direction", "Logo concepts", "Finalize brand kit"],
  },
  "website-design-development": {
    title: "Website Design & Development",
    description:
      "Custom-coded, mobile-first websites designed to get enquiries — not just look pretty.",
    who: "Restaurants, hotels, hospitals, shops, cloud kitchens, villas, and local service businesses.",
    includes: ["UI/UX design", "Custom development", "Responsive pages", "WhatsApp & forms", "SEO-ready structure"],
    process: ["Discovery", "Design preview", "Build & revisions", "Launch"],
  },
  "domain-hosting": {
    title: "Domain & Hosting",
    description:
      "We purchase/connect your domain, configure DNS, enable SSL, and host your site securely.",
    who: "Business owners who want one team to handle go-live without technical hassle.",
    includes: ["Domain purchase/setup", "DNS configuration", "SSL certificate", "Secure hosting", "Go-live checklist"],
    process: ["Choose domain", "Configure DNS", "Deploy site", "Verify SSL & speed"],
  },
  maintenance: {
    title: "Maintenance / AMC",
    description:
      "Stay online with backups, updates, monitoring, and small content edits after launch.",
    who: "Any business that doesn’t want their website to go stale or break quietly.",
    includes: ["Backups", "Security updates", "Uptime checks", "Small content edits", "Priority support options"],
    process: ["Choose care plan", "Monitor & update", "Monthly summary", "Request small edits anytime"],
  },
  "ai-chatbot": {
    title: "AI Chatbot Integration",
    description:
      "Optional AI chatbot for FAQs, timings, menu questions, and lead capture — with WhatsApp handoff.",
    who: "Hotels, clinics, restaurants, and shops that get repeat questions and want 24/7 first response.",
    includes: ["FAQ knowledge setup", "Lead capture flow", "WhatsApp escape hatch", "Widget design", "Optional monthly care"],
    process: ["Collect FAQs", "Configure bot", "Test on staging", "Launch + monitor"],
  },
  ecommerce: {
    title: "Ecommerce Websites",
    description:
      "Catalog and storefront flows with India-ready payments like UPI/Razorpay and COD options.",
    who: "Local shops and D2C sellers who need an owned store beyond Instagram.",
    includes: ["Product catalog", "Cart/checkout path", "Razorpay/UPI ready", "COD options", "Order enquiry support"],
    process: ["Catalog planning", "Store design", "Payments setup", "Launch & train"],
  },
};

export function generateStaticParams() {
  return Object.keys(details).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = details[slug];
  if (!service) return {};
  return createMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = details[slug];

  if (!service) {
    return (
      <Section>
        <Container>
          <h1 className="text-3xl font-bold">Service not found</h1>
          <Button href="/services" className="mt-6">
            Back to services
          </Button>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} description={service.description}>
        <Button href={getWhatsAppLink(`Hi, I'm interested in ${service.title}.`)} variant="whatsapp" target="_blank" rel="noopener noreferrer">
          WhatsApp about this service
        </Button>
      </PageHero>
      <Section>
        <Container className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-heading text-xl font-bold">Who it’s for</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{service.who}</p>
            <h3 className="mt-6 font-heading text-lg font-bold">What’s included</h3>
            <ul className="mt-3 space-y-2">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="font-heading text-xl font-bold">Process</h2>
            <ol className="mt-4 space-y-3">
              {service.process.map((step, index) => (
                <li key={step} className="rounded-xl bg-surface-muted px-4 py-3 text-sm">
                  <span className="font-semibold text-accent">Step {index + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <Button href="/pricing" variant="secondary" className="mt-6">
              See packages
            </Button>
          </Card>
        </Container>
      </Section>
    </>
  );
}
