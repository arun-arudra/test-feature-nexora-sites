import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe2,
  MessageCircle,
  Palette,
  Server,
  Wrench,
} from "lucide-react";
import { faqs } from "@/config/faqs";
import { packages, addOns } from "@/config/pricing";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  Badge,
  Card,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui/LayoutPrimitives";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { IndustryShowcase } from "@/components/sections/IndustryShowcase";
import { HomeCaseStudies } from "@/components/sections/HomeCaseStudies";
import { TestimonialsDeck } from "@/components/sections/TestimonialsDeck";
// import { FaqIllustration } from "@/components/sections/FaqIllustration";
import type { Testimonial } from "@/types/testimonial";
import { cn } from "@/lib/utils";

const quoteCta = "Free call · Fixed price · Ready in days";

export function HeroSection() {
  return (
    <Section className="relative overflow-hidden pb-8 pt-8 sm:pb-12 sm:pt-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 atmosphere-warm" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl motion-safe:animate-[soft-float_8s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl motion-safe:animate-[soft-float_10s_ease-in-out_infinite]"
      />
      <Container className="relative grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <p className="mb-3 inline-flex flex-wrap items-center gap-2 text-sm font-semibold text-primary sm:mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(228,160,26,0.3)]" />
            Bangalore · Karnataka & Andhra Pradesh
          </p>
          <h1 className="max-w-xl font-heading text-[1.75rem] font-bold leading-[1.15] text-text sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Get a website that{" "}
            <span className="bg-gradient-to-r from-primary via-primary-mid to-primary bg-clip-text text-transparent">
              sells while you sleep.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-base md:text-lg">
            Logo + custom-coded website + domain + hosting + maintenance for restaurants,
            hotels, hospitals, shops & cloud kitchens. Fixed price. Free quote in 24 hours.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button href="#quote" variant="primary" className="w-full sm:w-auto">
              Get a free quote
            </Button>
            <Button
              href={getWhatsAppLink()}
              variant="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Talk to an expert
            </Button>
          </div>
          <ul className="mt-8 grid gap-2 text-sm font-medium text-text sm:grid-cols-2">
            {[
              "Custom coded (not a template dump)",
              "Logo + domain + hosting included",
              "Works great on mobile",
              "AMC care after launch",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-lg px-1 py-0.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-mid" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div
            id="quote"
            className="relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface/95 p-5 shadow-[var(--glow-teal)] transition duration-300 hover:border-accent/40 hover:shadow-[var(--glow-amber)] sm:p-6"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary-mid"
            />
            <p className="font-heading text-xl font-bold text-text">Get your free quote</p>
            <p className="mt-1 text-sm text-muted">Fixed price and timeline in 24 hours.</p>
            <div className="mt-5">
              <ContactForm compact />
            </div>
          </div>
        </Reveal>
      </Container>

      <IndustryMarquee />
    </Section>
  );
}

function IndustryMarquee() {
  const labels = [
    "E-commerce",
    "Restaurants",
    "Education",
    "Real estate",
    "Tourism",
    "Healthcare",
    "Beauty",
    "Finance",
    "Logistics",
    "Manufacturing",
  ];
  const loop = [...labels, ...labels];

  return (
    <div className="mt-10 overflow-hidden border-y border-border/60 bg-gradient-to-r from-primary-soft/40 via-surface/70 to-accent-soft/50 py-3.5">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8 px-6 text-sm font-semibold text-primary/80 hover:[animation-play-state:paused]">
        {loop.map((label, i) => (
          <span key={`${label}-${i}`} className="flex items-center gap-8 transition hover:text-primary">
            {label}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function StatsSection() {
  const stats = [
    { to: 1000, suffix: "+", label: "Projects delivered", decimals: 0 },
    { to: 10, suffix: "+", label: "Years of craft", decimals: 0 },
    { to: 6, suffix: "", label: "Core services", decimals: 0 },
    { to: 1, suffix: "", label: "Unified team", decimals: 0 },
  ];

  return (
    <section
      aria-label="Key stats"
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-[#18d45a] text-[#0c1210]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-10 text-center sm:px-6 sm:py-14",
              i % 2 === 1 && "border-l border-black/15",
              i >= 2 && "border-t border-black/15 md:border-t-0",
              i > 0 && "md:border-l md:border-black/15",
            )}
          >
            <p className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <CountUp to={stat.to} suffix={stat.suffix} decimals={stat.decimals} />
            </p>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.22em]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Research gap: full care stack visible on homepage */
export function FullStackSection() {
  const stack = [
    { icon: Palette, title: "Logo & brand", desc: "Clean identity that looks trusted", href: "/services/logo-branding" },
    { icon: Code2, title: "Custom website", desc: "Coded from scratch, mobile-first", href: "/services/website-design-development" },
    { icon: Globe2, title: "Domain setup", desc: "We buy & connect your .in / .com", href: "/services/domain-hosting" },
    { icon: Server, title: "Hosting + SSL", desc: "Secure hosting and go-live", href: "/services/domain-hosting" },
    { icon: MessageCircle, title: "WhatsApp leads", desc: "Click-to-chat enquiry flows", href: "/services/website-design-development" },
    { icon: Wrench, title: "AMC care", desc: "Backups, updates, small edits", href: "/services/maintenance" },
  ];

  return (
    <Section className="band-soft-dark relative overflow-hidden">
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            What you get
          </p>
          <h2 className="font-heading text-3xl font-bold text-dark-text sm:text-4xl">
            Logo to go-live — one team handles it
          </h2>
          <p className="mt-4 text-base leading-relaxed text-dark-text/75 sm:text-lg">
            Domain, design, code, hosting, and maintenance under one roof. Not five vendors.
          </p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((item, i) => (
            <Reveal key={item.title} delay={i * 40}>
              <Link
                href={item.href}
                className="flex h-full gap-3 rounded-2xl border border-white/15 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/14 hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)]"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-heading font-bold text-dark-text">{item.title}</p>
                  <p className="mt-1 text-sm text-dark-text/75">{item.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function PitchSection() {
  return (
    <Section className="relative overflow-hidden bg-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 atmosphere-muted" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Website development"
          title="Stop searching. Your website team is here."
          description="From small shops to growing brands, we build websites that look great and bring real results."
        />
        <div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Fixed price, no hidden costs",
              "Dedicated project manager",
              "Google-friendly page speed",
              "Payment gateway integration",
              "Content & image support",
              "Post-launch training",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-transparent bg-surface/70 px-3 py-2 text-sm text-text shadow-sm transition hover:border-primary/15 hover:bg-surface hover:shadow-[var(--shadow-card)]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-mid" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button href="#quote" variant="primary">
              Get a free quote
            </Button>
            <p className="mt-2 text-sm text-muted">{quoteCta}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function ServicesSection() {
  const items = [
    {
      n: "01",
      title: "Logo & brand identity",
      desc: "A clean logo, colors, and fonts so your restaurant, clinic, or shop looks trusted from day one.",
      tags: ["Logo concepts", "Brand kit"],
      href: "/services/logo-branding",
    },
    {
      n: "02",
      title: "Custom website build",
      desc: "A brand-new, custom-coded site made for your business — designed to turn visitors into customers.",
      tags: ["Not a template dump", "Ready in days"],
      href: "/services/website-design-development",
    },
    {
      n: "03",
      title: "Domain, hosting & SSL",
      desc: "We buy the domain, set DNS, enable SSL, and host your site so you don’t juggle vendors.",
      tags: ["Domain + hosting", "Secure go-live"],
      href: "/services/domain-hosting",
    },
    {
      n: "04",
      title: "Maintenance / AMC",
      desc: "Updates, backups, uptime checks, and small content edits after launch — named care plan.",
      tags: ["Monthly AMC", "Small edits"],
      href: "/services/maintenance",
    },
  ];

  return (
    <Section className="band-soft-dark" id="services">
      <Container>
        <SectionHeading
          align="center"
          tone="soft-dark"
          title="Your business. Our team. A website that sells."
          description="Logo, site, domain, hosting, and AMC — everything under one roof."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.n} delay={i * 50}>
              <Card className="group h-full" interactive>
                <p className="text-xs font-bold tracking-[0.16em] text-accent">{item.n}</p>
                <p className="mt-3 font-heading text-xl font-bold text-text">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-primary transition group-hover:bg-primary/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={item.href}
                  className="text-link mt-5 inline-flex items-center gap-1 text-sm"
                >
                  Get a quote{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="#quote" variant="primary">
            Get a free quote
          </Button>
          <p className="mt-2 text-sm text-dark-text/65">{quoteCta}</p>
        </div>
      </Container>
    </Section>
  );
}

/** Named Maintenance / AMC product band */
export function AmcSection() {
  const perks = [
    "Weekly backups & security updates",
    "Uptime checks so you know you’re online",
    "Small content edits (menu, photos, timings)",
    "WhatsApp support for urgent fixes",
  ];

  return (
    <Section className="band-soft-dark">
      <Container className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge className="border-white/20 bg-white/10 text-dark-text">
            Maintenance / AMC
          </Badge>
          <h2 className="mt-4 font-heading text-3xl font-bold text-dark-text sm:text-4xl">
            Don’t go live and get left alone
          </h2>
          <p className="mt-4 max-w-xl text-dark-text/70">
            After launch, our AMC plan covers backups, updates, and small edits — so your
            site stays fast, secure, and current without hiring another vendor.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {perks.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-dark-text/90">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/services/maintenance" variant="primary">
              See AMC details
            </Button>
            <Button
              href={getWhatsAppLink("Hi, I want a maintenance / AMC plan for my website.")}
              variant="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ask about AMC
            </Button>
          </div>
        </div>
        <Card className="relative overflow-hidden border-transparent bg-gradient-to-br from-primary via-primary to-primary-mid text-white shadow-[var(--shadow-dark)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/25 blur-2xl"
          />
          <p className="relative text-sm font-semibold uppercase tracking-[0.14em] text-accent">
            From
          </p>
          <p className="relative mt-2 font-heading text-4xl font-bold">
            ₹1,999
            <span className="text-lg font-semibold text-white/75"> / month</span>
          </p>
          <p className="relative mt-3 text-sm text-white/85">
            Starter packages include 1–3 months care. Extend with monthly AMC when you need ongoing edits.
          </p>
          <ul className="relative mt-6 space-y-2 text-sm text-white/90">
            {addOns.filter((a) => a.name.toLowerCase().includes("maintenance")).map((a) => (
              <li
                key={a.name}
                className="flex flex-col gap-1 border-b border-white/15 pb-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <span>{a.name}</span>
                <span className="shrink-0 font-semibold text-accent">{a.price}</span>
              </li>
            ))}
            <li className="flex flex-col gap-1 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span>Included care in packages</span>
              <span className="shrink-0 font-semibold text-accent">1–3 months</span>
            </li>
          </ul>
        </Card>
      </Container>
    </Section>
  );
}

/** Homepage pricing — Nordpixel-style cards, Nexora colors */
export function PricingTeaserSection() {
  return (
    <Section id="pricing" className="bg-surface-muted/40">
      <Container className="max-w-7xl">
        <SectionHeading
          align="center"
          eyebrow="Packages"
          title="Clear packages. Fixed prices."
          description="Logo, website, domain, hosting, and care — pick a starting point. Exact quote after a short call."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 50}>
              <article
                className={cn(
                  "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6",
                  pkg.popular
                    ? "border-primary shadow-[var(--glow-teal)]"
                    : "border-border/90",
                )}
              >
                {pkg.popular ? (
                  <div className="absolute inset-x-0 top-0 bg-primary px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-dark-text">
                    Most popular
                  </div>
                ) : null}

                <div className={cn("flex flex-1 flex-col", pkg.popular && "pt-6")}>
                  <PackageMark index={i} />

                  <h3 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-text">
                    {pkg.name}
                  </h3>
                  <p className="mt-2 min-h-[2.75rem] text-sm leading-relaxed text-muted">
                    {pkg.bestFor}
                  </p>

                  <p className="mt-6 font-heading text-[1.85rem] font-extrabold tracking-tight text-primary sm:text-[2rem]">
                    {pkg.price}
                  </p>
                  <p className="mt-1 text-xs text-muted">{pkg.note}</p>

                  <Button
                    href={
                      pkg.popular
                        ? getWhatsAppLink(`Hi, I want the ${pkg.name} package.`)
                        : "#quote"
                    }
                    variant={pkg.popular ? "dark" : "secondary"}
                    className="mt-5 w-full rounded-full"
                    {...(pkg.popular
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {pkg.cta}
                  </Button>

                  <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                    Services
                  </p>
                  <ul className="mt-3 flex-1 space-y-2.5">
                    {pkg.includes.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-sm text-text">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/45" />
                        <span className="leading-snug">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Need ecommerce, chatbot, or multilingual detail?{" "}
          <Link href="/pricing" className="font-semibold text-primary underline-offset-2 hover:underline">
            See full pricing
          </Link>
        </p>
      </Container>
    </Section>
  );
}

function PackageMark({ index }: { index: number }) {
  const patterns = [
    "bg-[linear-gradient(135deg,var(--color-primary)_25%,transparent_25%),linear-gradient(225deg,var(--color-primary)_25%,transparent_25%),linear-gradient(45deg,var(--color-primary)_25%,transparent_25%),linear-gradient(315deg,var(--color-primary)_25%,#e4efef_25%)] bg-[length:12px_12px]",
    "bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_3px,transparent_3px,transparent_8px)]",
    "bg-[radial-gradient(circle_at_30%_30%,var(--color-accent)_0_22%,transparent_23%),radial-gradient(circle_at_70%_70%,var(--color-primary)_0_22%,#e4efef_23%)]",
    "bg-[linear-gradient(90deg,var(--color-primary)_50%,#e4efef_50%),linear-gradient(0deg,var(--color-primary-mid)_50%,#e4efef_50%)] bg-[length:10px_10px]",
  ];

  return (
    <div
      aria-hidden
      className={cn(
        "h-11 w-11 overflow-hidden rounded-lg border border-border bg-primary-soft",
        patterns[index % patterns.length],
      )}
    />
  );
}

export function ProcessSection() {
  const steps = [
    { title: "Free call", desc: "A quick call to understand what you need." },
    { title: "Fixed price in 24h", desc: "Clear plan, price, and timeline. No hidden costs." },
    { title: "Design & build", desc: "Daily updates so you see real progress." },
    { title: "Launch & support", desc: "We launch your site, train you, and stay with you after go-live." },
  ];

  return (
    <Section className="bg-bg" id="process">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How we work"
          title="4 simple steps. No surprises."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <Card className="h-full" interactive>
                <p className="text-sm font-bold text-accent">0{index + 1}</p>
                <p className="mt-2 font-heading text-lg font-bold text-text">{step.title}</p>
                <p className="mt-2 text-sm text-muted">{step.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href={getWhatsAppLink("Hi, I want to start my website project.")} variant="whatsapp" target="_blank" rel="noopener noreferrer">
            Start my project
          </Button>
          <p className="mt-2 text-sm text-muted">{quoteCta}</p>
        </div>
      </Container>
    </Section>
  );
}

export function IndustriesSection() {
  return <IndustryShowcase />;
}

export function PortfolioSection({
  projects = [],
}: {
  projects?: import("@/types/project").WorkProject[];
}) {
  return <HomeCaseStudies projects={projects} />;
}

/** Removed from V2 homepage — kept as no-op for any leftover imports. */
export function WhyUsSection() {
  return null;
}

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  return <TestimonialsDeck items={items} />;
}

export { NewsCarousel as NewsSection } from "@/components/sections/NewsCarousel";

export function FaqSection() {
  return (
    <Section className="band-soft-dark relative overflow-hidden" id="faq">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
      />
      <Container className="relative grid items-stretch gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="flex min-h-0 flex-col">
          <SectionHeading
            tone="soft-dark"
            eyebrow="FAQ"
            title="Questions business owners ask us"
            description="Clear answers on cost, timeline, SEO, and support — or talk to a real person."
          />
          <div className="mt-8">
            <div className="flex flex-wrap gap-3">
              <Button href="#quote" variant="primary">
                Get a free quote
              </Button>
              <Button
                href={getWhatsAppLink()}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/15 text-white hover:bg-white/10"
              >
                WhatsApp us
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/55">Prefer a call? {siteConfig.phone}</p>
          </div>
          {/* <div className="mt-10 hidden justify-center lg:flex lg:justify-start">
            <FaqIllustration className="w-full max-w-[170px]" />
          </div> */}
        </div>
        <div>
          {/* <FaqIllustration className="mx-auto mb-6 max-w-[180px] lg:hidden" /> */}
          <Accordion items={faqs} variant="panel" />
        </div>
      </Container>
    </Section>
  );
}

export function FinalCtaSection() {
  return (
    <Section>
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] shadow-[var(--shadow-dark)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="band-cta relative px-6 py-12 text-white sm:px-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
            />
            <p className="relative inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(228,160,26,0.28)]" />
              Free call
            </p>
            <h2 className="relative mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              Ready to grow your business online?
            </h2>
            <p className="relative mt-4 text-white/85">
              Tell us about your business. We’ll send a clear plan, timeline, and fixed
              price — no obligation.
            </p>
            <p className="relative mt-3 text-sm text-white/75">
              {siteConfig.address} ·{" "}
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent underline decoration-accent/40 underline-offset-2 transition hover:text-accent-soft hover:decoration-accent"
              >
                Maps
              </a>
            </p>
            <div className="relative mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                href={getWhatsAppLink()}
                variant="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to our experts
              </Button>
              <Button
                href={siteConfig.phoneHref}
                variant="secondary"
                className="w-full border-white/30 bg-white/10 text-white shadow-none hover:border-white/50 hover:bg-white/18 hover:text-white sm:w-auto"
              >
                Call {siteConfig.phone}
              </Button>
            </div>
          </div>
          <div className="border-t border-border bg-surface px-6 py-10 sm:border-l sm:border-t-0 sm:px-8">
            <p className="font-heading text-xl font-bold text-text">Get your free quote</p>
            <p className="mt-1 text-sm text-muted">Fixed price and timeline in 24 hours.</p>
            <div className="mt-5">
              <ContactForm compact />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
