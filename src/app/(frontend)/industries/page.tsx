import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Card, Container, Section } from "@/components/ui/LayoutPrimitives";
import { industries } from "@/config/industries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Industries",
  description:
    "Websites for restaurants, hotels, hospitals, cloud kitchens, shops, and villas across Karnataka and Andhra Pradesh.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Websites tailored to how your customers actually buy"
        description="Different businesses need different flows — menus, rooms, appointments, catalogs, or booking enquiries."
      />
      <Section>
        <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Card interactive className="h-full">
                <h2 className="font-heading text-xl font-bold text-primary transition group-hover:text-primary-hover">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{item.short}</p>
                <p className="text-link mt-4 inline-flex items-center gap-1 text-sm">
                  Explore{" "}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </p>
              </Card>
            </Link>
          ))}
        </Container>
      </Section>
    </>
  );
}
