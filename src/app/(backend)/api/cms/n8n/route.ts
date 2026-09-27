import { NextRequest, NextResponse } from "next/server";
import { getN8nWebhookUrl } from "@/lib/cms/contentful-management";
import { requireCmsSession } from "@/lib/cms/require-session";

export async function POST(req: NextRequest) {
  const auth = await requireCmsSession();
  if (!auth.ok) return auth.response;

  const webhookUrl = getN8nWebhookUrl();
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_WEBHOOK_URL is not configured" },
      { status: 503 },
    );
  }

  try {
    const payload = await req.json();
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    return new NextResponse(text || JSON.stringify({ ok: res.ok }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach n8n webhook" },
      { status: 502 },
    );
  }
}
