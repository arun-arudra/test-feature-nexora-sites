/** Email / Resend env for contact notifications. */

export function getContactEmailEnv() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const to =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    process.env.CONTACT_ADMIN_EMAIL?.trim() ||
    "";
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Nexora Sites <onboarding@resend.dev>";
  const logoMode =
    process.env.EMAIL_LOGO_MODE?.trim().toLowerCase() === "image"
      ? "image"
      : "svg";
  const logoImageUrl = process.env.EMAIL_LOGO_IMAGE_URL?.trim() || "";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://nexorasites.com";

  return {
    apiKey,
    to,
    from,
    logoMode: logoMode as "svg" | "image",
    logoImageUrl,
    siteUrl,
    isConfigured: Boolean(apiKey && to),
  };
}
