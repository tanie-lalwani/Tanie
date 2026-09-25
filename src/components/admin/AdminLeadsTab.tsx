"use client";

import React from "react";
import { type LeadItem, updateLeadStatus } from "@/lib/portalServices";

interface AdminLeadsTabProps {
  leads: LeadItem[];
  setLeads: React.Dispatch<React.SetStateAction<LeadItem[]>>;
  isRefreshing: boolean;
  onRefresh: () => void;
  onConvertToProject: (lead: LeadItem) => void;
}

export default function AdminLeadsTab({
  leads,
  setLeads,
  isRefreshing,
  onRefresh,
  onConvertToProject,
}: AdminLeadsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sky-400/20 bg-slate-950/70 p-6 backdrop-blur-xl">
        <div>
          <h3 className="text-xl font-bold text-white">Captured Leads & Booking Inquiries ({leads.length})</h3>
          <p className="text-xs text-slate-400">
            Real-time updates for website bookings and pricing rate card unlock inquiries.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-full bg-sky-500/10 hover:bg-sky-500/20 px-4 py-1.5 text-xs font-bold text-sky-300 border border-sky-400/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span className={isRefreshing ? "animate-spin" : ""}>🔄</span>
            <span>{isRefreshing ? "Refreshing..." : "Refresh Updates"}</span>
          </button>
          <span className="rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-300 border border-amber-500/30">
            Auto-synced with Supabase
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl shadow-lg space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold text-white">{lead.client_name}</h4>
                  <span className="rounded-md bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 border border-sky-400/20">
                    {lead.source || "Booking Inquiry"}
                  </span>
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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

                {/* ESTIMATED PRICE BADGE */}
                {(lead.estimated_budget_usd || lead.estimated_budget_inr) && (
                  <div className="rounded-xl bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span>💰 Estimated Investment:</span>
                    <span>
                      {lead.estimated_budget_inr ? `₹${lead.estimated_budget_inr.toLocaleString()}` : ""}
                      {lead.estimated_budget_usd && lead.estimated_budget_inr ? " • " : ""}
                      {lead.estimated_budget_usd ? `$${lead.estimated_budget_usd.toLocaleString()} USD` : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* AESTHETIC & SCOPE */}
              {(lead.selected_aesthetic || lead.scope_tier || lead.package_interest) && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Direction & Scope:</span>
                  <span className="rounded-md bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-bold text-purple-200 border border-purple-500/30">
                    🎨 {lead.selected_aesthetic || lead.package_interest || "Custom"} {lead.scope_tier ? `• ${lead.scope_tier}` : ""}
                  </span>
                  {lead.timeline_requirement && (
                    <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] text-slate-300 border border-white/10">
                      ⏱️ {lead.timeline_requirement}
                    </span>
                  )}
                </div>
              )}

              {/* SELECTED ADDONS */}
              {lead.selected_addons && lead.selected_addons.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Selected Modules:</span>
                  {lead.selected_addons.map((addon, aIdx) => (
                    <span key={aIdx} className="rounded-md bg-slate-900 border border-sky-400/30 px-2 py-0.5 text-[10px] text-sky-200 font-medium">
                      ✓ {addon}
                    </span>
                  ))}
                </div>
              )}

              {/* CLIENT MESSAGE / NOTES */}
              {lead.client_message && (
                <div className="rounded-xl bg-slate-900/90 border border-white/10 p-3 text-xs text-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-0.5">Client Note / Message:</div>
                  <p className="whitespace-pre-line leading-relaxed italic text-slate-300">
                    "{lead.client_message}"
                  </p>
                </div>
              )}

              {/* CONTACT DETAILS & ACTIONS ROW */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
                  <span>
                    ✉️ <strong>{lead.client_email}</strong>
                  </span>
                  {lead.phone && (
                    <span className="text-sky-300 font-bold">
                      📞 {lead.phone}
                    </span>
                  )}
                  {lead.company_name && <span>🏢 {lead.company_name}</span>}
                  <span className="text-slate-500">
                    🕒 {new Date(lead.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {lead.phone && (
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 px-3 py-1.5 text-xs font-bold text-emerald-200 border border-emerald-500/40 flex items-center gap-1.5 !no-underline transition"
                      title="Open WhatsApp Chat"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </a>
                  )}

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
                    Status: {lead.status} →
                  </button>

                  <button
                    type="button"
                    onClick={() => onConvertToProject(lead)}
                    className="rounded-lg bg-gradient-to-r from-sky-400 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:brightness-110"
                  >
                    Convert to Project +
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 rounded-2xl border border-white/8 bg-slate-900/40">
            No leads collected yet. When visitors sign up to unlock rates or book, they will appear here in real-time.
          </div>
        )}
      </div>
    </div>
  );
}
