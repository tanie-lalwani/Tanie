"use client";

import React, { useState, useRef, useEffect } from "react";
import { useGeoPricing } from "@/context/GeoPricingContext";
import { MARKET_TIERS, resolveMarketTier } from "@/lib/geoPricing";

interface MarketRegionSelectorProps {
  className?: string;
  compact?: boolean;
}

export default function MarketRegionSelector({
  className = "",
  compact = false
}: MarketRegionSelectorProps) {
  const { marketTier, tierConfig, setMarketTier, detectedCountry } = useGeoPricing();
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

  // 1. Identify user's detected country tier and the standard USD tier
  const detectedTierCode = resolveMarketTier(detectedCountry || "IN");
  const localTier = MARKET_TIERS[detectedTierCode] || MARKET_TIERS.IN;
  const usTier = MARKET_TIERS.US;

  // 2. Is user detected in the USA?
  const isUsa = detectedTierCode === "US" || localTier.countryCode === "US";

  // For USA visitors: Show standard USD
  if (isUsa) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border border-sky-300/80 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 ${className}`}
      >
        <span className="text-sm leading-none">🇺🇸</span>
        <span>United States ($USD)</span>
      </div>
    );
  }

  // For international visitors: Show local country & USD
  const allowedMarkets = [localTier, usTier];

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full border border-sky-300/80 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 transition hover:bg-white hover:border-sky-400 cursor-pointer ${
          compact ? "text-[11px] py-0.5 px-2" : ""
        }`}
      >
        <span className="text-sm leading-none">{tierConfig.flag}</span>
        <span>
          {tierConfig.countryName} ({tierConfig.currencySymbol}{tierConfig.currencyCode})
        </span>

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

      {/* Dropdown Menu (Only the two options, no meta text) */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-52 origin-top rounded-xl border border-sky-200 bg-white p-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-0.5">
            {allowedMarkets.map((tier) => {
              const isSelected = tier.countryCode === marketTier;
              return (
                <button
                  key={tier.countryCode}
                  type="button"
                  onClick={() => {
                    setMarketTier(tier.countryCode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? "bg-[#0a192f] text-white font-bold"
                      : "text-slate-700 hover:bg-sky-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{tier.flag}</span>
                    <span>{tier.countryName} ({tier.currencySymbol}{tier.currencyCode})</span>
                  </div>

                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
