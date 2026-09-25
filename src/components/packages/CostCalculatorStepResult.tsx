"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FEATURE_BUNDLES,
  UNIVERSAL_ADDONS,
  BUILDING_OPTIONS,
  getMacroDistributedPrice,
  getMicroDistributedPrice
} from "./calculatorData";
import { PACKAGE_BREAKDOWN_DATA, getPackageBreakdownDef } from "./packageBreakdownData";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

interface CostCalculatorStepResultProps {
  locale: string;
  t: any;
  goToStep: (step: number) => void;
  isUnlocked: boolean;
  setIsUnlocked?: (val: boolean) => void;
  authLoading?: boolean;
  authError: string;
  setAuthError: (val: string) => void;
  isAuthSubmitting: boolean;
  setIsAuthSubmitting: (val: boolean) => void;
  authMode: "signup" | "signin";
  setAuthMode: (mode: "signup" | "signin") => void;
  authName: string;
  setAuthName: (name: string) => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPassword: string;
  setAuthPassword: (pwd: string) => void;
  businessName: string;
  socialAccount: string;
  timeline: string;
  budgetTier: string;
  tierConfig: any;
  calculation: any;
  selectedBundles: string[];
  selectedGoal: string;
  selectedGoals?: string[];
  currency: "USD" | "INR";
  signInWithGoogle: (redirectTo?: string) => Promise<any>;
  dispatchLeadCapture: (params: any) => Promise<any>;
  saveLeadProfile: (profile: any) => void;
  onProceedWithCustomQuote?: (quoteData: any) => void;
  handleWhatsAppQuote: () => void;
  handleUnlockSubmit: (e: React.FormEvent) => void;
}

export default function CostCalculatorStepResult({
  locale,
  t,
  goToStep,
  isUnlocked,
  setIsUnlocked,
  authLoading,
  authError,
  setAuthError,
  isAuthSubmitting,
  setIsAuthSubmitting,
  authMode,
  setAuthMode,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  businessName,
  socialAccount,
  timeline,
  budgetTier,
  tierConfig,
  calculation,
  selectedBundles,
  selectedGoal,
  selectedGoals,
  currency,
  signInWithGoogle,
  dispatchLeadCapture,
  saveLeadProfile,
  onProceedWithCustomQuote,
  handleWhatsAppQuote,
  handleUnlockSubmit,
}: CostCalculatorStepResultProps) {
  // In-line macro accordion for suggested package
  const [expandedMacroInPage, setExpandedMacroInPage] = useState<string | null>(null);

  const toggleMacroInPage = (macroId: string) => {
    setExpandedMacroInPage((prev) => (prev === macroId ? null : macroId));
  };

  // Find active suggested package
  const primaryPackageId = selectedBundles[0] || "landing";
  const activePackage = FEATURE_BUNDLES.find((b) => b.id === primaryPackageId) || FEATURE_BUNDLES[0];
  const breakdownDef = getPackageBreakdownDef(primaryPackageId);

  // Selected addons list
  const selectedAddonsList = selectedBundles.slice(1).map((addonId) => {
    return UNIVERSAL_ADDONS.find((a) => a.id === addonId);
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToStep(4)}
          className="px-5 py-2 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer flex items-center gap-1.5"
        >
          <span>←</span>
          <span>{locale === "hi" ? "Timeline & Budget Badlein" : "Adjust Scope & Budget"}</span>
        </button>
      </div>

      {authLoading ? (
        <div className="rounded-3xl bg-[#c8ecff]/30 border border-sky-300/90 p-12 text-center backdrop-blur-md flex flex-col items-center justify-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
          <span className="text-xs font-bold text-sky-900">Verifying session...</span>
        </div>
      ) : !isUnlocked ? (
        /* ================= LOCKED RESULT GATE ================= */
        <div className="relative rounded-3xl bg-[#c8ecff]/30 border border-sky-300/90 p-6 sm:p-10 shadow-lg text-center overflow-hidden backdrop-blur-md">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-[#0a192f] text-2xl mb-4 border border-sky-200">
            🔒
          </div>

          <h3 className="text-2xl font-black !text-[#0a192f]">
            {locale === "hi" ? "Quote Save & Unlock Karein" : t.funnel.unlockTitle}
          </h3>
          <p className="text-xs text-sky-950/80 max-w-md mx-auto mt-2 mb-6 leading-relaxed font-medium">
            {locale === "hi"
              ? "Is estimate ko lock karne aur planning shuru karne ke liye apna free client profile banayein."
              : t.funnel.unlockSubtitle}
          </p>

          {authError && (
            <div className="max-w-md mx-auto mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {authError}
            </div>
          )}

          <div className="max-w-md mx-auto">
            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={isAuthSubmitting}
              onClick={async () => {
                setAuthError("");
                setIsAuthSubmitting(true);
                try {
                  const target =
                    typeof window !== "undefined"
                      ? window.location.pathname + window.location.search
                      : "/pricing";
                  await signInWithGoogle(target);
                } catch (err: any) {
                  setAuthError(err.message || "Failed to sign in with Google");
                  setIsAuthSubmitting(false);
                }
              }}
              className="w-full py-3 px-4 rounded-full bg-white hover:bg-slate-50 text-[#0a192f] border border-sky-300 font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer mb-3.5 disabled:opacity-60"
            >
              {isAuthSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <>
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
                  <span>
                    {locale === "hi"
                      ? "Google / Gmail ke saath continue karein"
                      : "Continue with Google / Gmail"}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-sky-200 flex-1" />
              <span className="text-[11px] text-sky-900/60 font-semibold uppercase tracking-wider">
                {locale === "hi" ? "ya email ke saath" : "or with email"}
              </span>
              <div className="h-px bg-sky-200 flex-1" />
            </div>

            <form
              onSubmit={handleUnlockSubmit}
              className="space-y-3.5 text-left"
              autoComplete="on"
            >
              {authMode === "signup" && (
                <div>
                  <label
                    htmlFor="calc_auth_name"
                    className="block text-xs font-bold !text-[#0a192f] mb-1"
                  >
                    {t.funnel.nameLabel}
                  </label>
                  <input
                    id="calc_auth_name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={authName}
                    onChange={(e) => {
                      setAuthName(e.target.value);
                      saveLeadProfile({ name: e.target.value });
                    }}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white/80 border border-sky-300 rounded-xl px-3.5 py-2.5 text-sm !text-[#0a192f] focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 font-medium"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="calc_auth_email"
                  className="block text-xs font-bold !text-[#0a192f] mb-1"
                >
                  {t.funnel.emailLabel}
                </label>
                <input
                  id="calc_auth_email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={authEmail}
                  onChange={(e) => {
                    setAuthEmail(e.target.value);
                    saveLeadProfile({ email: e.target.value });
                  }}
                  placeholder="name@company.com"
                  className="w-full bg-white/80 border border-sky-300 rounded-xl px-3.5 py-2.5 text-sm !text-[#0a192f] focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="calc_auth_password"
                  className="block text-xs font-bold !text-[#0a192f] mb-1"
                >
                  {t.funnel.passwordLabel}
                </label>
                <input
                  id="calc_auth_password"
                  name="password"
                  type="password"
                  autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/80 border border-sky-300 rounded-xl px-3.5 py-2.5 text-sm !text-[#0a192f] focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthSubmitting}
                className="w-full py-3.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                {isAuthSubmitting
                  ? "Calculating & Unlocking..."
                  : authMode === "signup"
                  ? (locale === "hi" ? "Proposal Unlock & Save Karein" : t.funnel.unlockBtn)
                  : (locale === "hi" ? "Sign In Karein" : t.funnel.signinTab)}
              </button>
            </form>
          </div>

          <div className="mt-4 text-xs text-sky-950/80">
            {authMode === "signup" ? (
              <>
                {locale === "hi" ? "Pehle se account hai? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="text-sky-700 hover:underline font-black cursor-pointer"
                >
                  {t.funnel.signinTab}
                </button>
              </>
            ) : (
              <>
                {locale === "hi" ? "Naya account? " : "New client? "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="text-sky-700 hover:underline font-black cursor-pointer"
                >
                  {t.funnel.signupTab}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* ================= UNLOCKED RESULT ================= */
        <div className="space-y-6">
          {/* QUOTATION SUMMARY CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#c8ecff]/35 border border-sky-300/90 backdrop-blur-md shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-950 text-xs font-bold border border-sky-200">
                  ✓ {businessName || "Your Project"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0a192f] text-white text-xs font-extrabold">
                  {activePackage.badge || "Suggested"}
                </span>
                <MarketRegionSelector />
              </div>
              <h3 className="text-2xl font-black !text-[#0a192f]">
                {activePackage.icon} {activePackage.name}
              </h3>
              <p className="text-xs text-sky-950/80 mt-1 font-medium">
                {`Target Timeline: ${timeline || activePackage.turnaround || "Standard"}`}
              </p>
              {(breakdownDef.typicalRangeInr || activePackage.typicalRangeInr) && (
                <p className="text-[11px] text-sky-800 font-bold mt-1">
                  Typical Scope Range: {tierConfig.currencyCode === "INR" ? (breakdownDef.typicalRangeInr || activePackage.typicalRangeInr) : (breakdownDef.typicalRangeUsd || activePackage.typicalRangeUsd)}
                </p>
              )}
            </div>

            <div className="text-center md:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {activePackage.isCustomQuoteOnly ? "Investment Model" : "Total Investment"}
              </span>
              <div className="text-2xl sm:text-3xl font-black !text-[#0a192f] tracking-tight mt-0.5">
                {activePackage.isCustomQuoteOnly ? (
                  <span className="text-indigo-950 font-black">Quotation on Request</span>
                ) : (
                  <>
                    {tierConfig.currencySymbol}
                    {calculation.finalTotalMarket.toLocaleString()} {tierConfig.currencyCode}
                  </>
                )}
              </div>
              {activePackage.isCustomQuoteOnly && (
                <span className="text-[10px] font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 inline-block mt-1.5">
                  ✨ Custom scope quotation on request
                </span>
              )}
            </div>
          </div>

          {/* ITEMISED PRICING & SCOPE BREAKDOWN */}
          <div className="p-6 rounded-3xl bg-[#c8ecff]/25 border border-sky-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-200/60 pb-3 gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-sky-900">
                  {locale === "hi" ? "Package Scope & Transparent Pricing" : "Package Scope & Transparent Pricing"}
                </h4>
                <p className="text-[11px] text-sky-950/70 font-medium">
                  {locale === "hi"
                    ? "Har package standalone aur independent hai • Neeche macro & micro features dekhein"
                    : "Standalone independent package scope with transparent feature decomposition"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <Link
                  href="/pricing/breakdown"
                  className="px-4 py-2 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📋</span>
                  <span>Full Scope Breakdown Page ↗</span>
                </Link>
              </div>
            </div>

            {/* Suggested Package Details */}
            <div className="divide-y divide-sky-200/50">
              {/* Primary Package */}
              <div className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-xl shrink-0">{activePackage.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black !text-[#0a192f]">{activePackage.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                        Suggested Package
                      </span>
                    </div>
                    <span className="text-sky-800/80 text-[11px] block mt-0.5 font-medium">
                      {activePackage.tagline}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-[#0a192f] shrink-0 text-sm">
                  {activePackage.isCustomQuoteOnly ? (
                    <span className="text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-xs">
                      Quotation on Request
                    </span>
                  ) : (
                    <>
                      {tierConfig.currencySymbol}
                      {calculation.pkgMarket.toLocaleString()} {tierConfig.currencyCode}
                    </>
                  )}
                </span>
              </div>

              {/* Universal Add-ons if any */}
              {calculation.selectedAddonsList.map((addon: any) => (
                <div key={addon.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="text-lg shrink-0">{addon.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold !text-[#0a192f]">{addon.name}</span>
                        {addon.isFreeBonus ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            FREE Promo Bonus
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Universal Add-on
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {addon.isFreeBonus ? (
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[11px] text-slate-400 line-through font-bold">
                          +{tierConfig.currencySymbol}{addon.originalPriceMarket?.toLocaleString()}
                        </span>
                        <span className="font-black text-emerald-800 text-xs">
                          FREE (Included)
                        </span>
                      </div>
                      <span className="text-[9px] text-amber-900 font-semibold tracking-tight block">
                        ⏳ Limited time offer
                      </span>
                    </div>
                  ) : (
                    <span className="font-extrabold text-[#0a192f] shrink-0">
                      +{tierConfig.currencySymbol}
                      {addon.priceMarket.toLocaleString()} {tierConfig.currencyCode}
                    </span>
                  )}
                </div>
              ))}

              {/* Express Urgency / Timeline Acceleration Surcharge */}
              {calculation.urgencyPercent > 0 && (
                <div className="py-3 flex items-center justify-between gap-3 text-xs bg-amber-50/80 -mx-6 px-6 border-y border-amber-200/80">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="text-lg shrink-0">⚡</span>
                    <div className="min-w-0">
                      <span className="font-black text-amber-950 block sm:inline">
                        Timeline Acceleration Surcharge (+{calculation.urgencyPercent}%)
                      </span>
                      <span className="text-amber-800 text-[11px] block mt-0.5">
                        {calculation.urgencyReason}
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-amber-900 shrink-0">
                    +{tierConfig.currencySymbol}
                    {calculation.urgencyAmountMarket.toLocaleString()} {tierConfig.currencyCode}
                  </span>
                </div>
              )}
            </div>

            {/* INLINE MACRO & MICRO FEATURES ACCORDION */}
            <div className="pt-4 border-t border-sky-200/80 space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-sky-900 block">
                {locale === "hi" ? "Included Macro & Micro Features:" : "Included Macro & Micro Features:"}
              </label>

              <div className="space-y-2">
                {breakdownDef.macroFeatures.map((macro) => {
                  const isOpen = expandedMacroInPage === macro.id;
                  const isCustomMacro = macro.isCustomQuoteOnly;
                  const macroPriceFormatted = macro.priceInr
                    ? (tierConfig.currencyCode === "INR"
                        ? `₹${macro.priceInr.toLocaleString()}`
                        : `$${(macro.priceUsd || Math.round(macro.priceInr / 83)).toLocaleString()}`)
                    : `${tierConfig.currencySymbol}${Math.round((macro.priceInr / Math.max(1, breakdownDef.basePriceInr)) * calculation.pkgMarket).toLocaleString()}`;

                  return (
                    <div
                      key={macro.id}
                      className="rounded-2xl border border-sky-200/80 bg-white/70 overflow-hidden shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleMacroInPage(macro.id)}
                        className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-white transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{macro.icon}</span>
                          <span className="text-xs font-bold text-[#0a192f] truncate">
                            {macro.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isCustomMacro ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              Quotation on Request
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-sky-800">
                              {macroPriceFormatted}
                            </span>
                          )}
                          <span className="h-5 w-5 rounded-full bg-sky-100 flex items-center justify-center text-xs font-black text-sky-900">
                            {isOpen ? "−" : "+"}
                          </span>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="p-3.5 pt-0 border-t border-sky-100/80 bg-sky-50/40 space-y-2">
                          <p className="text-[11px] text-slate-600 mt-2 font-medium leading-relaxed">
                            {macro.description}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {macro.microFeatures.map((micro) => (
                              <div
                                key={micro.id}
                                className="p-2.5 rounded-xl bg-white border border-sky-100 flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-[#0a192f] block truncate">
                                    • {micro.name}
                                  </span>
                                  {micro.detail && (
                                    <span className="text-[10px] text-slate-500 block truncate">
                                      {micro.detail}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-bold text-sky-800 shrink-0">
                                  ✓
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTONS: WHATSAPP & BOOKING */}
            <div className="pt-4 border-t border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>💬</span>
                <span>{locale === "hi" ? "WhatsApp Par Share Karein" : t.funnel.whatsappShare}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onProceedWithCustomQuote) {
                    onProceedWithCustomQuote({
                      packageId: activePackage.id,
                      packageName: activePackage.name,
                      businessName,
                      socialAccount,
                      timeline,
                      selectedAddons: calculation.selectedAddonsList,
                      bundles: calculation.moduleBreakdown,
                      finalTotalMarket: calculation.finalTotalMarket,
                      finalTotalInr: calculation.finalTotalInr,
                      finalTotalUsd: calculation.finalTotalUsd,
                      estimatedTotal: calculation.finalTotalMarket,
                      total: calculation.finalTotalMarket,
                      currency: tierConfig.currencyCode
                    });
                  }
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {activePackage.isCustomQuoteOnly
                    ? (locale === "hi" ? "Custom Quotation Request Karein ✨" : "Request Custom Quotation ✨")
                    : (locale === "hi" ? "Project Booking Ke Liye Aage Badhein →" : t.funnel.proceedBooking)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
