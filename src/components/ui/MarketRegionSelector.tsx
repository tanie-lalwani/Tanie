"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGeoPricing } from "@/context/GeoPricingContext";

interface MarketRegionSelectorProps {
  className?: string;
  compact?: boolean;
}

export default function MarketRegionSelector({
  className = "",
  compact = false
}: MarketRegionSelectorProps) {
  const { marketTier, tierConfig, setMarketTier, isAutoDetected, allMarkets } = useGeoPricing();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full border border-sky-300/80 bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-white hover:border-sky-400 hover:shadow-md cursor-pointer ${
          compact ? "text-[11px] py-1 px-2.5" : ""
        }`}
        title="Change Country & Market Pricing"
      >
        <span className="text-base leading-none">{tierConfig.flag}</span>
        <span className="font-semibold text-slate-700">
          {compact ? tierConfig.currencyCode : `${tierConfig.countryName} (${tierConfig.currencySymbol}${tierConfig.currencyCode})`}
        </span>

        {isAutoDetected && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Auto
          </span>
        )}

        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-sky-200 bg-white/95 p-2 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-sky-100 mb-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
              Country & Market Pricing
            </p>
            <p className="text-[11px] text-slate-500">
              Pricing is calibrated specifically for each country&apos;s local market.
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1">
            {allMarkets.map((tier) => {
              const isSelected = tier.countryCode === marketTier;
              return (
                <button
                  key={tier.countryCode}
                  type="button"
                  onClick={() => {
                    setMarketTier(tier.countryCode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? "bg-[#0a192f] text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-sky-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{tier.flag}</span>
                    <div>
                      <div className="leading-tight">{tier.countryName}</div>
                      <div className={`text-[10px] ${isSelected ? "text-sky-200" : "text-slate-400"}`}>
                        Base Sprint: {tier.currencySymbol}{tier.packages["luxury-landing-sprint"].toLocaleString()} {tier.currencyCode}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-2 border-t border-sky-100 px-3 py-1 text-[10px] text-slate-400 text-center">
            Auto-detected via your IP address
          </div>
        </div>
      )}
    </div>
  );
}
