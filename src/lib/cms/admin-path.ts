/**
 * Public admin URL base (news CMS + testimonials).
 * Physical App Router tree is always `/admin`.
 * Set NEXT_PUBLIC_CMS_ADMIN_BASE=/studio (etc.) to expose a different public path via rewrite.
 */
export function getCmsAdminBase(): string {
  const raw = process.env.NEXT_PUBLIC_CMS_ADMIN_BASE?.trim() || "/admin";
  const base = raw.startsWith("/") ? raw : `/${raw}`;
  return base.replace(/\/$/, "") || "/admin";
}

export function cmsPath(...segments: string[]): string {
  const base = getCmsAdminBase();
  const rest = segments
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return rest ? `${base}/${rest}` : base;
}

/** True for configured public base and the physical /admin tree. */
export function isCmsAdminPath(pathname: string): boolean {
  const bases = new Set([getCmsAdminBase(), "/admin"]);
  for (const base of bases) {
    if (pathname === base || pathname.startsWith(`${base}/`)) return true;
  }
  return false;
}

export function isCmsLoginPath(pathname: string): boolean {
  return pathname === cmsPath("login") || pathname === "/admin/login";
}
