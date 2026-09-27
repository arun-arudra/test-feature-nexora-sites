"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, MessageCircle, X } from "lucide-react";
import { faqs } from "@/config/faqs";
import { getWhatsAppLink, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

type Msg = { role: "bot" | "user"; text: string };

const starter: Msg[] = [
  {
    role: "bot",
    text: `Hi! I'm the ${siteConfig.shortName} assistant. Ask about pricing, timelines, logo, hosting, or AI chatbot — or leave your details and we'll WhatsApp you.`,
  },
];

function matchFaq(input: string): string | null {
  const q = input.toLowerCase();
  const hit = faqs.find(
    (f) =>
      q.includes(f.q.toLowerCase().slice(0, 12)) ||
      f.q
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 4)
        .some((w) => q.includes(w)) ||
      (q.includes("price") && f.q.toLowerCase().includes("cost")) ||
      (q.includes("cost") && f.q.toLowerCase().includes("cost")) ||
      (q.includes("logo") && f.q.toLowerCase().includes("logo")) ||
      (q.includes("host") && f.q.toLowerCase().includes("host")) ||
      (q.includes("chatbot") && f.q.toLowerCase().includes("chatbot")) ||
      (q.includes("time") && f.q.toLowerCase().includes("long")),
  );
  return hit?.a ?? null;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(starter);
  const [input, setInput] = useState("");
  const enabled = siteConfig.chatbotEnabled;

  const quick = useMemo(
    () => ["How much does a website cost?", "Do you design logos?", "Can you add an AI chatbot?"],
    [],
  );

  if (!enabled) return null;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");

    const local = matchFaq(trimmed);
    if (local) {
      setMessages((m) => [...m, { role: "bot", text: local }]);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            data.reply ??
            "Thanks! For a quick quote, WhatsApp us with your business type and city.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "I can help with FAQs here. For a custom quote, talk to us on WhatsApp.",
        },
      ]);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:scale-[1.03] hover:bg-primary-hover hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        aria-label="Open chatbot"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        <span className="hidden sm:inline">Chat</span>
      </button>

      {open ? (
        <div className="fixed bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+4rem))] left-4 right-4 z-50 flex max-h-[min(28rem,calc(100dvh-6.5rem))] w-auto flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:left-5 sm:right-auto sm:w-[min(calc(100vw-2.5rem),24rem)]">
          <div className="bg-primary px-4 py-3 text-white">
            <p className="font-semibold">{siteConfig.shortName} Assistant</p>
            <p className="text-xs text-white/75">FAQ mode · WhatsApp handoff available</p>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={
                  m.role === "bot"
                    ? "max-w-[90%] rounded-2xl bg-surface-muted px-3 py-2 text-sm text-text"
                    : "ml-auto max-w-[90%] rounded-2xl bg-accent px-3 py-2 text-sm text-accent-foreground"
                }
              >
                {m.text}
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  className="min-h-9 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:bg-surface-muted"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border p-3">
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, logo, hosting..."
                className="min-h-11 flex-1 rounded-xl border border-border px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-accent sm:text-sm"
              />
              <Button type="submit" className="min-h-11 shrink-0 px-4">
                Send
              </Button>
            </form>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-whatsapp"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Talk to a human on WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
