export type CmsSys = {
  id: string;
  version: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  publishedVersion?: number;
};

export type CmsLocaleFields = Record<string, { "en-US"?: unknown }>;

export type CmsEntry = {
  sys: CmsSys;
  fields: CmsLocaleFields & Record<string, unknown>;
};

export type CmsAsset = {
  sys: CmsSys;
  fields?: {
    title?: { "en-US"?: string };
    file?: {
      "en-US"?: {
        url?: string;
        contentType?: string;
        fileName?: string;
      };
    };
  };
};

export function localeString(field: unknown): string {
  if (field == null) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "en-US" in field) {
    const v = (field as { "en-US"?: unknown })["en-US"];
    return v == null ? "" : String(v);
  }
  return String(field);
}

export function assetLink(id: string) {
  return {
    sys: { type: "Link" as const, linkType: "Asset" as const, id },
  };
}
