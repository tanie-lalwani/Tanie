"use client";

import React from "react";
import type { CalculationResult } from "@/data/featureCatalogDatabase";

interface ScopeQuoteSidebarProps {
  projectName: string;
  setProjectName: (val: string) => void;
  activeCurrency: "INR" | "USD";
  quoteSummary: CalculationResult;
  isSaving: boolean;
  onProceed: () => void;
  onSaveQuote: () => void;
  onShareWhatsApp: () => void;
}

export default function ScopeQuoteSidebar({
  projectName,
  setProjectName,
  activeCurrency,
  quoteSummary,
  isSaving,
  onProceed,
  onSaveQuote,
  onShareWhatsApp,
}: ScopeQuoteSidebarProps) {
  return (
    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-2xl shadow-2xl space-y-6 ring-1 ring-white/5">
        {/* PROJECT NAME INPUT */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="e.g. Luxury Salon Brand Portal"
          />
        </div>

        {/* LIVE BREAKDOWN CARD */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Cost Breakdown
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>🏛️</span>
              <span>Base Website Architecture</span>
            </span>
            <span className="font-mono font-medium text-white">
              {activeCurrency === "INR"
                ? `₹${quoteSummary.basePriceInr.toLocaleString()}`
                : `$${quoteSummary.basePriceUsd.toLocaleString()}`}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span>🧩</span>
              <span>{quoteSummary.totalSelectedItemsCount} Selected Modules</span>
            </span>
            <span className="font-mono font-medium text-white">
              {activeCurrency === "INR"
                ? `+₹${quoteSummary.itemizedTotalInr.toLocaleString()}`
                : `+$${quoteSummary.itemizedTotalUsd.toLocaleString()}`}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
            <span>Standard Value Subtotal</span>
            <span className="font-mono">
              {activeCurrency === "INR"
                ? `₹${quoteSummary.subtotalInr.toLocaleString()}`
                : `$${quoteSummary.subtotalUsd.toLocaleString()}`}
            </span>
          </div>

          {/* PACKAGE BUNDLE DISCOUNT CALLOUT */}
          {quoteSummary.discountPercent > 0 && (
            <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-between text-xs animate-pulse">
              <div className="flex items-center gap-1.5 text-sky-400 font-medium">
                <span>🎉</span>
                <span>{quoteSummary.discountPercent}% Package Discount</span>
              </div>
              <div className="font-mono font-bold text-sky-300">
                {activeCurrency === "INR"
                  ? `-₹${quoteSummary.discountAmountInr.toLocaleString()}`
                  : `-$${quoteSummary.discountAmountUsd.toLocaleString()}`}
              </div>
            </div>
          )}
        </div>

        {/* FINAL TOTAL HERO */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-cyan-500/30 text-center">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
            Total Estimated Investment
          </div>
          <div className="text-3xl sm:text-4xl font-light tracking-tight text-white font-mono">
            {activeCurrency === "INR" ? (
              <>
                <span className="text-cyan-400 font-normal">₹</span>
                {quoteSummary.finalTotalInr.toLocaleString()}
              </>
            ) : (
              <>
                <span className="text-cyan-400 font-normal">$</span>
                {quoteSummary.finalTotalUsd.toLocaleString()}
              </>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Estimated Turnaround: <span className="text-slate-200 font-medium">2–4 Weeks</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-2.5">
          {/* Primary Action: Proceed with Scope */}
          <button
            type="button"
            onClick={onProceed}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Proceed with this Scope →
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSaveQuote}
              disabled={isSaving}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>💾</span>
              <span>{isSaving ? "Saving..." : "Save Draft"}</span>
            </button>

            <button
              type="button"
              onClick={onShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-700/50 text-xs font-mono text-sky-300 transition-all flex items-center justify-center gap-1.5"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* GUARANTEE FOOTNOTE */}
        <div className="text-[11px] text-slate-500 text-center leading-relaxed font-sans">
          🔒 Fixed milestone billing • 100% transparent itemized scope • No hidden charges.
        </div>
      </div>
    </div>
  );
}
