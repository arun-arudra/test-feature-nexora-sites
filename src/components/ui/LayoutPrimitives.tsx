import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-12 sm:py-16 md:py-20", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** soft-dark = cream type on soft-dark bands */
  tone?: "light" | "soft-dark";
}) {
  const dark = tone === "soft-dark";
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]",
            dark ? "text-accent" : "text-primary",
            align === "center" && "mx-auto",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(228,160,26,0.25)]" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-heading text-2xl font-bold leading-tight sm:text-3xl md:text-4xl",
          dark ? "text-dark-text" : "text-text",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed sm:mt-4 sm:text-base md:text-lg",
            dark ? "text-dark-text/70" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Lift + border shift on hover (for clickable or featured surfaces) */
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/90 bg-surface/95 p-5 shadow-[var(--shadow-card)] backdrop-blur-[2px] transition duration-300 ease-out sm:p-6",
        interactive &&
          "hover:-translate-y-1 hover:border-primary/30 hover:bg-surface hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
