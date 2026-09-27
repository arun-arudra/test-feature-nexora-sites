import { getContactEmailEnv } from "@/lib/email/env";
import { siteConfig } from "@/config/site";

/**
 * Email logo — swap easily:
 * - EMAIL_LOGO_MODE=svg (default): inline SVG below
 * - EMAIL_LOGO_MODE=image + EMAIL_LOGO_IMAGE_URL=https://.../logo.png
 *   (or falls back to siteUrl + /brand/logo-white.png if set)
 *
 * Edit `EMAIL_LOGO_SVG` to paste your own mark.
 */
const EMAIL_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="32" viewBox="0 0 720 140" fill="none" role="img" aria-label="${siteConfig.brandName}">
  <rect x="8" y="28" width="84" height="84" rx="20" fill="#FFFFFF"/>
  <text x="32" y="88" fill="#000000" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">N</text>
  <text x="120" y="92" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" letter-spacing="-2">Nexora Sites</text>
</svg>
`.trim();

export function renderEmailLogoHtml(): string {
  const { logoMode, logoImageUrl, siteUrl } = getContactEmailEnv();

  if (logoMode === "image") {
    const src =
      logoImageUrl ||
      `${siteUrl}/brand/logo-white.svg`;
    return `<img src="${escapeAttr(src)}" alt="${escapeAttr(siteConfig.brandName)}" width="160" height="32" style="display:block;border:0;outline:none;height:32px;width:auto;max-width:180px;" />`;
  }

  // Many clients strip SVG — image mode is safer for production.
  // SVG kept as default for easy local preview / clients that support it.
  return `<div style="line-height:0;">${EMAIL_LOGO_SVG}</div>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function escapeAttr(value: string): string {
  return escapeHtml(value);
}

/** Digits-only tel: href from free-form phone input */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.length === 10) return `tel:+91${digits}`;
  return `tel:${digits}`;
}
