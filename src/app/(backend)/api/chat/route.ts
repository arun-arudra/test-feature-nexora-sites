import { NextResponse } from "next/server";
import { faqs } from "@/config/faqs";
import { z } from "zod";

const schema = z.object({
  message: z.string().trim().min(1).max(500),
});

function localReply(message: string) {
  const q = message.toLowerCase();
  const hit = faqs.find((f) => {
    const words = f.q.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    return words.some((w) => q.includes(w));
  });
  if (hit) return hit.a;
  if (q.includes("price") || q.includes("cost") || q.includes("package")) {
    return faqs[0].a;
  }
  return "Thanks for your message. For a tailored quote, WhatsApp us with your business type and city — we usually reply within a few hours.";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // Ready for OpenAI later: if process.env.OPENAI_API_KEY, call model here.
    const reply = localReply(parsed.data.message);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Chat unavailable" }, { status: 500 });
  }
}
