"use client";

import React from "react";
import Link from "next/link";
import { ClientHubProject } from "./types";

interface ClientHubHeroProps {
  project: ClientHubProject;
  onScrollToSection: (sectionId: string) => void;
  onSignOut: () => void;
}

const STAGES = [
  { key: "not_booked",          label: "Reserve" },
  { key: "requested",           label: "Requested" },
  { key: "booked_advance_paid", label: "Booked" },
  { key: "handed_over",         label: "Handed Over" },
] as const;

function getStageIndex(status: string): number {
  if (status === "handed_over")                              return 3;
  if (status === "booked_advance_paid")                     return 2;
  if (status === "contract_ready" || status === "requested") return 1;
  return 0;
}

export default function ClientHubHero({
  project,
  onScrollToSection,
  onSignOut,
}: ClientHubHeroProps) {
  const isBooked =
    project.booking_status === "booked_advance_paid" ||
    project.booking_status === "handed_over";
  const stageIdx = getStageIndex(project.booking_status);

  return (
    <div className="rounded-[2rem] border border-sky-200/80 bg-white/80 backdrop-blur-xl shadow-sm px-5 py-4 space-y-4">

      {/* Row 1: Account one-liner */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#0a192f] text-white flex items-center justify-center text-xs font-black shrink-0">
            {(project.client_name || project.client_email || "C")[0].toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">
            {project.client_email}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-semibold">
          <Link href="/pricing" className="text-sky-600 !no-underline hover:!underline">
            Open Calculator
          </Link>
          <button type="button" onClick={onSignOut} className="text-rose-500 hover:text-rose-700 cursor-pointer transition">
            Sign Out
          </button>
        </div>
      </div>

      {/* Row 2: Progress bar */}
      <div className="flex items-center gap-0">
        {STAGES.map((stage, i) => {
          const done    = i < stageIdx;
          const current = i === stageIdx;
          const isLast  = i === STAGES.length - 1;
          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${done || current ? "bg-[#0a192f] border-[#0a192f]" : "bg-white border-slate-300"} ${current ? "ring-2 ring-sky-400/40 scale-125" : ""}`} />
                <span className={`text-[9px] font-bold whitespace-nowrap ${current ? "text-[#0a192f]" : done ? "text-slate-500" : "text-slate-300"}`}>
                  {stage.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mb-3.5 mx-1 rounded-full transition-all ${i < stageIdx ? "bg-[#0a192f]" : "bg-slate-200"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Row 3: CTAs */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-sky-100">
        {!isBooked ? (
          <>
            <button type="button" onClick={() => onScrollToSection("booking-contract-tile")} className="rounded-xl bg-[#0a192f] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition cursor-pointer">
              {project.booking_status === "contract_ready" ? "Review Contract & Pay →" : "Book Now / Request Contract →"}
            </button>
            <button type="button" onClick={() => onScrollToSection("calculated-prices-tile")} className="rounded-xl border border-sky-300/80 bg-white/80 px-4 py-2.5 text-xs font-bold text-sky-950 hover:bg-white shadow-xs transition cursor-pointer">
              View Calculated Prices 📊
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onScrollToSection("deliverables-progress-tile")} className="rounded-xl bg-[#0a192f] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition cursor-pointer">
              View Booking Status 🔍
            </button>
            <button type="button" onClick={() => onScrollToSection("payments-invoices-tile")} className="rounded-xl border border-sky-300/80 bg-white/80 px-4 py-2.5 text-xs font-bold text-sky-950 hover:bg-white shadow-xs transition cursor-pointer">
              Invoices & Settlement 🧾
            </button>
          </>
        )}
        <button type="button" onClick={() => onScrollToSection("asset-manager-tile")} className="rounded-xl border border-sky-200/80 bg-sky-50/60 px-4 py-2.5 text-xs font-bold text-sky-950 hover:bg-sky-100/80 transition cursor-pointer">
          Asset Vault ({project.assets.filter((a) => !a.is_deleted).length}) 📁
        </button>
      </div>
    </div>
  );
}
