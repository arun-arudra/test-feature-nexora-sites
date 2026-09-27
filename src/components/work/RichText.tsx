import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, type Document } from "@contentful/rich-text-types";
import { cn } from "@/lib/utils";

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_: unknown, children: React.ReactNode) => (
      <p className="mb-4 text-base leading-relaxed text-muted last:mb-0 sm:text-[17px]">
        {children}
      </p>
    ),
    [BLOCKS.HEADING_1]: (_: unknown, children: React.ReactNode) => (
      <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_2]: (_: unknown, children: React.ReactNode) => (
      <h3 className="mb-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_3]: (_: unknown, children: React.ReactNode) => (
      <h4 className="mb-3 font-heading text-xl font-semibold text-white">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ul className="mb-4 list-disc space-y-2 pl-5 text-muted">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_: unknown, children: React.ReactNode) => (
      <ol className="mb-4 list-decimal space-y-2 pl-5 text-muted">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_: unknown, children: React.ReactNode) => (
      <li className="leading-relaxed">{children}</li>
    ),
    [BLOCKS.QUOTE]: (_: unknown, children: React.ReactNode) => (
      <blockquote className="my-6 border-l-2 border-primary pl-5 text-lg italic text-white/85">
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
        className="text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary"
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
      <div className={cn("space-y-4", className)}>
        {paras.map((p) => (
          <p
            key={p.slice(0, 24)}
            className="text-base leading-relaxed text-muted sm:text-[17px]"
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
