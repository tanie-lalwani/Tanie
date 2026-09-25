"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { initiateDirectGoogleAuth } from "@/lib/googleAuth";

function AuthForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextTarget = searchParams.get("next") || "/client";

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(
    null
  );

  const [showForgot, setShowForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push(nextTarget);
    }
  }, [user, loading, router, nextTarget]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (error) {
      setFeedback({ type: "error", message: error.message });
      return;
    }
    router.push(nextTarget);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setBusy(true);
    const origin =
      typeof window !== "undefined" && window.location.hostname === "localhost"
        ? window.location.origin
        : "https://www.tanie.me";

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${origin}/auth/google/callback?next=${encodeURIComponent(nextTarget)}`,
      },
    });
    setBusy(false);
    if (error) {
      setFeedback({ type: "error", message: error.message });
      return;
    }
    setFeedback({
      type: "success",
      message: "Account created! You are ready to log in or check your confirmation email.",
    });
    setTimeout(() => router.push(nextTarget), 1500);
  }

  async function handleGoogleLogin() {
    setBusy(true);
    setFeedback(null);
    try {
      await initiateDirectGoogleAuth(nextTarget);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate Google sign in";
      setFeedback({ type: "error", message: msg });
      setBusy(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setFeedback({ type: "error", message: "Please enter your account email address" });
      return;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const origin =
        typeof window !== "undefined" && window.location.hostname === "localhost"
          ? window.location.origin
          : "https://www.tanie.me";

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${origin}/auth?next=${encodeURIComponent(nextTarget)}`,
      });
      if (error) throw error;
      setResetSent(true);
      setFeedback({
        type: "success",
        message: "Password reset instructions sent to your email!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending recovery email";
      setFeedback({ type: "error", message: msg });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl p-7 shadow-2xl">
          {/* Feedback alert */}
          {feedback && (
            <div
              className={`mb-5 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 leading-relaxed border ${
                feedback.type === "error"
                  ? "bg-red-500/10 border-red-500/25 text-red-300"
                  : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              }`}
            >
              <span className="font-bold">{feedback.type === "error" ? "⚠️" : "✓"}</span>
              <span>{feedback.message}</span>
            </div>
          )}

          {showForgot ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">Reset Password</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setResetSent(false);
                    setFeedback(null);
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  ← Back to Sign in
                </button>
              </div>

              {resetSent ? (
                <div className="space-y-3 pt-2 text-center">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-zinc-200 space-y-1">
                    <p className="font-bold text-emerald-400">Check your email inbox</p>
                    <p className="text-zinc-400 leading-relaxed">
                      We sent secure reset instructions to{" "}
                      <strong className="text-white">{email}</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 text-xs rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                    onClick={() => setResetSent(false)}
                  >
                    Resend link
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Account Email</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-[11px] text-zinc-400">
                      We will send you a secure link to reset your account credentials.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    disabled={busy}
                  >
                    {busy ? "Sending..." : "Send Password Reset Link"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setFeedback(null);
                  }}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === "signin"
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setFeedback(null);
                  }}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Create account
                </button>
              </div>

              {/* Direct Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={busy}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium transition cursor-pointer disabled:opacity-50 mb-5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="my-5 flex items-center gap-3 text-xs text-zinc-500">
                <span className="h-px flex-1 bg-white/10" /> or with email{" "}
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {activeTab === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Email</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgot(true);
                          setFeedback(null);
                        }}
                        className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      minLength={6}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    disabled={busy}
                  >
                    {busy ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Work Email</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white cursor-pointer shadow-lg shadow-purple-500/20 disabled:opacity-50"
                    disabled={busy}
                  >
                    {busy ? "Creating account..." : "Create account"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition cursor-pointer"
            >
              ← Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050508] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
