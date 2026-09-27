import { getYoutubeEmbedUrl } from "@/lib/contentful/projects";
import { RichText } from "@/components/work/RichText";
import type { ProjectBlock } from "@/types/project";
import { cn } from "@/lib/utils";

export function ProjectBlocks({ blocks }: { blocks: ProjectBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="space-y-16 md:space-y-24">
      {blocks.map((block, index) => (
        <Block key={block.id} block={block} index={index} />
      ))}
    </div>
  );
}

function Block({ block, index }: { block: ProjectBlock; index: number }) {
  if (block.type === "text") {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {block.eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {block.eyebrow}
          </p>
        ) : null}
        {block.heading ? (
          <h2 className="mb-5 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {block.heading}
          </h2>
        ) : null}
        <RichText value={block.body} />
      </section>
    );
  }

  if (block.type === "image") {
    return (
      <section
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          block.wide ? "max-w-6xl" : "max-w-4xl",
        )}
      >
        <div className="overflow-hidden rounded-[1.25rem] border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.caption || ""}
            className="h-auto w-full object-cover"
          />
        </div>
        {block.caption ? (
          <p className="mt-3 text-center text-sm text-muted">{block.caption}</p>
        ) : null}
      </section>
    );
  }

  if (block.type === "gallery") {
    const cols =
      block.columns === 2
        ? "sm:grid-cols-2"
        : block.columns === 4
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-2 lg:grid-cols-3";
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className={cn("grid gap-3 sm:gap-4", cols)}>
          {block.images.map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-[1.1rem] border border-border bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "quote") {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <figure className="relative rounded-[1.5rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-black px-6 py-10 sm:px-10">
          <span
            aria-hidden
            className="font-heading text-6xl leading-none text-primary/40"
          >
            “
          </span>
          <blockquote className="-mt-4 font-heading text-xl font-medium leading-relaxed text-white sm:text-2xl">
            {block.quote}
          </blockquote>
          {block.author ? (
            <figcaption className="mt-6 text-sm text-muted">
              — {block.author}
            </figcaption>
          ) : null}
        </figure>
      </section>
    );
  }

  if (block.type === "video") {
    const embed = getYoutubeEmbedUrl(block.url);
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.25rem] border border-border bg-black shadow-[0_0_60px_rgba(70,0,187,0.15)]">
          {embed ? (
            <div className="aspect-video">
              <iframe
                src={embed}
                title="Project video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              src={block.url}
              poster={block.poster || undefined}
              controls
              playsInline
              className="aspect-video w-full object-cover"
            />
          )}
        </div>
      </section>
    );
  }

  if (block.type === "stats") {
    return (
      <section className="relative overflow-hidden border-y border-border bg-surface/40 py-14 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(70,0,187,0.25),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {block.heading ? (
            <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {block.heading}
            </p>
          ) : null}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((stat) => (
              <div
                key={`${stat.label}-${stat.value}`}
                className="rounded-[1.15rem] border border-border bg-black/50 px-5 py-6 text-center"
              >
                <p className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === "twoColumn") {
    const flip = index % 2 === 1;
    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
            flip && "lg:[&>*:first-child]:order-2",
          )}
        >
          <div className="space-y-4">
            <RichText value={block.left} />
            {block.leftImage ? (
              <div className="overflow-hidden rounded-[1.15rem] border border-border lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.leftImage} alt="" className="w-full object-cover" />
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            {block.rightImage || block.leftImage ? (
              <div className="hidden overflow-hidden rounded-[1.15rem] border border-border lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={(block.rightImage || block.leftImage)!}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
            ) : null}
            <RichText value={block.right} />
          </div>
        </div>
      </section>
    );
  }

  return null;
}
