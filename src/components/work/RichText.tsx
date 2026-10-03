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
      <h2 className="mb-4 mt-8 font-heading text-2xl font-normal tracking-[-0.02em] text-white first:mt-0 sm:text-3xl">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_2]: (_: unknown, children: React.ReactNode) => (
      <h3 className="mb-3 mt-8 font-heading text-xl font-normal tracking-[-0.02em] text-white first:mt-0 sm:text-2xl">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_3]: (_: unknown, children: React.ReactNode) => (
      <h4 className="mb-3 mt-6 text-base font-normal uppercase tracking-[0.08em] text-white/80 first:mt-0">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ul className="mb-5 space-y-2 pl-0">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ol className="mb-5 space-y-2 pl-0 counter-reset-list">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_: unknown, children: React.ReactNode) => (
      <li className="flex gap-3 text-[1.0625rem] font-light leading-[1.7] text-muted">
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
}: {
  value: Document | string | null | undefined;
  className?: string;
}) {
  if (!value) return null;

  if (typeof value === "string") {
    const paras = value.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    return (
      <div className={cn("space-y-5", className)}>
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
    <div className={cn(className)}>
      {documentToReactComponents(value, options as never)}
    </div>
  );
}
