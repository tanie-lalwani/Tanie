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
import IndustryPresetsBar from "./calculator/IndustryPresetsBar";
import ScopeCategoryAccordionList from "./calculator/ScopeCategoryAccordionList";
import ScopeQuoteSidebar from "./calculator/ScopeQuoteSidebar";
import SavedQuotesModal from "./calculator/SavedQuotesModal";
import ScopeAuthModal from "./calculator/ScopeAuthModal";

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
        <IndustryPresetsBar
          selectedIndustry={selectedIndustry}
          onApplyPreset={handleApplyPreset}
        />
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
          <ScopeCategoryAccordionList
            categories={filteredCategories}
            expandedCategories={expandedCategories}
            onToggleCategoryExpand={toggleCategoryExpand}
            selectedItems={selectedItems}
            activeCurrency={activeCurrency}
            onSelectAllInCategory={handleSelectAllInCategory}
            onClearCategory={handleClearCategory}
            onToggleFeature={handleToggleFeature}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        {/* RIGHT 4 COLS: STICKY REAL-TIME QUOTATION SUMMARY */}
        <ScopeQuoteSidebar
          projectName={projectName}
          setProjectName={setProjectName}
          activeCurrency={activeCurrency}
          quoteSummary={quoteSummary}
          isSaving={isSaving}
          onProceed={handleProceed}
          onSaveQuote={handleSaveQuote}
          onShareWhatsApp={handleShareWhatsApp}
        />
      </div>

      {/* SAVED QUOTES DRAWER / MODAL */}
      <SavedQuotesModal
        isOpen={showSavedQuotesModal}
        onClose={() => setShowSavedQuotesModal(false)}
        isLoading={isLoadingQuotes}
        savedQuotes={savedQuotes}
        onLoadQuote={handleLoadSavedQuote}
        onDeleteQuote={handleDeleteSavedQuote}
      />

      {/* QUICK AUTH MODAL FOR SAVING QUOTE */}
      <ScopeAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authError={authError}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
