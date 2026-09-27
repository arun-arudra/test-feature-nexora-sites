"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { triggerN8n } from "@/lib/cms/client";

const SOURCES = ["YouTube URL", "Instagram URL", "Topic / Keyword"] as const;

export function CmsGenerationForm() {
  const [input, setInput] = useState("");
  const [sourceType, setSourceType] =
    useState<(typeof SOURCES)[number]>("Topic / Keyword");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  function handleInputChange(value: string) {
    setInput(value);
    if (value.includes("youtube.com") || value.includes("youtu.be")) {
      setSourceType("YouTube URL");
    } else if (value.includes("instagram.com")) {
      setSourceType("Instagram URL");
    } else if (value.length > 0) {
      setSourceType("Topic / Keyword");
    }
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) {
      setMessage({ ok: false, text: "Enter a URL or topic first." });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await triggerN8n({
        sourceType,
        input: input.trim(),
        extraInstructions: extraInstructions.trim() || undefined,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || "Failed to trigger n8n",
        );
      }
      setMessage({
        ok: true,
        text: "Draft started — it will show in the queue shortly.",
      });
      setInput("");
      setExtraInstructions("");
      setSourceType("Topic / Keyword");
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : "Could not reach n8n",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[12px] border border-border bg-surface p-6 shadow-xl">
      <h2 className="font-heading text-xl text-white">Create New Draft</h2>
      <p className="mt-1 text-sm text-muted">
        Feed a URL or topic to the n8n AI pipeline.
      </p>

      <form onSubmit={handleGenerate} className="mt-5 space-y-4">
        <label className="block text-xs text-muted">
          Input URL or Topic
          <input
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste URL or type topic…"
            className="mt-1 w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white placeholder:text-muted"
          />
        </label>

        <label className="block text-xs text-muted">
          Source Type
          <select
            value={sourceType}
            onChange={(e) =>
              setSourceType(e.target.value as (typeof SOURCES)[number])
            }
            className="mt-1 w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs text-muted">
          Extra Instructions (optional)
          <textarea
            value={extraInstructions}
            onChange={(e) => setExtraInstructions(e.target.value)}
            placeholder="e.g. Focus on technical setup…"
            rows={4}
            className="mt-1 w-full resize-y rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white placeholder:text-muted"
          />
        </label>

        {message ? (
          <p
            className={`rounded-lg border px-3 py-2 text-sm ${
              message.ok
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transmitting…
            </>
          ) : (
            "Generate Draft"
          )}
        </button>
      </form>
    </div>
  );
}
