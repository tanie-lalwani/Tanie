"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MARKET_TIERS, type MarketPricingTier, resolveMarketTier } from "@/lib/geoPricing";

interface GeoPricingContextValue {
  marketTier: string;
  tierConfig: MarketPricingTier;
  setMarketTier: (tier: string) => void;
  detectedCountry: string;
  isAutoDetected: boolean;
  formatPackagePrice: (packageId: string) => { amount: number; formatted: string; symbol: string; currency: string };
  formatBundlePrice: (bundleId: string) => { amount: number; formatted: string; symbol: string; currency: string };
  formatAddonPrice: (addonId: string) => { amount: number; formatted: string; symbol: string; currency: string };
  allMarkets: MarketPricingTier[];
}

const GeoPricingContext = createContext<GeoPricingContextValue | null>(null);

const STORAGE_KEY = "tanie_market_tier_override";

export function GeoPricingProvider({ children }: { children: React.ReactNode }) {
  const [marketTier, setMarketTierState] = useState<string>("IN");
  const [detectedCountry, setDetectedCountry] = useState<string>("IN");
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);

  // Initialize geo-detection and localStorage check
  useEffect(() => {
    // 1. Check if user already manually selected a market previously
    let savedOverride: string | null = null;
    try {
      savedOverride = localStorage.getItem(STORAGE_KEY);
    } catch (_) {}

    if (savedOverride && MARKET_TIERS[savedOverride]) {
      setMarketTierState(savedOverride);
      setIsAutoDetected(false);
    }

    // 2. Fetch detected country from server
    async function detectGeo() {
      try {
        const res = await fetch("/api/geo");
        if (res.ok) {
          const data = await res.json();
          if (data?.marketTier) {
            setDetectedCountry(data.detectedCountry || "IN");
            // If user did not manually override, apply the detected market
            if (!savedOverride) {
              setMarketTierState(data.marketTier);
              setIsAutoDetected(true);
            }
          }
        }
      } catch (e) {
        console.warn("Geo detection failed, defaulting to IN:", e);
      }
    }

    detectGeo();
  }, []);

  const handleSetMarketTier = (tier: string) => {
    const resolved = resolveMarketTier(tier);
    setMarketTierState(resolved);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch (_) {}
  };

  const currentConfig = MARKET_TIERS[marketTier] || MARKET_TIERS.IN;

  const formatPackagePrice = (packageId: string) => {
    const normalizedId =
      packageId === "landing" ? "luxury-landing-sprint"
      : packageId === "ecommerce" ? "sales-website-engine"
      : packageId === "saas" ? "fullstack-saas-app"
      : packageId === "business_automation" ? "portals-dashboards-suite"
      : packageId === "custom_app" ? "custom-bespoke-build"
      : packageId;

    const amount =
      currentConfig.packages[normalizedId as keyof typeof currentConfig.packages] ??
      currentConfig.packages[packageId as keyof typeof currentConfig.packages] ??
      currentConfig.bundles[packageId] ??
      currentConfig.packages["luxury-landing-sprint"] ??
      4999;
    return {
      amount,
      formatted: `${currentConfig.currencySymbol}${amount.toLocaleString()}`,
      symbol: currentConfig.currencySymbol,
      currency: currentConfig.currencyCode
    };
  };

  const formatBundlePrice = (bundleId: string) => {
    const normalizedId =
      bundleId === "landing" ? "essential_core"
      : bundleId === "ecommerce" ? "sales_engine"
      : bundleId === "saas" ? "fullstack_saas"
      : bundleId === "business_automation" ? "portals_dashboards"
      : bundleId;

    const amount =
      currentConfig.bundles[normalizedId] ??
      currentConfig.bundles[bundleId] ??
      currentConfig.packages[normalizedId as keyof typeof currentConfig.packages] ??
      currentConfig.addons[bundleId] ??
      500;
    return {
      amount,
      formatted: `${currentConfig.currencySymbol}${amount.toLocaleString()}`,
      symbol: currentConfig.currencySymbol,
      currency: currentConfig.currencyCode
    };
  };

  const formatAddonPrice = (addonId: string) => {
    const amount =
      currentConfig.addons[addonId] ??
      currentConfig.bundles[addonId] ??
      currentConfig.packages[addonId as keyof typeof currentConfig.packages] ??
      (currentConfig.currencyCode === "INR" ? 4999 : 99);
    return {
      amount,
      formatted: `${currentConfig.currencySymbol}${amount.toLocaleString()}`,
      symbol: currentConfig.currencySymbol,
      currency: currentConfig.currencyCode
    };
  };

  const allMarkets = Object.values(MARKET_TIERS);

  return (
    <GeoPricingContext.Provider
      value={{
        marketTier,
        tierConfig: currentConfig,
        setMarketTier: handleSetMarketTier,
        detectedCountry,
        isAutoDetected,
        formatPackagePrice,
        formatBundlePrice,
        formatAddonPrice,
        allMarkets
      }}
    >
      {children}
    </GeoPricingContext.Provider>
  );
}

export function useGeoPricing() {
  const ctx = useContext(GeoPricingContext);
  if (!ctx) {
    // Graceful fallback if used outside provider
    const fallbackTier = MARKET_TIERS.IN;
    return {
      marketTier: "IN",
      tierConfig: fallbackTier,
      setMarketTier: () => {},
      detectedCountry: "IN",
      isAutoDetected: true,
      formatPackagePrice: (packageId: string) => ({
        amount: fallbackTier.packages[packageId as keyof typeof fallbackTier.packages] || 1999,
        formatted: `₹${(fallbackTier.packages[packageId as keyof typeof fallbackTier.packages] || 1999).toLocaleString()}`,
        symbol: "₹",
        currency: "INR"
      }),
      formatBundlePrice: (bundleId: string) => ({
        amount: fallbackTier.bundles[bundleId] || 500,
        formatted: `₹${(fallbackTier.bundles[bundleId] || 500).toLocaleString()}`,
        symbol: "₹",
        currency: "INR"
      }),
      formatAddonPrice: (addonId: string) => ({
        amount: fallbackTier.addons[addonId] || 299,
        formatted: `₹${(fallbackTier.addons[addonId] || 299).toLocaleString()}`,
        symbol: "₹",
        currency: "INR"
      }),
      allMarkets: Object.values(MARKET_TIERS)
    };
  }
  return ctx;
}
