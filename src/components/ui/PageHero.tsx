import { ReactNode } from "react";
import { Container } from "@/components/ui/LayoutPrimitives";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/80 py-10 sm:py-14 md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 atmosphere-warm" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-accent/15 blur-3xl"
      />
      <Container className="relative max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(228,160,26,0.25)]" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-2xl font-bold leading-tight text-text sm:text-3xl md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base md:text-lg">
          {description}
        </p>
        {children ? <div className="mt-5 sm:mt-6">{children}</div> : null}
      </Container>
    </section>
  );
}
