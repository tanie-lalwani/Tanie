"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useGeoPricing } from "@/context/GeoPricingContext";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

export * from "./marketingFunnelData";
import {
  BOFU_PAGE_MODULES,
  type WebsiteMarketingScope,
  type BofuPageModule,
  type MarketingFunnelSuiteProps,
} from "./marketingFunnelData";
import MarketingFunnelInspector from "./MarketingFunnelInspector";
import UtmAttributionEngine from "./UtmAttributionEngine";

export default function MarketingFunnelSuite({
  currency,
  onCurrencyChange,
  onBookMarketingPackage
}: MarketingFunnelSuiteProps) {
  const { tierConfig, formatPackagePrice } = useGeoPricing();
  const bofuPrice = formatPackagePrice("growth-marketing-campaigns");

  // Website Scope Mode
  const [websiteScope, setWebsiteScope] = useState<WebsiteMarketingScope>("ecommerce");

  // Selected BOFU module for live preview
  const [activeModule, setActiveModule] = useState<BofuPageModule>(BOFU_PAGE_MODULES[0]);

  // Selected Modules checklist
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    "checkout_flow",
    "countdown_timers",
    "offer_first_banners",
    "ugc_testimonials_wall",
    "price_comparison_matrix",
    "fomo_scarcity_notifiers",
    "freebie_lead_magnets"
  ]);

  // Toggle module selection
  const toggleSelectModule = (id: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Trigger Booking with clean details
  const handleTriggerBooking = () => {
    const scopeLabels: Record<WebsiteMarketingScope, string> = {
      ecommerce: "E-Commerce Website & Checkout",
      single_product: "Singular Hero Product Drop Page",
      personal_brand: "Personal Brand & Authority Website"
    };

    const selectedTitles = BOFU_PAGE_MODULES
      .filter((item) => selectedModuleIds.includes(item.id))
      .map((item) => item.title);

    onBookMarketingPackage({
      packageName: "BOFU Website Marketing & Sources Management Package",
      businessModel: scopeLabels[websiteScope],
      selectedItems: [
        ...selectedTitles,
        "Multi-Channel UTM Attribution Engine",
        "Meta Pixel / CAPI & GA4 Telemetry"
      ],
      priceAmount: bofuPrice.amount,
      currencyCode: bofuPrice.currency,
      currencySymbol: bofuPrice.symbol,
      formattedPrice: `${bofuPrice.symbol}${bofuPrice.formatted}`,
      priceInr: tierConfig.currencyCode === "INR" ? bofuPrice.amount : undefined,
      priceUsd: tierConfig.currencyCode === "USD" ? bofuPrice.amount : undefined,
      timeline: "2–3 Weeks"
    });
  };

  return (
    <div className="w-full space-y-10">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO & POSITIONING (WEBSITE BOFU ENGINE)                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-400/40 bg-gradient-to-br from-white/95 via-emerald-50/70 to-sky-50/90 p-8 sm:p-12 shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-900">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Website-Only Marketing Package
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                All 9 BOFU Pages & Modules
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              The Website BOFU Engine: <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 bg-clip-text text-transparent">
                Where Cold Clicks Turn Into Cash
              </span>
            </h2>

            <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
              External ads and social media get you the traffic — but <strong>your website is the Bottom of Funnel (BOFU) terminal</strong> where decisions are made. 
              We build high-converting checkout flows, countdowns, offer banners, and on-site source tracking so every visitor converts.
            </p>
          </div>

          {/* Pricing & Booking Card */}
          <div className="flex flex-col items-center sm:items-end justify-center rounded-3xl border border-emerald-300/80 bg-white/90 p-6 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between w-full mb-2 gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                BOFU Website Package
              </span>
              <MarketRegionSelector compact />
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-950">
                {bofuPrice.symbol}{bofuPrice.formatted}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {bofuPrice.currency}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full mb-3 flex items-center gap-1.5">
              <span>{tierConfig.flag}</span>
              <span>{tierConfig.countryName} Local Market Rate</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 text-center sm:text-right">
              All 9 BOFU modules + multi-channel UTM source tracker & pixel telemetry
            </p>
            <button
              type="button"
              onClick={handleTriggerBooking}
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 px-6 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              🚀 Book BOFU Website Engine
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. THREE WEBSITE TYPES (WIDE SCOPE)                           */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-10 border-t border-emerald-200/80 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Adaptable For Any Business Type:
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Select Your Website Focus
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
              Current: {websiteScope === "ecommerce" ? "E-Commerce Store Website" : websiteScope === "single_product" ? "Singular Hero Product Launch Page" : "Personal Brand & Authority Website"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* E-Commerce Website */}
            <button
              type="button"
              onClick={() => setWebsiteScope("ecommerce")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                websiteScope === "ecommerce"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/80 text-slate-800 border-emerald-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">🛒</span>
              <div>
                <div className="text-sm font-bold">E-Commerce Website</div>
                <div className={`text-xs ${websiteScope === "ecommerce" ? "text-slate-300" : "text-slate-500"}`}>
                  Multi-product catalog, slide-over cart, checkout upsells & order tracking
                </div>
              </div>
            </button>

            {/* Singular Hero Product Drop Page */}
            <button
              type="button"
              onClick={() => setWebsiteScope("single_product")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                websiteScope === "single_product"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/80 text-slate-800 border-emerald-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">📦</span>
              <div>
                <div className="text-sm font-bold">Singular Hero Product</div>
                <div className={`text-xs ${websiteScope === "single_product" ? "text-slate-300" : "text-slate-500"}`}>
                  Dedicated pre-order landing page, 360 viewer & 1-page checkout
                </div>
              </div>
            </button>

            {/* Personal Brand & High-Ticket Authority Site */}
            <button
              type="button"
              onClick={() => setWebsiteScope("personal_brand")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                websiteScope === "personal_brand"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/80 text-slate-800 border-emerald-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">🎙️</span>
              <div>
                <div className="text-sm font-bold">Personal Brand Site</div>
                <div className={`text-xs ${websiteScope === "personal_brand" ? "text-slate-300" : "text-slate-500"}`}>
                  High-ticket client application, VIP booking calendar & lead magnet funnels
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. THE 9 BOFU WEBSITE PAGES & MODULES GRID                    */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                On-Site Conversion Components
              </span>
              <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                All 9 BOFU Deliverables
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-950">
              The 9 On-Website BOFU Pages & Modules
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>{selectedModuleIds.length} of 9 modules selected for your build</span>
          </div>
        </div>

        {/* 9 BOFU Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOFU_PAGE_MODULES.map((mod) => {
            const isSelected = selectedModuleIds.includes(mod.id);
            const isActive = activeModule.id === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => setActiveModule(mod)}
                className={`flex flex-col justify-between rounded-2xl p-5 border transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? "bg-slate-950 text-white border-slate-900 shadow-lg ring-2 ring-emerald-500 scale-[1.01]"
                    : isSelected
                    ? "bg-white text-slate-900 border-emerald-300 hover:bg-emerald-50/50"
                    : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{mod.icon}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-emerald-500 text-black font-black"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold mb-1">{mod.title}</h4>
                  <p className={`text-xs leading-relaxed mb-3 ${isActive ? "text-slate-300" : "text-slate-600"}`}>
                    {mod.shortDesc}
                  </p>

                  <div className={`text-[11px] p-2.5 rounded-xl border mb-4 ${
                    isActive ? "bg-slate-900 border-slate-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-950 font-medium"
                  }`}>
                    <strong>Website Role:</strong> {mod.websiteScope[websiteScope]}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <span className={`text-[10px] font-mono ${isActive ? "text-slate-400" : "text-slate-500"}`}>
                    {mod.conversionMetric}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectModule(mod.id);
                    }}
                    className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {isSelected ? "✓ Included" : "+ Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. LIVE INTERACTIVE COMPONENT PREVIEW INSPECTOR               */}
      {/* ------------------------------------------------------------- */}
      <MarketingFunnelInspector
        activeModule={activeModule}
        websiteScope={websiteScope}
        selectedModuleIds={selectedModuleIds}
        onToggleSelectModule={toggleSelectModule}
      />

      {/* ------------------------------------------------------------- */}
      {/* 5. SOURCES MANAGEMENT & UTM ATTRIBUTION ENGINE                */}
      {/* ------------------------------------------------------------- */}
      <UtmAttributionEngine />

      {/* ------------------------------------------------------------- */}
      {/* 6. FINAL SUMMARY & DIRECT BOOKING ACTION                      */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-[2.2rem] border border-emerald-400/40 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 p-8 sm:p-12 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 border border-emerald-700/60 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <span>💎 Ready for Launch</span>
              <span>•</span>
              <span>{selectedModuleIds.length} BOFU Modules Selected</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Launch Your High-Converting BOFU Website Engine
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We design, code, and deploy the entire Bottom-of-Funnel architecture directly on your website: 1-click checkouts, urgency countdowns, offer banners, 4K galleries, price comparisons, and multi-source UTM attribution.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 font-medium">Included Standard:</span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                All 9 BOFU Pages & Modules
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                1-Click Express Checkout
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                UTM & Sources Tracking
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                Meta CAPI & GA4 Telemetry
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
              Package Investment ({tierConfig.countryName})
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white my-1">
              {bofuPrice.symbol}{bofuPrice.formatted}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mb-5">
              {bofuPrice.currency} • Turnaround: 2–3 Weeks • 50% Milestone Deposit
            </div>

            <button
              type="button"
              onClick={handleTriggerBooking}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              🚀 Book BOFU Website Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
