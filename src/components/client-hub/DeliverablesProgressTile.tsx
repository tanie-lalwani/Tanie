"use client";

import React from "react";
import { ClientHubProject } from "./types";

interface DeliverablesProgressTileProps {
  project: ClientHubProject;
  onScrollToSection: (sectionId: string) => void;
}

export default function DeliverablesProgressTile({
  project,
  onScrollToSection,
}: DeliverablesProgressTileProps) {
  const isAdvancePaid = project.advance_paid;

  if (!isAdvancePaid) {
    return (
      <div
        id="deliverables-progress-tile"
        className="rounded-[2.4rem] border border-slate-200 bg-slate-50/70 p-6 sm:p-10 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center text-xl font-bold">
              🔒
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Sprint Telemetry & Deliverables
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                Deliverables & Progress Unlocks Upon Advance Payment
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Once your contract is signed and the 50% advance deposit is settled, your project milestones, real-time completion tracker, and deliverables vault will activate here.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onScrollToSection("booking-contract-tile")}
            className="shrink-0 rounded-2xl bg-[#0a192f] px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition cursor-pointer shadow-md"
          >
            Go to Contract & Advance →
          </button>
        </div>
      </div>
    );
  }

  // Active Milestones
  const milestones = [
    { id: 1, title: "Discovery & Requirements Architecture", status: "completed", desc: "Scope locked, brand assets verified & design tokens established" },
    { id: 2, title: "Figma UI/UX & Responsive Layouts", status: project.progress_percent >= 40 ? "completed" : "in-progress", desc: "Design system, mobile/desktop mockups & interactive prototype" },
    { id: 3, title: "Next.js & Frontend Engineering", status: project.progress_percent >= 70 ? "completed" : project.progress_percent >= 40 ? "in-progress" : "pending", desc: "Components, micro-interactions, API integrations & PageSpeed tuning" },
    { id: 4, title: "Staging Review & Client Walkthrough", status: project.progress_percent >= 90 ? "completed" : project.progress_percent >= 70 ? "in-progress" : "pending", desc: "Live staging deployment inspection, revision round & approval" },
    { id: 5, title: "Production Release & Final Handover", status: project.completion_paid ? "completed" : "pending", desc: "Final completion settlement, repository transfer & domain launch" },
  ];

  return (
    <div
      id="deliverables-progress-tile"
      className="rounded-[2.4rem] border border-sky-300/80 bg-white/95 p-6 sm:p-10 shadow-lg backdrop-blur-xl space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
              ✓ Active Sprint Telemetry
            </span>
            <span className="text-xs font-mono text-slate-500">
              Target: {project.target_launch_date || "3-4 Weeks"}
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#0a192f]">
            Package Deliverables & Live Progress Tracking
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 max-w-2xl">
            Real-time status of your commissioned website sprint. Inspect milestones, deliverables, and preview links.
          </p>
        </div>

        {/* Progress % Pill */}
        <div className="rounded-2xl border border-sky-300/80 bg-gradient-to-br from-sky-50 to-blue-50 p-4 text-center min-w-[160px]">
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-800">
            Sprint Completion
          </span>
          <div className="text-3xl font-black text-[#0a192f] mt-0.5">
            {project.progress_percent}%
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">
            Stage: {project.status}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span>Overall Project Progress</span>
          <span className="font-mono text-sky-900">{project.progress_percent}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 p-0.5 border border-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 transition-all duration-500 shadow-sm"
            style={{ width: `${project.progress_percent}%` }}
          />
        </div>
      </div>

      {/* Live Deliverable Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href={project.live_preview_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-sky-200/90 bg-sky-50/70 hover:bg-sky-100/80 p-4 transition shadow-2xs flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-black uppercase text-sky-900 block">
              Live Staging Link
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {project.live_preview_url ? "staging.tanie.me" : "Deploying..."}
            </span>
          </div>
          <span className="text-lg">🌐</span>
        </a>

        <a
          href={project.figma_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-sky-200/90 bg-sky-50/70 hover:bg-sky-100/80 p-4 transition shadow-2xs flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-black uppercase text-sky-900 block">
              Figma Design Canvas
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              View Design System
            </span>
          </div>
          <span className="text-lg">🎨</span>
        </a>

        <a
          href={project.github_repo || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-sky-200/90 bg-sky-50/70 hover:bg-sky-100/80 p-4 transition shadow-2xs flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-black uppercase text-sky-900 block">
              GitHub Repository
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {project.completion_paid ? "Access Granted ✓" : "Protected (Unlocks at Handover)"}
            </span>
          </div>
          <span className="text-lg">💻</span>
        </a>
      </div>

      {/* Milestone Timeline Checklist */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
          Sprint Milestone Pipeline
        </h3>
        <div className="space-y-3">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                m.status === "completed"
                  ? "border-emerald-300 bg-emerald-50/80 text-emerald-950"
                  : m.status === "in-progress"
                  ? "border-sky-400 bg-white ring-2 ring-sky-200 shadow-xs"
                  : "border-slate-200 bg-white/60 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                    m.status === "completed"
                      ? "bg-emerald-600 text-white"
                      : m.status === "in-progress"
                      ? "bg-sky-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {m.status === "completed" ? "✓" : m.id}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {m.desc}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full self-start sm:self-auto ${
                  m.status === "completed"
                    ? "bg-emerald-200 text-emerald-900"
                    : m.status === "in-progress"
                    ? "bg-sky-100 text-sky-900 font-black animate-pulse"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {m.status === "completed" ? "Completed" : m.status === "in-progress" ? "Active Now" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Whole Package & Deliverables Breakdown with Price */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Scope & Deliverables Breakdown with Transparent Itemized Value
          </h3>
          <span className="text-xs font-mono font-bold text-slate-700">
            Total Package: {project.symbol}{(project.admin_agreed_price || 2800).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {project.deliverables_breakdown.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-sky-200/90 bg-white p-4 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-[#0a192f]">
                    {item.title}
                  </span>
                  {item.price && (
                    <span className="text-xs font-mono font-bold text-sky-800 shrink-0">
                      {project.symbol}{item.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                <span>✓ Included in agreed contract scope</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
