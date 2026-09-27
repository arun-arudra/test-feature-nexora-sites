/** Normalize Supabase / unknown throwables for UI messages. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === "object") {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  if (typeof err === "string" && err.trim()) return err;
  return fallback;
}

export function isMissingTableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: unknown }).code;
  const message = String((err as { message?: unknown }).message ?? "");
  return code === "PGRST205" || /could not find the table/i.test(message);
}

export function isPermissionDeniedError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: unknown }).code;
  const message = String((err as { message?: unknown }).message ?? "");
  return (
    code === "42501" ||
    /permission denied/i.test(message) ||
    /must be owner/i.test(message)
  );
}

export function formatSupabaseWriteError(err: unknown, fallback = "Could not save"): string {
  const message = getErrorMessage(err, fallback);
  if (isMissingTableError(err)) {
    return `${message} — run supabase/setup.sql in the Supabase SQL Editor, then try again.`;
  }
  if (isPermissionDeniedError(err)) {
    return `${message} — run supabase/fix_grants.sql in the Supabase SQL Editor, then try again.`;
  }
  return message;
}
