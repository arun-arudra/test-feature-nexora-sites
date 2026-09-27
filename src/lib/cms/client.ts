"use client";

/** Browser helper — calls our server CMA proxy (management token never in client). */
export async function cmaFetch(
  path: string,
  init: RequestInit & { version?: number | string; contentTypeId?: string } = {},
) {
  const { version, contentTypeId, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);
  if (version != null) headers.set("X-Contentful-Version", String(version));
  if (contentTypeId) headers.set("X-Contentful-Content-Type", contentTypeId);
  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/vnd.contentful.management.v1+json");
  }
  const clean = path.replace(/^\//, "");
  return fetch(`/api/cms/cma/${clean}`, { ...rest, headers });
}

export async function triggerN8n(payload: {
  sourceType: string;
  input: string;
  extraInstructions?: string;
}) {
  return fetch("/api/cms/n8n", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function uploadCmsAsset(file: File) {
  const form = new FormData();
  form.append("file", file);
  return fetch("/api/cms/upload", { method: "POST", body: form });
}
