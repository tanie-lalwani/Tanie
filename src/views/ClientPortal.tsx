"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  getClientProjects,
  getContractForProject,
  getProjectAssets,
  uploadProjectAsset,
  deleteProjectAsset,
  signContract,
  getWebsitePackages,
  type ClientProject,
  type EContract,
  type ProjectAsset,
  type WebsitePackage,
  DEMO_CLIENT_PROJECT,
} from "@/lib/portalServices";
import SignaturePad from "@/components/SignaturePad";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function ClientPortal() {
  const [sessionUser, setSessionUser] = useState<{ email?: string; id?: string } | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup" | "magic">("login");
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Portal State
  const [activeTab, setActiveTab] = useState<"overview" | "assets" | "contracts" | "packages">("overview");
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [contract, setContract] = useState<EContract | null>(null);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [packages, setPackages] = useState<WebsitePackage[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Asset Upload State
  const [uploadCategory, setUploadCategory] = useState<ProjectAsset["category"]>("brand_assets");
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Contract Signature State
  const [isSigning, setIsSigning] = useState(false);
  const [contractSignedSuccess, setContractSignedSuccess] = useState(false);
  const [legalAgreed, setLegalAgreed] = useState(false);

  const [, startTransition] = useTransition();

  // Check Supabase Auth session on mount
  useEffect(() => {
    async function checkAuth() {
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            setSessionUser({
              email: data.session.user.email,
              id: data.session.user.id,
            });
          }
        } catch (e) {
          console.warn("Auth session check error:", e);
        }
      }
    }
    checkAuth();
  }, []);

  // Load project, contract, assets, and packages when user or demo mode changes
  useEffect(() => {
    let isMounted = true;
    async function loadPortalData() {
      setLoadingData(true);
      const email = sessionUser?.email || (isDemoMode ? "client@demo.com" : "");

      try {
        const [pkgs, projs] = await Promise.all([
          getWebsitePackages(),
          email ? getClientProjects(email) : Promise.resolve([DEMO_CLIENT_PROJECT]),
        ]);

        if (!isMounted) return;
        setPackages(pkgs);
        setProjects(projs);

        const currentProj = projs[0] || DEMO_CLIENT_PROJECT;
        setSelectedProject(currentProj);

        if (currentProj) {
          const [ctr, asts] = await Promise.all([
            getContractForProject(currentProj.id),
            getProjectAssets(currentProj.id),
          ]);
          if (!isMounted) return;
          setContract(ctr);
          setAssets(asts);
        }
      } catch (err) {
        console.error("Portal data loading error:", err);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    }

    if (sessionUser || isDemoMode) {
      loadPortalData();
    } else {
      setLoadingData(false);
    }

    return () => {
      isMounted = false;
    };
  }, [sessionUser, isDemoMode]);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (!authEmail.trim()) {
      setAuthMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    if (isSupabaseConfigured()) {
      try {
        if (authMode === "magic") {
          const { error } = await supabase.auth.signInWithOtp({
            email: authEmail.trim(),
            options: { emailRedirectTo: typeof window !== "undefined" ? window.location.href : undefined },
          });
          if (error) throw error;
          setAuthMessage({ type: "success", text: "Magic link sent! Check your inbox to sign in." });
          return;
        }

        if (authMode === "signup") {
          const { data, error } = await supabase.auth.signUp({
            email: authEmail.trim(),
            password: authPassword,
          });
          if (error) throw error;
          if (data.user) {
            setSessionUser({ email: data.user.email, id: data.user.id });
            setAuthMessage({ type: "success", text: "Account created successfully!" });
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail.trim(),
            password: authPassword,
          });
          if (error) throw error;
          if (data.user) {
            setSessionUser({ email: data.user.email, id: data.user.id });
          }
        }
      } catch (err: any) {
        setAuthMessage({ type: "error", text: err?.message || "Authentication failed. Please try again." });
      }
    } else {
      // Fallback local session if Supabase is in initial setup
      setSessionUser({ email: authEmail.trim(), id: "local-user" });
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Sign out err:", e);
      }
    }
    setSessionUser(null);
    setIsDemoMode(false);
  };

  // Asset Upload Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProject) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${files.length} asset(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newAsset = await uploadProjectAsset(file, selectedProject.id, uploadCategory, uploadDescription);
        setAssets((prev) => [newAsset, ...prev]);
      }
      setUploadDescription("");
      setUploadProgress("Upload complete!");
      setTimeout(() => setUploadProgress(null), 3000);
    } catch (err) {
      console.error("Asset upload failed:", err);
      setUploadProgress("Upload encountered an issue.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteAsset = async (assetId: string, storagePath: string) => {
    if (!confirm("Are you sure you want to remove this asset?")) return;
    try {
      await deleteProjectAsset(assetId, storagePath);
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch (err) {
      console.error("Delete asset error:", err);
    }
  };

  // Contract Signature Submission
  const handleSaveSignature = async (signatureDataUrl: string, signatureName: string) => {
    if (!contract || !legalAgreed) {
      alert("Please check the box agreeing to the contract terms before signing.");
      return;
    }

    setIsSigning(true);
    try {
      const updated = await signContract(contract.id, signatureDataUrl, signatureName);
      setContract(updated);
      setContractSignedSuccess(true);
    } catch (err) {
      console.error("Error signing contract:", err);
      alert("Failed to submit signature. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  // Project Stage Order Helper
  const stages = ["Discovery", "Design", "Development", "Review", "Launch", "Completed"];
  const currentStageIndex = selectedProject ? stages.indexOf(selectedProject.status) : 0;

  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky-400/20 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-sky-950/40 p-6 backdrop-blur-2xl shadow-[0_12px_40px_rgba(2,8,23,0.5)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-sky-400" />
              Client Portal & Hub
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {sessionUser || isDemoMode
                ? `Welcome, ${selectedProject?.client_name || sessionUser?.email?.split("@")[0] || "Partner"}`
                : "Client Management & Workspace"}
            </h1>
            <p className="text-sm text-slate-300">
              Manage your website project, track milestones, upload brand assets, and sign e-contracts securely.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/packages"
              className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sky-200 transition hover:bg-sky-500/20"
            >
              Browse Packages
            </Link>

            {sessionUser || isDemoMode ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/30"
              >
                Sign Out ({isDemoMode ? "Demo Mode" : sessionUser?.email})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsDemoMode(true)}
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.3)] transition hover:brightness-110"
              >
                Explore Demo Client Workspace
              </button>
            )}
          </div>
        </div>

        {/* AUTH VIEW (If Not Logged In and Not Demo Mode) */}
        {!sessionUser && !isDemoMode ? (
          <div className="mx-auto max-w-md rounded-3xl border border-sky-400/20 bg-slate-950/80 p-8 backdrop-blur-2xl shadow-2xl">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">Sign In to Your Workspace</h2>
              <p className="mt-1 text-xs text-slate-400">
                Access your active project deliverables, contracts & asset dropzone.
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="mt-6 flex rounded-full bg-slate-900/90 p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 rounded-full py-1.5 font-semibold transition ${
                  authMode === "login" ? "bg-sky-500/20 text-sky-300 border border-sky-400/40" : "text-slate-400"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("magic")}
                className={`flex-1 rounded-full py-1.5 font-semibold transition ${
                  authMode === "magic" ? "bg-sky-500/20 text-sky-300 border border-sky-400/40" : "text-slate-400"
                }`}
              >
                Magic Link
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`flex-1 rounded-full py-1.5 font-semibold transition ${
                  authMode === "signup" ? "bg-sky-500/20 text-sky-300 border border-sky-400/40" : "text-slate-400"
                }`}
              >
                Sign Up
              </button>
            </div>

            {authMessage && (
              <div
                className={`mt-4 rounded-xl p-3 text-xs ${
                  authMessage.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {authMessage.text}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>

              {authMode !== "magic" && (
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:brightness-110"
              >
                {authMode === "login" ? "Sign In to Portal" : authMode === "magic" ? "Send Magic Sign-In Link" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4 text-center">
              <p className="text-xs text-slate-400">Want to test the full client experience right away?</p>
              <button
                type="button"
                onClick={() => setIsDemoMode(true)}
                className="mt-2 text-xs font-semibold text-sky-400 underline underline-offset-4 hover:text-sky-300"
              >
                Launch One-Click Demo Client Workspace →
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED / DEMO CLIENT PORTAL VIEW */
          <div>
            {/* Navigation Tabs */}
            <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
              {[
                { id: "overview", label: "Project Overview & Milestones", icon: "📊" },
                { id: "assets", label: "Asset Dropzone & Media Hub", count: assets.length, icon: "📁" },
                {
                  id: "contracts",
                  label: "E-Contract & Signing",
                  status: contract?.status === "signed" ? "Signed ✓" : "Pending Signature ✍️",
                  icon: "📜",
                },
                { id: "packages", label: "Packages & Upgrades", icon: "💎" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "border border-sky-400/40 bg-sky-500/20 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                      : "border border-transparent text-slate-400 hover:bg-slate-900/60 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-sky-300">
                      {tab.count}
                    </span>
                  )}
                  {tab.status && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        tab.status.includes("Signed")
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                      }`}
                    >
                      {tab.status}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && selectedProject && (
              <div className="space-y-8">
                {/* Project Header Card */}
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="inline-block rounded-md border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-sky-300">
                        {selectedProject.company_name || "Active Engagement"}
                      </span>
                      <h2 className="mt-2 text-2xl font-bold text-white">{selectedProject.title}</h2>
                      <p className="mt-1 max-w-2xl text-sm text-slate-300">{selectedProject.description}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-right">
                      <div className="text-xs uppercase tracking-wider text-slate-400">Target Launch</div>
                      <div className="text-base font-bold text-sky-300">
                        {selectedProject.target_launch_date
                          ? new Date(selectedProject.target_launch_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "October 2026"}
                      </div>
                      <div className="mt-1 text-xs text-emerald-400">On Track • Active Phase</div>
                    </div>
                  </div>

                  {/* Stage Flow Stepper */}
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      <span>Project Lifecycle Pipeline</span>
                      <span className="text-sky-300">{selectedProject.progress_percent}% Overall Progress</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900 border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 transition-all duration-1000 shadow-[0_0_14px_rgba(56,189,248,0.6)]"
                        style={{ width: `${selectedProject.progress_percent}%` }}
                      />
                    </div>

                    {/* Stage Steps */}
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-6">
                      {stages.map((stage, idx) => {
                        const isDone = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        return (
                          <div
                            key={stage}
                            className={`flex flex-col items-center rounded-xl p-2.5 text-center text-xs transition ${
                              isCurrent
                                ? "border border-sky-400/50 bg-sky-500/20 text-sky-200 font-bold shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                                : isDone
                                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium"
                                : "border border-white/5 bg-slate-900/40 text-slate-500"
                            }`}
                          >
                            <span className="text-sm">
                              {isDone ? "✓" : isCurrent ? "⚡" : idx + 1}
                            </span>
                            <span className="mt-1">{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Action Deliverable Links */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/8">
                    {selectedProject.live_preview_url && (
                      <a
                        href={selectedProject.live_preview_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/30"
                      >
                        <span>🌐 Staging Preview Build</span>
                        <span>↗</span>
                      </a>
                    )}
                    {selectedProject.figma_url && (
                      <a
                        href={selectedProject.figma_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                      >
                        <span>🎨 Figma Design System</span>
                        <span>↗</span>
                      </a>
                    )}
                    {selectedProject.github_repo && (
                      <a
                        href={selectedProject.github_repo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                      >
                        <span>📦 GitHub Repository</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Grid: Milestones & Deliverables */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Milestones Checklist */}
                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>🎯</span> Key Sprint Milestones
                    </h3>
                    <div className="mt-4 space-y-3">
                      {selectedProject.milestones?.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-900/60 p-4"
                        >
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              milestone.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : milestone.status === "in-progress"
                                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 animate-pulse"
                                : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {milestone.status === "completed" ? "✓" : "•"}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-white">{milestone.title}</h4>
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  milestone.status === "completed"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : milestone.status === "in-progress"
                                    ? "bg-sky-500/10 text-sky-300"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {milestone.status}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-300">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables Hub */}
                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>💎</span> Handed-Over Deliverables
                    </h3>
                    <div className="mt-4 space-y-3">
                      {selectedProject.deliverables?.length > 0 ? (
                        selectedProject.deliverables.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-900/60 p-4 transition hover:border-sky-400/30"
                          >
                            <div>
                              <div className="text-sm font-semibold text-white">{item.title}</div>
                              <div className="text-xs text-slate-400">Added on {item.added_at}</div>
                            </div>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-300 border border-sky-400/30 hover:bg-sky-500/20"
                            >
                              Access ↗
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 py-6 text-center">
                          Deliverables will be published here as each milestone is completed.
                        </p>
                      )}
                    </div>

                    {/* Direct Contact & Support Callout */}
                    <div className="mt-6 rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-950/40 to-slate-900/60 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                        Need an urgent revision or question?
                      </div>
                      <p className="mt-1 text-xs text-slate-300">
                        Reach out directly via email or scheduled Slack sprint channel.
                      </p>
                      <Link
                        href="/contact"
                        className="mt-3 inline-block text-xs font-bold text-sky-400 hover:text-sky-300 underline underline-offset-4"
                      >
                        Contact Tanie Lalwani →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ASSET DROPZONE & MEDIA HUB */}
            {activeTab === "assets" && selectedProject && (
              <div className="space-y-6">
                {/* Upload Panel */}
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📤</span> Upload Project Assets & Media
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Upload logos (SVG/PNG), brand guidelines (PDF), typography, images, copy documents, or 3D models.
                    Stored securely with Supabase Storage.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                        Asset Category
                      </label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value as any)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-sky-400 focus:outline-none"
                      >
                        <option value="brand_assets">Brand Assets & Guidelines</option>
                        <option value="logo">Vector Logos & Icons</option>
                        <option value="content_copy">Content & Copywriting Docs</option>
                        <option value="images_media">High-Res Images & Video Media</option>
                        <option value="design_reference">Design References & Moodboards</option>
                        <option value="contract">Executed Contract Documents</option>
                        <option value="general">General Asset</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-1">
                        Note / Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder="e.g. Primary transparent hero logo (dark mode)"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Drag-and-drop Dropzone */}
                  <div className="mt-4 relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-400/30 bg-slate-900/40 p-8 text-center transition hover:border-sky-400/60 hover:bg-slate-900/60">
                    <input
                      type="file"
                      multiple
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <span className="text-3xl">📁</span>
                    <span className="mt-2 text-sm font-semibold text-white">
                      {isUploading ? "Uploading to Cloud Storage..." : "Click or drag files here to upload"}
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      Supports SVG, PNG, JPG, WebP, PDF, DOCX, GLB/GLTF, ZIP up to 50MB
                    </span>
                    {uploadProgress && (
                      <div className="mt-3 rounded-full bg-sky-500/20 px-4 py-1 text-xs font-medium text-sky-300 border border-sky-400/30">
                        {uploadProgress}
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Assets List */}
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Uploaded Project Assets ({assets.length})</h3>
                    <span className="text-xs text-slate-400">Directly accessible to developer</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {assets.length > 0 ? (
                      assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex flex-col justify-between rounded-2xl border border-white/8 bg-slate-900/60 p-4 transition hover:border-sky-400/30 shadow-lg"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
                                {asset.category.replace("_", " ")}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {(asset.file_size_bytes / 1024).toFixed(0)} KB
                              </span>
                            </div>
                            <h4 className="mt-2 truncate text-sm font-semibold text-white" title={asset.file_name}>
                              {asset.file_name}
                            </h4>
                            {asset.description && (
                              <p className="mt-1 text-xs text-slate-400 line-clamp-2">{asset.description}</p>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                            <span className="text-[10px] text-slate-500">
                              {new Date(asset.created_at).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                              <a
                                href={asset.public_url}
                                target="_blank"
                                rel="noreferrer"
                                download={asset.file_name}
                                className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300 hover:bg-sky-500/20"
                              >
                                Download ↓
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteAsset(asset.id, asset.storage_path)}
                                className="rounded-lg bg-rose-500/10 px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/20"
                                title="Delete asset"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 text-center text-xs text-slate-400">
                        No assets uploaded yet. Drop your brand assets above to get started.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: E-CONTRACT & SIGNING */}
            {activeTab === "contracts" && (
              <div className="space-y-6">
                {contract ? (
                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/80 p-6 backdrop-blur-2xl shadow-2xl sm:p-8">
                    {/* Contract Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📜</span>
                          <h2 className="text-2xl font-bold text-white">Client Engagement Agreement</h2>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Document ID: <span className="font-mono text-sky-300">{contract.id}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
                            contract.status === "signed"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          {contract.status === "signed" ? "Executed & Signed ✓" : "Pending Signature"}
                        </span>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="rounded-full border border-white/10 bg-slate-900 px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-white"
                        >
                          Print / Save PDF
                        </button>
                      </div>
                    </div>

                    {/* Contract Parties & Summary */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl bg-slate-900/60 p-5 border border-white/6 text-xs">
                      <div>
                        <span className="font-semibold uppercase tracking-wider text-slate-400">Developer</span>
                        <p className="mt-1 font-bold text-white text-sm">Tanie Lalwani</p>
                        <p className="text-slate-300">Creative & Full-Stack Web Engineer</p>
                        <p className="text-slate-400">Website: https://tanie.me</p>
                      </div>
                      <div>
                        <span className="font-semibold uppercase tracking-wider text-slate-400">Client</span>
                        <p className="mt-1 font-bold text-white text-sm">{contract.client_name}</p>
                        <p className="text-slate-300">{contract.client_email}</p>
                        <p className="text-slate-400">Package: {contract.package_name}</p>
                      </div>
                    </div>

                    {/* Scope & Financial Terms */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">1. Project Scope</h4>
                        <p className="mt-1.5 text-sm text-slate-200 bg-slate-900/40 p-4 rounded-xl border border-white/6 leading-relaxed">
                          {contract.scope_summary}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          2. Compensation & Payment Schedule
                        </h4>
                        <div className="mt-1.5 rounded-xl bg-slate-900/40 p-4 border border-white/6 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="text-xs text-slate-400">Agreed Fixed Total Investment</div>
                            <div className="text-2xl font-bold text-white">
                              ${contract.total_amount_usd.toLocaleString("en-US")} USD
                            </div>
                          </div>
                          <div className="text-xs text-slate-300 max-w-md">{contract.payment_terms}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          3. Legal Provisions, IP Transfer & Warranty
                        </h4>
                        <pre className="mt-1.5 whitespace-pre-wrap font-sans text-xs text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/6 leading-relaxed max-h-48 overflow-y-auto about-scroll">
                          {contract.legal_terms}
                        </pre>
                      </div>
                    </div>

                    {/* SIGNATURE SECTION */}
                    <div className="mt-8 border-t border-white/10 pt-6">
                      {contract.status === "signed" ? (
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="inline-flex items-center gap-2 text-emerald-300 font-bold text-sm">
                                <span>🛡️</span> Digital Certificate of Execution
                              </div>
                              <p className="mt-1 text-xs text-slate-300">
                                Legally executed by <strong className="text-white">{contract.signature_name}</strong> on{" "}
                                {new Date(contract.signed_at || "").toUTCString()}.
                              </p>
                              <p className="text-[11px] font-mono text-emerald-400/80 mt-0.5">
                                Verification IP / Stamp: {contract.signed_ip}
                              </p>
                            </div>

                            {contract.signature_url && (
                              <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3 text-center">
                                <img
                                  src={contract.signature_url}
                                  alt="Client Signature"
                                  className="h-16 max-w-[200px] object-contain"
                                />
                                <span className="text-[10px] text-slate-400 block mt-1">Verified Client Signature</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                              <input
                                type="checkbox"
                                checked={legalAgreed}
                                onChange={(e) => setLegalAgreed(e.target.checked)}
                                className="h-4 w-4 rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-400"
                              />
                              <span>
                                I acknowledge that I have reviewed and agree to the project scope, payment schedule, and
                                terms above.
                              </span>
                            </label>
                          </div>

                          <SignaturePad
                            onSave={handleSaveSignature}
                            defaultName={contract.client_name}
                            isSaving={isSigning}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-12 text-center text-slate-400">
                    No active contract document found. Once a project is initiated, your tailored agreement will appear
                    here for digital execution.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: WEBSITE PACKAGES & UPGRADES */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white">Website Packages & Add-on Upgrades</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Explore available website engineering tiers, add dynamic 3D shaders, multi-language localization,
                    or CMS integrations.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {packages.map((pkg) => {
                    const isCurrent = selectedProject?.package_id === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        className={`relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all ${
                          isCurrent
                            ? "border-sky-400 bg-gradient-to-b from-sky-950/50 via-slate-950/80 to-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
                            : "border-white/10 bg-slate-950/70 hover:border-sky-400/40"
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                            {pkg.badge}
                          </span>
                        )}

                        <div>
                          <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                          <p className="mt-1 text-xs text-slate-400">{pkg.tagline}</p>

                          <div className="my-4 flex items-baseline gap-1">
                            <span className="text-2xl font-black text-white">
                              ${pkg.price_usd.toLocaleString("en-US")}
                            </span>
                            <span className="text-xs text-slate-400">USD ({pkg.turnaround_weeks})</span>
                          </div>

                          <ul className="space-y-2 text-xs text-slate-300">
                            {pkg.features?.slice(0, 5).map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-sky-400">✓</span>
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 border-t border-white/8 pt-4">
                          {isCurrent ? (
                            <div className="rounded-xl bg-sky-500/20 py-2.5 text-center text-xs font-bold text-sky-300 border border-sky-400/40">
                              Currently Active Tier
                            </div>
                          ) : (
                            <Link
                              href="/packages"
                              className="block w-full rounded-xl bg-slate-900 py-2.5 text-center text-xs font-semibold text-white border border-white/10 hover:bg-sky-500/20 hover:text-sky-200"
                            >
                              Explore Tier Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
