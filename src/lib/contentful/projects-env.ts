/** Contentful Projects — Delivery API (same space as news by default). */

export function getContentfulProjectsEnv() {
  const spaceId =
    process.env.CONTENTFUL_PROJECTS_SPACE_ID?.trim() ||
    process.env.CONTENTFUL_NEWS_SPACE_ID?.trim() ||
    "";
  const token =
    process.env.CONTENTFUL_PROJECTS_DELIVERY_TOKEN?.trim() ||
    process.env.CONTENTFUL_NEWS_DELIVERY_TOKEN?.trim() ||
    "";
  const environment =
    process.env.CONTENTFUL_PROJECTS_ENVIRONMENT?.trim() ||
    process.env.CONTENTFUL_NEWS_ENVIRONMENT?.trim() ||
    "master";

  return {
    spaceId,
    token,
    environment,
    isConfigured: Boolean(spaceId && token),
  };
}
