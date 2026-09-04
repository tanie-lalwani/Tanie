"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
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

export default function ClientPortal() {
  const {
    user,
    loading: authLoading,
    signInWithPassword,
    signUp,
    signInWithOtp,
    signOut,
  } = useAuth();

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup" | "magic">("login");
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
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

  // Load project, contract, assets, and packages when user or demo mode changes
  useEffect(() => {
    let isMounted = true;
    async function loadPortalData() {
      setLoadingData(true);
      const email = user?.email || (isDemoMode ? "client@demo.com" : "");

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

    if (user || isDemoMode) {
      loadPortalData();
    } else {
      setLoadingData(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user, isDemoMode]);

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (!authEmail.trim()) {
      setAuthMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    setIsSubmittingAuth(true);

    try {
      if (authMode === "magic") {
        const res = await signInWithOtp(authEmail.trim());
        if (res?.error) throw res.error;
        setAuthMessage({
          type: "success",
          text: "✨ Magic link sent! Check your inbox to sign in directly.",
        });
      } else if (authMode === "signup") {
        if (!authPassword || authPassword.length < 6) {
          setAuthMessage({ type: "error", text: "Password must be at least 6 characters." });
          setIsSubmittingAuth(false);
          return;
        }
        const res = await signUp(authEmail.trim(), authPassword);
        if (res?.error) throw res.error;
        setAuthMessage({ type: "success", text: "🎉 Account created successfully! Signing in..." });
      } else {
        const res = await signInWithPassword(authEmail.trim(), authPassword);
        if (res?.error) throw res.error;
        setAuthMessage(null);
      }
    } catch (err: unknown) {
      setAuthMessage({
        type: "error",
        text: (err as Error)?.message || "Authentication failed. Please check your credentials.",
      });
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
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
        const newAsset = await uploadProjectAsset(
          file,
          selectedProject.id,
          uploadCategory,
          uploadDescription
        );
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

  const isAuthenticatedUser = Boolean(user) || isDemoMode;

  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky-400/20 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-sky-950/40 p-6 backdrop-blur-2xl shadow-[0_12px_40px_rgba(2,8,23,0.5)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <span className="h-2 w-2 animate-ping rounded-full bg-sky-400" />
              {isAuthenticatedUser ? "Client Workspace & Active Hub" : "Client Portal & Gateway"}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {isAuthenticatedUser
                ? `Welcome, ${selectedProject?.client_name || user?.email?.split("@")[0] || "Partner"}`
                : "Client Management & Workspace"}
            </h1>
            <p className="text-sm text-slate-300">
              {isAuthenticatedUser
                ? "Track live project milestones, upload brand assets, access staging deliverables, and sign e-contracts securely."
                : "A centralized private engineering portal for design reviews, sprint tracking, digital agreements, and asset management."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/packages"
              className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sky-200 transition hover:bg-sky-500/20"
            >
              Browse Packages
            </Link>

            {isAuthenticatedUser ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/30"
              >
                Sign Out ({isDemoMode ? "Demo Client" : user?.email})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsDemoMode(true)}
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.3)] transition hover:brightness-110"
              >
                Explore Demo Client Workspace ⚡
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: UNAUTHENTICATED GUEST / DISCOVERY UI                   */}
        {/* ------------------------------------------------------------- */}
        {!isAuthenticatedUser ? (
          <div className="space-y-12">
            {/* Feature Showcase Grid for Prospective Clients */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-sky-400/20 bg-slate-950/60 p-6 backdrop-blur-xl transition hover:border-sky-400/40 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-400/30 text-2xl">
                  📊
                </div>
                <h3 className="mt-4 text-base font-bold text-white">Live Sprint Milestones</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Real-time timeline tracking across Discovery, Figma Design, Development, Staging Review, and Production Launch.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-400/20 bg-slate-950/60 p-6 backdrop-blur-xl transition hover:border-sky-400/40 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-400/30 text-2xl">
                  📁
                </div>
                <h3 className="mt-4 text-base font-bold text-white">Cloud Asset Dropzone</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Upload logos, vector graphics, typography files, copy docs, and 3D assets directly to Supabase cloud storage.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-400/20 bg-slate-950/60 p-6 backdrop-blur-xl transition hover:border-sky-400/40 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-400/30 text-2xl">
                  ✍️
                </div>
                <h3 className="mt-4 text-base font-bold text-white">Digital E-Contracts</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Review clear scope summaries, legal warranties, milestone payment schedules, and execute signatures with cryptographic IP stamping.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-400/20 bg-slate-950/60 p-6 backdrop-blur-xl transition hover:border-sky-400/40 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-400/30 text-2xl">
                  💎
                </div>
                <h3 className="mt-4 text-base font-bold text-white">Deliverables Vault</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Direct one-click access to staging deployment previews, Figma design boards, production code repositories, and documentation.
                </p>
              </div>
            </div>

            {/* Authentication Card & Demo CTA Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
              {/* Left Column: Interactive Auth Card */}
              <div className="lg:col-span-6 rounded-3xl border border-sky-400/30 bg-slate-950/85 p-8 backdrop-blur-2xl shadow-[0_16px_50px_rgba(2,8,23,0.7)]">
                <div className="text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 mb-3">
                    🔐
                  </div>
                  <h2 className="text-xl font-bold text-white">Sign In to Your Client Hub</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Enter your registered email to access your active workspace.
                  </p>
                </div>

                {/* Auth Mode Tabs */}
                <div className="mt-6 flex rounded-full bg-slate-900/90 p-1 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className={`flex-1 rounded-full py-1.5 font-semibold transition ${
                      authMode === "login"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Password Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("magic")}
                    className={`flex-1 rounded-full py-1.5 font-semibold transition ${
                      authMode === "magic"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Magic Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className={`flex-1 rounded-full py-1.5 font-semibold transition ${
                      authMode === "signup"
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Create Account
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
                      Client Email Address
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
                    disabled={isSubmittingAuth || authLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:brightness-110 disabled:opacity-60"
                  >
                    {isSubmittingAuth
                      ? "Processing..."
                      : authMode === "login"
                      ? "Sign In to Client Workspace"
                      : authMode === "magic"
                      ? "Send Magic Sign-In Link"
                      : "Create Client Account"}
                  </button>
                </form>

                <div className="mt-6 border-t border-white/10 pt-4 text-center">
                  <p className="text-xs text-slate-400">Want to test the full client experience right away?</p>
                  <button
                    type="button"
                    onClick={() => setIsDemoMode(true)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 underline underline-offset-4 hover:text-sky-300"
                  >
                    <span>Launch One-Click Demo Client Workspace</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Demo Experience Highlight */}
              <div className="lg:col-span-6 space-y-6">
                <div className="rounded-3xl border border-sky-400/20 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-sky-950/40 p-8 backdrop-blur-2xl shadow-xl">
                  <span className="inline-block rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                    Interactive Walkthrough
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white">Test-Drive the Client Hub</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Experience what it feels like to collaborate with Tanie Lalwani. With the demo workspace, you can inspect live milestone progression, try the canvas signature pad, and test the cloud asset dropzone.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-xs text-slate-300">
                      <span className="text-emerald-400">✓</span>
                      <span>No sign-up or credit card required for demo exploration</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-xs text-slate-300">
                      <span className="text-emerald-400">✓</span>
                      <span>Simulated real-world e-contract agreement & signature pad</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-xs text-slate-300">
                      <span className="text-emerald-400">✓</span>
                      <span>Active sprint milestone tracker with progress analytics</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsDemoMode(true)}
                      className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:brightness-110"
                    >
                      Open Demo Workspace ⚡
                    </button>
                    <Link
                      href="/contact"
                      className="rounded-xl border border-white/10 bg-slate-800/80 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:bg-slate-700/80"
                    >
                      Inquire for New Project
                    </Link>
                  </div>
                </div>

                {/* Direct Help Callout */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Have questions before starting?</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Explore package options or get in touch directly.</p>
                  </div>
                  <Link
                    href="/packages"
                    className="rounded-full bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-300 border border-sky-400/30 hover:bg-sky-500/20"
                  >
                    View Packages →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW 2: AUTHENTICATED CLIENT DASHBOARD / DEMO MODE            */
          /* ------------------------------------------------------------- */
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
                          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                            Digital Engineering Agreement
                          </span>
                        </div>
                        <h2 className="mt-1 text-2xl font-bold text-white">{contract.package_name}</h2>
                        <p className="text-xs text-slate-400">
                          Client: {contract.client_name} ({contract.client_email})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            contract.status === "signed"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                          }`}
                        >
                          {contract.status === "signed" ? "Executed & Signed ✓" : "Pending Signature ✍️"}
                        </span>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-2">
                          1. Project Scope & Deliverables
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {contract.scope_summary}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-2">
                          2. Total Fee & Payment Schedule
                        </h4>
                        <div className="text-xl font-bold text-white mb-2">
                          ${contract.total_amount_usd?.toLocaleString() || "3,200"} USD
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {contract.payment_terms}
                        </p>
                      </div>

                      <div className="col-span-full rounded-2xl border border-white/8 bg-slate-900/60 p-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-2">
                          3. Legal Terms & Warranties
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {contract.legal_terms}
                        </p>
                      </div>
                    </div>

                    {/* Signature Section */}
                    <div className="mt-8 border-t border-white/10 pt-6">
                      {contract.status === "signed" ? (
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                Legally Executed Signature
                              </div>
                              <div className="text-lg font-bold text-white mt-1">
                                {contract.signature_name || contract.client_name}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                Signed on: {new Date(contract.signed_at || "").toLocaleString()}
                              </div>
                              {contract.signed_ip && (
                                <div className="text-[10px] text-slate-500">Cryptographic IP: {contract.signed_ip}</div>
                              )}
                            </div>

                            {contract.signature_url && (
                              <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={contract.signature_url}
                                  alt="Client Signature"
                                  className="h-16 max-w-[200px] object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id="agreeTerms"
                              checked={legalAgreed}
                              onChange={(e) => setLegalAgreed(e.target.checked)}
                              className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-400"
                            />
                            <label htmlFor="agreeTerms" className="text-xs text-slate-300 cursor-pointer">
                              I confirm that I have authority to execute this agreement on behalf of my organization,
                              and agree to the terms, scope, and milestone payment schedules set forth above.
                            </label>
                          </div>

                          <div className="rounded-2xl border border-sky-400/20 bg-slate-900/70 p-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3">
                              Draw or Type Your Signature Below
                            </h4>
                            <SignaturePad
                              onSave={handleSaveSignature}
                              defaultName={contract.client_name}
                              isSaving={isSigning}
                            />
                          </div>

                          {contractSignedSuccess && (
                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-xs font-bold text-emerald-300">
                              🎉 Agreement successfully signed and recorded!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-12 text-center backdrop-blur-xl">
                    <span className="text-4xl">📜</span>
                    <h3 className="mt-3 text-lg font-bold text-white">No Pending Contracts</h3>
                    <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
                      All agreements for this active sprint are up to date. Once a new milestone contract is created, it will appear here for one-click signature.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PACKAGES & SPRINT ADDONS */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white">Available Packages & Sprint Expansions</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Expand your project with dedicated sprint modules, AI integrations, or speed optimization packages.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`flex flex-col justify-between rounded-3xl border p-6 transition backdrop-blur-xl ${
                          pkg.popular
                            ? "border-sky-400/50 bg-gradient-to-b from-sky-950/40 to-slate-900/80 shadow-[0_0_30px_rgba(56,189,248,0.15)]"
                            : "border-white/10 bg-slate-900/50 hover:border-sky-400/30"
                        }`}
                      >
                        <div>
                          {pkg.badge && (
                            <span className="inline-block rounded-md bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 border border-sky-400/30">
                              {pkg.badge}
                            </span>
                          )}
                          <h4 className="mt-2 text-lg font-bold text-white">{pkg.name}</h4>
                          <p className="mt-1 text-xs text-slate-400">{pkg.tagline}</p>
                          <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-white">${pkg.price_usd}</span>
                            <span className="text-xs text-slate-400">USD / sprint</span>
                          </div>

                          <ul className="mt-5 space-y-2 text-xs text-slate-300">
                            {pkg.features.slice(0, 5).map((feat, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 border-t border-white/10 pt-4">
                          <Link
                            href="/contact"
                            className="block w-full rounded-xl bg-sky-500/20 py-2.5 text-center text-xs font-bold text-sky-200 border border-sky-400/30 transition hover:bg-sky-500/30"
                          >
                            Request Add-On Sprint →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
