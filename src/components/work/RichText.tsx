import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, type Document } from "@contentful/rich-text-types";
import { cn } from "@/lib/utils";

/**
 * Rich text renderer styled after ulrychkristian.cz:
 * - Body text: 17-18px, font-light, leading-[1.7], text-muted
 * - Headings: clean, not bold, tracking tight
 * - Good spacing between paragraphs
 */
const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_: unknown, children: React.ReactNode) => (
      <p className="mb-5 text-[1.0625rem] font-light leading-[1.7] text-muted last:mb-0 sm:text-[1.125rem]">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_1]: (_: unknown, children: React.ReactNode) => (
      <div className="md:col-span-3">
        <h2 className="mb-4 mt-8 font-heading text-[clamp(1.4rem,2.2vw,1.9rem)] font-normal tracking-[-0.02em] text-white first:mt-0 leading-[1.15]">
          {children}
        </h2>
        <span className="neon-line mt-5 block h-px w-10" aria-hidden />
      </div>
    ),
    [BLOCKS.HEADING_2]: (_: unknown, children: React.ReactNode) => (
      <div className="md:col-span-3">
        <h2 className="mb-4 mt-8 font-heading text-[clamp(1.4rem,2.2vw,1.9rem)] font-normal tracking-[-0.02em] text-white first:mt-0 leading-[1.15]">
          {children}
        </h2>
        <span className="neon-line mt-5 block h-px w-10" aria-hidden />
      </div>
    ),
    [BLOCKS.HEADING_3]: (_: unknown, children: React.ReactNode) => (
      <div className="md:col-span-3">
        <h3 className="mb-4 mt-8 text-[11px] font-normal uppercase tracking-[0.18em] text-primary first:mt-0">
          {children}
        </h3>
      </div>
    ),
    [BLOCKS.UL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ul className="mb-5 space-y-2 pl-0">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ol className="mb-5 space-y-2 pl-0 counter-reset-list">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_: unknown, children: React.ReactNode) => (
      <li className="flex gap-3 text-[1.0625rem] font-light leading-[1.7] text-muted sm:text-[1.125rem]">
        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
        <span>{children}</span>
      </li>
    ),
    [BLOCKS.QUOTE]: (_: unknown, children: React.ReactNode) => (
      <blockquote className="my-8 border-l border-primary pl-6 font-heading text-lg font-light italic leading-relaxed text-white/80">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-10 border-border" />,
    [INLINES.HYPERLINK]: (
      node: { data: { uri: string } },
      children: React.ReactNode,
    ) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="border-b border-primary/40 pb-px text-white transition hover:border-primary"
      >
        {children}
      </a>
    ),
  },
};

export function RichText({
  value,
  className,
  prose = false,
}: {
  value: Document | string | null | undefined;
  className?: string;
  prose?: boolean;
}) {
  if (!value) return null;

  // We add a custom CSS class to enable the 3-col/9-col grid when prose=true
  // This uses CSS grid where H2/H3 elements go into the left column (grid-column: 1)
  // and all other elements go into the right column (grid-column: 2) on large screens.
  const gridClasses = prose
    ? "md:grid md:grid-cols-12 md:gap-x-12 lg:gap-x-12 md:[&>p]:col-start-4 md:[&>p]:col-span-7 md:[&>ul]:col-start-4 md:[&>ul]:col-span-7 md:[&>blockquote]:col-start-4 md:[&>blockquote]:col-span-7"
    : "";

  if (typeof value === "string") {
    const paras = value.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    return (
      <div className={cn("space-y-5", gridClasses, className)}>
        {paras.map((p) => (
          <p
            key={p.slice(0, 24)}
            className="text-[1.0625rem] font-light leading-[1.7] text-muted sm:text-[1.125rem]"
          >
            {p}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(gridClasses, className)}>
      {documentToReactComponents(value, options as never)}
    </div>
  );
}
