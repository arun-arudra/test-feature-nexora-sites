"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/LayoutPrimitives";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type MetricCard = {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  desc: string;
  visual: "projects" | "reach" | "rating" | "speed" | "mobile" | "care";
};

const metrics: MetricCard[] = [
  {
    id: "projects",
    value: 1000,
    suffix: "+",
    label: "Projects delivered",
    desc: "Custom-coded websites for restaurants, hotels, clinics, shops, and cloud kitchens across Karnataka & AP.",
    visual: "projects",
  },
  {
    id: "reach",
    value: 50,
    suffix: "+",
    label: "Cities & towns served",
    desc: "From Bangalore to Tier-2 towns — we build for how local customers actually search and enquire.",
    visual: "reach",
  },
  {
    id: "rating",
    value: 4.9,
    decimals: 1,
    label: "Client satisfaction",
    desc: "Clear fixed pricing, daily updates, and WhatsApp support — business owners keep coming back.",
    visual: "rating",
  },
  {
    id: "speed",
    value: 24,
    suffix: "h",
    label: "Quote turnaround",
    desc: "Share your business type and city — get a clear plan, timeline, and fixed price within a day.",
    visual: "speed",
  },
  {
    id: "mobile",
    value: 100,
    suffix: "%",
    label: "Mobile-first builds",
    desc: "Most of your customers are on phones. Every site is designed to convert on a small screen first.",
    visual: "mobile",
  },
  {
    id: "care",
    value: 3,
    suffix: " mo",
    label: "Care included",
    desc: "Packages include post-launch AMC months — backups, small edits, and peace of mind after go-live.",
    visual: "care",
  },
];

export function WhyChooseShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <Section className="band-soft-dark relative overflow-hidden" id="why-us">
      <Container className="relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-dark-text">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Why us
          </span>
          <h2 className="mt-5 font-heading text-2xl font-bold leading-tight text-dark-text sm:text-3xl md:text-4xl">
            Why local businesses choose {siteConfig.shortName} for design & development
          </h2>
          <p className="mt-3 text-sm text-dark-text/70 sm:text-base">
            Logo, custom code, domain, hosting, and AMC — one team, fixed price, built to get you more enquiries.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <motion.article
              key={metric.id}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "group flex h-full flex-col rounded-[1.35rem] border border-border/90 bg-surface p-5 shadow-[var(--shadow-card)] transition duration-300 sm:p-6",
                "hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-card-hover)]",
              )}
            >
              <div>
                <p className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {metric.prefix}
                  <CountUp
                    to={metric.value}
                    suffix={metric.suffix}
                    decimals={metric.decimals ?? 0}
                    duration={1.6}
                  />
                </p>
                <p className="mt-1 text-sm font-semibold text-muted">{metric.label}</p>
              </div>

              <div className="my-6 flex flex-1 items-center justify-center py-2">
                <CardVisual type={metric.visual} reduceMotion={!!reduceMotion} />
              </div>

              <p className="text-sm leading-relaxed text-muted">{metric.desc}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button href="#quote" variant="primary">
            Get a free quote
          </Button>
          <Button
            href={getWhatsAppLink()}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            Talk on WhatsApp
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}

function CardVisual({
  type,
  reduceMotion,
}: {
  type: MetricCard["visual"];
  reduceMotion: boolean;
}) {
  const spin = reduceMotion ? undefined : { rotate: 360 };
  const float = reduceMotion ? undefined : { y: [0, -5, 0] };

  if (type === "projects") {
    return (
      <div className="relative flex h-28 w-36 items-center justify-center">
        <div className="absolute inset-x-6 inset-y-4 rounded-2xl border-2 border-dashed border-primary/25 bg-primary-soft/50" />
        <motion.div
          animate={float}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-accent bg-surface shadow-[var(--glow-amber)]"
        >
          <Rocket className="h-7 w-7 text-primary" />
        </motion.div>
        <span className="absolute bottom-3 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
          Live
        </span>
      </div>
    );
  }

  if (type === "reach") {
    return (
      <div className="relative flex h-28 w-28 items-center justify-center">
        <motion.div
          animate={spin}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-primary/20"
        />
        <motion.div
          animate={spin}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-dashed border-accent/50"
        />
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-mid text-white shadow-md">
          <MapPin className="h-5 w-5" />
        </div>
        {[0, 90, 180, 270].map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-46px)` }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-[9px] font-bold text-primary shadow-sm">
              <Users className="h-3 w-3" />
            </span>
          </span>
        ))}
      </div>
    );
  }

  if (type === "rating") {
    return (
      <div className="relative flex h-28 w-40 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-gradient-to-b from-accent-soft/80 to-surface px-4 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div className="flex gap-0.5 text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <Star className="h-4 w-4 fill-accent" />
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "speed") {
    return (
      <div className="relative flex h-28 w-36 items-center justify-center">
        <motion.div
          animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-accent/30 bg-accent-soft"
        >
          <span className="font-heading text-xl font-bold text-primary">24h</span>
        </motion.div>
        <ShieldCheck className="absolute bottom-2 right-6 h-7 w-7 rounded-full bg-surface p-1 text-primary shadow-md ring-1 ring-border" />
      </div>
    );
  }

  if (type === "mobile") {
    return (
      <div className="relative flex h-28 items-end justify-center gap-2">
        <motion.div
          animate={float}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="h-16 w-10 rounded-lg border-2 border-primary/30 bg-primary-soft"
        />
        <motion.div
          animate={float}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-24 w-14 flex-col overflow-hidden rounded-xl border-2 border-primary bg-surface shadow-[var(--glow-teal)]"
        >
          <div className="h-3 bg-primary" />
          <div className="flex flex-1 items-center justify-center">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
        </motion.div>
        <motion.div
          animate={float}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="h-14 w-16 rounded-lg border-2 border-accent/40 bg-accent-soft"
        />
      </div>
    );
  }

  // care
  return (
    <div className="relative flex h-28 w-36 items-center justify-center">
      <div className="absolute h-20 w-28 rounded-2xl border border-border bg-surface-muted/80" />
      <motion.div
        animate={reduceMotion ? undefined : { y: [6, 0, 6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex items-center gap-2 rounded-xl border border-primary/20 bg-surface px-3 py-2 shadow-[var(--shadow-card)]"
      >
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span className="text-xs font-bold text-primary">AMC on</span>
      </motion.div>
    </div>
  );
}
