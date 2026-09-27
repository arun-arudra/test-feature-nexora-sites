"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, ShieldCheck, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { getSupabaseEnv } from "@/lib/supabase/env";

type Step = "login" | "enroll" | "verify";

export function CmsLoginClient() {
  const router = useRouter();
  const configured = getSupabaseEnv().isConfigured;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [qrCodeSvg, setQrCodeSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!configured) {
      setError("Configure NEXT_PUBLIC_SUPABASE_URL and ANON_KEY first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) throw signError;

      const { data: factors, error: factorsError } =
        await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactors = factors.totp || [];
      for (const factor of totpFactors) {
        if ((factor.status as string) === "unverified") {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }
      const verified = totpFactors.filter(
        (f) => (f.status as string) === "verified",
      );

      if (verified.length === 0) {
        const { data: enrollData, error: enrollError } =
          await supabase.auth.mfa.enroll({
            factorType: "totp",
            friendlyName: "Nexora CMS",
          });
        if (enrollError) throw enrollError;
        setFactorId(enrollData.id);
        setQrCodeSvg(enrollData.totp.qr_code);
        setStep("enroll");
        return;
      }

      const { data: mfaStatus } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (mfaStatus?.currentLevel === "aal2") {
        router.replace(cmsPath());
        router.refresh();
        return;
      }
      setFactorId(verified[0].id);
      setStep("verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: otpCode,
      });
      if (verifyError) throw verifyError;
      router.replace(cmsPath());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(70,0,187,0.35),transparent_55%)]"
      />
      <div className="relative z-10 w-full max-w-md rounded-[12px] border border-border bg-surface p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-border bg-black">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
        </div>

        {!configured ? (
          <p className="text-center text-sm text-muted">
            Add Supabase env keys to enable CMS login.
          </p>
        ) : null}

        {error ? (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        {step === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-center">
              <h1 className="font-heading text-2xl text-white">CMS Admin</h1>
              <p className="text-sm text-muted">
                Contentful + n8n publishing pipeline
              </p>
            </div>
            <label className="block text-xs text-muted">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
                placeholder="admin@example.com"
              />
            </label>
            <label className="block text-xs text-muted">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
            </button>
          </form>
        ) : null}

        {step === "enroll" || step === "verify" ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1 text-center">
              <h1 className="font-heading text-2xl text-white">
                {step === "enroll" ? "Set up MFA" : "Two-factor code"}
              </h1>
              <p className="text-sm text-muted">
                {step === "enroll"
                  ? "Scan the QR, then enter the 6-digit code."
                  : "Enter the code from your authenticator app."}
              </p>
            </div>
            {step === "enroll" && qrCodeSvg ? (
              <div className="flex flex-col items-center rounded-[12px] border border-border bg-black p-4">
                <QrCode className="mb-3 h-5 w-5 text-muted" />
                <div
                  className="rounded-lg bg-white p-2"
                  dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                />
              </div>
            ) : null}
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-black py-3 text-center font-mono text-2xl tracking-[0.4em] text-white"
              placeholder="000000"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              Verify
            </button>
            {step === "enroll" ? (
              <button
                type="button"
                onClick={() => {
                  router.replace(cmsPath());
                }}
                className="w-full text-sm text-muted hover:text-white"
              >
                Skip for now
              </button>
            ) : null}
          </form>
        ) : null}
      </div>
    </div>
  );
}
