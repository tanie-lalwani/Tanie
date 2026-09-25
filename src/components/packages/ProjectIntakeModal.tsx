"use client";

import React from "react";
import { type AestheticStyle } from "@/data/aestheticDatabase";

interface ProjectIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  intakeSuccess: boolean;
  selectedAesthetic: AestheticStyle | null;
  selectedScopeTier: string;
  estimatedPriceAmount: number | null;
  estimatedPriceSymbol: string;
  estimatedPriceCurrency: string;
  countryName: string;
  featuresList: string[];
  likedAesthetics: string[];
  clientName: string;
  setClientName: (v: string) => void;
  clientEmail: string;
  setClientEmail: (v: string) => void;
  contactPhone: string;
  setContactPhone: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  clientMessage: string;
  setClientMessage: (v: string) => void;
  locale?: string;
}

export default function ProjectIntakeModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  intakeSuccess,
  selectedAesthetic,
  selectedScopeTier,
  estimatedPriceAmount,
  estimatedPriceSymbol,
  estimatedPriceCurrency,
  countryName,
  featuresList,
  likedAesthetics,
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  contactPhone,
  setContactPhone,
  companyName,
  setCompanyName,
  clientMessage,
  setClientMessage,
  locale = "en",
}: ProjectIntakeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl rounded-[2.4rem] border border-sky-300/80 bg-[#dff4ff]/95 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl"
        dir={locale === "ur" ? "rtl" : "ltr"}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-full border border-sky-300/80 text-lg flex items-center justify-center text-sky-900 hover:bg-sky-100 cursor-pointer"
        >
          ×
        </button>

        {intakeSuccess ? (
          <div className="text-center py-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 border border-sky-200 text-[#0a192f] text-3xl mb-4">
              🎉
            </div>
            <h3 className="text-2xl font-black text-[#0a192f] mb-2">Booking & Scope Saved!</h3>
            <p className="text-xs text-sky-900/80 mb-4">
              Your project and estimated pricing have been saved to your workspace. Redirecting to your Client Hub...
            </p>
            <div className="animate-spin h-5 w-5 border-2 border-sky-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100/70 border border-sky-200 px-2.5 py-0.5 rounded-full">
                Fast Booking • Direct to Studio
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#0a192f] mt-1 mb-1">
              Book Your Website Project
            </h3>
            <p className="text-xs text-sky-900/80 mb-4">
              Confirm your contact details. Your selected options and estimated price are saved directly for both you and Tanie.
            </p>

            {/* SELECTED OPTIONS & ESTIMATED PRICE SUMMARY CARD */}
            <div className="rounded-2xl border border-sky-300/90 bg-white/80 p-4 mb-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Selected Direction</span>
                  <div className="text-sm font-black text-[#0a192f]">
                    {selectedAesthetic?.name || "Bespoke Web Design"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Foundation: <span className="font-bold text-slate-800">{selectedScopeTier}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Estimated Investment</span>
                  <div className="text-xl sm:text-2xl font-black text-[#0a192f]">
                    {estimatedPriceSymbol}{(estimatedPriceAmount ?? 2899).toLocaleString()} {estimatedPriceCurrency}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700">
                    📍 {countryName} Market Pricing
                  </div>
                </div>
              </div>

              {featuresList.length > 0 && (
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Selected Modules & Features ({featuresList.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {featuresList.map((feat, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-sky-50 border border-sky-200/80 px-2 py-0.5 text-[10px] font-semibold text-sky-950"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {likedAesthetics.length > 0 && (
                <div className="mt-3 pt-3 border-t border-sky-100">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1.5">
                    Liked Aesthetics Attached ({likedAesthetics.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {likedAesthetics.map((liked) => (
                      <span
                        key={liked}
                        className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-800"
                      >
                        ❤️ {liked}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ESSENTIAL LEAD FORM */}
            <form onSubmit={onSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210 / +1..."
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Company or Brand (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Living Ltd."
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Project Message & Notes
                </label>
                <textarea
                  rows={3}
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  placeholder="Briefly describe what you're building, specific inspirations, or desired launch timeline..."
                  className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 disabled:opacity-50 cursor-pointer mt-2 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Booking & Scope...</span>
                  </>
                ) : (
                  <span>Confirm Booking & Save Scope →</span>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-500 mt-2">
                🔒 Saved directly to Tanie's studio portal. You can review your saved estimate anytime on the Client Hub.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
