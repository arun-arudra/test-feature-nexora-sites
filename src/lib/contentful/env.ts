/** Server-only Contentful News space credentials (Plan B — Delivery API). */

export function getContentfulNewsEnv() {
  const spaceId = process.env.CONTENTFUL_NEWS_SPACE_ID?.trim() ?? "";
  const token = process.env.CONTENTFUL_NEWS_DELIVERY_TOKEN?.trim() ?? "";
  const environment =
    process.env.CONTENTFUL_NEWS_ENVIRONMENT?.trim() || "master";
  return {
    spaceId,
    token,
    environment,
    isConfigured: Boolean(spaceId && token),
  };
}
