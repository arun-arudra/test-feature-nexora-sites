"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  variant = "default",
}: {
  items: readonly { q: string; a: string }[] | { q: string; a: string }[];
  /** `panel` = cleaner list for split FAQ layouts (V2) */
  variant?: "default" | "panel";
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div
      className={cn(
        variant === "panel" ? "divide-y divide-border border-b border-border" : "space-y-3",
      )}
    >
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden transition duration-300",
              variant === "default" && "rounded-2xl border border-border bg-surface",
              variant === "default" &&
                isOpen &&
                "border-primary/25 shadow-[var(--shadow-card-hover)]",
            )}
          >
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between gap-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                variant === "default" && "px-5 py-4 hover:bg-primary-soft/50",
                variant === "panel" && "px-1 py-5 hover:text-white sm:px-2",
              )}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span
                className={cn(
                  "pr-1 sm:text-base",
                  variant === "default" && "text-sm font-semibold text-text",
                  variant === "panel" && "text-[15px] font-normal text-white/90",
                )}
              >
                {item.q}
              </span>
              <span
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300",
                  variant === "panel" && isOpen && "bg-primary text-white",
                  variant === "panel" && !isOpen && "text-muted",
                )}
              >
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition duration-300",
                    variant === "default" && "text-muted",
                    variant === "default" && isOpen && "rotate-180 text-primary",
                    variant === "panel" && !isOpen && "text-muted",
                    isOpen && "rotate-180",
                  )}
                />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "text-sm leading-relaxed text-muted",
                    variant === "default" && "border-t border-border px-5 py-4",
                    variant === "panel" && "px-1 pb-5 pt-0 sm:px-2",
                  )}
                >
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
