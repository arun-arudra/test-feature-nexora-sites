import { NextRequest, NextResponse } from "next/server";
import {
  cmaBaseUrl,
  getContentfulManagementEnv,
} from "@/lib/cms/contentful-management";
import { requireCmsSession } from "@/lib/cms/require-session";

type Ctx = { params: Promise<{ path?: string[] }> };

async function proxy(
  req: NextRequest,
  pathParts: string[],
  init?: RequestInit,
) {
  const auth = await requireCmsSession();
  if (!auth.ok) return auth.response;

  const { managementToken, isWriteConfigured } = getContentfulManagementEnv();
  if (!isWriteConfigured) {
    return NextResponse.json(
      { error: "Contentful management is not configured" },
      { status: 503 },
    );
  }

  const search = req.nextUrl.search || "";
  const target = `${cmaBaseUrl()}/${pathParts.join("/")}${search}`;
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${managementToken}`);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/vnd.contentful.management.v1+json");
  }

  const res = await fetch(target, { ...init, headers });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
    },
  });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return proxy(req, path, { method: "GET" });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  const body = await req.arrayBuffer();
  const contentType =
    req.headers.get("content-type") ||
    "application/vnd.contentful.management.v1+json";
  return proxy(req, path, {
    method: "POST",
    body,
    headers: {
      "Content-Type": contentType,
      ...(req.headers.get("X-Contentful-Content-Type")
        ? {
            "X-Contentful-Content-Type": req.headers.get(
              "X-Contentful-Content-Type",
            )!,
          }
        : {}),
    },
  });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  const body = await req.arrayBuffer();
  return proxy(req, path, {
    method: "PUT",
    body: body.byteLength ? body : undefined,
    headers: {
      "Content-Type":
        req.headers.get("content-type") ||
        "application/vnd.contentful.management.v1+json",
      ...(req.headers.get("X-Contentful-Version")
        ? { "X-Contentful-Version": req.headers.get("X-Contentful-Version")! }
        : {}),
      ...(req.headers.get("X-Contentful-Content-Type")
        ? {
            "X-Contentful-Content-Type": req.headers.get(
              "X-Contentful-Content-Type",
            )!,
          }
        : {}),
    },
  });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path = [] } = await ctx.params;
  return proxy(req, path, {
    method: "DELETE",
    headers: {
      ...(req.headers.get("X-Contentful-Version")
        ? { "X-Contentful-Version": req.headers.get("X-Contentful-Version")! }
        : {}),
    },
  });
}
