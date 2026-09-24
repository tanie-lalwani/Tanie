"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      // Extract hash fragment or search query parameters
      const hash = window.location.hash.substring(1);
      const search = window.location.search.substring(1);

      // Immediately scrub the ID token hash from the address bar and window.location
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }

      const params = new URLSearchParams(hash || search);
      const idToken = params.get("id_token");

      if (!idToken) {
        const error =
          params.get("error_description") ||
          params.get("error") ||
          "No ID token received from Google";
        setErrorMsg(error);
        setTimeout(() => router.push("/auth"), 2500);
        return;
      }

      let nextTarget = "/client";
      let rawNonce =
        typeof window !== "undefined"
          ? sessionStorage.getItem("google_auth_raw_nonce") || undefined
          : undefined;

      const rawState = params.get("state");
      if (rawState) {
        try {
          const decoded = decodeURIComponent(rawState);
          if (decoded.startsWith("{")) {
            const parsed = JSON.parse(decoded);
            if (parsed?.next) nextTarget = parsed.next;
            if (parsed?.rawNonce) rawNonce = parsed.rawNonce;
          } else if (decoded.startsWith("/")) {
            nextTarget = decoded;
          }
        } catch (_) {
          if (rawState.startsWith("/")) nextTarget = rawState;
        }
      }

      // Verify Google's ID token cryptographically with Supabase using rawNonce
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
        ...(rawNonce ? { nonce: rawNonce } : {}),
      });

      if (error) {
        setErrorMsg(error.message);
        setTimeout(() => router.replace("/auth"), 2500);
      } else {
        router.replace(nextTarget);
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,80,255,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl p-8 text-center shadow-2xl">
        {errorMsg ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-red-400">Authentication Error</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{errorMsg}</p>
            <p className="text-[11px] text-zinc-500">Redirecting back to login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center">
              <svg
                className="w-6 h-6 text-cyan-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
              Verifying Google Credentials
            </h2>
            <p className="text-xs text-zinc-400">
              Authenticating securely with Tanie Studio...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
