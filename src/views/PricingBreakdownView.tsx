"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FEATURE_BUNDLES,
  UNIVERSAL_ADDONS,
  BUILDING_OPTIONS,
  type FeatureBundle
} from "@/components/packages/calculatorData";
import {
  PACKAGE_BREAKDOWN_DATA,
  getPackageBreakdownDef,
  type PackageBreakdownDef,
  type MacroFeatureItem
} from "@/components/packages/packageBreakdownData";
import { useGeoPricing } from "@/context/GeoPricingContext";
import { useLanguage } from "@/context/LanguageContext";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

export default function PricingBreakdownView() {
  const router = useRouter();
  const { tierConfig, formatPackagePrice, formatAddonPrice } = useGeoPricing();
  const { locale } = useLanguage();

  // Saved state from local storage
  const [isLoaded, setIsLoaded] = useState(false);
  const [businessName, setBusinessName] = useState("My Project");
  const [socialAccount, setSocialAccount] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("landing");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("🚀 Standard Delivery (3–4 Weeks)");
  const [budgetTier, setBudgetTier] = useState("Standard Foundation");
  const [selectedAesthetic, setSelectedAesthetic] = useState("Luxury Minimalist");
  const [disabledMacros, setDisabledMacros] = useState<string[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Single-open accordion state: 1 macro open at a time
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
          if (saved.selectedPackageId) setSelectedPackageId(saved.selectedPackageId);
          else if (Array.isArray(saved.selectedBundles) && saved.selectedBundles.length > 0) {
            const first = saved.selectedBundles[0];
            setSelectedPackageId(first === "essential_core" ? "landing" : first);
          }
          if (Array.isArray(saved.selectedAddons)) setSelectedAddons(saved.selectedAddons);
          if (saved.timeline) setTimeline(saved.timeline);
          if (saved.budgetTier) setBudgetTier(saved.budgetTier);
          if (saved.selectedAesthetic) setSelectedAesthetic(saved.selectedAesthetic);
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
        selectedPackageId,
        selectedAddons,
        timeline,
        budgetTier,
        selectedAesthetic,
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

  const currentPackage = useMemo(() => {
    return getPackageBreakdownDef(selectedPackageId);
  }, [selectedPackageId]);

  const toggleMacro = (id: string) => {
    setExpandedMacro((prev) => (prev === id ? null : id));
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
    const isINR = tierConfig.currencyCode === "INR";
    const pkgMarket = formatPackagePrice(currentPackage.id).amount;

    let omittedDeductionsMarket = 0;
    currentPackage.macroFeatures.forEach((macro) => {
      if (disabledMacros.includes(macro.id)) {
        const ratio = macro.priceInr / currentPackage.basePriceInr;
        omittedDeductionsMarket += Math.round(pkgMarket * ratio);
      }
    });

    let addonsMarket = 0;
    const addonsList = selectedAddons.map((addonId) => {
      const addon = UNIVERSAL_ADDONS.find((a) => a.id === addonId);
      const price = formatAddonPrice(addonId).amount;
      addonsMarket += price;
      return {
        id: addonId,
        name: addon?.name || addonId,
        icon: addon?.icon || "🧩",
        priceMarket: price
      };
    });

    const subtotalAfterDeductions = Math.max(
      Math.round(pkgMarket * 0.5),
      pkgMarket - omittedDeductionsMarket + addonsMarket
    );

    let urgencyPercent = 0;
    let urgencyReason = "";

    if (timeline.includes("1–2 Weeks") || timeline.includes("Express")) {
      urgencyPercent = 25;
      urgencyReason = "Express Sprint Priority Acceleration (+25%)";
    }

    const urgencyAmountMarket = Math.round((subtotalAfterDeductions * urgencyPercent) / 100);
    const finalTotalMarket = subtotalAfterDeductions + urgencyAmountMarket;

    return {
      pkgMarket,
      addonsMarket,
      addonsList,
      omittedDeductionsMarket,
      subtotalAfterDeductions,
      urgencyPercent,
      urgencyReason,
      urgencyAmountMarket,
      finalTotalMarket
    };
  }, [currentPackage, disabledMacros, selectedAddons, tierConfig, timeline]);

  // WhatsApp Quote Share
  const handleWhatsAppQuote = () => {
    const lines: string[] = [
      `  • *${currentPackage.name} (Suggested Package):* ${tierConfig.currencySymbol}${calculation.pkgMarket.toLocaleString()} ${tierConfig.currencyCode}`
    ];

    calculation.addonsList.forEach((addon) => {
      lines.push(
        `  • ${addon.icon} ${addon.name} (Universal Add-on): +${tierConfig.currencySymbol}${addon.priceMarket.toLocaleString()} ${tierConfig.currencyCode}`
      );
    });

    const omittedText =
      disabledMacros.length > 0
        ? `\n✂️ *Custom Scope Modifications:* ${disabledMacros.length} optional sub-modules excluded (−${tierConfig.currencySymbol}${calculation.omittedDeductionsMarket.toLocaleString()} saved).`
        : "";

    const urgencyLine =
      calculation.urgencyPercent > 0
        ? `⚡ *Timeline Acceleration Surcharge (+${calculation.urgencyPercent}%):* +${tierConfig.currencySymbol}${calculation.urgencyAmountMarket.toLocaleString()} ${tierConfig.currencyCode} (${calculation.urgencyReason})\n`
        : "";

    const text = `Hi Tanie! I am reviewing my full website feature breakdown on https://tanie.me/pricing/breakdown:
🏢 *Brand / Project:* ${socialAccount || businessName || "My Project"}
📦 *Suggested Package:* ${currentPackage.name}
✨ *Scope Breakdown:*
${lines.join("\n")}
${omittedText}

📊 *Subtotal:* ${tierConfig.currencySymbol}${calculation.subtotalAfterDeductions.toLocaleString()} ${tierConfig.currencyCode}
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
            <span>{locale === "hi" ? "Pricing Calculator Par Wapas Jaayein" : "Back to Pricing Calculator"}</span>
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

        {/* PACKAGE SELECTOR SWITCHER PILLS */}
        <div className="rounded-3xl border border-sky-300/80 bg-white/70 p-5 shadow-xs space-y-3">
          <label className="text-[11px] font-black uppercase tracking-wider text-sky-900 block">
            {locale === "hi" ? "Package Inspect Karein:" : "Inspect Any Standalone Package Scope:"}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {PACKAGE_BREAKDOWN_DATA.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              const displayPrice = formatPackagePrice(pkg.id);

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    setExpandedMacro(null);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0a192f] text-white border-[#0a192f] shadow-md scale-[1.02]"
                      : "bg-white/80 hover:bg-white border-sky-200 text-slate-800"
                  }`}
                >
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md mb-1.5 inline-block ${
                    isSelected ? "bg-sky-400/20 text-sky-200" : "bg-sky-100 text-sky-800"
                  }`}>
                    {pkg.badge}
                  </span>
                  <span className="text-xs font-black block truncate">
                    {pkg.name}
                  </span>
                  <span className={`text-[11px] font-bold mt-1 block ${isSelected ? "text-sky-300" : "text-sky-900"}`}>
                    {displayPrice.formatted} {displayPrice.currency}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/85 border border-sky-200 shadow-md backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-950 text-xs font-bold mb-3 border border-sky-200">
              <span>📋 {currentPackage.name} Scope Breakdown</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0a192f] tracking-tight">
              {businessName || "Your Project"} Scope Architecture
            </h1>
            <p className="text-xs sm:text-sm text-sky-950/80 mt-1 max-w-xl font-medium leading-relaxed">
              {currentPackage.tagline}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-sky-900 font-semibold">
              <span className="bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                ⏱️ Turnaround: {currentPackage.turnaround}
              </span>
              <span className="bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                🎨 Aesthetic: {selectedAesthetic}
              </span>
              {disabledMacros.length > 0 && (
                <span className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                  ✂️ {disabledMacros.length} Omitted Modules (−{tierConfig.currencySymbol}{calculation.omittedDeductionsMarket.toLocaleString()})
                </span>
              )}
            </div>
          </div>

          <div className="text-center md:text-right shrink-0 bg-sky-50/80 p-5 rounded-2xl border border-sky-200 min-w-[220px]">
            <div className="text-xs uppercase tracking-wider font-bold text-sky-800 mb-1">
              Package Investment
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#0a192f] tracking-tight">
              {tierConfig.currencySymbol}
              {calculation.finalTotalMarket.toLocaleString()} {tierConfig.currencyCode}
            </div>
            <div className="text-[11px] text-emerald-800 font-bold mt-1">
              ✓ Standalone Independent Package
            </div>
          </div>
        </div>

        {/* MACRO & MICRO ACCORDIONS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-sky-950">
              Macro Modules & Expandable Micro Features ({currentPackage.macroFeatures.length})
            </h2>
            <span className="text-xs font-semibold text-sky-700">
              Click + to inspect micro-specifications
            </span>
          </div>

          <div className="space-y-2.5">
            {currentPackage.macroFeatures.map((macro) => {
              const isMacroOpen = expandedMacro === macro.id;
              const isOmitted = disabledMacros.includes(macro.id);
              const macroPriceMarket = Math.round(
                (macro.priceInr / currentPackage.basePriceInr) * calculation.pkgMarket
              );

              return (
                <div
                  key={macro.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOmitted
                      ? "bg-slate-50/80 border-slate-300 opacity-60"
                      : isMacroOpen
                      ? "bg-white border-2 border-sky-500 shadow-md"
                      : "bg-white/80 hover:bg-white border-sky-200 shadow-xs"
                  }`}
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div
                      onClick={() => toggleMacro(macro.id)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer select-none"
                    >
                      <span className="text-2xl shrink-0">{macro.icon}</span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-black text-sm sm:text-base text-[#0a192f] ${
                              isOmitted ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {macro.name}
                          </span>
                          {macro.isEssential ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-200">
                              Core Foundation
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Optional Module
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-sky-900/70 mt-0.5 truncate">
                          {macro.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className={`font-black text-sm ${isOmitted ? "line-through text-slate-400" : "text-[#0a192f]"}`}>
                          {tierConfig.currencySymbol}{macroPriceMarket.toLocaleString()}
                        </div>
                      </div>

                      {/* Optional toggle checkbox */}
                      {!macro.isEssential && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMacroDisabled(macro.id);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                            isOmitted
                              ? "bg-slate-200 text-slate-600 border-slate-300"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          {isOmitted ? "Include +" : "Omit −"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleMacro(macro.id)}
                        className="w-7 h-7 rounded-full border border-sky-300 bg-sky-50 flex items-center justify-center text-sm font-bold text-sky-800 hover:bg-sky-100 cursor-pointer"
                      >
                        {isMacroOpen ? "−" : "+"}
                      </button>
                    </div>
                  </div>

                  {/* Micro features drawer */}
                  {isMacroOpen && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-sky-100 bg-sky-50/40 space-y-3">
                      <p className="text-xs text-slate-700 font-medium leading-relaxed mt-3">
                        {macro.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                        {macro.microFeatures.map((micro) => {
                          const microPrice = Math.round(macroPriceMarket / Math.max(1, macro.microFeatures.length));
                          return (
                            <div
                              key={micro.id}
                              className="p-3 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-2 shadow-2xs"
                            >
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-[#0a192f] block truncate">
                                  • {micro.name}
                                </span>
                                <span className="text-[10px] text-slate-500 block truncate">
                                  {micro.detail}
                                </span>
                              </div>
                              <span className="text-[10px] font-extrabold text-sky-900 shrink-0">
                                {tierConfig.currencySymbol}{microPrice.toLocaleString()}
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

        {/* UNIVERSAL ADD-ONS SECTION */}
        {calculation.addonsList.length > 0 && (
          <div className="rounded-3xl border border-sky-300 bg-white/85 p-6 space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-sky-950">
              Selected Universal Add-Ons ({calculation.addonsList.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {calculation.addonsList.map((addon) => (
                <div key={addon.id} className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{addon.icon}</span>
                    <span className="text-xs font-bold text-[#0a192f]">{addon.name}</span>
                  </div>
                  <span className="text-xs font-black text-sky-900">
                    +{tierConfig.currencySymbol}{addon.priceMarket.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="p-6 rounded-3xl bg-white/90 border border-sky-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Ready to execute this scope?
            </span>
            <span className="text-lg font-black text-[#0a192f]">
              {tierConfig.currencySymbol}{calculation.finalTotalMarket.toLocaleString()} {tierConfig.currencyCode}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleWhatsAppQuote}
              className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💬</span>
              <span>{locale === "hi" ? "WhatsApp Par Share Karein" : "Share via WhatsApp"}</span>
            </button>

            <Link
              href="/contact"
              className="flex-1 sm:flex-none px-8 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <span>{locale === "hi" ? "Project Booking Confirm Karein →" : "Confirm Project Scope →"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
