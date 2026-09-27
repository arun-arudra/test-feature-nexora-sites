import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "whatsapp" | "ghost" | "dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-accent to-accent-hover text-accent-foreground shadow-[var(--shadow-cta)] hover:brightness-[1.04] hover:shadow-[0_16px_40px_rgba(228,160,26,0.36)]",
  secondary:
    "bg-surface text-text border border-border shadow-sm hover:border-primary/35 hover:bg-primary-soft/60 hover:shadow-[var(--shadow-card)]",
  whatsapp:
    "bg-whatsapp text-white shadow-[0_10px_28px_rgba(34,197,94,0.28)] hover:bg-whatsapp-hover hover:shadow-[0_14px_34px_rgba(34,197,94,0.35)]",
  ghost: "bg-transparent text-text hover:bg-primary-soft/70",
  dark:
    "bg-gradient-to-b from-primary-mid to-primary text-white shadow-[var(--glow-teal)] hover:brightness-110",
};

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
