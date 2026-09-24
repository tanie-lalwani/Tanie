"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FEATURE_CATEGORIES,
  ALL_FEATURES_MAP,
  INDUSTRY_PRESETS,
  calculateQuoteSummary,
  type CatalogFeature,
  type IndustryPreset,
  type CalculationResult
} from "@/data/featureCatalogDatabase";
import {
  saveClientCustomQuote,
  getClientCustomQuotes,
  deleteClientCustomQuote,
  type ClientCustomQuote
} from "@/lib/portalServices";
import { useAuth } from "@/hooks/useAuth";
import { useGeoPricing } from "@/context/GeoPricingContext";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

interface CustomScopeCalculatorProps {
  onProceedWithScope?: (quoteData: {
    projectName: string;
    industry: string;
    selectedFeatureNames: string[];
    selectedItems: Record<string, number>;
    finalTotalInr: number;
    finalTotalUsd: number;
    currency: "INR" | "USD";
  }) => void;
  currency?: "INR" | "USD";
  onCurrencyChange?: (c: "INR" | "USD") => void;
}

export default function CustomScopeCalculator({
  onProceedWithScope,
  currency = "INR",
  onCurrencyChange
}: CustomScopeCalculatorProps) {
  const { user, isAuthenticated, signInWithPassword, signUp } = useAuth();
  const { tierConfig } = useGeoPricing();

  // Active currency
  const [activeCurrency, setActiveCurrency] = useState<"INR" | "USD">(currency);
  
  useEffect(() => {
    if (tierConfig.currencyCode === "INR") {
      setActiveCurrency("INR");
      onCurrencyChange?.("INR");
    } else {
      setActiveCurrency("USD");
      onCurrencyChange?.("USD");
    }
  }, [tierConfig]);

  // Selected Industry Template
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryPreset>(INDUSTRY_PRESETS[0]);

  // Project Name
  const [projectName, setProjectName] = useState<string>("My Custom Business Website");

  // Selected features state: featureId -> quantity (0 = not selected)
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    INDUSTRY_PRESETS[0].defaultFeatureIds.forEach((id) => {
      const feat = ALL_FEATURES_MAP[id];
      initial[id] = feat?.defaultQty || 1;
    });
    return initial;
  });

  // Category collapse states (all expanded by default or first 3)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    FEATURE_CATEGORIES.forEach((cat, idx) => {
      state[cat.id] = idx < 3; // First 3 expanded by default
    });
    return state;
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>("all");

  // Client Saved Quotes Drawer / Modal
  const [savedQuotes, setSavedQuotes] = useState<ClientCustomQuote[]>([]);
  const [showSavedQuotesModal, setShowSavedQuotesModal] = useState(false);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auth Modal for saving quote if guest
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Base price overrides
  const basePriceInr = selectedIndustry.recommendedBasePriceInr;
  const basePriceUsd = selectedIndustry.recommendedBasePriceUsd;
  const discountPercent = selectedIndustry.discountPercent;

  // Real-time calculation summary
  const quoteSummary: CalculationResult = useMemo(() => {
    return calculateQuoteSummary(
      selectedItems,
      basePriceInr,
      basePriceUsd,
      discountPercent
    );
  }, [selectedItems, basePriceInr, basePriceUsd, discountPercent]);

  // Load saved quotes when user is authenticated
  useEffect(() => {
    async function loadUserQuotes() {
      if (user?.email) {
        setIsLoadingQuotes(true);
        const quotes = await getClientCustomQuotes(user.email);
        setSavedQuotes(quotes);
        setIsLoadingQuotes(false);
      }
    }
    loadUserQuotes();
  }, [user]);

  // Switch Industry Preset
  const handleApplyPreset = (preset: IndustryPreset) => {
    setSelectedIndustry(preset);
    setProjectName(`${preset.name} Project`);
    const newSelected: Record<string, number> = {};
    preset.defaultFeatureIds.forEach((id) => {
      const feat = ALL_FEATURES_MAP[id];
      newSelected[id] = feat?.defaultQty || 1;
    });
    setSelectedItems(newSelected);

    // Expand relevant categories
    const relevantCats: Record<string, boolean> = {};
    preset.defaultFeatureIds.forEach((id) => {
      const feat = ALL_FEATURES_MAP[id];
      if (feat) relevantCats[feat.categoryId] = true;
    });
    setExpandedCategories((prev) => ({ ...prev, ...relevantCats }));
  };

  // Toggle single feature
  const handleToggleFeature = (feature: CatalogFeature) => {
    setSelectedItems((prev) => {
      const current = prev[feature.id] || 0;
      if (current > 0) {
        const next = { ...prev };
        delete next[feature.id];
        return next;
      } else {
        return {
          ...prev,
          [feature.id]: feature.defaultQty || 1
        };
      }
    });
  };

  // Adjust quantity for unit-based features
  const handleQuantityChange = (feature: CatalogFeature, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[feature.id] || 0;
      const min = feature.minQty || 1;
      const max = feature.maxQty || 100;
      const nextQty = Math.max(min, Math.min(max, current + delta));
      return {
        ...prev,
        [feature.id]: nextQty
      };
    });
  };

  // Toggle category expansion
  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Expand / Collapse All
  const handleToggleAllCategories = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    FEATURE_CATEGORIES.forEach((c) => {
      next[c.id] = expand;
    });
    setExpandedCategories(next);
  };

  // Select all features in a category
  const handleSelectAllInCategory = (cat: typeof FEATURE_CATEGORIES[0]) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      cat.features.forEach((f) => {
        next[f.id] = next[f.id] || f.defaultQty || 1;
      });
      return next;
    });
  };

  // Clear all features in a category
  const handleClearCategory = (cat: typeof FEATURE_CATEGORIES[0]) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      cat.features.forEach((f) => {
        delete next[f.id];
      });
      return next;
    });
  };

  // Filtered categories based on search and category tab
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FEATURE_CATEGORIES.map((cat) => {
      if (selectedFilterCategory !== "all" && cat.id !== selectedFilterCategory) {
        return null;
      }
      if (!q) return cat;

      const matchingFeatures = cat.features.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q)
      );

      if (matchingFeatures.length === 0 && !cat.name.toLowerCase().includes(q)) {
        return null;
      }

      return {
        ...cat,
        features: matchingFeatures.length > 0 ? matchingFeatures : cat.features
      };
    }).filter(Boolean) as typeof FEATURE_CATEGORIES;
  }, [searchQuery, selectedFilterCategory]);

  // Save Quote Handler
  const handleSaveQuote = async () => {
    if (!isAuthenticated || !user?.email) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveClientCustomQuote({
        client_id: user.id,
        client_email: user.email,
        client_name: user.user_metadata?.full_name || user.email.split("@")[0],
        project_name: projectName || `${selectedIndustry.name} Scope`,
        industry_template: selectedIndustry.id,
        selected_features: selectedItems,
        base_price_inr: quoteSummary.basePriceInr,
        base_price_usd: quoteSummary.basePriceUsd,
        itemized_total_inr: quoteSummary.itemizedTotalInr,
        itemized_total_usd: quoteSummary.itemizedTotalUsd,
        discount_percent: quoteSummary.discountPercent,
        discount_amount_inr: quoteSummary.discountAmountInr,
        discount_amount_usd: quoteSummary.discountAmountUsd,
        final_total_inr: quoteSummary.finalTotalInr,
        final_total_usd: quoteSummary.finalTotalUsd,
        currency: activeCurrency,
        status: "draft"
      });

      setSaveSuccessMessage(`Quote "${projectName}" saved successfully to your portal!`);
      const updated = await getClientCustomQuotes(user.email);
      setSavedQuotes(updated);
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (e) {
      console.error("Failed to save custom quote:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Load a previously saved quote into calculator
  const handleLoadSavedQuote = (quote: ClientCustomQuote) => {
    setProjectName(quote.project_name);
    setSelectedItems(quote.selected_features || {});
    const preset = INDUSTRY_PRESETS.find((p) => p.id === quote.industry_template) || INDUSTRY_PRESETS[0];
    setSelectedIndustry(preset);
    setShowSavedQuotesModal(false);
    setSaveSuccessMessage(`Loaded "${quote.project_name}" into calculator!`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  // Delete saved quote
  const handleDeleteSavedQuote = async (quoteId: string) => {
    await deleteClientCustomQuote(quoteId);
    if (user?.email) {
      const updated = await getClientCustomQuotes(user.email);
      setSavedQuotes(updated);
    }
  };

  // Share / Copy quote to clipboard or WhatsApp
  const handleShareWhatsApp = () => {
    const selectedNames = Object.keys(selectedItems)
      .filter((id) => (selectedItems[id] || 0) > 0)
      .map((id) => {
        const feat = ALL_FEATURES_MAP[id];
        const qty = selectedItems[id];
        return qty > 1 ? `• ${feat?.name} (${qty}x)` : `• ${feat?.name}`;
      })
      .slice(0, 20);

    const text = `Hi Tanie! I just configured my custom website scope on your website:
🏢 *Project:* ${projectName} (${selectedIndustry.name})
💰 *Estimated Total:* ${activeCurrency === "INR" ? `₹${quoteSummary.finalTotalInr.toLocaleString()}` : `$${quoteSummary.finalTotalUsd.toLocaleString()}`} (includes ${quoteSummary.discountPercent}% package bundle discount)
✨ *Selected Features (${quoteSummary.totalSelectedItemsCount}):*
${selectedNames.join("\n")}
${selectedNames.length >= 20 ? "...and more" : ""}

I'd love to discuss starting this project with you!`;

    window.open(`https://wa.me/919326048128?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Proceed with current scope into Project Intake
  const handleProceed = () => {
    const selectedFeatureNames = Object.keys(selectedItems)
      .filter((id) => (selectedItems[id] || 0) > 0)
      .map((id) => {
        const feat = ALL_FEATURES_MAP[id];
        const qty = selectedItems[id];
        return qty > 1 ? `${feat?.name} (${qty}x)` : `${feat?.name}`;
      });

    if (onProceedWithScope) {
      onProceedWithScope({
        projectName,
        industry: selectedIndustry.name,
        selectedFeatureNames,
        selectedItems,
        finalTotalInr: quoteSummary.finalTotalInr,
        finalTotalUsd: quoteSummary.finalTotalUsd,
        currency: activeCurrency
      });
    }
  };

  // Handle Quick Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === "signup") {
        const res = await signUp(authEmail, authPassword);
        if (res?.error) {
          setAuthError(res.error.message);
          return;
        }
      } else {
        const res = await signInWithPassword(authEmail, authPassword);
        if (res?.error) {
          setAuthError(res.error.message);
          return;
        }
      }
      setShowAuthModal(false);
      // Trigger save after login
      setTimeout(handleSaveQuote, 500);
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    }
  };

  return (
    <div className="w-full text-slate-100">
      {/* SUCCESS TOAST */}
      {saveSuccessMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#0a192f] text-white font-mono text-sm px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border border-sky-400/50 animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* TOP HERO & CONTROLS */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <span>⚡</span>
              <span>Granular Atomic Pricing Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white">
              Bespoke Website <span className="text-cyan-400 font-medium">Scope & Price Estimator</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Choose your industry baseline, toggle features from our 18 master categories, and receive transparent instant pricing with automatic package bundle discounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Auto-detected Market & Country Selector */}
            <MarketRegionSelector />

            {/* My Saved Quotes Button */}
            <button
              type="button"
              onClick={() => setShowSavedQuotesModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-2 transition-all shadow-md"
            >
              <span>📂</span>
              <span>Saved Quotes ({savedQuotes.length})</span>
            </button>
          </div>
        </div>

        {/* INDUSTRY PRESETS BAR */}
        <div className="mt-8">
          <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
            <span>1. Select Industry Preset (Loads Recommended Core Stack)</span>
            <span className="text-cyan-400 font-sans normal-case text-xs">
              {selectedIndustry.name} • {selectedIndustry.discountPercent}% Bundle Savings
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {INDUSTRY_PRESETS.map((preset) => {
              const isSelected = selectedIndustry.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                    isSelected
                      ? "bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="text-2xl mb-1.5 transform group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white line-clamp-1">
                      {preset.name.split("/")[0]}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                      {preset.discountPercent}% OFF
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE: CATEGORIES MATRIX (LEFT) + STICKY QUOTE SIDEBAR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT 8 COLS: SEARCH, FILTERS & 18 ACCORDIONS */}
        <div className="lg:col-span-8 space-y-6">
          {/* SEARCH & ACCORDION EXPAND TOGGLE */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 300+ features (e.g. WhatsApp, Cart, SEO, 3D)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleToggleAllCategories(true)}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Expand All
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={() => handleToggleAllCategories(false)}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* 18 CATEGORY ACCORDIONS */}
          <div className="space-y-4">
            {filteredCategories.map((cat) => {
              const isExpanded = expandedCategories[cat.id] ?? false;
              const selectedCount = cat.features.reduce(
                (sum, f) => sum + (selectedItems[f.id] ? 1 : 0),
                0
              );
              const catSubtotalInr = cat.features.reduce(
                (sum, f) => sum + (selectedItems[f.id] || 0) * f.priceInr,
                0
              );
              const catSubtotalUsd = cat.features.reduce(
                (sum, f) => sum + (selectedItems[f.id] || 0) * f.priceUsd,
                0
              );

              return (
                <div
                  key={cat.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    selectedCount > 0
                      ? "bg-slate-900/70 border-slate-700/80 shadow-lg"
                      : "bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60"
                  }`}
                >
                  {/* CATEGORY HEADER */}
                  <div
                    onClick={() => toggleCategoryExpand(cat.id)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none bg-slate-900/30 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-2xl w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                        {cat.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-medium text-white">
                            {cat.name}
                          </h3>
                          {selectedCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold">
                              {selectedCount} selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {selectedCount > 0 && (
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-mono font-semibold text-cyan-400">
                            {activeCurrency === "INR"
                              ? `+₹${catSubtotalInr.toLocaleString()}`
                              : `+$${catSubtotalUsd.toLocaleString()}`}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Category Subtotal
                          </div>
                        </div>
                      )}
                      <div
                        className={`text-slate-400 transition-transform duration-200 text-sm ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* EXPANDED FEATURES GRID */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
                      {/* Category Quick Batch Select */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-2 border-b border-slate-800/40">
                        <span>{cat.features.length} Features Available</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAllInCategory(cat);
                            }}
                            className="text-slate-400 hover:text-cyan-400 transition-colors"
                          >
                            + Select All
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearCategory(cat);
                            }}
                            className="text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* FEATURES GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                        {cat.features.map((feature) => {
                          const isSelected = (selectedItems[feature.id] || 0) > 0;
                          const currentQty = selectedItems[feature.id] || 0;
                          const hasQuantity = feature.priceType !== "flat";

                          return (
                            <div
                              key={feature.id}
                              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                                isSelected
                                  ? "bg-slate-900 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20"
                                  : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700/80"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Custom Checkbox */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeature(feature)}
                                  className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                    isSelected
                                      ? "bg-cyan-500 border-cyan-400 text-slate-950 font-bold text-xs"
                                      : "border-slate-700 bg-slate-900 hover:border-slate-500"
                                  }`}
                                >
                                  {isSelected && "✓"}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                      onClick={() => handleToggleFeature(feature)}
                                      className={`text-xs sm:text-sm font-medium cursor-pointer ${
                                        isSelected ? "text-white font-semibold" : "text-slate-200"
                                      }`}
                                    >
                                      {feature.name}
                                    </span>
                                    {feature.isPopular && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>

                              {/* PRICE & UNIT QUANTITY ROW */}
                              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                                <div className="text-xs font-mono font-semibold text-cyan-400">
                                  {activeCurrency === "INR"
                                    ? `₹${feature.priceInr.toLocaleString()}`
                                    : `$${feature.priceUsd.toLocaleString()}`}
                                  {feature.unitLabel && (
                                    <span className="text-[10px] text-slate-500 font-normal ml-1">
                                      /{feature.unitLabel}
                                    </span>
                                  )}
                                </div>

                                {/* Quantity Selector for Unit Features */}
                                {hasQuantity && isSelected && (
                                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg p-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(feature, -1)}
                                      className="w-5 h-5 rounded flex items-center justify-center text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                                    >
                                      -
                                    </button>
                                    <span className="text-xs font-mono px-1 font-bold text-white min-w-[20px] text-center">
                                      {currentQty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(feature, 1)}
                                      className="w-5 h-5 rounded flex items-center justify-center text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
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

        {/* RIGHT 4 COLS: STICKY REAL-TIME QUOTATION SUMMARY */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-2xl shadow-2xl space-y-6 ring-1 ring-white/5">
            {/* PROJECT NAME INPUT */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="e.g. Luxury Salon Brand Portal"
              />
            </div>

            {/* LIVE BREAKDOWN CARD */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Cost Breakdown
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>🏛️</span>
                  <span>Base Website Architecture</span>
                </span>
                <span className="font-mono font-medium text-white">
                  {activeCurrency === "INR"
                    ? `₹${quoteSummary.basePriceInr.toLocaleString()}`
                    : `$${quoteSummary.basePriceUsd.toLocaleString()}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>🧩</span>
                  <span>{quoteSummary.totalSelectedItemsCount} Selected Modules</span>
                </span>
                <span className="font-mono font-medium text-white">
                  {activeCurrency === "INR"
                    ? `+₹${quoteSummary.itemizedTotalInr.toLocaleString()}`
                    : `+$${quoteSummary.itemizedTotalUsd.toLocaleString()}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                <span>Standard Value Subtotal</span>
                <span className="font-mono">
                  {activeCurrency === "INR"
                    ? `₹${quoteSummary.subtotalInr.toLocaleString()}`
                    : `$${quoteSummary.subtotalUsd.toLocaleString()}`}
                </span>
              </div>

              {/* PACKAGE BUNDLE DISCOUNT CALLOUT */}
              {quoteSummary.discountPercent > 0 && (
                <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-between text-xs animate-pulse">
                  <div className="flex items-center gap-1.5 text-sky-400 font-medium">
                    <span>🎉</span>
                    <span>{quoteSummary.discountPercent}% Package Discount</span>
                  </div>
                  <div className="font-mono font-bold text-sky-300">
                    {activeCurrency === "INR"
                      ? `-₹${quoteSummary.discountAmountInr.toLocaleString()}`
                      : `-$${quoteSummary.discountAmountUsd.toLocaleString()}`}
                  </div>
                </div>
              )}
            </div>

            {/* FINAL TOTAL HERO */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-cyan-500/30 text-center">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                Total Estimated Investment
              </div>
              <div className="text-3xl sm:text-4xl font-light tracking-tight text-white font-mono">
                {activeCurrency === "INR" ? (
                  <>
                    <span className="text-cyan-400 font-normal">₹</span>
                    {quoteSummary.finalTotalInr.toLocaleString()}
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400 font-normal">$</span>
                    {quoteSummary.finalTotalUsd.toLocaleString()}
                  </>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Estimated Turnaround: <span className="text-slate-200 font-medium">2–4 Weeks</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5">
              {/* Primary Action: Proceed with Scope */}
              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Proceed with this Scope →
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSaveQuote}
                  disabled={isSaving}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>💾</span>
                  <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-700/50 text-xs font-mono text-sky-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* GUARANTEE FOOTNOTE */}
            <div className="text-[11px] text-slate-500 text-center leading-relaxed font-sans">
              🔒 Fixed milestone billing • 100% transparent itemized scope • No hidden charges.
            </div>
          </div>
        </div>
      </div>

      {/* SAVED QUOTES DRAWER / MODAL */}
      {showSavedQuotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-light text-white">Your Saved Quotations</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Draft quotes saved to your browser and client portal account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSavedQuotesModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {isLoadingQuotes ? (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                Loading saved quotations...
              </div>
            ) : savedQuotes.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-sans space-y-2">
                <div className="text-4xl">📂</div>
                <div className="text-sm text-slate-300">No saved quotations found</div>
                <p className="text-xs text-slate-500">
                  Configure your desired features and click &quot;Save Draft&quot; to store quotations here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white">{quote.project_name}</h4>
                      <div className="text-xs text-cyan-400 font-mono mt-0.5">
                        {quote.currency === "INR"
                          ? `₹${quote.final_total_inr.toLocaleString()}`
                          : `$${quote.final_total_usd.toLocaleString()}`}
                        <span className="text-slate-500 font-normal ml-2">
                          ({Object.keys(quote.selected_features || {}).length} features)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        Saved on {new Date(quote.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadSavedQuote(quote)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-semibold hover:bg-cyan-400 transition-all"
                      >
                        Load Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedQuote(quote.id)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Quote"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK AUTH MODAL FOR SAVING QUOTE */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-light text-white">
                  {authMode === "signup" ? "Create Account to Save Quote" : "Sign In to Save Quote"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Save quotes to your Client Dashboard and track project milestones.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="client@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold font-mono text-xs uppercase tracking-wider transition-all"
              >
                {authMode === "signup" ? "Create Account & Save" : "Sign In & Save"}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              {authMode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Need an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    Create One
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
