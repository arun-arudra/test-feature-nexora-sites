import Link from "next/link";
import { brandAssets } from "@/config/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** `mark` = header/compact; `footer` = oversized wordmark */
  variant?: "mark" | "footer";
  className?: string;
  /** Wrap with home link (default true for mark) */
  linked?: boolean;
  /** Use white mark for dark / V2 surfaces */
  onDark?: boolean;
};

/**
 * Swappable brand mark. Change files / paths in `src/config/brand.ts`.
 * Uses a plain <img> so SVG, PNG, WebP, and JPG all work without extra config.
 */
export function BrandLogo({
  variant = "mark",
  className,
  linked = variant === "mark",
  onDark = false,
}: BrandLogoProps) {
  const asset =
    variant === "footer"
      ? brandAssets.logoFooter
      : onDark
        ? brandAssets.logoOnDark
        : brandAssets.logo;

  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- intentional: easy logo swap for any image type
    <img
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      decoding="async"
      className={cn(
        "block select-none object-contain object-left",
        // Do not mix h-auto with fixed h-* — without twMerge the wrong one wins and the logo collapses to 0×0
        variant === "mark" &&
          "h-8 w-auto max-h-8 max-w-[10rem] sm:h-9 sm:max-h-9 sm:max-w-[12rem]",
        variant === "footer" && "h-auto w-full max-w-none",
        className,
      )}
    />
  );

  if (!linked) return image;

  return (
    <Link
      href="/"
      aria-label={asset.alt}
      className="inline-flex max-w-full shrink-0 items-center"
    >
      {image}
    </Link>
  );
}
