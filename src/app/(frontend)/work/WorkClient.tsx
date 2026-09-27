"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/config/site";
import type { WorkProject } from "@/types/project";
import { cn } from "@/lib/utils";

export function WorkClient({ projects }: { projects: WorkProject[] }) {
  const filters = useMemo(() => {
    const cats = Array.from(
      new Set(projects.map((p) => p.industry || p.category).filter(Boolean)),
    );
    return ["All", ...cats];
  }, [projects]);

  const [filter, setFilter] = useState("All");
  const items = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((p) => (p.industry || p.category) === filter),
    [filter, projects],
  );

  return (
    <div className="theme-v2 bg-black text-white">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(70,0,187,0.4),transparent_52%),radial-gradient(ellipse_at_95%_70%,rgba(107,51,201,0.18),transparent_42%)]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm text-muted">
            <span className="text-primary">[</span> Work{" "}
            <span className="text-primary">]</span>
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-[clamp(2.25rem,5vw,3.75rem)] tracking-tight">
            Selected projects
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
            Design and development case studies — websites and digital products
            built for real businesses.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {filters.length > 1 ? (
          <div className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1 sm:mb-12 sm:flex-wrap sm:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-[10px] px-4 py-2 text-sm transition",
                  filter === item
                    ? "bg-primary text-white"
                    : "border border-border text-muted hover:border-primary/40 hover:text-white",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}

        {items.length === 0 ? (
          <p className="rounded-[12px] border border-border bg-surface px-4 py-10 text-center text-muted">
            No projects in this filter yet.
          </p>
        ) : (
          <ul className="grid list-none grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-14 lg:gap-x-8 lg:gap-y-16">
            {items.map((project, index) => {
              const blurb = project.excerpt || project.subtitle || project.blurb;
              const featured = index === 0 && filter === "All";
              return (
                <li
                  key={project.id}
                  className={cn(featured ? "sm:col-span-2" : "")}
                >
                  <Link href={`/work/${project.slug}`} className="group block">
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-[1.35rem] bg-surface",
                        featured
                          ? "aspect-[4/3] sm:aspect-[21/9]"
                          : "aspect-[4/3]",
                      )}
                      style={{ background: project.accent }}
                    >
                      {project.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      ) : project.videoDesktop || project.videoUrl ? (
                        <video
                          src={
                            project.videoDesktop ||
                            project.videoUrl ||
                            undefined
                          }
                          muted
                          loop
                          playsInline
                          autoPlay
                          preload="metadata"
                          className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-surface to-black" />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                      <span className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition group-hover:border-primary group-hover:bg-primary sm:bottom-5 sm:right-5">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-4 px-0.5 sm:mt-5">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                          {project.category}
                        </p>
                        <h2 className="mt-1.5 font-heading text-xl font-semibold leading-snug tracking-tight text-white transition group-hover:text-primary sm:text-2xl">
                          {project.title}
                        </h2>
                        {blurb ? (
                          <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2 sm:text-[15px]">
                            {blurb}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-14 border-t border-border pt-10 sm:mt-16 sm:pt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl tracking-tight sm:text-2xl">
                Want a site like these?
              </h2>
              <p className="mt-1 text-sm text-muted">
                Free call · Fixed price · Ready in days
              </p>
            </div>
            <Button
              href={getWhatsAppLink(
                "Hi, I want a website like one of your portfolio projects.",
              )}
              variant="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request a similar website
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
