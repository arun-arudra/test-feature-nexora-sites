"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="theme-v2 relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-black px-4 py-20 text-center text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(70,0,187,0.35),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(107,51,201,0.2),transparent_45%)]"
      />

      {/* Floating illustration */}
      <motion.div
        className="relative mb-10 h-48 w-48 sm:h-56 sm:w-56"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-dashed border-white/15"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border border-border bg-surface shadow-[0_0_48px_rgba(70,0,187,0.45)] sm:h-32 sm:w-32">
            <span className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl">
              404
            </span>
            <motion.span
              aria-hidden
              className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-primary"
              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <motion.span
              aria-hidden
              className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-accent"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative z-10 max-w-lg"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Page not found
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          This page is not available
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          The link may be broken, or the page may have moved. Head back home or
          explore the site — we&apos;ll get you where you need to go.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:border-primary/40 hover:text-white"
          >
            <Compass className="h-4 w-4" />
            Browse news
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
