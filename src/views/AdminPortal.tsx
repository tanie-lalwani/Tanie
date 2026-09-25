"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  getAllProjects,
  getAllContracts,
  getAllAssets,
  getWebsitePackages,
  getAllLeads,
  updateLeadStatus,
  createClientProject,
  updateProject,
  saveWebsitePackage,
  type ClientProject,
  type EContract,
  type ProjectAsset,
  type WebsitePackage,
  type LeadItem,
} from "@/lib/portalServices";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import AdminLeadsTab from "@/components/admin/AdminLeadsTab";
import AdminContractsTab from "@/components/admin/AdminContractsTab";
import AdminPackagesTab from "@/components/admin/AdminPackagesTab";

const ADMIN_EMAILS = [
  "tanielalwani.work@gmail.com",
  "admin@tanie.me",
  "wordsofvoice2210@gmail.com",
];

export default function AdminPortal() {
  const { user, signInWithPassword, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [activeTab, setActiveTab] = useState<"metrics" | "projects" | "leads" | "contracts" | "assets" | "packages">("metrics");
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [contracts, setContracts] = useState<EContract[]>([]);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [packages, setPackages] = useState<WebsitePackage[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Project Form Modal
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    client_name: "",
    client_email: "",
    company_name: "",
    title: "",
    description: "",
    package_id: "interactive-3d-experience",
    budget_usd: 3499,
    target_launch_date: "",
    live_preview_url: "",
    figma_url: "",
  });

  // Selected Project for Editing
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);

  // Load all admin data
  const fetchAdminData = async () => {
    setIsRefreshing(true);
    try {
      const [pkgs, projs, ctrs, asts, lds] = await Promise.all([
        getWebsitePackages(),
        getAllProjects(),
        getAllContracts(),
        getAllAssets(),
        getAllLeads(),
      ]);
      setPackages(pkgs);
      setProjects(projs);
      setContracts(ctrs);
      setAssets(asts);
      setLeads(lds);
    } catch (err) {
      console.error("Admin data loading error:", err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Auto-unlock if authenticated via Supabase with an admin email
  useEffect(() => {
    if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      setIsAdminUnlocked(true);
    } else {
      setIsAdminUnlocked(false);
    }
  }, [user]);

  // Google OAuth Login for Admin
  const handleGoogleAdminLogin = async () => {
    setAuthError("");
    setIsSigningInGoogle(true);
    try {
      const res = await signInWithGoogle(
        typeof window !== "undefined" ? window.location.href : undefined
      );
      if (res?.error) {
        setAuthError(res.error.message);
      }
    } catch (err: unknown) {
      setAuthError((err as Error)?.message || "Failed to sign in with Google.");
    } finally {
      setIsSigningInGoogle(false);
    }
  };

  // Real Supabase Email/Password Admin Sign-in
  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmittingPassword(true);
    try {
      const res = await signInWithPassword(adminEmail, adminPassword);
      if (res?.error) {
        setAuthError(res.error.message);
      } else if (res?.data?.user?.email && !ADMIN_EMAILS.includes(res.data.user.email.toLowerCase())) {
        setAuthError("Access restricted: This account is not registered as a studio administrator.");
      }
    } catch (err: unknown) {
      setAuthError((err as Error)?.message || "Failed to sign in.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Create Project Action
  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createClientProject(newProjectData);
      setProjects((prev) => [created, ...prev]);
      setShowNewProjectModal(false);
      setNewProjectData({
        client_name: "",
        client_email: "",
        company_name: "",
        title: "",
        description: "",
        package_id: "interactive-3d-experience",
        budget_usd: 3499,
        target_launch_date: "",
        live_preview_url: "",
        figma_url: "",
      });
      alert("Project created successfully!");
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Error creating project.");
    }
  };

  // Update Project Progress & Stage
  const handleUpdateProjectStage = async (projectId: string, newStatus: ClientProject["status"], newProgress: number) => {
    try {
      await updateProject(projectId, { status: newStatus, progress_percent: newProgress });
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus, progress_percent: newProgress } : p))
      );
      if (editingProject && editingProject.id === projectId) {
        setEditingProject((prev) => (prev ? { ...prev, status: newStatus, progress_percent: newProgress } : null));
      }
    } catch (err) {
      console.error("Error updating project stage:", err);
    }
  };

  // Calculate Metrics
  const totalPipelineValue = projects.reduce((acc, p) => acc + (p.budget_usd || 0), 0);
  const activeProjectsCount = projects.filter((p) => p.status !== "Completed").length;
  const signedContractsCount = contracts.filter((c) => c.status === "signed").length;

  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky-400/20 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-sky-950/50 p-6 backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Executive Admin Suite
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Tanie Lalwani Studio Admin
            </h1>
            <p className="text-sm text-slate-300">
              Manage client projects, update milestones, inspect e-signatures, and configure website packages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/client"
              className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sky-200 hover:bg-sky-500/20"
            >
              Open Client Portal
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white"
            >
              View Pricing
            </Link>
            {user && (
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  setIsAdminUnlocked(false);
                }}
                className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white cursor-pointer transition"
                title={`Signed in as ${user.email}`}
              >
                Sign Out ({user.email?.split("@")[0]})
              </button>
            )}
          </div>
        </div>

        {/* AUTHENTICATION / ACCESS GUARD */}
        {user && !isAdminUnlocked ? (
          <div className="mx-auto max-w-md rounded-3xl border border-rose-500/30 bg-slate-950/90 p-8 backdrop-blur-2xl shadow-2xl text-center">
            <span className="text-4xl">🚫</span>
            <h2 className="mt-3 text-xl font-black text-white">Administrator Access Required</h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              You are signed in as <span className="font-semibold text-rose-300">{user.email}</span>. This account does not have administrative privileges for the studio dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => signOut()}
                className="w-full rounded-xl bg-rose-500/20 border border-rose-500/40 py-2.5 text-xs font-bold text-rose-200 hover:bg-rose-500/30 cursor-pointer transition"
              >
                Sign Out & Switch Account
              </button>
              <Link
                href="/client"
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition !no-underline"
              >
                Go to Client Workspace →
              </Link>
            </div>
          </div>
        ) : !isAdminUnlocked ? (
          <div className="mx-auto max-w-md rounded-3xl border border-sky-400/20 bg-slate-950/90 p-8 backdrop-blur-2xl shadow-2xl">
            <div className="text-center">
              <span className="text-3xl">🔐</span>
              <h2 className="mt-2 text-xl font-bold text-white">Studio Admin Authentication</h2>
              <p className="mt-1 text-xs text-slate-400">
                Sign in with an authorized administrator account to manage clients, contracts, and revenue.
              </p>
            </div>

            {authError && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {authError}
              </div>
            )}

            {/* 1-Click Google Admin Sign-in */}
            <div className="mt-6">
              <button
                type="button"
                disabled={isSigningInGoogle || authLoading}
                onClick={handleGoogleAdminLogin}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
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
                <span>{isSigningInGoogle ? "Connecting to Google..." : "Sign In with Google (Admin)"}</span>
              </button>

              <div className="relative my-5 flex items-center justify-center">
                <div className="w-full border-t border-white/10" />
                <span className="absolute bg-slate-950 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Or admin email & password
                </span>
              </div>
            </div>

            <form onSubmit={handleAdminEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@tanie.me"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingPassword}
                className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:brightness-110 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingPassword ? "Verifying..." : "Sign In to Admin Workspace"}
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED ADMIN DASHBOARD */
          <div>
            {/* Nav Tabs */}
            <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
              {[
                { id: "metrics", label: "Executive Metrics", icon: "📈" },
                { id: "leads", label: "Leads & Prospects", count: leads.length, icon: "🎯" },
                { id: "projects", label: "Client Projects", count: projects.length, icon: "💻" },
                { id: "contracts", label: "Contracts & Signatures", count: contracts.length, icon: "📜" },
                { id: "assets", label: "Asset Vault", count: assets.length, icon: "🗄️" },
                { id: "packages", label: "Website Packages", count: packages.length, icon: "💎" },
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
                </button>
              ))}
            </div>

            {/* TAB 1: METRICS */}
            {activeTab === "metrics" && (
              <div className="space-y-8">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-5 backdrop-blur-xl">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Pipeline Value
                    </span>
                    <div className="mt-2 text-2xl font-black text-white">
                      ${totalPipelineValue.toLocaleString("en-US")}
                    </div>
                    <span className="mt-1 block text-[11px] text-emerald-400">Active contracts</span>
                  </div>

                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-5 backdrop-blur-xl">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Captured Leads
                    </span>
                    <div className="mt-2 text-2xl font-black text-amber-300">{leads.length}</div>
                    <span className="mt-1 block text-[11px] text-amber-400/80">From price gate & booking</span>
                  </div>

                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-5 backdrop-blur-xl">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Active Engagements
                    </span>
                    <div className="mt-2 text-2xl font-black text-sky-300">{activeProjectsCount}</div>
                    <span className="mt-1 block text-[11px] text-slate-400">In Design / Dev / Review</span>
                  </div>

                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-5 backdrop-blur-xl">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Executed Contracts
                    </span>
                    <div className="mt-2 text-2xl font-black text-emerald-400">{signedContractsCount}</div>
                    <span className="mt-1 block text-[11px] text-emerald-400/80">With e-signature stamp</span>
                  </div>

                  <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-5 backdrop-blur-xl">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Client Assets
                    </span>
                    <div className="mt-2 text-2xl font-black text-cyan-300">{assets.length}</div>
                    <span className="mt-1 block text-[11px] text-slate-400">In Cloud Storage</span>
                  </div>
                </div>

                {/* Recent Projects Quick View */}
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Live Project Tracker</h3>
                    <button
                      type="button"
                      onClick={() => setShowNewProjectModal(true)}
                      className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110"
                    >
                      + New Project
                    </button>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4">Client / Company</th>
                          <th className="py-3 px-4">Project Title</th>
                          <th className="py-3 px-4">Stage</th>
                          <th className="py-3 px-4">Progress</th>
                          <th className="py-3 px-4">Budget (USD)</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/6 text-slate-200">
                        {projects.map((p) => (
                          <tr key={p.id} className="hover:bg-white/5 transition">
                            <td className="py-3.5 px-4 font-semibold text-white">
                              {p.client_name}
                              <span className="block text-[11px] font-normal text-slate-400">
                                {p.company_name || p.client_email}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">{p.title}</td>
                            <td className="py-3.5 px-4">
                              <span className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-bold text-sky-300 border border-sky-400/30">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-800">
                                  <div className="h-full bg-sky-400" style={{ width: `${p.progress_percent}%` }} />
                                </div>
                                <span className="font-mono text-[11px]">{p.progress_percent}%</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                              ${p.budget_usd?.toLocaleString("en-US")}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProject(p);
                                  setActiveTab("projects");
                                }}
                                className="rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 hover:bg-sky-500/20"
                              >
                                Edit / Progress →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LEADS & PROSPECTS */}
            {activeTab === "leads" && (
              <AdminLeadsTab
                leads={leads}
                setLeads={setLeads}
                isRefreshing={isRefreshing}
                onRefresh={fetchAdminData}
                onConvertToProject={(lead) => {
                  setNewProjectData({
                    client_name: lead.client_name,
                    client_email: lead.client_email,
                    company_name: lead.company_name || "",
                    title: `${lead.company_name || lead.client_name} ${lead.selected_aesthetic || "Custom"} Web Project`,
                    description: lead.client_message || `Scope: ${lead.scope_tier || "Business"}. Modules: ${lead.selected_addons?.join(", ") || "Core"}`,
                    package_id: "interactive-3d-experience",
                    budget_usd: lead.estimated_budget_usd || 3499,
                    target_launch_date: "",
                    live_preview_url: "",
                    figma_url: "",
                  });
                  setShowNewProjectModal(true);
                }}
              />
            )}

            {/* TAB 2: PROJECTS HUB */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <div>
                    <h3 className="text-xl font-bold text-white">Client Projects Management</h3>
                    <p className="text-xs text-slate-400">Create, adjust sprint stages, and attach staging links.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(true)}
                    className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110"
                  >
                    + Create New Project
                  </button>
                </div>

                {/* Project List */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-md bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300 border border-sky-400/30">
                            {proj.status}
                          </span>
                          <span className="font-mono text-sm font-bold text-white">
                            ${proj.budget_usd?.toLocaleString("en-US")} USD
                          </span>
                        </div>

                        <h4 className="mt-3 text-lg font-bold text-white">{proj.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Client: <strong className="text-slate-200">{proj.client_name}</strong> ({proj.client_email})
                        </p>
                        {proj.company_name && (
                          <p className="text-xs text-slate-500">Company: {proj.company_name}</p>
                        )}

                        {/* Stage Controls */}
                        <div className="mt-4 border-t border-white/8 pt-4">
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Update Stage & Percentage ({proj.progress_percent}%)
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {(["Discovery", "Design", "Development", "Review", "Launch", "Completed"] as const).map(
                              (stg, idx) => (
                                <button
                                  key={stg}
                                  type="button"
                                  onClick={() => handleUpdateProjectStage(proj.id, stg, Math.min(100, (idx + 1) * 18))}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                                    proj.status === stg
                                      ? "bg-sky-400 text-slate-950 font-bold"
                                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                                  }`}
                                >
                                  {stg}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4 text-xs">
                        <span className="text-slate-500">
                          Target: {proj.target_launch_date || "Flexible Launch"}
                        </span>
                        <Link
                          href="/client"
                          className="text-sky-400 font-semibold hover:underline"
                        >
                          View as Client →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CONTRACTS & SIGNATURES */}
            {activeTab === "contracts" && (
              <AdminContractsTab contracts={contracts} />
            )}

            {/* TAB 4: ASSETS VAULT */}
            {activeTab === "assets" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white">Client Uploads & Media Vault ({assets.length})</h3>
                  <p className="text-xs text-slate-400">
                    Browse all brand files, PDFs, vector logos, and copy submitted by clients.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl shadow-lg flex flex-col justify-between"
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
                        <a
                          href={asset.public_url}
                          target="_blank"
                          rel="noreferrer"
                          download={asset.file_name}
                          className="rounded-lg bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 hover:bg-sky-500/20"
                        >
                          Download ↓
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: WEBSITE PACKAGES */}
            {activeTab === "packages" && (
              <AdminPackagesTab packages={packages} setPackages={setPackages} />
            )}
          </div>
        )}

        {/* MODAL: CREATE NEW PROJECT */}
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-3xl border border-sky-400/30 bg-slate-950 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white">Create New Client Project</h3>
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="rounded-lg bg-slate-900 p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProjectSubmit} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Client Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newProjectData.client_name}
                      onChange={(e) => setNewProjectData({ ...newProjectData, client_name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Client Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newProjectData.client_email}
                      onChange={(e) => setNewProjectData({ ...newProjectData, client_email: e.target.value })}
                      placeholder="sarah@agency.com"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={newProjectData.company_name}
                      onChange={(e) => setNewProjectData({ ...newProjectData, company_name: e.target.value })}
                      placeholder="e.g. Apex Labs"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Website Package
                    </label>
                    <select
                      value={newProjectData.package_id}
                      onChange={(e) => {
                        const selected = packages.find((p) => p.id === e.target.value);
                        setNewProjectData({
                          ...newProjectData,
                          package_id: e.target.value,
                          budget_usd: selected?.price_usd || 3499,
                        });
                      }}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    >
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} (${pkg.price_usd})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium uppercase tracking-wider text-slate-300">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectData.title}
                    onChange={(e) => setNewProjectData({ ...newProjectData, title: e.target.value })}
                    placeholder="e.g. Apex Labs Interactive WebGL Showcase"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Budget (USD)
                    </label>
                    <input
                      type="number"
                      value={newProjectData.budget_usd}
                      onChange={(e) =>
                        setNewProjectData({ ...newProjectData, budget_usd: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Target Launch Date
                    </label>
                    <input
                      type="date"
                      value={newProjectData.target_launch_date}
                      onChange={(e) =>
                        setNewProjectData({ ...newProjectData, target_launch_date: e.target.value })
                      }
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-2 font-bold text-slate-950 hover:brightness-110"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
