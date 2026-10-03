import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ProjectBlocks } from "@/components/work/ProjectBlocks";
import { RichText } from "@/components/work/RichText";
import {
  getAllProjects,
  getProjectBySlug,
} from "@/lib/contentful/projects";
import { getWhatsAppLink } from "@/config/site";
import { createMetadata } from "@/lib/seo";
import type { WorkProject } from "@/types/project";

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
  const hasBlocks = project.sections.length > 0;

  // Pick up to 3 other projects for "Continue Exploring"
  const others = all
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  // Next project for the bottom arrow
  const nextProject = all[(idx + 1) % all.length];

  return (
    <div className="theme-v2 bg-black text-white">

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        {/* subtle gradient bg when no image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 60% 0%, rgba(70,0,187,0.18) 0%, transparent 70%)`,
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-white mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>

          {/* Client / label */}
          {project.category && (
            <p className="text-xs font-normal uppercase tracking-[0.18em] text-primary mb-5">
              {project.category}
            </p>
          )}

          {/* Main heading */}
          <h1 className="max-w-4xl font-heading text-[clamp(2.2rem,5.5vw,4rem)] font-normal leading-[1.1] tracking-[-0.03em] text-white">
            {project.title}
          </h1>

          {project.subtitle && project.subtitle !== project.title && (
            <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-muted sm:text-lg">
              {project.subtitle}
            </p>
          )}

          {/* ── Metadata bar ── */}
          <dl className="mt-10 grid grid-cols-2 border-t border-border md:grid-cols-4">
            {project.category && (
              <MetaCell label="Category" value={project.category} />
            )}
            <MetaCell label="Industry" value={project.industry || project.category || "—"} border />
            <MetaCell label="Services" value={project.tags.join(", ") || "Design & Development"} border />
            <MetaCell label="Type" value="Client project" border />
          </dl>
        </div>

        {/* ── Hero cover image ── */}
        {(project.image || project.videoDesktop || project.videoUrl) && (
          <div className="mt-14 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[12px] border border-border aspect-[16/9] w-full bg-surface">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={(project.videoDesktop || project.videoUrl) ?? undefined}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* If no media, show a gradient placeholder */}
        {!project.image && !project.videoDesktop && !project.videoUrl && (
          <div className="mt-14 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="overflow-hidden rounded-[12px] border border-border aspect-[16/9] w-full"
              style={{
                background: `linear-gradient(135deg, #0f0013 0%, #1a003a 40%, #000 100%)`,
              }}
            >
              <div className="h-full w-full flex items-center justify-center">
                <p className="text-sm text-muted tracking-widest uppercase">
                  {project.title}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── CONTENT BODY ── */}
      <div className="py-20 md:py-32">
        {hasBlocks ? (
          <ProjectBlocks blocks={project.sections} />
        ) : (
          <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8 md:space-y-28">

            {/* Overview */}
            {project.overview && (
              <ContentSection label="Overview">
                <RichText value={project.overview} />
              </ContentSection>
            )}

            {/* Challenge */}
            {project.challenge && (
              <ContentSection label="Challenge">
                <RichText value={project.challenge} />
              </ContentSection>
            )}

            {/* Blurb fallback when no rich sections */}
            {!project.overview && !project.challenge && (project.blurb || project.excerpt) && (
              <ContentSection label="About this project">
                <p className="text-base font-light leading-[1.75] text-muted sm:text-lg">
                  {project.blurb || project.excerpt}
                </p>
                {project.metric && (
                  <p className="mt-6 font-heading text-2xl font-normal text-primary">
                    {project.metric}
                  </p>
                )}
                {project.outcome && (
                  <p className="mt-2 text-sm text-muted">{project.outcome}</p>
                )}
              </ContentSection>
            )}
          </div>
        )}
      </div>

      {/* ── CTA BAND ── */}
      <section className="border-t border-border bg-surface/40 py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted mb-2">
              [ Start a project ]
            </p>
            <h2 className="font-heading text-2xl font-normal tracking-tight sm:text-3xl">
              Want something like this for your business?
            </h2>
            <p className="mt-2 text-sm font-light text-muted">
              Fixed price · Free quote in 24 hours
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={getWhatsAppLink(`Hi, I want a website like ${project.title}. Can we talk?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn v2-btn-primary px-5 py-3"
            >
              Request a similar site
            </a>
            <Link href="/work" className="v2-btn v2-btn-ghost px-5 py-3">
              View all projects
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTINUE EXPLORING ── */}
      {others.length > 0 && (
        <section className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
                  [ More work ]
                </p>
                <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal tracking-[-0.02em] text-white">
                  Continue exploring our latest work
                </h2>
              </div>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-white shrink-0"
              >
                View all projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {others.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEXT PROJECT ── */}
      {all.length > 1 && nextProject.slug !== project.slug && (
        <Link
          href={`/work/${nextProject.slug}`}
          className="group block border-t border-border bg-surface/20 transition hover:bg-surface/50"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-10 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted mb-2">
                Next project
              </p>
              <p className="font-heading text-xl font-normal text-white transition group-hover:text-primary sm:text-2xl">
                {nextProject.title}
              </p>
            </div>
            <ArrowUpRight className="h-8 w-8 shrink-0 text-muted transition group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </Link>
      )}
    </div>
  );
}

/* ─── Small helper components ─── */

function MetaCell({
  label,
  value,
  border,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div
      className={`flex flex-col py-5 md:py-7 md:px-8 ${
        border ? "border-l border-border pl-5 md:pl-8" : ""
      }`}
    >
      <dt className="text-[10px] uppercase tracking-[0.15em] text-muted mb-2">
        {label}
      </dt>
      <dd className="text-sm font-normal text-white/90">{value}</dd>
    </div>
  );
}

function ContentSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-3">
        <h2 className="font-heading text-[clamp(1.4rem,2.5vw,2rem)] font-normal tracking-[-0.02em] text-white">
          {label}
        </h2>
        <span
          className="neon-line mt-4 block h-px w-12"
          aria-hidden
        />
      </div>
      <div className="md:col-span-7 md:col-start-4 text-base font-light leading-[1.75] text-muted [&_p]:mb-5 [&_p:last-child]:mb-0">
        {children}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: WorkProject }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-[12px] border border-border bg-surface transition hover:border-primary/50"
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-muted">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full transition duration-500 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, #0f0013 0%, #1a003a 60%, #000 100%)`,
            }}
          >
            <div className="flex h-full items-center justify-center">
              <p className="text-xs uppercase tracking-widest text-muted/60">
                {project.category}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-start justify-between gap-2 px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-normal text-white transition group-hover:text-primary">
            {project.title}
          </p>
          <p className="mt-0.5 text-xs text-muted">{project.category}</p>
        </div>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
