"use client";

import React from "react";
import Link from "next/link";
import { CalculatedQuote } from "./types";

interface CalculatedPricesTileProps {
  quote: CalculatedQuote | null;
  onProceedToBooking: () => void;
}

export default function CalculatedPricesTile({
  quote,
  onProceedToBooking,
}: CalculatedPricesTileProps) {
  if (!quote) {
    return (
      <div
        id="calculated-prices-tile"
        className="rounded-[2.2rem] border border-sky-300/80 bg-[#c8ecff]/30 p-6 sm:p-8 backdrop-blur-xl shadow-md"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 bg-sky-100/90 px-3 py-1 rounded-full border border-sky-200">
              Pricing Calculator Snapshot
            </span>
            <h2 className="mt-2 text-2xl font-black text-[#0a192f]">
              View Your Calculated Prices
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
              You haven&apos;t run a custom quote estimation yet. Configure your project scope, features, and timeline on our interactive pricing engine.
            </p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 rounded-2xl bg-[#0a192f] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition text-center"
          >
            Open Cost Calculator →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      id="calculated-prices-tile"
      className="rounded-[2.2rem] border border-sky-300/80 bg-[#c8ecff]/35 p-6 sm:p-8 backdrop-blur-xl shadow-md transition hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full shadow-2xs">
              Pricing Calculator Snapshot
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Saved {new Date(quote.saved_at).toLocaleDateString()}
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#0a192f]">
            Your Calculated Scope & Pricing
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Official scope calculation captured from your pricing funnel session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="rounded-xl border border-sky-300/80 bg-white/80 px-4 py-2 text-xs font-bold text-sky-950 hover:bg-white shadow-xs transition"
          >
            Recalculate 🔄
          </Link>
          <button
            type="button"
            onClick={onProceedToBooking}
            className="rounded-xl bg-[#0a192f] px-5 py-2 text-xs font-black text-white hover:bg-slate-800 shadow-sm transition cursor-pointer"
          >
            Lock This Scope →
          </button>
        </div>
      </div>

      {/* Main Quote Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Price Card */}
        <div className="rounded-2xl border border-sky-300/80 bg-gradient-to-br from-white via-sky-50/70 to-blue-50/60 p-5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-sky-800">
            Calculated Price Estimate
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#0a192f]">
              {quote.symbol}
              {quote.calculated_price.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-500">{quote.currency}</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-snug">
            Estimate based on selected micro-features and architecture tier.
          </p>
        </div>

        {/* Scope Tier */}
        <div className="rounded-2xl border border-sky-200/90 bg-white/85 p-5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Scope Package Foundation
          </span>
          <div className="mt-1 text-base font-extrabold text-slate-900 truncate">
            {quote.scope_tier}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-sky-800 font-semibold">
            <span>⚡ Turnaround:</span>
            <span>{quote.timeline}</span>
          </div>
        </div>

        {/* Aesthetic */}
        <div className="rounded-2xl border border-sky-200/90 bg-white/85 p-5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Aesthetic Vibe Direction
          </span>
          <div className="mt-1 text-base font-extrabold text-slate-900 truncate">
            {quote.selected_aesthetic || "Bespoke Editorial / Modern SaaS"}
          </div>
          <div className="mt-2 text-xs text-slate-600 font-medium">
            Custom typographic hierarchy & shaders
          </div>
        </div>

        {/* Contact handle */}
        <div className="rounded-2xl border border-sky-200/90 bg-white/85 p-5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Associated Business Handle
          </span>
          <div className="mt-1 text-base font-extrabold text-slate-900 truncate font-mono">
            {quote.social_handle || "Direct Inbound Lead"}
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-bold">
            ✓ Priority Routing Connected
          </div>
        </div>
      </div>

      {/* Selected Features List */}
      <div className="rounded-2xl border border-sky-200/80 bg-white/70 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
            Included Feature Modules ({quote.features.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Tailored during pricing customization
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {quote.features.map((feat) => (
            <div
              key={feat}
              className="flex items-center gap-2 rounded-xl bg-sky-50/80 border border-sky-200/70 px-3 py-2 text-xs font-semibold text-sky-950"
            >
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
