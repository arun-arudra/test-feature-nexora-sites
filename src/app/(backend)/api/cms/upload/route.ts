import { NextRequest, NextResponse } from "next/server";
import {
  getContentfulManagementEnv,
} from "@/lib/cms/contentful-management";
import { requireCmsSession } from "@/lib/cms/require-session";

/** Binary upload to Contentful Upload API, then create + process asset */
export async function POST(req: NextRequest) {
  const auth = await requireCmsSession();
  if (!auth.ok) return auth.response;

  const { spaceId, managementToken, environment, isWriteConfigured } =
    getContentfulManagementEnv();
  if (!isWriteConfigured) {
    return NextResponse.json(
      { error: "Contentful management is not configured" },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();

  const uploadRes = await fetch(
    `https://upload.contentful.com/spaces/${spaceId}/uploads`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${managementToken}`,
        "Content-Type": "application/octet-stream",
      },
      body: bytes,
    },
  );
  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    return NextResponse.json(uploadData, { status: uploadRes.status });
  }

  const assetRes = await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/${environment}/assets`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${managementToken}`,
        "Content-Type": "application/vnd.contentful.management.v1+json",
      },
      body: JSON.stringify({
        fields: {
          title: { "en-US": file.name },
          file: {
            "en-US": {
              contentType: file.type || "application/octet-stream",
              fileName: file.name,
              uploadFrom: {
                sys: {
                  type: "Link",
                  linkType: "Upload",
                  id: uploadData.sys.id,
                },
              },
            },
          },
        },
      }),
    },
  );
  const assetData = await assetRes.json();
  if (!assetRes.ok) {
    return NextResponse.json(assetData, { status: assetRes.status });
  }

  await fetch(
    `https://api.contentful.com/spaces/${spaceId}/environments/${environment}/assets/${assetData.sys.id}/files/en-US/process`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${managementToken}` },
    },
  );

  return NextResponse.json(assetData);
}
