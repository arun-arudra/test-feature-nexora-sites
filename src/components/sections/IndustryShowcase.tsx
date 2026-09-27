"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getWhatsAppLink } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/LayoutPrimitives";
import {
  AnimatedIndustryIcon,
  type IndustryIconType,
} from "@/components/icons/AnimatedIndustryIcons";

type ShowcaseItem = {
  label: string;
  href: string;
  icon: IndustryIconType;
};

const items: ShowcaseItem[] = [
  { label: "E-commerce", href: "/industries/shops-ecommerce", icon: "ecommerce" },
  { label: "Restaurant", href: "/industries/restaurants", icon: "restaurant" },
  { label: "Education", href: "/industries/education", icon: "education" },
  { label: "Real estate", href: "/industries/real-estate", icon: "realestate" },
  { label: "Tourism", href: "/industries/hotels-resorts", icon: "tourism" },
  { label: "Healthcare", href: "/industries/hospitals-clinics", icon: "healthcare" },
  { label: "Beauty", href: "/industries/beauty", icon: "beauty" },
  { label: "Finance", href: "/industries/finance", icon: "finance" },
];

export function IndustryShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <Section className="band-soft-dark relative overflow-hidden" id="industries">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
      />

      <Container className="relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          <SectionHeading
            align="center"
            tone="soft-dark"
            eyebrow="Industries we work for"
            title="Made for your industry · not a copy-paste template"
            description="From restaurants to clinics — we design the flow your customers actually use."
          />
        </motion.div>

        {/* Icon-forward editorial grid — no white cards / peach frames */}
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-12 sm:gap-x-4 sm:gap-y-4 md:grid-cols-4 md:gap-x-6">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={item.href}
                className="group relative flex h-full flex-col items-center rounded-2xl px-2 py-4 text-center transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-soft-dark sm:px-3 sm:py-6"
              >
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-2 flex h-20 w-20 items-center justify-center sm:mb-4 sm:h-24 sm:w-24 md:h-[6.25rem] md:w-[6.25rem]">
                    {/* White-tile wrap for original GIFs — restore with:
                    rounded-2xl bg-bg/95 */}
                    <AnimatedIndustryIcon
                      type={item.icon}
                      className="h-[85%] w-[85%]"
                    />
                  </div>

                  <p className="font-heading text-sm font-bold text-dark-text transition-colors duration-300 group-hover:text-accent sm:text-base md:text-lg">
                    {item.label}
                  </p>
                  <span className="mt-2 h-[2px] w-6 rounded-full bg-accent transition-all duration-300 group-hover:w-11" />
                  <span className="mt-2 flex h-4 items-center gap-1 text-xs font-semibold text-dark-text/65 transition-all duration-300 group-hover:gap-1.5 group-hover:text-accent group-focus-visible:text-accent">
                    View
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-10 flex flex-col items-center"
        >
          <Button
            href={getWhatsAppLink("Hi, I want a quote for my industry website.")}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get a quote for your industry
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-sm text-dark-text/65">Free call · Fixed price · Ready in days</p>
        </motion.div>
      </Container>
    </Section>
  );
}
