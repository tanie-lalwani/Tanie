"use client";

import React from "react";
import Link from "next/link";
import { ClientHubProject } from "./types";

interface ClientHubHeroProps {
  project: ClientHubProject;
  onScrollToSection: (sectionId: string) => void;
  onSignOut: () => void;
}

export default function ClientHubHero({
  project,
  onScrollToSection,
  onSignOut,
}: ClientHubHeroProps) {
  const isBooked =
    project.booking_status === "booked_advance_paid" ||
    project.booking_status === "handed_over";

  const isHandedOver = project.booking_status === "handed_over";

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-sky-300/80 bg-gradient-to-br from-white/95 via-sky-50/90 to-blue-50/80 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
      {/* Decorative gradient blur backdrop */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-100/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-sky-950 shadow-2xs">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isHandedOver
                  ? "bg-purple-600 animate-pulse"
                  : isBooked
                  ? "bg-emerald-500 animate-pulse"
                  : project.booking_status === "contract_ready"
                  ? "bg-amber-500 animate-bounce"
                  : "bg-sky-500 animate-ping"
              }`}
            />
            <span>
              {isHandedOver
                ? "Project Handed Over · Production Complete"
                : isBooked
                ? `Sprint In Progress · ${project.status} (${project.progress_percent}%)`
                : project.booking_status === "contract_ready"
                ? "Contract Ready For Signature & Advance"
                : project.booking_status === "requested"
                ? "Proposal Requested · Awaiting Admin Contract"
                : "Workspace Active · Reserve Your Sprint"}
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-3.5 text-3xl sm:text-5xl font-black tracking-tight text-[#0a192f]">
            {isHandedOver
              ? `Production Vault: ${project.title}`
              : isBooked
              ? `Active Sprint: ${project.title}`
              : `Welcome to Your Hub, ${project.client_name}`}
          </h1>

          {/* Subheading */}
          <p className="mt-2.5 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {isHandedOver
              ? "Your website code, production assets, and credentials have been officially handed over. You can review invoices or request revisions & add-on sprints below."
              : isBooked
              ? `Advance deposit received. Tanie is actively executing your project milestones. Live launch target: ${project.target_launch_date || "3-4 Weeks"}.`
              : "Review your calculated pricing, inspect your bespoke contract, and submit your advance deposit to lock your engineering sprint on our calendar."}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!isBooked ? (
              <>
                <button
                  type="button"
                  onClick={() => onScrollToSection("booking-contract-tile")}
                  className="rounded-2xl bg-[#0a192f] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-slate-800 transition cursor-pointer hover:scale-105 active:scale-95"
                >
                  {project.booking_status === "contract_ready"
                    ? "Review Contract & Pay Advance →"
                    : "Book Now / Request Contract →"}
                </button>
                <button
                  type="button"
                  onClick={() => onScrollToSection("calculated-prices-tile")}
                  className="rounded-2xl border border-sky-300/80 bg-white/80 px-5 py-3 text-xs font-black uppercase tracking-wider text-sky-950 hover:bg-white shadow-xs transition cursor-pointer"
                >
                  View Calculated Prices 📊
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onScrollToSection("deliverables-progress-tile")}
                  className="rounded-2xl bg-[#0a192f] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-slate-800 transition cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>View Your Booking Status</span>
                  <span>🔍</span>
                </button>
                <button
                  type="button"
                  onClick={() => onScrollToSection("payments-invoices-tile")}
                  className="rounded-2xl border border-sky-300/80 bg-white/80 px-5 py-3 text-xs font-black uppercase tracking-wider text-sky-950 hover:bg-white shadow-xs transition cursor-pointer"
                >
                  Invoices & Settlement 🧾
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => onScrollToSection("asset-manager-tile")}
              className="rounded-2xl border border-sky-200/80 bg-sky-100/60 px-5 py-3 text-xs font-bold text-sky-950 hover:bg-sky-200/80 transition cursor-pointer"
            >
              Asset Vault ({project.assets.filter((a) => !a.is_deleted).length}) 📁
            </button>
          </div>
        </div>

        {/* Right Side Stats Card */}
        <div className="rounded-3xl border border-sky-200/90 bg-white/90 p-5 sm:p-6 shadow-md backdrop-blur-md min-w-[260px]">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Client Account
          </span>
          <div className="mt-1 font-bold text-slate-900 text-sm truncate">
            {project.client_email}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Booking State:</span>
              <span className="font-extrabold capitalize text-slate-900">
                {project.booking_status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Advance Paid:</span>
              <span className={`font-extrabold ${project.advance_paid ? "text-emerald-700" : "text-amber-700"}`}>
                {project.advance_paid ? "✓ Settled" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Final Handover:</span>
              <span className={`font-extrabold ${project.completion_paid ? "text-emerald-700" : "text-slate-500"}`}>
                {project.completion_paid ? "✓ Released" : "Awaiting Final"}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/pricing"
              className="text-[11px] font-bold text-sky-700 hover:text-sky-950 hover:underline"
            >
              Open Calculator
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
