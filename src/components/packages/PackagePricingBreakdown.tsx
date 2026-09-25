"use client";

import React, { useState, useMemo } from "react";
import { useGeoPricing } from "@/context/GeoPricingContext";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

import {
  type MicroFeatureItem,
  type MacroFeatureItem,
  type PackageBreakdownDef,
  PACKAGE_BREAKDOWN_DATA,
} from "./packageBreakdownData";

export {
  type MicroFeatureItem,
  type MacroFeatureItem,
  type PackageBreakdownDef,
  PACKAGE_BREAKDOWN_DATA,
};

interface PackagePricingBreakdownProps {
  initialPackageId?: string;
  onProceedWithCustomScope?: (scopeData: {
    packageId: string;
    packageName: string;
    originalPriceInr: number;
    originalPriceUsd: number;
    customPriceInr: number;
    customPriceUsd: number;
    currency: "INR" | "USD";
    includedMacroFeatures: string[];
    removedMacroFeatures: string[];
  }) => void;
}

export default function PackagePricingBreakdown({
  initialPackageId = "growth-marketing-campaigns",
  onProceedWithCustomScope
}: PackagePricingBreakdownProps) {
  const { tierConfig, formatPackagePrice } = useGeoPricing();

  // Active selected package
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId);

  // Set of deselected macro feature IDs (only non-essential ones can be deselected)
  const [deselectedFeatureIds, setDeselectedFeatureIds] = useState<Set<string>>(new Set());

  // Currently open macro feature ID for the micro-features drawer (accordion: only one open at a time)
  const [expandedMacroId, setExpandedMacroId] = useState<string | null>(null);

  // Active currency
  const isINR = tierConfig.currencyCode === "INR";

  // Selected package definition
  const currentPackage = useMemo(() => {
    return PACKAGE_BREAKDOWN_DATA.find((p) => p.id === selectedPackageId) || PACKAGE_BREAKDOWN_DATA[0];
  }, [selectedPackageId]);

  // When switching packages, reset the expanded drawer (or keep reasonable)
  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setExpandedMacroId(null);
  };

  // Toggle macro feature inclusion (only if not essential)
  const handleToggleFeature = (feature: MacroFeatureItem) => {
    if (feature.isEssential) return; // Non-removable core feature

    setDeselectedFeatureIds((prev) => {
      const next = new Set(prev);
      if (next.has(feature.id)) {
        next.delete(feature.id);
      } else {
        next.add(feature.id);
      }
      return next;
    });
  };

  // Toggle the micro-features accordion (one at a time)
  const handleToggleAccordion = (featureId: string) => {
    setExpandedMacroId((prev) => (prev === featureId ? null : featureId));
  };

  // Price calculations
  const calculation = useMemo(() => {
    // Original package base prices
    const origInr = currentPackage.basePriceInr;
    const origUsd = currentPackage.basePriceUsd;

    // Deductions from deselected optional features
    let deductionInr = 0;
    let deductionUsd = 0;
    const removedNames: string[] = [];
    const includedNames: string[] = [];

    currentPackage.macroFeatures.forEach((feat) => {
      if (deselectedFeatureIds.has(feat.id)) {
        deductionInr += feat.priceInr;
        deductionUsd += feat.priceUsd;
        removedNames.push(feat.name);
      } else {
        includedNames.push(feat.name);
      }
    });

    const customInr = Math.max(4999, origInr - deductionInr);
    const customUsd = Math.max(99, origUsd - deductionUsd);

    // Market pricing calculation
    const pkgMarketPrice = tierConfig.packages[selectedPackageId as keyof typeof tierConfig.packages];
    const marketRatio = typeof pkgMarketPrice === "number"
      ? pkgMarketPrice / (isINR ? origInr : origUsd)
      : 1;

    const customMarket = Math.round((isINR ? customInr : customUsd) * marketRatio);
    const origMarket = typeof pkgMarketPrice === "number" ? pkgMarketPrice : (isINR ? origInr : origUsd);
    const deductionMarket = Math.max(0, origMarket - customMarket);

    return {
      origInr,
      origUsd,
      customInr,
      customUsd,
      deductionInr,
      deductionUsd,
      origMarket,
      customMarket,
      deductionMarket,
      removedNames,
      includedNames
    };
  }, [currentPackage, deselectedFeatureIds, tierConfig, isINR, selectedPackageId]);

  return (
    <div className="w-full space-y-8 py-6">
      {/* HEADER & PACKAGE SELECTOR TABS */}
      <div className="rounded-3xl border border-sky-300/80 bg-[#c8ecff]/35 p-6 sm:p-8 backdrop-blur-xl shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-200/70 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-[#0a192f] text-white px-3 py-0.5 text-[10px] font-black uppercase tracking-wider">
                Interactive Scope Breakdown
              </span>
              <span className="text-xs font-bold text-sky-800">
                Macro & Micro Feature Architecture
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0a192f] tracking-tight">
              Package Scope & Transparent Pricing Decomposition
            </h2>
            <p className="text-xs sm:text-sm text-sky-950/80 font-medium mt-1 max-w-2xl">
              Every package includes a complete, battle-tested functional architecture. Click the <span className="font-bold text-sky-900">+</span> icon on any macro feature to inspect its granular micro-features and engineering deliverables.
            </p>
          </div>

          {/* Market Currency Selector */}
          <div className="shrink-0 flex items-center gap-2">
            <MarketRegionSelector />
          </div>
        </div>

        {/* PACKAGE SELECTOR PILLS */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-sky-900">
            1. Select Package to Inspect & Customize:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {PACKAGE_BREAKDOWN_DATA.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              const displayPrice = formatPackagePrice(pkg.id);
              const isINR = tierConfig.currencyCode === "INR";
              const rangeText = isINR ? pkg.typicalRangeInr : pkg.typicalRangeUsd;

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0a192f] text-white border-[#0a192f] shadow-md scale-[1.02]"
                      : "bg-white/60 hover:bg-white/90 border-sky-200/80 text-slate-800 hover:border-sky-300"
                  }`}
                >
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md mb-1.5 ${
                    isSelected ? "bg-sky-400/20 text-sky-200" : "bg-sky-100 text-sky-800"
                  }`}>
                    {pkg.badge}
                  </span>
                  <span className="text-xs font-black line-clamp-1">
                    {pkg.name}
                  </span>
                  <span className={`text-[11px] font-bold mt-1 ${isSelected ? "text-sky-300" : "text-sky-900"}`}>
                    {pkg.isCustomQuoteOnly ? "Quote on Request" : `Starting ${displayPrice.formatted} ${displayPrice.currency}`}
                  </span>
                  {rangeText && (
                    <span className={`text-[10px] font-medium block truncate mt-0.5 ${isSelected ? "text-sky-200/70" : "text-slate-500"}`}>
                      {rangeText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED PACKAGE HEADER BANNER */}
      <div className={`rounded-3xl border border-sky-300/80 bg-gradient-to-r ${currentPackage.accentGradient} p-6 sm:p-7 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md`}>
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-200 border border-sky-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-950">
              {currentPackage.badge}
            </span>
            <span className="text-xs font-bold text-sky-900">
              ⏱ Turnaround: {currentPackage.turnaround}
            </span>
            {(currentPackage.typicalRangeInr || currentPackage.typicalRangeUsd) && (
              <span className="bg-sky-100/90 text-sky-950 px-2.5 py-0.5 rounded-full border border-sky-300 text-[10px] font-bold">
                📊 Typical: {isINR ? currentPackage.typicalRangeInr : currentPackage.typicalRangeUsd}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0a192f]">
            {currentPackage.name}
          </h3>
          <p className="text-xs text-sky-950/80 font-medium leading-relaxed">
            {currentPackage.tagline}
          </p>
        </div>

        {/* LIVE PRICING SUMMARY TILE */}
        <div className="shrink-0 bg-white/80 border border-sky-200/80 rounded-2xl p-4 sm:p-5 shadow-sm text-center md:text-right min-w-[220px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            {currentPackage.isCustomQuoteOnly ? "Investment Model" : calculation.deductionMarket > 0 ? "Estimated Custom Investment" : "Estimated Full Package Investment"}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0a192f] mt-0.5">
            {currentPackage.isCustomQuoteOnly ? (
              <span className="text-indigo-950">Quotation on Request</span>
            ) : (
              <>
                {tierConfig.currencySymbol}{calculation.customMarket.toLocaleString()} <span className="text-xs font-bold text-slate-600">{tierConfig.currencyCode}</span>
              </>
            )}
          </div>
          {currentPackage.isCustomQuoteOnly ? (
            <div className="text-[11px] text-indigo-800 font-bold mt-1">
              ✨ Scope quotation on request
            </div>
          ) : calculation.deductionMarket > 0 ? (
            <div className="mt-1 flex items-center justify-center md:justify-end gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span>✂️ Saved:</span>
              <span className="font-black">-{tierConfig.currencySymbol}{calculation.deductionMarket.toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium block mt-1 max-w-[220px] md:ml-auto">
              *Final pricing may vary based on scope of work. Initial estimate, not final pricing.
            </span>
          )}
        </div>
      </div>

      {/* MACRO & MICRO FEATURES LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-sky-900">
            2. Macro Features & Expandable Micro Functionalities:
          </label>
          <span className="text-[11px] font-bold text-sky-800">
            {currentPackage.macroFeatures.length} Macro Modules • Click [+] for micro-breakdown
          </span>
        </div>

        <div className="space-y-3">
          {currentPackage.macroFeatures.map((macro, idx) => {
            const isRemoved = deselectedFeatureIds.has(macro.id);
            const isExpanded = expandedMacroId === macro.id;
            const macroPrice = isINR ? macro.priceInr : macro.priceUsd;
            const basePrice = isINR ? currentPackage.basePriceInr : currentPackage.basePriceUsd;
            const macroMarketPrice = macroPrice > 0 && basePrice > 0
              ? Math.round(macroPrice * (calculation.origMarket / basePrice))
              : 0;

            return (
              <div
                key={macro.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isRemoved
                    ? "bg-slate-50/70 border-slate-200 opacity-60"
                    : isExpanded
                    ? "bg-white border-sky-400 shadow-md ring-2 ring-sky-400/20"
                    : "bg-[#c8ecff]/30 hover:bg-[#c8ecff]/50 border-sky-300/80 shadow-xs"
                }`}
              >
                {/* MACRO CARD HEADER */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5 flex-1">
                    {/* Checkbox / Removal Toggle */}
                    <div className="pt-0.5 sm:pt-0 shrink-0">
                      {macro.isEssential ? (
                        <div
                          className="h-6 w-6 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800"
                          title="Essential Core Architecture: Non-removable for foundational performance and compliance."
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(macro)}
                          className={`h-6 w-6 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                            isRemoved
                              ? "bg-white border-slate-300 text-transparent hover:border-slate-400"
                              : "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                          }`}
                          title={isRemoved ? "Click to add back this feature" : "Click to remove optional feature and reduce price"}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Macro Icon & Titles */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-lg">{macro.icon}</span>
                        <h4 className={`text-sm sm:text-base font-black ${isRemoved ? "line-through text-slate-500" : "text-[#0a192f]"}`}>
                          {macro.name}
                        </h4>
                        {macro.isEssential ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 border border-sky-200 px-2 py-0.5 text-[9px] font-black text-sky-900">
                            🔒 Non-Removable Core
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black ${
                            isRemoved
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                          }`}>
                            {isRemoved ? "✂️ Removed from Scope" : "✓ Optional Module Included"}
                          </span>
                        )}
                        {macro.isCustomQuoteOnly && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[9px] font-bold text-indigo-900">
                            Quotation on Request
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-sky-950/70 font-medium leading-relaxed">
                        {macro.description}
                      </p>
                    </div>
                  </div>

                  {/* Price Tag & Drawer Plus [+] Toggle */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-sky-200/50">
                    <div className="text-right">
                      {macro.isCustomQuoteOnly ? (
                        <span className="text-[11px] font-extrabold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                          {macro.priceLabel || "Quote on Request"}
                        </span>
                      ) : (
                        <>
                          <span className={`text-xs font-black ${isRemoved ? "line-through text-slate-400" : "text-sky-950"}`}>
                            {tierConfig.currencySymbol}{macroMarketPrice.toLocaleString()} {tierConfig.currencyCode}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 block">
                            {macro.isEssential ? "Built-In Base" : isRemoved ? "Deducted" : "Included"}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Plus [+] / Minus [-] Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleAccordion(macro.id)}
                      className={`h-9 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all cursor-pointer ${
                        isExpanded
                          ? "bg-[#0a192f] text-white border-[#0a192f] shadow-sm"
                          : "bg-white/80 hover:bg-white text-sky-900 border-sky-300 hover:border-sky-400 shadow-xs"
                      }`}
                      title={isExpanded ? "Close micro-features breakdown" : "Expand micro-features breakdown"}
                    >
                      <span className={`text-sm transition-transform duration-200 font-mono ${isExpanded ? "rotate-45" : "rotate-0"}`}>
                        +
                      </span>
                      <span className="text-[11px]">
                        {macro.microFeatures.length} Micros
                      </span>
                    </button>
                  </div>
                </div>

                {/* EXPANDABLE MICRO-FEATURES BREAKDOWN (ONE AT A TIME ACCORDION) */}
                <div
                  className={`transition-all duration-300 ease-in-out border-t border-sky-200/70 overflow-hidden ${
                    isExpanded ? "max-h-[600px] opacity-100 bg-sky-50/50" : "max-h-0 opacity-0 bg-transparent"
                  }`}
                >
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-900">
                        Granular Micro-Features & Specific Deliverables ({macro.microFeatures.length}):
                      </span>
                      <span className="text-[10px] font-bold text-sky-800">
                        All micro-functionalities verified for this module
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {macro.microFeatures.map((micro) => (
                        <div
                          key={micro.id}
                          className="p-3 rounded-xl bg-white border border-sky-200/80 shadow-2xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#0a192f] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                              {micro.name}
                            </span>
                            {micro.tag && (
                              <span className="rounded bg-sky-100 text-sky-800 font-extrabold text-[9px] px-1.5 py-0.5">
                                {micro.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-normal pl-3">
                            {micro.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STICKY / BOTTOM CUSTOM SCOPE PROCEED BAR */}
      <div className="rounded-3xl border border-sky-300 bg-gradient-to-r from-sky-100 via-white to-blue-50 p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-200/60 px-2 py-0.5 rounded-full">
            Scope Customization Summary
          </span>
          <h4 className="text-lg sm:text-xl font-black text-[#0a192f] mt-1.5">
            Ready to proceed with this scope?
          </h4>
          <p className="text-xs text-sky-950/80 font-medium mt-0.5">
            {currentPackage.isCustomQuoteOnly
              ? "Bespoke workflow architecture with custom requirements quotation."
              : calculation.removedNames.length > 0
              ? `You removed ${calculation.removedNames.length} optional module(s) saving ${tierConfig.currencySymbol}${calculation.deductionMarket.toLocaleString()} ${tierConfig.currencyCode}.`
              : "All macro & micro modules are included for the complete, high-performance experience."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto">
          <div className="text-center sm:text-right w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {currentPackage.isCustomQuoteOnly ? "Investment Model" : "Estimated Custom Investment"}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#0a192f]">
              {currentPackage.isCustomQuoteOnly
                ? "Quotation on Request"
                : `${tierConfig.currencySymbol}${calculation.customMarket.toLocaleString()} ${tierConfig.currencyCode}`}
            </span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              *Final pricing may vary based on scope of work (not final pricing).
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onProceedWithCustomScope) {
                onProceedWithCustomScope({
                  packageId: currentPackage.id,
                  packageName: currentPackage.name,
                  originalPriceInr: calculation.origInr,
                  originalPriceUsd: calculation.origUsd,
                  customPriceInr: calculation.customInr,
                  customPriceUsd: calculation.customUsd,
                  currency: isINR ? "INR" : "USD",
                  includedMacroFeatures: calculation.includedNames,
                  removedMacroFeatures: calculation.removedNames
                });
              }
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <span>{currentPackage.isCustomQuoteOnly ? "Request Custom Quotation ✨" : "Lock In Scope & Book Consultation"}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
