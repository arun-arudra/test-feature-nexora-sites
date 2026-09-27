"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  /** Final number to land on */
  to: number;
  /** Optional suffix after the number, e.g. "+" */
  suffix?: string;
  /** Decimal places while counting (rating uses 1) */
  decimals?: number;
  /** Animation length in seconds */
  duration?: number;
  className?: string;
};

export function CountUp({
  to,
  suffix = "",
  decimals = 0,
  duration = 1.7,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduceMotion) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(latest),
    });

    return () => controls.stop();
  }, [inView, to, duration, reduceMotion]);

  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
