"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function CmsSettingsClient() {
  const configured = getSupabaseEnv().isConfigured;
  const [email, setEmail] = useState("");
  const [mfaStatus, setMfaStatus] = useState<"unknown" | "on" | "off">(
    "unknown",
  );
  const [qrCodeSvg, setQrCodeSvg] = useState("");
  const [factorId, setFactorId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!configured) return;
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    setEmail(userData.user?.email || "");
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verified = factors?.totp?.some((f) => f.status === "verified");
    setMfaStatus(verified ? "on" : "off");
  }

  useEffect(() => {
    void load();
  }, [configured]);

  async function startMfa() {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Nexora CMS",
      });
      if (enrollError) throw enrollError;
      setFactorId(data.id);
      setQrCodeSvg(data.totp.qr_code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enroll failed");
    } finally {
      setBusy(false);
    }
  }

  async function verifyMfa(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: otp,
      });
      if (verifyError) throw verifyError;
      setQrCodeSvg("");
      setOtp("");
      setMessage("MFA connected.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  async function disableMfa() {
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: factors } = await supabase.auth.mfa.listFactors();
      for (const factor of factors?.totp || []) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
      setMessage("MFA disabled.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not disable MFA");
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="font-heading text-3xl">Account Settings</h1>

        {message ? (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <section className="rounded-[12px] border border-border bg-surface p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Mail className="h-4 w-4 text-primary" /> Profile
          </h2>
          <input
            disabled
            value={email}
            className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-muted"
          />
        </section>

        <section className="space-y-6 rounded-[12px] border border-border bg-surface p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Lock className="h-4 w-4 text-primary" /> Security
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] bg-black p-4">
            <span className="text-sm">
              Multi-Factor Authentication{" "}
              {mfaStatus === "on" ? (
                <span className="text-emerald-400">(on)</span>
              ) : mfaStatus === "off" ? (
                <span className="text-muted">(off)</span>
              ) : null}
            </span>
            {mfaStatus === "on" ? (
              <button
                type="button"
                disabled={busy}
                onClick={disableMfa}
                className="rounded-[10px] border border-border px-3 py-1.5 text-sm text-muted hover:text-white disabled:opacity-60"
              >
                Disable
              </button>
            ) : (
              <button
                type="button"
                disabled={busy || !configured}
                onClick={startMfa}
                className="rounded-[10px] bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-hover disabled:opacity-60"
              >
                Enable MFA
              </button>
            )}
          </div>

          {qrCodeSvg ? (
            <form onSubmit={verifyMfa} className="space-y-3">
              <div
                className="inline-block rounded-lg bg-white p-2"
                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
              />
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="6-digit code"
                className="w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
              />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center rounded-[10px] bg-primary px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Verify & link
              </button>
            </form>
          ) : null}

          <form
            onSubmit={updatePassword}
            className="space-y-3 border-t border-border pt-6"
          >
            <label className="block text-xs text-muted">
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-muted">
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !configured}
              className="inline-flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
            >
              Update password
            </button>
          </form>
        </section>
    </div>
  );
}
