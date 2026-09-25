"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FEATURE_BUNDLES,
  WEBSITE_GOALS,
  getMacroDistributedPrice,
  getMicroDistributedPrice
} from "./calculatorData";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

/**
 * Detects if a micro-feature is redundant / consolidated when multiple packages are chosen
 */
function checkMicroFeatureRedundancy(
  bundleId: string,
  macroId: string,
  microText: string,
  selectedBundles: string[]
): { isRedundant: boolean; reason?: string } {
  const hasSales = selectedBundles.includes("sales_engine");
  const hasMarketing = selectedBundles.includes("marketing_campaigns");
  const hasPortals = selectedBundles.includes("portals_dashboards");
  const hasSaaS = selectedBundles.includes("fullstack_saas");
  const has3D = selectedBundles.includes("design_3d");

  // Essential Core overrides
  if (bundleId === "essential_core") {
    if (
      hasSales &&
      (microText.includes("Contact Form") ||
        microText.includes("Inquiry") ||
        microText.includes("Lead Capture"))
    ) {
      return { isRedundant: true, reason: "Superseded by Sales & Smart Booking Engine" };
    }
    if (
      hasMarketing &&
      (microText.includes("XML Sitemap") ||
        microText.includes("OpenGraph") ||
        microText.includes("SEO"))
    ) {
      return { isRedundant: true, reason: "Consolidated into Marketing UTM & Telemetry Hub" };
    }
    if (
      hasSaaS &&
      (microText.includes("Next.js App Router") || microText.includes("Edge CDN"))
    ) {
      return { isRedundant: true, reason: "Handled by Custom SaaS Full-Stack Architecture" };
    }
    if (
      has3D &&
      (microText.includes("IntersectionObserver") ||
        microText.includes("Motion") ||
        microText.includes("Cursor Physics"))
    ) {
      return { isRedundant: true, reason: "Elevated to 3D Experiential Physics & Three.js" };
    }
  }

  // Sales Engine overrides
  if (bundleId === "sales_engine") {
    if (
      hasPortals &&
      (microText.includes("Tax Invoice") || microText.includes("Invoicing"))
    ) {
      return { isRedundant: true, reason: "Consolidated into Portals Document Vault" };
    }
    if (
      hasSaaS &&
      (microText.includes("Webhook") || microText.includes("Gateways"))
    ) {
      return { isRedundant: true, reason: "Unified via SaaS Payment & Billing Webhooks" };
    }
  }

  // Marketing Campaigns overrides
  if (bundleId === "marketing_campaigns") {
    if (
      hasSales &&
      (microText.includes("Inventory Indicators") ||
        microText.includes("Variant & Material"))
    ) {
      return { isRedundant: true, reason: "Included in Sales Catalog Engine" };
    }
  }

  // Portals & Dashboards overrides
  if (bundleId === "portals_dashboards") {
    if (
      hasSaaS &&
      (microText.includes("RBAC Security") ||
        microText.includes("Encrypted Employee Profile"))
    ) {
      return { isRedundant: true, reason: "Managed by Supabase PostgreSQL RLS Auth" };
    }
  }

  return { isRedundant: false };
}

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
  // Modal & Single-Open Accordion States
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(
    selectedBundles[0] || "essential_core"
  );
  const [expandedMacro, setExpandedMacro] = useState<string | null>(null);
  const [disabledMacros, setDisabledMacros] = useState<string[]>([]);

  const togglePackage = (id: string) => {
    if (expandedPackage === id) {
      setExpandedPackage(null);
      setExpandedMacro(null);
    } else {
      setExpandedPackage(id);
      setExpandedMacro(null);
    }
  };

  const toggleMacro = (id: string) => {
    if (expandedMacro === id) {
      setExpandedMacro(null);
    } else {
      setExpandedMacro(id);
    }
  };

  const toggleMacroDisabled = (id: string) => {
    setDisabledMacros((prev) => {
      const updated = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("tanie_calculator_state");
          const existing = raw ? JSON.parse(raw) : {};
          localStorage.setItem(
            "tanie_calculator_state",
            JSON.stringify({ ...existing, disabledMacros: updated })
          );
        } catch (e) {
          // ignore error
        }
      }
      return updated;
    });
  };

  // Base Foundation price
  const basePrice =
    tierConfig.bundles["essential_core"] ??
    (tierConfig.currencyCode === "INR" ? 4999 : 99);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToStep(3)}
          className="px-5 py-2 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer flex items-center gap-1.5"
        >
          <span>←</span>
          <span>{locale === "ur" ? "بجٹ اور وقت تبدیل کریں" : "Adjust Scope & Budget"}</span>
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

          <h3 className="text-2xl font-black !text-[#0a192f]">{t.funnel.unlockTitle}</h3>
          <p className="text-xs text-sky-950/80 max-w-md mx-auto mt-2 mb-6 leading-relaxed font-medium">
            {t.funnel.unlockSubtitle}
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
                    {locale === "ur"
                      ? "Google / Gmail کے ساتھ جاری رکھیں"
                      : locale === "hi"
                      ? "Google / Gmail کے ساتھ جاری رکھیں"
                      : locale === "es"
                      ? "Continuar con Google / Gmail"
                      : locale === "fr"
                      ? "Continuer avec Google / Gmail"
                      : locale === "ja"
                      ? "Google / Gmail で続行"
                      : locale === "zh"
                      ? "通过 Google / Gmail 继续"
                      : "Continue with Google / Gmail"}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-sky-200 flex-1" />
              <span className="text-[11px] text-sky-900/60 font-semibold uppercase tracking-wider">
                {locale === "ur" ? "یا ای میل کے ساتھ" : "or with email"}
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
                  ? locale === "ur"
                    ? "حساب لگایا جا رہا ہے..."
                    : "Calculating & Unlocking..."
                  : authMode === "signup"
                  ? t.funnel.unlockBtn
                  : t.funnel.signinTab}
              </button>
            </form>
          </div>

          <div className="mt-4 text-xs text-sky-950/80">
            {authMode === "signup" ? (
              <>
                {locale === "ur" ? "پہلے سے اکاؤنٹ ہے؟ " : "Already have an account? "}
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
                {locale === "ur" ? "نیا کلائنٹ؟ " : "New client? "}
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
                  ✓ {businessName || (locale === "ur" ? "آپ کا پروجیکٹ" : "Your Project")}
                </span>
                <MarketRegionSelector />
              </div>
              <h3 className="text-2xl font-black !text-[#0a192f]">{t.funnel.totalInvestment}</h3>
              <p className="text-xs text-sky-950/80 mt-1 font-medium">
                {locale === "ur"
                  ? `مدت: ${timeline} • بجٹ: ${budgetTier}`
                  : `Timeline: ${timeline} • Budget: ${budgetTier}`}
              </p>
            </div>

            <div className="text-center md:text-right">
              <div className="text-4xl sm:text-5xl font-black !text-[#0a192f] tracking-tight">
                {tierConfig.currencySymbol}
                {calculation.finalTotalMarket.toLocaleString()} {tierConfig.currencyCode}
              </div>
            </div>
          </div>

          {/* ITEMISED PRICING & SCOPE BREAKDOWN */}
          <div className="p-6 rounded-3xl bg-[#c8ecff]/25 border border-sky-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-200/60 pb-3 gap-2">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-sky-900">
                  {locale === "ur"
                    ? `تفصیلی ماڈیول اور لاگت بریک ڈاؤن (${calculation.bundleCount})`
                    : `Scope & Modular Pricing (${calculation.bundleCount} Packages)`}
                </h4>
                <p className="text-[11px] text-sky-950/70 font-medium">
                  Base {tierConfig.currencySymbol}{basePrice.toLocaleString()} deducted from add-ons • Redundant features deduplicated
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowBreakdownModal(true)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 text-sky-900 border border-sky-300 text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔍</span>
                  <span>Inspect Scope (Quick View)</span>
                </button>
                <Link
                  href="/pricing/breakdown"
                  className="px-3.5 py-1.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📋</span>
                  <span>Full Breakdown Page ↗</span>
                </Link>
              </div>
            </div>

            <div className="divide-y divide-sky-200/50">
              {/* Base Foundation Layer (Included once for the website build) */}
              <div className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-lg shrink-0">🏛️</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold !text-[#0a192f]">Luxury Brand Landing Foundation</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                        Base Layer
                      </span>
                    </div>
                    <span className="text-sky-800/80 text-[11px] block mt-0.5 font-medium">
                      Core responsive architecture, 95+ speed, SSL, DNS & lead intake
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-[#0a192f] shrink-0">
                  {tierConfig.currencySymbol}
                  {basePrice.toLocaleString()} {tierConfig.currencyCode}
                </span>
              </div>

              {/* Additional Selected Modules as Modular Add-ons (Base deducted) */}
              {selectedBundles
                .filter((id) => id !== "essential_core")
                .map((bundleId) => {
                  const bundle = FEATURE_BUNDLES.find((b) => b.id === bundleId);
                  if (!bundle) return null;
                  const standalonePrice =
                    tierConfig.bundles[bundleId] ??
                    (tierConfig.currencyCode === "INR" ? bundle.priceInr : bundle.priceUsd);
                  const deltaPrice = Math.max(0, standalonePrice - basePrice);

                  return (
                    <div
                      key={bundle.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="text-lg shrink-0">{bundle.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold !text-[#0a192f] block sm:inline">{bundle.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Modular Add-on
                            </span>
                          </div>
                          <span className="text-sky-800/80 hidden sm:inline ml-0 text-[11px] font-medium">
                            • {bundle.tagline} (Standalone {tierConfig.currencySymbol}{standalonePrice.toLocaleString()} − Base {tierConfig.currencySymbol}{basePrice.toLocaleString()} deducted)
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#0a192f] shrink-0">
                        +{tierConfig.currencySymbol}
                        {deltaPrice.toLocaleString()} {tierConfig.currencyCode}
                      </span>
                    </div>
                  );
                })}

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

            {/* Subtotal & Final Summary Bar */}
            <div className="pt-3 border-t border-sky-200/80 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-2 text-xs">
              <div className="text-sky-800 font-medium">
                {calculation.urgencyPercent > 0 ? (
                  <span>
                    Modules Subtotal: <strong>{tierConfig.currencySymbol}{calculation.subtotalMarket.toLocaleString()} {tierConfig.currencyCode}</strong> + Acceleration Surcharge: <strong>{tierConfig.currencySymbol}{calculation.urgencyAmountMarket.toLocaleString()} {tierConfig.currencyCode}</strong>
                  </span>
                ) : (
                  <span>Standard Delivery Pace • No rush surcharge</span>
                )}
              </div>
              <div className="text-sm font-black text-[#0a192f]">
                Total Investment: {tierConfig.currencySymbol}{calculation.finalTotalMarket.toLocaleString()} {tierConfig.currencyCode}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DETAILED SCOPE & FEATURE BREAKDOWN OVERLAY MODAL                          */}
          {/* ========================================================================= */}
          {showBreakdownModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
              <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-sky-200 max-h-[90vh] flex flex-col overflow-hidden text-left">
                {/* Modal Header */}
                <div className="px-6 py-4 bg-sky-50/80 border-b border-sky-200 flex items-center justify-between shrink-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📋</span>
                      <h3 className="text-base sm:text-lg font-black text-[#0a192f]">
                        Selected Packages & Micro-Features Scope
                      </h3>
                    </div>
                    <p className="text-xs text-sky-900/70 mt-0.5 font-medium">
                      Line-wise package breakdown. Overlapping redundant features are struck out and deduplicated automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBreakdownModal(false)}
                    className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-sky-300 text-sky-950 font-bold flex items-center justify-center cursor-pointer transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body: Line-wise Package Accordion */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
                  {selectedBundles.map((bundleId) => {
                    const bundle = FEATURE_BUNDLES.find((b) => b.id === bundleId);
                    if (!bundle) return null;
                    const isPackageOpen = expandedPackage === bundle.id;
                    const isBase = bundle.id === "essential_core";
                    const standalonePrice =
                      tierConfig.bundles[bundle.id] ??
                      (tierConfig.currencyCode === "INR" ? bundle.priceInr : bundle.priceUsd);
                    const deltaPrice = isBase ? basePrice : Math.max(0, standalonePrice - basePrice);
                    const macros = bundle.macroFeatures || [];

                    return (
                      <div
                        key={bundle.id}
                        className={`rounded-2xl border transition-all ${
                          isPackageOpen
                            ? "bg-sky-50/60 border-2 border-sky-500 shadow-sm"
                            : "bg-slate-50/50 hover:bg-slate-50 border-sky-200"
                        }`}
                      >
                        {/* Package Row (Clicking '+' opens this package and closes all others) */}
                        <div
                          onClick={() => togglePackage(bundle.id)}
                          className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xl shrink-0">{bundle.icon}</span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-extrabold text-sm text-[#0a192f]">
                                  {bundle.name}
                                </span>
                                {isBase ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                                    Base Foundation
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    Modular Add-on
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-sky-900/70 mt-0.5 truncate">
                                {bundle.tagline}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-black text-xs text-[#0a192f]">
                              {isBase
                                ? `${tierConfig.currencySymbol}${basePrice.toLocaleString()}`
                                : `+${tierConfig.currencySymbol}${deltaPrice.toLocaleString()}`}
                            </span>
                            <span className="w-6 h-6 rounded-full border border-sky-300 bg-white flex items-center justify-center text-xs font-bold text-sky-800">
                              {isPackageOpen ? "−" : "+"}
                            </span>
                          </div>
                        </div>

                        {/* Package Macro Features List (Only open when this package is active) */}
                        {isPackageOpen && (
                          <div className="px-4 pb-4 pt-1 border-t border-sky-200 space-y-2 animate-in fade-in duration-150">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-900 mb-2">
                              Macro Modules ({macros.length}) • Click + to expand micro-features
                            </div>

                            <div className="space-y-2">
                              {macros.map((macro, idx) => {
                                const isMacroOpen = expandedMacro === macro.id;
                                const isMandatory = idx === 0 || bundle.isEssential;
                                const isOmitted = disabledMacros.includes(macro.id);
                                const macroPrice = getMacroDistributedPrice(deltaPrice, macro, macros.length);
                                const microCount = macro.microFeatures.length || 4;
                                const microPrice = getMicroDistributedPrice(macroPrice, microCount);

                                return (
                                  <div
                                    key={macro.id}
                                    className={`rounded-xl border transition-all ${
                                      isMacroOpen
                                        ? "bg-white border-sky-400 shadow-xs"
                                        : "bg-white/80 hover:bg-white border-sky-100"
                                    } ${isOmitted ? "opacity-60 bg-slate-100" : ""}`}
                                  >
                                    {/* Macro Header */}
                                    <div className="p-3 flex items-center justify-between gap-2.5">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        {/* Macro Checkbox / Selector */}
                                        <input
                                          type="checkbox"
                                          disabled={isMandatory}
                                          checked={!isOmitted}
                                          onChange={() => toggleMacroDisabled(macro.id)}
                                          className="h-4 w-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer disabled:opacity-50"
                                          title={isMandatory ? "Mandatory Core Architecture" : "Toggle optional module"}
                                        />
                                        <span className="text-base shrink-0">{macro.icon || "⚙️"}</span>
                                        <div className="min-w-0">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span
                                              className={`text-xs font-bold ${
                                                isOmitted ? "line-through text-slate-400" : "text-[#0a192f]"
                                              }`}
                                            >
                                              {macro.name}
                                            </span>
                                            {isMandatory ? (
                                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800">
                                                Core
                                              </span>
                                            ) : isOmitted ? (
                                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                                                −{tierConfig.currencySymbol}{macroPrice.toLocaleString()} Omitted
                                              </span>
                                            ) : (
                                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">
                                                +{tierConfig.currencySymbol}{macroPrice.toLocaleString()} Active
                                              </span>
                                            )}
                                          </div>
                                          {macro.description && (
                                            <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-md">
                                              {macro.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-xs font-black hidden sm:inline ${isOmitted ? "line-through text-slate-400" : "text-[#0a192f]"}`}>
                                          {tierConfig.currencySymbol}{macroPrice.toLocaleString()}
                                        </span>
                                        {/* Macro Accordion Toggle (Only 1 macro open at a time) */}
                                        <button
                                          type="button"
                                          onClick={() => toggleMacro(macro.id)}
                                          className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold transition cursor-pointer shrink-0 border border-sky-200"
                                        >
                                          {isMacroOpen ? "− Hide Micro Features" : "+ Micro Features"}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Expanded Micro Features List */}
                                    {isMacroOpen && (
                                      <div className="px-3.5 pb-3.5 pt-1 border-t border-sky-100 bg-sky-50/30 rounded-b-xl space-y-1.5 animate-in fade-in duration-100">
                                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                                          <span>Micro Architecture Specifications:</span>
                                          <span className="text-[10px] font-normal text-sky-800">
                                            Each micro-feature: ~{tierConfig.currencySymbol}{microPrice.toLocaleString()} value
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                          {macro.microFeatures.map((micro, mIdx) => {
                                            const redundancy = checkMicroFeatureRedundancy(
                                              bundle.id,
                                              macro.id,
                                              micro,
                                              selectedBundles
                                            );

                                            if (redundancy.isRedundant) {
                                              return (
                                                <div
                                                  key={mIdx}
                                                  className="p-2 rounded-lg bg-slate-100 border border-slate-200 flex items-start justify-between gap-2 text-[11px] text-slate-400"
                                                >
                                                  <div className="flex items-start gap-2 min-w-0">
                                                    <span className="text-slate-400 shrink-0 mt-0.5">✕</span>
                                                    <div className="min-w-0">
                                                      <span className="line-through block font-medium">
                                                        {micro}
                                                      </span>
                                                      <span className="text-[9px] text-amber-700 font-bold block mt-0.5">
                                                        Deduplicated: {redundancy.reason}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <span className="text-[9px] font-bold text-slate-400 shrink-0">
                                                    Included ($0)
                                                  </span>
                                                </div>
                                              );
                                            }

                                            return (
                                              <div
                                                key={mIdx}
                                                className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-[11px] font-medium ${
                                                  isOmitted
                                                    ? "bg-slate-50 text-slate-400 border-slate-200 line-through"
                                                    : "bg-white text-slate-800 border-sky-100 shadow-2xs"
                                                }`}
                                              >
                                                <div className="flex items-center gap-2 min-w-0">
                                                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                                  <span className="truncate">{micro}</span>
                                                </div>
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                                  isOmitted ? "text-slate-400 bg-slate-100" : "text-sky-800 bg-sky-50 border border-sky-100"
                                                }`}>
                                                  +{tierConfig.currencySymbol}{microPrice.toLocaleString()}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-sky-50/80 border-t border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <div className="text-xs text-sky-950 font-medium">
                    {disabledMacros.length > 0 ? (
                      <span>
                        Customized Scope: <strong>{disabledMacros.length} optional modules omitted</strong>
                      </span>
                    ) : (
                      <span>Full Comprehensive Scope Included • Base {tierConfig.currencySymbol}{basePrice.toLocaleString()} Deducted from Add-ons</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Link
                      href="/pricing/breakdown"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white hover:bg-sky-50 text-sky-900 border border-sky-300 font-bold text-xs uppercase tracking-wider transition text-center cursor-pointer"
                    >
                      Open Full Page ↗
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowBreakdownModal(false)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => {
                if (onProceedWithCustomQuote) {
                  const goalTitle =
                    selectedGoals && selectedGoals.length > 0
                      ? selectedGoals
                          .map((id) => WEBSITE_GOALS.find((g) => g.id === id)?.title)
                          .filter(Boolean)
                          .join(" + ")
                      : WEBSITE_GOALS.find((g) => g.id === selectedGoal)?.title || selectedGoal;
                  let likedList: string[] = [];
                  if (typeof window !== "undefined") {
                    try {
                      const raw = localStorage.getItem("tanie_liked_aesthetics");
                      if (raw) likedList = JSON.parse(raw);
                    } catch {}
                  }
                  onProceedWithCustomQuote({
                    projectName: businessName,
                    socialAccount: socialAccount.trim() || undefined,
                    goal: goalTitle,
                    industry: goalTitle,
                    selectedBundles,
                    bundles: selectedBundles
                      .map((id) => FEATURE_BUNDLES.find((b) => b.id === id))
                      .filter(Boolean),
                    finalTotalInr: calculation.finalTotalInr,
                    finalTotalUsd: calculation.finalTotalUsd,
                    currency,
                    timeline,
                    budgetTier,
                    likedAesthetics: likedList,
                  });
                }
              }}
              className="py-3.5 px-6 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center cursor-pointer"
            >
              {t.funnel.proceedBooking}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppQuote}
              className="py-3.5 px-6 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>💬</span>
              <span>{t.funnel.whatsappShare}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
