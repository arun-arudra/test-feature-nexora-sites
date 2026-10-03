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
    <div className="flex min-h-screen w-full bg-black font-sans text-white">
      {/* Left Panel - 50% */}
      <div className="flex w-full flex-col md:w-1/2 relative z-10">
        <div className="flex items-center justify-between px-6 py-6 lg:px-12">
          <div className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight">
            <LockKeyhole className="h-5 w-5 text-primary" />
            <span>Nexora CMS</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-20">
          <div className="w-full max-w-[380px]">
            {!configured ? (
              <p className="mb-6 text-center text-sm text-red-400">
                Configure NEXT_PUBLIC_SUPABASE_URL and ANON_KEY first.
              </p>
            ) : null}

            {error ? (
              <p className="mb-6 rounded-[10px] border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            {step === "login" ? (
              <div className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
                    Welcome back
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Sign in to your admin account to manage content.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="admin@nexora.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="••••••••••••"
                    />
                  </div>

                  <div className="flex items-center pt-2">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-border bg-surface text-primary focus:ring-primary focus:ring-offset-black"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm text-muted">
                      Keep me signed in
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign in to Admin
                  </button>
                </form>
              </div>
            ) : null}

            {step === "enroll" || step === "verify" ? (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div>
                  <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
                    {step === "enroll" ? "Set up MFA" : "Two-factor code"}
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    {step === "enroll"
                      ? "Scan the QR, then enter the 6-digit code."
                      : "Enter the 6-digit code from your authenticator app."}
                  </p>
                </div>
                {step === "enroll" && qrCodeSvg ? (
                  <div className="flex flex-col items-center rounded-[12px] border border-border bg-surface p-6">
                    <QrCode className="mb-4 h-6 w-6 text-muted" />
                    <div
                      className="rounded-lg bg-white p-3 shadow-sm"
                      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                    />
                  </div>
                ) : null}
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="block w-full rounded-[10px] border border-border bg-surface py-4 text-center font-mono text-3xl tracking-[0.5em] text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    Verify Code
                  </button>
                  {step === "enroll" ? (
                    <button
                      type="button"
                      onClick={() => {
                        router.replace(cmsPath());
                      }}
                      className="w-full rounded-[10px] border border-border bg-black px-4 py-3 text-sm font-medium text-muted transition hover:bg-surface hover:text-white"
                    >
                      Skip for now
                    </button>
                  ) : null}
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right Panel - 50% */}
      <div className="relative hidden w-1/2 overflow-hidden border-l border-border bg-surface md:block">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(70,0,187,0.15),transparent_70%)]"
        />
        
        <div className="absolute inset-0 z-0 opacity-[0.03]">
          <svg className="absolute -right-[20%] top-[-10%] h-[120%] w-[120%] animate-[spin_240s_linear_infinite]" viewBox="0 0 100 100" fill="none">
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={10 + i * 2.5}
                stroke="white"
                strokeWidth={i % 3 === 0 ? "0.2" : "0.05"}
                strokeDasharray={i % 5 === 0 ? "1 2" : "none"}
              />
            ))}
          </svg>
        </div>
        
        <div className="relative z-10 flex h-full flex-col justify-center px-12 lg:px-24">
          <div className="max-w-lg">
            <h2 className="mb-4 font-heading text-4xl font-bold tracking-tight text-white lg:text-5xl">
              Content Management System
            </h2>
            <p className="text-lg leading-relaxed text-muted">
              Securely manage your projects, content blocks, and media assets using the Nexora content pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
