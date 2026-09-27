import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectBlocks } from "@/components/work/ProjectBlocks";
import { RichText } from "@/components/work/RichText";
import { Button } from "@/components/ui/Button";
import {
  getAllProjects,
  getProjectBySlug,
} from "@/lib/contentful/projects";
import { getWhatsAppLink } from "@/config/site";
import { createMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = await getProjectBySlug(id);
  if (!project) return {};
  return createMetadata({
    title: project.title,
    description: project.excerpt || project.subtitle || project.blurb,
    path: `/work/${project.slug}`,
  });
}

export default async function WorkProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, all] = await Promise.all([
    getProjectBySlug(id),
    getAllProjects(),
  ]);
  if (!project) notFound();

  const idx = all.findIndex((p) => p.slug === project.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];
  const hasBlocks = project.sections.length > 0;

  return (
    <div className="theme-v2 bg-black text-white">
      {/* Hero */}
      <section className="relative min-h-[62vh] overflow-hidden md:min-h-[72vh]">
        <div className="absolute inset-0 bg-surface">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : project.videoDesktop || project.videoUrl ? (
            <video
              src={project.videoDesktop || project.videoUrl || undefined}
              muted
              loop
              playsInline
              autoPlay
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `linear-gradient(155deg, ${project.accent} 0%, #1a1028 50%, #000 100%)`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/25" />
        </div>

        <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 md:min-h-[72vh] md:pb-16 lg:px-8">
          <Link
            href="/work"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            {project.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {tag}
                </span>
                {i < project.tags.length - 1 ? (
                  <span className="h-1 w-1 rounded-full bg-primary" />
                ) : null}
              </span>
            ))}
          </div>

          <h1 className="max-w-4xl font-heading text-[clamp(2.4rem,6vw,4.5rem)] font-bold tracking-tight">
            {project.title}
          </h1>
          {project.subtitle ? (
            <p className="mt-4 max-w-2xl text-lg text-white/75 sm:text-xl">
              {project.subtitle}
            </p>
          ) : null}
        </div>
      </section>

      {/* Body */}
      <div className="border-t border-border py-16 md:py-24">
        {hasBlocks ? (
          <ProjectBlocks blocks={project.sections} />
        ) : (
          <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
            {project.overview ? (
              <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Overview
                  </p>
                  <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                    What we built
                  </h2>
                </div>
                <RichText value={project.overview} />
              </section>
            ) : null}

            {project.challenge ? (
              <section className="rounded-[1.5rem] border border-border bg-surface/60 px-6 py-10 sm:px-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  The challenge
                </p>
                <div className="mt-4">
                  <RichText value={project.challenge} />
                </div>
              </section>
            ) : null}

            {!project.overview && !project.challenge ? (
              <section className="mx-auto max-w-3xl">
                <p className="text-lg leading-relaxed text-muted">
                  {project.blurb || project.excerpt}
                </p>
                {project.metric ? (
                  <p className="mt-6 font-heading text-2xl font-bold text-primary">
                    {project.metric}
                  </p>
                ) : null}
                {project.outcome ? (
                  <p className="mt-2 text-muted">{project.outcome}</p>
                ) : null}
              </section>
            ) : null}
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Want something like this?
            </h2>
            <p className="mt-2 text-muted">
              Tell us about your business — we&apos;ll suggest a clear next step.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              href={getWhatsAppLink(
                `Hi, I want a website like ${project.title}. Can we talk?`,
              )}
              variant="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Request a similar site
            </Button>
            <Button href="/work" variant="secondary">
              View all projects
            </Button>
          </div>
        </div>
      </section>

      {/* Prev / next */}
      {all.length > 1 ? (
        <nav className="border-t border-border">
          <div className="mx-auto grid max-w-7xl gap-px bg-border sm:grid-cols-2">
            <Link
              href={`/work/${prev.slug}`}
              className="group flex items-center gap-4 bg-black px-4 py-8 transition hover:bg-surface sm:px-6 lg:px-8"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-muted transition group-hover:-translate-x-1 group-hover:text-primary" />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Previous
                </p>
                <p className="mt-1 truncate font-heading text-lg font-semibold text-white group-hover:text-primary">
                  {prev.title}
                </p>
              </div>
            </Link>
            <Link
              href={`/work/${next.slug}`}
              className="group flex items-center justify-end gap-4 bg-black px-4 py-8 text-right transition hover:bg-surface sm:px-6 lg:px-8"
            >
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Next
                </p>
                <p className="mt-1 truncate font-heading text-lg font-semibold text-white group-hover:text-primary">
                  {next.title}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </div>
        </nav>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-white"
        >
          Back to all projects
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
