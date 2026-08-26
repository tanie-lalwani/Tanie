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
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function AdminPortal() {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"metrics" | "projects" | "leads" | "contracts" | "assets" | "packages">("metrics");
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [contracts, setContracts] = useState<EContract[]>([]);
  const [assets, setAssets] = useState<ProjectAsset[]>([]);
  const [packages, setPackages] = useState<WebsitePackage[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Load all data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [pkgs, projs, ctrs, asts, lds] = await Promise.all([
          getWebsitePackages(),
          getAllProjects(),
          getAllContracts(),
          getAllAssets(),
          getAllLeads(),
        ]);
        if (!isMounted) return;
        setPackages(pkgs);
        setProjects(projs);
        setContracts(ctrs);
        setAssets(asts);
        setLeads(lds);
      } catch (err) {
        console.error("Admin data loading error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Admin Passcode Authenticator (Master Access)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    // Secure master passcode or developer override
    if (adminPasscode.trim().toLowerCase() === "tanie2026" || adminPasscode.trim().toLowerCase() === "admin") {
      setIsAdminUnlocked(true);
    } else {
      setAuthError("Incorrect admin master passcode. Use 'tanie2026' to unlock.");
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
              href="/packages"
              className="rounded-full border border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-white"
            >
              View Packages
            </Link>
            {isAdminUnlocked && (
              <button
                type="button"
                onClick={() => setIsAdminUnlocked(false)}
                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20"
              >
                Lock Admin
              </button>
            )}
          </div>
        </div>

        {/* ADMIN PASSCODE UNLOCK (If Locked) */}
        {!isAdminUnlocked ? (
          <div className="mx-auto max-w-md rounded-3xl border border-sky-400/20 bg-slate-950/90 p-8 backdrop-blur-2xl shadow-2xl">
            <div className="text-center">
              <span className="text-3xl">🔐</span>
              <h2 className="mt-2 text-xl font-bold text-white">Unlock Admin Workspace</h2>
              <p className="mt-1 text-xs text-slate-400">
                Enter your administrative key or passcode to manage studio deliverables.
              </p>
            </div>

            {authError && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. tanie2026)"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition hover:brightness-110"
              >
                Unlock Dashboard
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setAdminPasscode("tanie2026");
                  setIsAdminUnlocked(true);
                }}
                className="text-xs text-sky-400 underline underline-offset-4 hover:text-sky-300"
              >
                Quick Demo Unlock (Passcode: tanie2026) →
              </button>
            </div>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <div>
                    <h3 className="text-xl font-bold text-white">Captured Leads & Rate Card Inquiries ({leads.length})</h3>
                    <p className="text-xs text-slate-400">
                      Prospective clients who signed up to unlock pricing or submitted booking intakes.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                    Auto-synced with Supabase & Formspree
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl shadow-lg flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white">{lead.client_name}</h4>
                            <span className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 border border-sky-400/20">
                              {lead.source || "Pricing Unlock"}
                            </span>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                lead.status === "converted"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : lead.status === "contacted"
                                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {lead.status}
                            </span>
                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                            <span>
                              ✉️ <strong>{lead.client_email}</strong>
                            </span>
                            {lead.company_name && <span>🏢 {lead.company_name}</span>}
                            {lead.phone && <span>📞 {lead.phone}</span>}
                            {lead.package_interest && (
                              <span className="text-sky-300 font-medium">💎 {lead.package_interest}</span>
                            )}
                            <span className="text-slate-500">
                              🕒 {new Date(lead.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(lead.client_email);
                              alert(`Copied ${lead.client_email} to clipboard!`);
                            }}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-white/10"
                          >
                            Copy Email
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              const nextStatus: LeadItem["status"] =
                                lead.status === "pending" ? "contacted" : lead.status === "contacted" ? "converted" : "pending";
                              await updateLeadStatus(lead.id, nextStatus);
                              setLeads((prev) =>
                                prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l))
                              );
                            }}
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
                          >
                            Toggle: {lead.status} →
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNewProjectData({
                                client_name: lead.client_name,
                                client_email: lead.client_email,
                                company_name: lead.company_name || "",
                                title: `${lead.company_name || lead.client_name} Interactive Web Project`,
                                description: `Project initialized from lead inquiry for ${lead.package_interest || "Website Package"}.`,
                                package_id: "interactive-3d-experience",
                                budget_usd: 3499,
                                target_launch_date: "",
                                live_preview_url: "",
                                figma_url: "",
                              });
                              setShowNewProjectModal(true);
                            }}
                            className="rounded-lg bg-gradient-to-r from-sky-400 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:brightness-110"
                          >
                            Convert to Project +
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs text-slate-400 rounded-2xl border border-white/8 bg-slate-900/40">
                      No leads collected yet. When visitors sign up to unlock rates, they will appear here in real-time.
                    </div>
                  )}
                </div>
              </div>
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
              <div className="space-y-6">
                <div className="rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <h3 className="text-xl font-bold text-white">E-Contracts & Digital Signatures</h3>
                  <p className="text-xs text-slate-400">
                    Verify legal execution timestamps, IP addresses, and inspect handwritten signatures.
                  </p>
                </div>

                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl shadow-xl flex flex-wrap items-start justify-between gap-6"
                    >
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                              contract.status === "signed"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            {contract.status === "signed" ? "Signed ✓" : "Pending Signature"}
                          </span>
                          <span className="font-mono text-xs text-slate-500">ID: {contract.id}</span>
                        </div>

                        <h4 className="mt-2 text-lg font-bold text-white">
                          {contract.package_name} — {contract.client_name}
                        </h4>
                        <p className="text-xs text-slate-400">{contract.client_email}</p>

                        <p className="mt-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/6 leading-relaxed">
                          {contract.scope_summary}
                        </p>

                        <div className="mt-3 font-mono text-xs text-sky-300 font-bold">
                          Amount: ${contract.total_amount_usd.toLocaleString("en-US")} USD
                        </div>
                      </div>

                      {/* Signature Inspection Box */}
                      <div className="min-w-[240px] rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-right">
                        {contract.status === "signed" ? (
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">
                              Verified Signature
                            </span>
                            {contract.signature_url && (
                              <div className="my-2 rounded-xl bg-slate-950 p-2 border border-white/10 flex justify-center">
                                <img
                                  src={contract.signature_url}
                                  alt="Client Signature"
                                  className="h-14 max-w-[180px] object-contain"
                                />
                              </div>
                            )}
                            <div className="text-xs font-bold text-white">{contract.signature_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Signed: {new Date(contract.signed_at || "").toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">{contract.signed_ip}</div>
                          </div>
                        ) : (
                          <div className="py-6 text-center text-xs text-slate-400">
                            Awaiting client digital signature
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
                  <div>
                    <h3 className="text-xl font-bold text-white">Website Packages & Pricing Tiers</h3>
                    <p className="text-xs text-slate-400">
                      Configure your public offerings, timelines, deliverables, and add-on pricing.
                    </p>
                  </div>
                  <Link
                    href="/packages"
                    target="_blank"
                    className="rounded-full border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/30"
                  >
                    View Public Packages Page ↗
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                          {pkg.badge && (
                            <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-400/30">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{pkg.tagline}</p>

                        <div className="my-4 font-mono">
                          <span className="text-2xl font-black text-white">
                            ${pkg.price_usd.toLocaleString("en-US")}
                          </span>{" "}
                          <span className="text-xs text-slate-400">USD / ₹{pkg.price_inr.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="text-xs text-sky-300 mb-3 font-semibold">
                          Turnaround: {pkg.turnaround_weeks}
                        </div>

                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {pkg.features?.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-sky-400">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 border-t border-white/8 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            const newPrice = prompt("Enter new price in USD:", pkg.price_usd.toString());
                            if (newPrice && !isNaN(Number(newPrice))) {
                              const updated = { ...pkg, price_usd: Number(newPrice) };
                              saveWebsitePackage(updated);
                              setPackages((prev) => prev.map((p) => (p.id === pkg.id ? updated : p)));
                            }
                          }}
                          className="w-full rounded-xl bg-slate-900 py-2 text-center text-xs font-semibold text-slate-300 border border-white/10 hover:bg-slate-800 hover:text-white"
                        >
                          Quick Edit Price
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
