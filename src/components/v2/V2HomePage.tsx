import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Code2,
  Globe2,
  MessageCircle,
  Palette,
  Server,
  Wrench,
} from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { CountUp } from "@/components/ui/CountUp";
import { Accordion } from "@/components/ui/Accordion";
import { NewsCarousel } from "@/components/sections/NewsCarousel";
import { HomeCaseStudies } from "@/components/sections/HomeCaseStudies";
import { IndustryShowcase } from "@/components/sections/IndustryShowcase";
import { TestimonialsDeck } from "@/components/sections/TestimonialsDeck";
import { GlowStrokeCard } from "@/components/v2/GlowStrokeCard";
import { packages, addOns } from "@/config/pricing";
import { faqs } from "@/config/faqs";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import type { Testimonial } from "@/types/testimonial";
import type { NewsItem } from "@/config/news";
import type { WorkProject } from "@/types/project";
// import { FaqIllustration } from "@/components/sections/FaqIllustration";

const quoteCta = "Free call · Fixed price · Ready in days";

const industryLabels = [
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

/**
 * Main homepage.
 * Story: offer → services → who we serve → process → proof (work) → price → care → social.
 * Work sits between two light bands (Process → Work → Pricing) so black reads cleanly.
 */
export function V2HomePage({
  testimonials,
  news,
  projects = [],
}: {
  testimonials: Testimonial[];
  news?: NewsItem[];
  projects?: WorkProject[];
}) {
  return (
    <>
      <Hero />
      <Stats />
      <FullStack />
      <Pitch />
      <Services />
      <IndustryShowcase />
      <Process />
      <HomeCaseStudies projects={projects} />
      <Pricing />
      <Amc />
      <TestimonialsDeck items={testimonials} />
      <NewsCarousel items={news} />
      <Faq />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="v2-peach-violet relative flex min-h-[calc(100svh-32px)] flex-col overflow-hidden">
      <div aria-hidden className="v2-violet-glow pointer-events-none absolute -left-20 top-10 h-72 w-72 opacity-70" />
      <div aria-hidden className="v2-violet-glow pointer-events-none absolute -right-16 bottom-0 h-80 w-80 opacity-50" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-normal text-white/90">
              <span className="text-accent">[</span> Bangalore · Karnataka &amp; AP{" "}
              <span className="text-accent">]</span>
            </p>
            <h1 className="mt-5 max-w-xl font-heading text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.1] text-white">
              Get a website that sells while you sleep.
            </h1>
            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-muted sm:text-lg">
              Logo + custom-coded website + domain + hosting + maintenance for restaurants,
              hotels, hospitals, shops &amp; cloud kitchens. Fixed price. Free quote in 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="v2-btn v2-btn-primary px-5 py-3">
                Get a free quote
              </a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-btn v2-btn-ghost px-5 py-3"
              >
                <MessageCircle className="h-4 w-4" />
                Talk to an expert
              </a>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
              {[
                "Custom coded (not a template dump)",
                "Logo + domain + hosting included",
                "Works great on mobile",
                "AMC care after launch",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            id="quote"
            className="relative overflow-hidden rounded-[12px] border border-border bg-surface p-5 sm:p-6"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary-mid"
            />
            <p className="text-xl text-white">Get your free quote</p>
            <p className="mt-1 text-sm text-muted">Fixed price and timeline in 24 hours.</p>
            <div className="mt-5">
              <ContactForm compact />
            </div>
          </div>
        </div>
      </div>
      <IndustryMarquee />
    </section>
  );
}

function IndustryMarquee() {
  const loop = [...industryLabels, ...industryLabels];
  return (
    <div className="overflow-hidden border-y border-border bg-black/50 py-3.5 backdrop-blur-sm">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8 px-6 text-sm font-normal text-white/70 hover:[animation-play-state:paused]">
        {loop.map((label, i) => (
          <span key={`${label}-${i}`} className="flex items-center gap-8">
            {label}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { to: 1000, suffix: "+", label: "Projects delivered", decimals: 0 },
    { to: 10, suffix: "+", label: "Years of craft", decimals: 0 },
    { to: 6, suffix: "", label: "Core services", decimals: 0 },
    { to: 1, suffix: "", label: "Unified team", decimals: 0 },
  ];

  return (
    <section aria-label="Key stats" className="bg-primary text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center px-3 py-10 text-center sm:px-6 sm:py-14 ${
              i % 2 === 1 ? "border-l border-white/20" : ""
            } ${i >= 2 ? "border-t border-white/20 md:border-t-0" : ""} ${
              i > 0 ? "md:border-l md:border-white/20" : ""
            }`}
          >
            <p className="font-heading text-4xl tracking-tight sm:text-5xl md:text-6xl">
              <CountUp to={stat.to} suffix={stat.suffix} decimals={stat.decimals} />
            </p>
            <p className="mt-3 text-[10px] font-normal uppercase tracking-[0.18em] sm:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FullStack() {
  const stack = [
    { icon: Palette, title: "Logo & brand", desc: "Clean identity that looks trusted" },
    { icon: Code2, title: "Custom website", desc: "Coded from scratch, mobile-first" },
    { icon: Globe2, title: "Domain setup", desc: "We buy & connect your .in / .com" },
    { icon: Server, title: "Hosting + SSL", desc: "Secure hosting and go-live" },
    { icon: MessageCircle, title: "WhatsApp leads", desc: "Click-to-chat enquiry flows" },
    { icon: Wrench, title: "AMC care", desc: "Backups, updates, small edits" },
  ];

  return (
    <section className="v2-light py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-[var(--color-light-text)]">
            <span className="text-primary">[</span> What you get{" "}
            <span className="text-primary">]</span>
          </p>
          <h2 className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] text-[var(--color-light-text)]">
            Logo to go-live — one team handles it
          </h2>
          <p className="mt-4 text-base font-light text-[var(--color-light-muted)]">
            Domain, design, code, hosting, and maintenance under one roof. Not five vendors.
          </p>
          <span className="neon-line mx-auto mt-5" aria-hidden />
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((item) => (
            <div key={item.title} className="v2-card-on-light flex gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[var(--color-light-text)]">{item.title}</p>
                <p className="mt-1 text-sm font-light text-[var(--color-light-muted)]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pitch() {
  return (
    <section className="bg-black py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm text-white/90">
            <span className="text-accent">[</span> Website development{" "}
            <span className="text-accent">]</span>
          </p>
          <h2 className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] text-white">
            Stop searching. Your website team is here.
          </h2>
          <p className="mt-4 text-base font-light text-muted">
            From small shops to growing brands, we build websites that look great and bring real
            results.
          </p>
          <span className="neon-line mt-5" aria-hidden />
        </div>
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
                className="flex items-start gap-2 rounded-[10px] border border-border bg-black/40 px-3 py-2 text-sm text-white/85"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
          <a href="#quote" className="v2-btn v2-btn-primary mt-6 px-5 py-3">
            Get a free quote
          </a>
          <p className="mt-2 text-sm text-muted">{quoteCta}</p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      n: "01",
      title: "Logo &\nbrand identity",
      href: "/services/logo-branding",
      icon: Palette,
    },
    {
      n: "02",
      title: "Custom\nwebsite build",
      href: "/services/website-design-development",
      icon: Code2,
    },
    {
      n: "03",
      title: "Domain, hosting\n& SSL",
      href: "/services/domain-hosting",
      icon: Globe2,
    },
    {
      n: "04",
      title: "Maintenance\n& AMC",
      href: "/services/maintenance",
      icon: Wrench,
    },
  ];

  return (
    <section id="services" className="v2-elevated border-y border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl font-heading text-[clamp(2rem,4vw,3.25rem)] text-white">
            Elevate your digital footprint.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services/website-design-development"
              className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-normal text-black transition hover:bg-white/90"
            >
              View all services
            </Link>
            <a
              href={getWhatsAppLink("Hi, I want to start a project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/35 bg-transparent px-5 py-2.5 text-sm font-normal text-white transition hover:bg-white/10"
            >
              Start a project
            </a>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.n}>
              <Link
                href={item.href}
                className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <GlowStrokeCard particles className="h-full w-full px-3">
                  <div className="relative flex flex-col items-center gap-[21px] text-center">
                    <item.icon
                      className="size-7 shrink-0 text-white/55 transition-colors duration-300 group-hover/cell:text-white"
                      strokeWidth={1.35}
                      aria-hidden
                    />
                    <span className="whitespace-pre-line font-heading text-lg leading-snug text-white/55 transition-colors duration-300 group-hover/cell:text-white sm:text-xl">
                      {item.title}
                    </span>
                  </div>
                </GlowStrokeCard>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { title: "Free call", desc: "A quick call to understand what you need." },
    { title: "Fixed price in 24h", desc: "Clear plan, price, and timeline. No hidden costs." },
    { title: "Design & build", desc: "Daily updates so you see real progress." },
    { title: "Launch & support", desc: "We launch your site, train you, and stay with you after go-live." },
  ];

  return (
    <section id="process" className="v2-light py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-[var(--color-light-text)]">
            <span className="text-primary">[</span> How we work{" "}
            <span className="text-primary">]</span>
          </p>
          <h2 className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] text-[var(--color-light-text)]">
            4 simple steps. No surprises.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <article key={step.title} className="v2-card-on-light">
              <p className="text-sm text-primary">0{i + 1}</p>
              <h3 className="mt-2 text-lg text-[var(--color-light-text)]">{step.title}</h3>
              <p className="mt-2 text-sm font-light text-[var(--color-light-muted)]">
                {step.desc}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={getWhatsAppLink("Hi, I want to start my website project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-btn v2-btn-primary px-5 py-3"
          >
            Start my project
          </a>
          <p className="mt-2 text-sm text-[var(--color-light-muted)]">{quoteCta}</p>
        </div>
      </div>
    </section>
  );
}

function Amc() {
  const perks = [
    "Weekly backups & security updates",
    "Uptime checks so you know you’re online",
    "Small content edits (menu, photos, timings)",
    "WhatsApp support for urgent fixes",
  ];

  return (
    <section className="v2-light py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="text-sm text-[var(--color-light-text)]">
            <span className="text-primary">[</span> Maintenance / AMC{" "}
            <span className="text-primary">]</span>
          </p>
          <h2 className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] text-[var(--color-light-text)]">
            Don’t go live and get left alone
          </h2>
          <p className="mt-4 max-w-xl text-sm font-light text-[var(--color-light-muted)] sm:text-base">
            After launch, our AMC plan covers backups, updates, and small edits — so your site
            stays fast, secure, and current without hiring another vendor.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {perks.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[var(--color-light-text)]"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/services/maintenance" className="v2-btn v2-btn-primary px-5 py-3">
              See AMC details
            </Link>
            <a
              href={getWhatsAppLink("Hi, I want a maintenance / AMC plan for my website.")}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn v2-btn-dark px-5 py-3"
            >
              Ask about AMC
            </a>
          </div>
        </div>
        <div className="rounded-[12px] border border-primary/40 bg-primary p-6 text-white">
          <p className="text-sm uppercase tracking-[0.14em] text-white/70">From</p>
          <p className="mt-2 font-heading text-4xl">
            ₹1,999
            <span className="text-lg text-white/75"> / month</span>
          </p>
          <p className="mt-3 text-sm text-white/85">
            Starter packages include 1–3 months care. Extend with monthly AMC when you need
            ongoing edits.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/90">
            {addOns
              .filter((a) => a.name.toLowerCase().includes("maintenance"))
              .map((a) => (
                <li
                  key={a.name}
                  className="flex flex-col gap-1 border-b border-white/15 pb-2 sm:flex-row sm:justify-between"
                >
                  <span>{a.name}</span>
                  <span className="font-normal text-white">{a.price}</span>
                </li>
              ))}
            <li className="flex flex-col gap-1 pt-1 sm:flex-row sm:justify-between">
              <span>Included care in packages</span>
              <span>1–3 months</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-black py-16 text-white sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 h-40 w-72 -translate-x-1/2 rounded-full bg-white/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-[clamp(2.5rem,5vw,4rem)] text-white">
          Pricing
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm font-light text-muted">
          Clear packages in Indian rupees — every project is quoted on its actual scope before
          work begins.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => (
            <GlowStrokeCard key={pkg.id} tall className="h-full">
              <div className="relative flex h-full flex-col p-6 sm:p-7">
                {/*
                  Most popular / recommended badge.
                  To hide: comment out this block (keep pkg.popular in pricing.ts).
                */}
                {pkg.popular ? (
                  <span className="absolute right-5 top-5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-normal uppercase tracking-[0.14em] text-white">
                    Most popular
                  </span>
                ) : null}
                {/* end Most popular badge */}

                <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-muted">
                  {pkg.name}
                </p>
                <p className="mt-4 flex items-baseline gap-2 text-white">
                  <span className="text-sm font-light text-muted">from</span>
                  <span className="font-heading text-[clamp(1.75rem,2.5vw,2.35rem)] tracking-tight">
                    {pkg.price}
                  </span>
                </p>
                <p className="mt-3 min-h-[3rem] text-sm font-light leading-relaxed text-muted">
                  {pkg.bestFor}
                </p>

                <ul className="mt-6 flex-1 space-y-0 border-t border-white/10">
                  {pkg.includes.map((line) => (
                    <li
                      key={line}
                      className="border-b border-white/10 py-3 text-sm font-light text-white/75"
                    >
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <a
                    href={getWhatsAppLink(`Hi, I want the ${pkg.name} package.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-normal text-black transition hover:bg-white/90"
                  >
                    Start a project
                  </a>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 text-sm font-light text-muted transition hover:text-white"
                  >
                    Details <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </GlowStrokeCard>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Need ecommerce, chatbot, or multilingual?{" "}
          <Link
            href="/pricing"
            className="font-normal text-white underline-offset-2 hover:underline"
          >
            See full pricing
          </Link>
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="v2-elevated relative overflow-hidden border-y border-border py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-stretch gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8">
        <div className="relative flex h-full min-h-0 flex-col">
          <div>
            <p className="text-sm text-white/90">
              <span className="text-accent">[</span> FAQ{" "}
              <span className="text-accent">]</span>
            </p>
            <h2 className="mt-3 font-heading text-[clamp(2rem,4vw,3rem)] text-white">
              Questions business owners ask us
            </h2>
            <p className="mt-3 max-w-md text-sm font-light text-muted">
              Clear answers on cost, timeline, SEO, and support — or talk to a real person.
            </p>
            <span className="neon-line mt-5" aria-hidden />
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <a href="#quote" className="v2-btn v2-btn-primary px-5 py-3">
                Get a free quote
              </a>
              <a
                href={getWhatsAppLink("Hi, I have a quick question about your website packages.")}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-btn v2-btn-ghost px-5 py-3"
              >
                WhatsApp us
              </a>
            </div>
            <p className="mt-3 text-xs text-muted">Prefer a call? {siteConfig.phone}</p>
          </div>

          {/* <div className="mt-10 hidden justify-center lg:flex lg:justify-start">
            <FaqIllustration className="w-full max-w-[170px]" />
          </div> */}
        </div>

        <div>
          {/* <FaqIllustration className="mx-auto mb-6 max-w-[160px] lg:hidden" /> */}
          <Accordion items={faqs} variant="panel" />
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-black py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[12px] border border-border lg:grid-cols-[1.1fr_0.9fr]">
          <div className="v2-peach-violet relative px-6 py-12 text-white sm:px-10">
            <div
              aria-hidden
              className="v2-violet-glow pointer-events-none absolute bottom-0 left-1/2 h-64 w-[28rem] -translate-x-1/2 translate-y-1/3 opacity-80"
            />
            <p className="relative text-sm text-white/90">
              <span className="text-accent">[</span> Free call{" "}
              <span className="text-accent">]</span>
            </p>
            <h2 className="relative mt-3 max-w-xl font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] text-white">
              Ready to grow your business online?
            </h2>
            <p className="relative mt-4 text-sm font-light text-muted sm:text-base">
              Tell us about your business. We’ll send a clear plan, timeline, and fixed
              price — no obligation.
            </p>
            <p className="relative mt-3 text-sm text-white/70">
              {siteConfig.address} ·{" "}
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-accent underline decoration-accent/40 underline-offset-2 transition hover:decoration-accent"
              >
                Maps
              </a>
            </p>
            <div className="relative mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-btn v2-btn-primary w-full px-5 py-3 sm:w-auto"
              >
                Talk to our experts
              </a>
              <a
                href={siteConfig.phoneHref}
                className="v2-btn v2-btn-ghost w-full px-5 py-3 sm:w-auto"
              >
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
          <div className="border-t border-border bg-surface px-6 py-10 sm:border-l sm:border-t-0 sm:px-8">
            <p className="font-heading text-xl text-white">Get your free quote</p>
            <p className="mt-1 text-sm font-light text-muted">
              Fixed price and timeline in 24 hours.
            </p>
            <div className="mt-5">
              <ContactForm compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
