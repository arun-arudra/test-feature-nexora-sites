"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type LetsTalkLinkProps = {
  href: string;
  label?: string;
  className?: string;
  external?: boolean;
};

/**
 * Dual-line vertical slide on hover (Catalin-style “LET’S TALK” cue).
 */
export function LetsTalkLink({
  href,
  label = "Let’s talk",
  className,
  external = false,
}: LetsTalkLinkProps) {
  const shared = cn(
    "group relative inline-flex h-[1.05em] overflow-hidden align-baseline font-heading text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-none tracking-[-0.04em] text-dark-text",
    className,
  );

  const layers = (
    <>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full text-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {label}
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={shared}
      >
        {layers}
      </a>
    );
  }

  return (
    <Link href={href} className={shared}>
      {layers}
    </Link>
  );
}
