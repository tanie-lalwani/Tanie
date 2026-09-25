"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { packagesTranslations } from "@/data/packagesTranslations";
import {
  loadClientHubProject,
  saveClientHubProject,
} from "@/components/client-hub/clientHubStorage";
import { ClientHubProject } from "@/components/client-hub/types";

// Tabbed workspace (contains all tiles internally)
import TabbedWorkspace from "@/components/client-hub/TabbedWorkspace";

export default function ClientPortal() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const pkgCopy = packagesTranslations[locale] || packagesTranslations.en;
  const {
    user,
    loading: authLoading,
    signInWithPassword,
    signUp,
    signInWithOtp,
    signInWithGoogle,
    signOut,
  } = useAuth();

  // Auth Form State for Visitors
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup" | "magic">("login");
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Client Project State
  const [project, setProject] = useState<ClientHubProject | null>(null);

  // Load project once user is detected
  useEffect(() => {
    if (user?.email) {
      const p = loadClientHubProject(user.email, user.user_metadata?.full_name);
      setProject(p);
    } else {
      setProject(null);
    }
  }, [user]);

  const handleUpdateProject = (updated: ClientHubProject) => {
    setProject(updated);
    saveClientHubProject(updated);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Auth handler for guest gate
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    setIsSubmittingAuth(true);

    try {
      if (authMode === "login") {
        const { error } = await signInWithPassword(authEmail, authPassword);
        if (error) throw error;
      } else if (authMode === "signup") {
        const { error } = await signUp(authEmail, authPassword);
        if (error) throw error;
        setAuthMessage({ type: "success", text: "Account created! You are now entering your Client Hub." });
      } else if (authMode === "magic") {
        const { error } = await signInWithOtp(authEmail);
        if (error) throw error;
        setAuthMessage({ type: "success", text: "Magic sign-in link dispatched to your inbox." });
      }
    } catch (err: any) {
      setAuthMessage({ type: "error", text: err?.message || "Authentication failed. Please verify credentials." });
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setAuthMessage({ type: "error", text: err?.message || "Google sign in error." });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#c8ecff] text-slate-900 overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT ICON DOCK / SIDEBAR                                   */}
      {/* ------------------------------------------------------------- */}
      <aside
        className="fixed bottom-0 left-0 top-0 z-40 hidden md:flex w-20 flex-col items-center justify-between border-r py-8 backdrop-blur-2xl transition-colors duration-200"
        style={{
          borderColor: "rgba(0, 0, 0, 0.08)",
          backgroundColor: "rgba(200, 236, 255, 0.4)",
        }}
      >
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/"
            className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all !text-slate-800 hover:bg-white/60 hover:!text-black"
            title={pkgCopy.nav.home}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.home}</span>
          </Link>

          <Link
            href="/projects"
            className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all !text-slate-800 hover:bg-white/60 hover:!text-black"
            title={pkgCopy.nav.projects}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.projects}</span>
          </Link>

          <Link
            href="/pricing"
            className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all !text-slate-800 hover:bg-white/60 hover:!text-black"
            title={pkgCopy.nav.pricing}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.pricing}</span>
          </Link>

          {/* Client Hub Link: ONLY VISIBLE WHEN USER IS SIGNED IN */}
          {user && (
            <Link
              href="/client"
              className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all bg-white !text-black shadow-md border border-sky-300/80"
              title={pkgCopy.nav.clientHub}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-bold">{pkgCopy.nav.clientHub}</span>
            </Link>
          )}

          <Link
            href="/qna"
            className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all !text-slate-800 hover:bg-white/60 hover:!text-black"
            title={pkgCopy.nav.qna}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-semibold">{pkgCopy.nav.qna}</span>
          </Link>
        </div>

        <div>
          {user ? (
            <button
              type="button"
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
              className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all !text-slate-800 hover:bg-rose-500/15 hover:!text-rose-600 cursor-pointer"
              title="Sign Out"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-[10px] font-semibold">Logout</span>
            </button>
          ) : (
            <Link
              href="/auth"
              className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all !text-slate-800 hover:bg-white/60 hover:!text-black"
              title="Sign In"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="text-[10px] font-semibold">Login</span>
            </Link>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN CONTAINER                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="pl-0 md:pl-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-8 sm:pt-10 sm:pb-24">
          
          {/* ------------------------------------------------------------- */}
          {/* A. SIGNED-OUT STATE: AUTHENTICATION GATEWAY                   */}
          {/* ------------------------------------------------------------- */}
          {!user ? (
            <div className="max-w-md mx-auto my-12 animate-fadeIn">
              <div className="rounded-[2.4rem] border border-sky-300/80 bg-white/95 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
                <div className="h-14 w-14 rounded-2xl bg-sky-100 text-sky-900 border border-sky-200 flex items-center justify-center text-2xl mx-auto mb-4 font-bold shadow-xs">
                  💼
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-800">
                  Private Client Gateway
                </span>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[#0a192f]">
                  Sign In to Client Hub
                </h1>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed mb-6">
                  Access your active sprint milestones, review custom contracts, manage assets, and track project status.
                </p>

                {/* Google 1-Click Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white p-3.5 text-xs font-extrabold text-slate-800 shadow-sm hover:bg-slate-50 transition cursor-pointer mb-4"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                    or email
                  </span>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {authMode !== "magic" && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Password:
                      </label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  )}

                  {authMessage && (
                    <div
                      className={`rounded-xl p-2.5 text-xs font-semibold ${
                        authMessage.type === "success"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {authMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full rounded-2xl bg-[#0a192f] p-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition cursor-pointer"
                  >
                    {isSubmittingAuth
                      ? "Verifying..."
                      : authMode === "login"
                      ? "Sign In to Client Hub →"
                      : authMode === "signup"
                      ? "Create Client Account →"
                      : "Send Magic Link →"}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                      className="hover:text-black underline cursor-pointer"
                    >
                      {authMode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === "magic" ? "login" : "magic")}
                      className="hover:text-black underline cursor-pointer"
                    >
                      {authMode === "magic" ? "Use Password" : "Passwordless Magic Link"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* B. SIGNED-IN STATE: TABBED WORKSPACE                          */
            /* ------------------------------------------------------------- */
            project && (
              <TabbedWorkspace
                project={project}
                onUpdateProject={handleUpdateProject}
                onSignOut={async () => { await signOut(); window.location.href = "/"; }}
                scrollToSection={scrollToSection}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
