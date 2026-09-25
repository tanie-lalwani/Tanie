"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FEATURE_BUNDLES, WEBSITE_GOALS, type FeatureBundle } from "@/components/packages/calculatorData";
import { useGeoPricing } from "@/context/GeoPricingContext";
import { useLanguage } from "@/context/LanguageContext";
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

export default function PricingBreakdownView() {
  const router = useRouter();
  const { tierConfig } = useGeoPricing();
  const { locale } = useLanguage();

  // Saved state from local storage
  const [isLoaded, setIsLoaded] = useState(false);
  const [businessName, setBusinessName] = useState("My Project");
  const [socialAccount, setSocialAccount] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["luxury_branding", "lead_generation"]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>(["essential_core", "sales_engine"]);
  const [timeline, setTimeline] = useState("🚀 1–3 Months (Standard Single-Module)");
  const [budgetTier, setBudgetTier] = useState("Best Value Recommendation");
  const [disabledMacros, setDisabledMacros] = useState<string[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Single-open accordion state: 1 package open at a time, 1 macro open at a time
  const [expandedPackage, setExpandedPackage] = useState<string | null>("essential_core");
  const [expandedMacro, setExpandedMacro] = useState<string | null>(null);

  // Load saved state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tanie_calculator_state");
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.businessName) setBusinessName(saved.businessName);
          if (saved.socialAccount) setSocialAccount(saved.socialAccount);
          if (Array.isArray(saved.selectedGoals) && saved.selectedGoals.length > 0) {
            setSelectedGoals(saved.selectedGoals);
          }
          if (Array.isArray(saved.selectedBundles) && saved.selectedBundles.length > 0) {
            setSelectedBundles(saved.selectedBundles);
            setExpandedPackage(saved.selectedBundles[0]);
          }
          if (saved.timeline) setTimeline(saved.timeline);
          if (saved.budgetTier) setBudgetTier(saved.budgetTier);
          if (Array.isArray(saved.disabledMacros)) setDisabledMacros(saved.disabledMacros);
        }
      } catch (e) {
        console.warn("Failed to load saved calculator state:", e);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const saveProgress = (updatedDisabledMacros?: string[]) => {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        businessName,
        socialAccount,
        selectedGoals,
        selectedBundles,
        timeline,
        budgetTier,
        disabledMacros: updatedDisabledMacros !== undefined ? updatedDisabledMacros : disabledMacros,
        timestamp: Date.now()
      };
      localStorage.setItem("tanie_calculator_state", JSON.stringify(payload));
      setSaveToast("Progress saved automatically ✨");
      setTimeout(() => setSaveToast(null), 3000);
    } catch (e) {
      console.warn("Failed to save state:", e);
    }
  };

  // Base Foundation price
  const basePrice =
    tierConfig.bundles["essential_core"] ??
    (tierConfig.currencyCode === "INR" ? 4999 : 99);

  // Single-open accordion toggles
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
    const updated = disabledMacros.includes(id)
      ? disabledMacros.filter((m) => m !== id)
      : [...disabledMacros, id];
    setDisabledMacros(updated);
    saveProgress(updated);
  };

  // Calculations
  const calculation = useMemo(() => {
    let subtotalInr = 0;
    let subtotalUsd = 0;
    let subtotalMarket = 0;

    const baseInr = 4999;
    const baseUsd = 99;
    const baseMarket =
      tierConfig.bundles["essential_core"] ??
      (tierConfig.currencyCode === "INR" ? baseInr : baseUsd);

    if (selectedBundles.length > 0) {
      subtotalInr += baseInr;
      subtotalUsd += baseUsd;
      subtotalMarket += baseMarket;

      selectedBundles.forEach((bundleId) => {
        if (bundleId === "essential_core") return;
        const bundle = FEATURE_BUNDLES.find((b) => b.id === bundleId);
        const inrStandalone = bundle?.priceInr ?? 0;
        const usdStandalone = bundle?.priceUsd ?? 0;
        const marketStandalone =
          tierConfig.bundles[bundleId] ??
          (tierConfig.currencyCode === "INR" ? inrStandalone : usdStandalone);

        const deltaInr = bundle?.deltaPriceInr ?? Math.max(0, inrStandalone - baseInr);
        const deltaUsd = bundle?.deltaPriceUsd ?? Math.max(0, usdStandalone - baseUsd);
        const deltaMarket = Math.max(0, marketStandalone - baseMarket);

        subtotalInr += deltaInr;
        subtotalUsd += deltaUsd;
        subtotalMarket += deltaMarket;
      });
    }

    // Urgency surcharge
    let urgencyPercent = 0;
    let urgencyReason = "";
    const hasHeavyModule =
      selectedBundles.includes("fullstack_saas") || selectedBundles.includes("design_3d");
    const moduleCount = selectedBundles.length;

    if (timeline.includes("1 Month")) {
      if (hasHeavyModule || moduleCount >= 3) {
        urgencyPercent = 35;
        urgencyReason = "Express Acceleration (+35% for compressing 4–8 mo scope into 1 mo sprint)";
      } else if (moduleCount >= 2) {
        urgencyPercent = 25;
        urgencyReason = "Sprint Acceleration (+25% for compressing 2–3 mo scope into 1 mo sprint)";
      }
    } else if (timeline.includes("1–3 Months")) {
      if (selectedBundles.includes("fullstack_saas") || moduleCount >= 4) {
        urgencyPercent = 25;
        urgencyReason = "Fast-Track Acceleration (+25% for delivering 5–8 mo platform in 1–3 mos)";
      } else if (hasHeavyModule || moduleCount >= 3) {
        urgencyPercent = 15;
        urgencyReason = "Priority Acceleration (+15% for delivering 3–5 mo scope in 1–3 mos)";
      }
    } else if (timeline.includes("3–5 Months")) {
      if (selectedBundles.includes("fullstack_saas") && moduleCount >= 3) {
        urgencyPercent = 15;
        urgencyReason = "Platform Fast-Track (+15% for delivering 6–8 mo ecosystem in 3–5 mos)";
      }
    }

    const urgencyAmountMarket = Math.round((subtotalMarket * urgencyPercent) / 100);
    const finalTotalMarket = subtotalMarket + urgencyAmountMarket;

    return {
      subtotalMarket,
      urgencyPercent,
      urgencyReason,
      urgencyAmountMarket,
      finalTotalMarket,
      bundleCount: selectedBundles.length
    };
  }, [selectedBundles, tierConfig, timeline]);

  // WhatsApp Quote Share
  const handleWhatsAppQuote = () => {
    const goalTitle =
      selectedGoals
        .map((id) => WEBSITE_GOALS.find((g) => g.id === id)?.title)
        .filter(Boolean)
        .join(" + ") || "Custom Growth";

    const lines: string[] = [
      `  • 🏛️ Base Brand Foundation: ${tierConfig.currencySymbol}${basePrice.toLocaleString()} ${tierConfig.currencyCode}`
    ];

    selectedBundles.forEach((id) => {
      if (id === "essential_core") return;
      const b = FEATURE_BUNDLES.find((item) => item.id === id);
      const standalone =
        tierConfig.bundles[id] ??
        (tierConfig.currencyCode === "INR" ? b?.priceInr ?? 0 : b?.priceUsd ?? 0);
      const delta = Math.max(0, standalone - basePrice);
      lines.push(
        `  • ${b?.icon || "📦"} ${b?.name} (Modular Add-on): +${tierConfig.currencySymbol}${delta.toLocaleString()} ${tierConfig.currencyCode}`
      );
    });

    const omittedText =
      disabledMacros.length > 0
        ? `\n✂️ *Custom Scope Modifications:* ${disabledMacros.length} optional sub-modules excluded.`
        : "";

    const urgencyLine =
      calculation.urgencyPercent > 0
        ? `⚡ *Timeline Acceleration Surcharge (+${calculation.urgencyPercent}%):* +${tierConfig.currencySymbol}${calculation.urgencyAmountMarket.toLocaleString()} ${tierConfig.currencyCode} (${calculation.urgencyReason})\n`
        : "";

    const text = `Hi Tanie! I am reviewing my full website feature breakdown on https://tanie.me/pricing/breakdown:
🏢 *Brand / Project:* ${socialAccount || businessName || "My Project"}
🎯 *Primary Goals:* ${goalTitle}
📦 *Scope Breakdown (Delta Modular Pricing - Base Foundation Deducted):*
${lines.join("\n")}
${omittedText}

📊 *Modules Subtotal:* ${tierConfig.currencySymbol}${calculation.subtotalMarket.toLocaleString()} ${tierConfig.currencyCode}
${urgencyLine}💰 *Total Investment:* ${tierConfig.currencySymbol}${calculation.finalTotalMarket.toLocaleString()} ${tierConfig.currencyCode}
⏱️ *Timeline:* ${timeline}

Let's discuss getting started!`;

    window.open(`https://wa.me/916351515091?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#0a192f] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0a192f] text-white text-xs px-5 py-3 rounded-xl shadow-2xl border border-sky-400/40 flex items-center gap-2 animate-bounce">
          <span>{saveToast}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/80 pb-4">
          <Link
            href="/pricing"
            className="px-5 py-2 rounded-full border border-sky-300 bg-white hover:bg-sky-50 text-[#0a192f] font-bold text-xs transition flex items-center gap-2 shadow-xs"
          >
            <span>←</span>
            <span>Back to Pricing Calculator</span>
          </Link>

          <div className="flex items-center gap-3">
            <MarketRegionSelector />
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-sky-300 text-sky-900 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Header Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-sky-200 shadow-md backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-950 text-xs font-bold mb-3 border border-sky-200">
              <span>📋 Comprehensive Architecture & Scope</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0a192f] tracking-tight">
              {businessName || "Your Website"} Scope Breakdown
            </h1>
            <p className="text-xs sm:text-sm text-sky-950/80 mt-1 max-w-xl font-medium leading-relaxed">
              Transparent macro and micro-feature specifications. Overlapping redundant features across selected packages are automatically deduplicated with strikethrough.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-sky-900 font-semibold">
              <span className="bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                ⏱️ {timeline}
              </span>
              <span className="bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                💼 {budgetTier}
              </span>
            </div>
          </div>

          <div className="text-center md:text-right shrink-0 bg-sky-50/80 p-5 rounded-2xl border border-sky-200">
            <div className="text-xs uppercase tracking-wider font-bold text-sky-800 mb-1">
              Total Calculated Investment
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#0a192f] tracking-tight">
              {tierConfig.currencySymbol}
              {calculation.finalTotalMarket.toLocaleString()} {tierConfig.currencyCode}
            </div>
            <div className="text-[11px] text-emerald-800 font-bold mt-1">
              ✓ Base {tierConfig.currencySymbol}{basePrice.toLocaleString()} Deducted from Add-ons
            </div>
          </div>
        </div>

        {/* LINE-WISE PACKAGE & MACRO/MICRO ACCORDIONS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-sky-950">
              Selected Packages & Modules ({selectedBundles.length})
            </h2>
            <span className="text-xs font-semibold text-sky-700">
              Click + to inspect micro-specifications
            </span>
          </div>

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
                    ? "bg-white border-2 border-sky-500 shadow-md"
                    : "bg-white/70 hover:bg-white border-sky-200 shadow-xs"
                }`}
              >
                {/* Package Row (Clicking '+' opens this package and closes all others) */}
                <div
                  onClick={() => togglePackage(bundle.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-2xl shrink-0">{bundle.icon}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#0a192f]">
                          {bundle.name}
                        </span>
                        {isBase ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                            Base Foundation
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Modular Add-on
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-sky-900/70 mt-0.5 truncate">
                        {bundle.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 shrink-0">
                    <div className="text-right">
                      <div className="font-black text-sm sm:text-base text-[#0a192f]">
                        {isBase
                          ? `${tierConfig.currencySymbol}${basePrice.toLocaleString()}`
                          : `+${tierConfig.currencySymbol}${deltaPrice.toLocaleString()}`}
                      </div>
                      {!isBase && (
                        <div className="text-[10px] text-slate-500">
                          (from {tierConfig.currencySymbol}{standalonePrice.toLocaleString()})
                        </div>
                      )}
                    </div>
                    <span className="w-7 h-7 rounded-full border border-sky-300 bg-sky-50 flex items-center justify-center text-sm font-bold text-sky-800">
                      {isPackageOpen ? "−" : "+"}
                    </span>
                  </div>
                </div>

                {/* Package Macro Features List (Only open when this package is active) */}
                {isPackageOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-sky-100 bg-sky-50/20 space-y-3 animate-in fade-in duration-150">
                    <div className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center justify-between">
                      <span>Macro Feature Modules ({macros.length})</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        Uncheck optional modules to customize your scope
                      </span>
                    </div>

                    <div className="space-y-2">
                      {macros.map((macro, idx) => {
                        const isMacroOpen = expandedMacro === macro.id;
                        const isMandatory = idx === 0 || bundle.isEssential;
                        const isOmitted = disabledMacros.includes(macro.id);

                        return (
                          <div
                            key={macro.id}
                            className={`rounded-xl border transition-all ${
                              isMacroOpen
                                ? "bg-white border-sky-400 shadow-sm"
                                : "bg-white/90 hover:bg-white border-sky-200/80"
                            } ${isOmitted ? "opacity-60 bg-slate-100" : ""}`}
                          >
                            {/* Macro Header */}
                            <div className="p-3.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Macro Checkbox / Selector */}
                                <input
                                  type="checkbox"
                                  disabled={isMandatory}
                                  checked={!isOmitted}
                                  onChange={() => toggleMacroDisabled(macro.id)}
                                  className="h-4 w-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500 cursor-pointer disabled:opacity-50"
                                  title={isMandatory ? "Mandatory Core Architecture" : "Toggle optional module"}
                                />
                                <span className="text-lg shrink-0">{macro.icon || "⚙️"}</span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs sm:text-sm font-bold ${
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
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 text-slate-600">
                                        Omitted
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  {macro.description && (
                                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-lg">
                                      {macro.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Macro Accordion Toggle (Only 1 macro open at a time) */}
                              <button
                                type="button"
                                onClick={() => toggleMacro(macro.id)}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition cursor-pointer shrink-0 border border-sky-200"
                              >
                                {isMacroOpen ? "− Hide Micro Specs" : "+ Micro Specs"}
                              </button>
                            </div>

                            {/* Expanded Micro Features List */}
                            {isMacroOpen && (
                              <div className="px-4 pb-4 pt-2 border-t border-sky-100 bg-sky-50/40 rounded-b-xl space-y-2 animate-in fade-in duration-100">
                                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Micro-Features Specifications:
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                          className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 flex items-start gap-2 text-xs text-slate-400"
                                        >
                                          <span className="text-slate-400 shrink-0 mt-0.5">✕</span>
                                          <div className="min-w-0">
                                            <span className="line-through block font-medium">
                                              {micro}
                                            </span>
                                            <span className="text-[10px] text-amber-800 font-bold block mt-0.5">
                                              Deduplicated: {redundancy.reason}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div
                                        key={mIdx}
                                        className={`p-2.5 rounded-lg border flex items-center gap-2 text-xs font-medium ${
                                          isOmitted
                                            ? "bg-slate-50 text-slate-400 border-slate-200 line-through"
                                            : "bg-white text-slate-800 border-sky-100 shadow-2xs"
                                        }`}
                                      >
                                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                        <span className="truncate">{micro}</span>
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

        {/* BOTTOM ACTION BAR */}
        <div className="p-6 rounded-3xl bg-white border border-sky-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-sky-950">
              Ready to build this website?
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Progress and selected modular scopes are saved automatically to your profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsAppQuote}
              className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>💬</span>
              <span>Share on WhatsApp</span>
            </button>
            <Link
              href="/contact"
              className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all text-center shadow-md cursor-pointer"
            >
              Book Project Kickoff
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
