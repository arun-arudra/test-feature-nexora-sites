"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Variant = "missing_tables" | "permission_denied";

const copy: Record<
  Variant,
  { title: string; body: string; button: string }
> = {
  missing_tables: {
    title: "Database tables are missing",
    body: "This Supabase project does not have the testimonials and site_settings tables yet. Open Supabase → SQL Editor, paste the setup script, run it once, then refresh this page.",
    button: "Copy setup SQL",
  },
  permission_denied: {
    title: "Tables exist, but the API cannot access them",
    body: "Your setup SQL created the tables, but Postgres roles (anon / authenticated) still need GRANT privileges. Run the short grants script below in the SQL Editor, then refresh.",
    button: "Copy grants SQL",
  },
};

export function SupabaseSetupBanner({
  sql,
  detail,
  projectRef,
  variant = "missing_tables",
}: {
  sql: string;
  detail?: string;
  projectRef?: string | null;
  variant?: Variant;
}) {
  const [copied, setCopied] = useState(false);
  const text = copy[variant];
  const sqlEditorHref = projectRef
    ? `https://supabase.com/dashboard/project/${projectRef}/sql/new`
    : "https://supabase.com/dashboard/project/_/sql/new";

  async function copySql() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-4 text-sm text-white">
      <p className="font-heading text-base font-bold text-amber-100">{text.title}</p>
      <p className="mt-2 text-amber-50/90">{text.body}</p>
      {detail ? (
        <p className="mt-2 text-xs text-amber-100/70">{detail}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void copySql()}
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-300"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : text.button}
        </button>
        <a
          href={sqlEditorHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-amber-400/50 px-4 py-2 text-xs font-semibold text-amber-50 hover:bg-amber-500/20"
        >
          Open SQL Editor
        </a>
      </div>
    </div>
  );
}
