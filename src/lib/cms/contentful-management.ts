import { getContentfulNewsEnv } from "@/lib/contentful/env";

export function getContentfulManagementEnv() {
  const news = getContentfulNewsEnv();
  const managementToken =
    process.env.CONTENTFUL_NEWS_MANAGEMENT_TOKEN?.trim() ?? "";
  return {
    ...news,
    managementToken,
    isWriteConfigured: Boolean(
      news.spaceId && managementToken && news.environment,
    ),
  };
}

export function getN8nWebhookUrl() {
  return (
    process.env.N8N_WEBHOOK_URL?.trim() ||
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL?.trim() ||
    ""
  );
}

export function cmaBaseUrl() {
  const { spaceId, environment } = getContentfulManagementEnv();
  return `https://api.contentful.com/spaces/${spaceId}/environments/${environment}`;
}
