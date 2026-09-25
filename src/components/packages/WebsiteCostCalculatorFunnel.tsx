"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { packagesTranslations } from "@/data/packagesTranslations";
import { saveClientCustomQuote } from "@/lib/portalServices";
import { getSavedLeadProfile, saveLeadProfile } from "@/features/lead-capture/lib/cookieHelper";
import { useGeoPricing } from "@/context/GeoPricingContext";
import CostCalculatorStepResult from "./CostCalculatorStepResult";

import {
  type FeatureBundle,
  FEATURE_BUNDLES,
  type WebsiteGoalOption,
  WEBSITE_GOALS,
  type IndustryOption,
  INDUSTRIES,
} from "./calculatorData";

export { FEATURE_BUNDLES, WEBSITE_GOALS, INDUSTRIES };

interface WebsiteCostCalculatorFunnelProps {
  onProceedWithCustomQuote?: (quoteData: any) => void;
  onStepChange?: (step: number) => void;
}

export default function WebsiteCostCalculatorFunnel({
  onProceedWithCustomQuote,
  onStepChange
}: WebsiteCostCalculatorFunnelProps) {
  const { user, isAuthenticated, loading: authLoading, signInWithPassword, signUp, signInWithGoogle } = useAuth();
  const { locale } = useLanguage();
  const t = packagesTranslations[locale] || packagesTranslations.en;
  const { marketTier, tierConfig, formatBundlePrice } = useGeoPricing();

  // ─── Funnel draft key ─────────────────────────────────────────────────────
  const DRAFT_KEY = "tanie_funnel_draft";
  const readDraft = () => {
    try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null"); } catch { return null; }
  };
  const _draft = typeof window !== "undefined" ? readDraft() : null;

  // Lead ID for deduplication across steps
  const [leadId, setLeadId] = useState<string>(_draft?.leadId || "");

  // Current Funnel Step
  const [currentStep, setCurrentStep] = useState<number>(_draft?.currentStep ?? 0);

  // User input states
  const [businessName, setBusinessName] = useState(_draft?.businessName || "");
  const [socialAccount, setSocialAccount] = useState(_draft?.socialAccount || "");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(_draft?.selectedGoals || []);
  const selectedGoal = selectedGoals[0] || "";

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => {
      const isAlreadySelected = prev.includes(goalId);
      const nextGoals = isAlreadySelected
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId];

      // Re-aggregate recommended modules from all active goals
      const merged = new Set<string>();
      if (nextGoals.length > 0) {
        merged.add("essential_core");
        nextGoals.forEach((gId) => {
          const g = WEBSITE_GOALS.find((item) => item.id === gId);
          g?.recommendedBundles.forEach((b) => merged.add(b));
        });
      }
      setSelectedBundles(Array.from(merged));

      return nextGoals;
    });
  };
  const [websiteType, setWebsiteType] = useState<"business" | "portfolio" | "ecommerce" | "saas">("business");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryOption>(INDUSTRIES[0]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>(_draft?.selectedBundles || []);
  const [budgetTier, setBudgetTier] = useState<string>(_draft?.budgetTier || "");
  const [timeline, setTimeline] = useState<string>(_draft?.timeline || "");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Auth unlock gate state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authError, setAuthError] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [localAuthenticated, setLocalAuthenticated] = useState(false);
  const isUnlocked = Boolean(user) || localAuthenticated;

  useEffect(() => {
    if (!user && !isAuthenticated) {
      setLocalAuthenticated(false);
    }
  }, [user, isAuthenticated]);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [expandedBundle, setExpandedBundle] = useState<string | null>(null);
  const [expandedMacro, setExpandedMacro] = useState<string | null>(null);

  const toggleBundleAccordion = (bundleId: string) => {
    setExpandedBundle((prev) => (prev === bundleId ? null : bundleId));
    setExpandedMacro(null); // Reset active macro when switching packages
  };

  const toggleMacroAccordion = (macroId: string) => {
    setExpandedMacro((prev) => (prev === macroId ? null : macroId));
  };

  const funnelContainerRef = useRef<HTMLDivElement>(null);

  // ─── Persist funnel draft to sessionStorage on every state change ─────────
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        leadId, currentStep, businessName, socialAccount,
        selectedGoals, selectedBundles, budgetTier, timeline
      }));
    } catch (_) {}
  }, [leadId, currentStep, businessName, socialAccount, selectedGoals, selectedBundles, budgetTier, timeline]);

  // ─── Prepopulate from cookies/localStorage on mount (only if no draft) ────
  useEffect(() => {
    if (_draft) return; // draft already hydrated above — don't overwrite
    const saved = getSavedLeadProfile();
    try {
      const savedSocial = localStorage.getItem("tanie_client_social");
      if (savedSocial && !socialAccount) {
        setSocialAccount(savedSocial);
      }
    } catch (_) {}
    if (saved.socialAccount && !socialAccount) {
      setSocialAccount(saved.socialAccount);
    }
    if (saved.businessName && !businessName && saved.businessName !== "Velvet & Silk Apparel") {
      setBusinessName(saved.businessName);
    }
    if (saved.name && !authName) {
      setAuthName(saved.name);
    }
    if (saved.email && !authEmail) {
      setAuthEmail(saved.email);
    }
    if (saved.leadId && !leadId) {
      setLeadId(saved.leadId);
    }
  }, []);

  // Background lead capture dispatcher
  const dispatchLeadCapture = async (data: Record<string, any>) => {
    try {
      let likedAestheticsList: string[] = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("tanie_liked_aesthetics");
          if (raw) likedAestheticsList = JSON.parse(raw);
        } catch {}
      }

      const goalsLabel =
        selectedGoals
          .map((id) => WEBSITE_GOALS.find((g) => g.id === id)?.title)
          .filter(Boolean)
          .join(" + ") || selectedGoal;

      const payload = {
        id: leadId || undefined,
        businessName: businessName.trim() || socialAccount.trim() || undefined,
        socialAccount: socialAccount.trim() || undefined,
        goal: goalsLabel,
        goals: selectedGoals,
        businessType: websiteType,
        industry: goalsLabel,
        selectedBundles,
        budgetTier,
        timeline,
        source: "hero_cost_calculator",
        likedAesthetics: likedAestheticsList.length > 0 ? likedAestheticsList : undefined,
        ...data
      };

      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success && json.leadId) {
        setLeadId(json.leadId);
        saveLeadProfile({ leadId: json.leadId });
      }
    } catch (e) {
      console.warn("Background lead capture error:", e);
    }
  };

  // Debounced typing capture for the hero input field
  useEffect(() => {
    const term = (socialAccount || businessName).trim();
    if (term.length < 2) return;

    const timer = setTimeout(() => {
      dispatchLeadCapture({
        businessName: term,
        socialAccount: socialAccount.trim() || undefined,
        step: "Hero Search Input",
        status: "typing"
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [socialAccount, businessName]);

  // Math Calculations (including realistic timeline acceleration surcharges)
  const calculation = useMemo(() => {
    let subtotalInr = 0;
    let subtotalUsd = 0;
    let subtotalMarket = 0;

    selectedBundles.forEach((bundleId) => {
      const bundle = FEATURE_BUNDLES.find((b) => b.id === bundleId);
      if (bundle) {
        subtotalInr += bundle.priceInr;
        subtotalUsd += bundle.priceUsd;
        const marketPrice = tierConfig.bundles[bundleId] ?? (tierConfig.currencyCode === "INR" ? bundle.priceInr : bundle.priceUsd);
        subtotalMarket += marketPrice;
      }
    });

    // Urgency surcharge computation
    let urgencyPercent = 0;
    let urgencyReason = "";

    const hasHeavyModule = selectedBundles.includes("fullstack_saas") || selectedBundles.includes("design_3d");
    const moduleCount = selectedBundles.length;

    if (timeline.includes("1 Month")) {
      if (hasHeavyModule || moduleCount >= 3) {
        urgencyPercent = 35; // Extreme rush for heavy multi-module scope
        urgencyReason = "Express Acceleration (+35% for compressing 4–8 mo scope into 1 mo sprint)";
      } else if (moduleCount >= 2) {
        urgencyPercent = 25; // Rush for 2 modules
        urgencyReason = "Sprint Acceleration (+25% for compressing 2–3 mo scope into 1 mo sprint)";
      } else {
        urgencyPercent = 0; // 1 month is standard for Base Foundation alone
      }
    } else if (timeline.includes("1–3 Months")) {
      if (selectedBundles.includes("fullstack_saas") || moduleCount >= 4) {
        urgencyPercent = 25; // High rush for SaaS / 4+ modules
        urgencyReason = "Fast-Track Acceleration (+25% for delivering 5–8 mo platform in 1–3 mos)";
      } else if (hasHeavyModule || moduleCount >= 3) {
        urgencyPercent = 15; // Moderate rush
        urgencyReason = "Priority Acceleration (+15% for delivering 3–5 mo scope in 1–3 mos)";
      } else {
        urgencyPercent = 0; // Standard for 1-2 modules
      }
    } else if (timeline.includes("3–5 Months")) {
      if (selectedBundles.includes("fullstack_saas") && moduleCount >= 3) {
        urgencyPercent = 15;
        urgencyReason = "Platform Fast-Track (+15% for delivering 6–8 mo ecosystem in 3–5 mos)";
      } else {
        urgencyPercent = 0;
      }
    } else {
      urgencyPercent = 0;
    }

    const urgencyAmountInr = Math.round((subtotalInr * urgencyPercent) / 100);
    const urgencyAmountUsd = Math.round((subtotalUsd * urgencyPercent) / 100);
    const urgencyAmountMarket = Math.round((subtotalMarket * urgencyPercent) / 100);

    const finalTotalInr = subtotalInr + urgencyAmountInr;
    const finalTotalUsd = subtotalUsd + urgencyAmountUsd;
    const finalTotalMarket = subtotalMarket + urgencyAmountMarket;

    return {
      subtotalInr,
      subtotalUsd,
      subtotalMarket,
      discountPercent: 0,
      discountAmountInr: 0,
      discountAmountUsd: 0,
      discountAmountMarket: 0,
      urgencyPercent,
      urgencyReason,
      urgencyAmountInr,
      urgencyAmountUsd,
      urgencyAmountMarket,
      finalTotalInr,
      finalTotalUsd,
      finalTotalMarket,
      bundleCount: selectedBundles.length,
      moduleBreakdown: selectedBundles.map((bundleId) => {
        const bundle = FEATURE_BUNDLES.find((b) => b.id === bundleId);
        const inr = bundle?.priceInr ?? 0;
        const usd = bundle?.priceUsd ?? 0;
        const market = tierConfig.bundles[bundleId] ?? (tierConfig.currencyCode === "INR" ? inr : usd);
        return {
          id: bundleId,
          name: bundle?.name ?? bundleId,
          icon: bundle?.icon ?? "📦",
          tagline: bundle?.tagline ?? "",
          priceInr: inr,
          priceUsd: usd,
          priceMarket: market
        };
      })
    };
  }, [selectedBundles, tierConfig, timeline]);

  // Quick Pick preset click in Hero
  const handleQuickPick = (industry: IndustryOption) => {
    setSelectedIndustry(industry);
    setBusinessName(industry.sampleBusinessName);
    setSelectedBundles(industry.recommendedBundles);
    goToStep(1);

    dispatchLeadCapture({
      businessName: industry.sampleBusinessName,
      industry: industry.name,
      selectedBundles: industry.recommendedBundles,
      step: "Quick Choice Picked",
      status: "in_progress"
    });
  };

  // Click on Hero "GET YOUR PRICING" button
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const handleOrContact = socialAccount.trim() || businessName.trim() || "My Project";
    if (!socialAccount.trim()) {
      setSocialAccount(handleOrContact);
    }
    if (!businessName.trim()) {
      setBusinessName(handleOrContact);
    }
    goToStep(1);

    dispatchLeadCapture({
      businessName: handleOrContact,
      socialAccount: socialAccount.trim() || undefined,
      step: "Step 1: Website Goals",
      status: "in_progress"
    });
  };

  const scrollToFunnel = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Toggle bundle selection
  const handleToggleBundle = (bundleId: string) => {
    if (bundleId === "essential_core") return; // Essential core is always required
    setSelectedBundles((prev) => {
      const next = prev.includes(bundleId)
        ? prev.filter((id) => id !== bundleId)
        : [...prev, bundleId];

      dispatchLeadCapture({
        selectedBundles: next,
        step: "Step 2: Feature Bundles",
        status: "in_progress"
      });

      return next;
    });
  };

  // Handle Question Step navigation
  const goToStep = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
    // Going back to hero = user wants a fresh start; clear saved draft
    if (step === 0) {
      try { sessionStorage.removeItem(DRAFT_KEY); } catch (_) {}
    }
    dispatchLeadCapture({
      step: `Step ${step}`,
      status: step === 4 ? "unlocked" : "in_progress"
    });
    scrollToFunnel();
  };

  // Auth unlock submission
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthSubmitting(true);

    try {
      if (authMode === "signup") {
        const res = await signUp(authEmail.trim().toLowerCase(), authPassword);
        if (res?.error) {
          setAuthError(res.error.message);
          setIsAuthSubmitting(false);
          return;
        }
        if (!res?.data?.session && !res?.data?.user) {
          setAuthError("Account created! Please check your email inbox to verify your account and view your custom estimate.");
          setIsAuthSubmitting(false);
          return;
        }
      } else {
        const res = await signInWithPassword(authEmail.trim().toLowerCase(), authPassword);
        if (res?.error) {
          setAuthError(res.error.message);
          setIsAuthSubmitting(false);
          return;
        }
      }

      // Lead unlocked on verified authentication
      setLocalAuthenticated(true);
      // Clear draft so a return visit starts fresh
      try { sessionStorage.removeItem(DRAFT_KEY); } catch (_) {}
      await dispatchLeadCapture({
        clientEmail: authEmail.trim().toLowerCase(),
        clientName: authName.trim() || businessName.trim(),
        step: "Result Unlocked",
        status: "unlocked",
        estimatedCostInr: calculation.finalTotalInr,
        estimatedCostUsd: calculation.finalTotalUsd,
        discountPercent: calculation.discountPercent
      });

      // Save custom quote draft to database
      if (user?.email || authEmail) {
        await saveClientCustomQuote({
          client_email: user?.email || authEmail.trim().toLowerCase(),
          client_name: authName.trim() || businessName.trim(),
          project_name: businessName || `${selectedIndustry.name} Project`,
          industry_template: selectedIndustry.id,
          selected_features: selectedBundles.reduce((acc, id) => ({ ...acc, [id]: 1 }), {}),
          base_price_inr: 5000,
          base_price_usd: 75,
          itemized_total_inr: calculation.subtotalInr - 5000,
          itemized_total_usd: calculation.subtotalUsd - 75,
          discount_percent: calculation.discountPercent,
          discount_amount_inr: calculation.discountAmountInr,
          discount_amount_usd: calculation.discountAmountUsd,
          final_total_inr: calculation.finalTotalInr,
          final_total_usd: calculation.finalTotalUsd,
          currency: currency,
          status: "submitted"
        });
      }

      setSaveToast("Quote successfully calculated & saved to your account!");
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // WhatsApp share
  const handleWhatsAppQuote = () => {
    const goalTitle =
      selectedGoals
        .map((id) => WEBSITE_GOALS.find((g) => g.id === id)?.title)
        .filter(Boolean)
        .join(" + ") || "Custom Growth";

    const moduleLines = selectedBundles
      .map((id) => {
        const b = FEATURE_BUNDLES.find((item) => item.id === id);
        const price = tierConfig.bundles[id] ?? (tierConfig.currencyCode === "INR" ? b?.priceInr : b?.priceUsd);
        return `  • ${b?.icon || "📦"} ${b?.name}: ${tierConfig.currencySymbol}${price?.toLocaleString()} ${tierConfig.currencyCode}`;
      })
      .join("\n");

    const urgencyLine =
      calculation.urgencyPercent > 0
        ? `⚡ *Timeline Acceleration Surcharge (+${calculation.urgencyPercent}%):* ${tierConfig.currencySymbol}${calculation.urgencyAmountMarket.toLocaleString()} ${tierConfig.currencyCode} (${calculation.urgencyReason})\n`
        : "";

    const text = `Hi Tanie! I just calculated my website estimate on your site:
🏢 *Brand / Contact:* ${socialAccount || businessName || "My Project"}
🎯 *Primary Goals:* ${goalTitle}
📦 *Selected Scope Modules (${calculation.bundleCount}):*
${moduleLines}

📊 *Modules Subtotal:* ${tierConfig.currencySymbol}${calculation.subtotalMarket.toLocaleString()} ${tierConfig.currencyCode}
${urgencyLine}💰 *Total Investment:* ${tierConfig.currencySymbol}${calculation.finalTotalMarket.toLocaleString()} ${tierConfig.currencyCode}
⏱️ *Timeline:* ${timeline}

Let's discuss getting started!`;

    window.open(`https://wa.me/916351515091?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div ref={funnelContainerRef} className="w-full" dir={locale === "ur" ? "rtl" : "ltr"}>
      {/* SUCCESS TOAST */}
      {saveToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#0a192f] text-white text-xs px-5 py-3 rounded-xl shadow-xl border border-sky-400/30 flex items-center gap-2">
          <span>✨</span>
          <span>{saveToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: MINIMALIST "CALCULATE YOUR WEBSITE COST" (Only Step 0)   */}
      {/* ========================================================================= */}
      {currentStep === 0 && (
        <div className="max-w-4xl mx-auto text-center pt-4 pb-8 sm:pb-12">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight !text-[#0a192f] leading-tight">
            {t.hero.titlePrefix}<span className="text-sky-700">{t.hero.titleHighlight}</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-sky-950/80 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* FILL-IN SEARCH CTA FORM */}
          <form onSubmit={handleHeroSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-full bg-white/85 border border-sky-300 shadow-md focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/15 transition-all">
              <div className="flex items-center gap-3 w-full pl-4">
                <span className="text-sky-500 text-lg">🔍</span>
                <input
                  id="calc_hero_social_contact"
                  name="social_or_contact"
                  autoComplete="off"
                  type="text"
                  value={socialAccount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSocialAccount(val);
                    setBusinessName(val.trim());
                    saveLeadProfile({ businessName: val.trim(), socialAccount: val.trim() });
                    try {
                      localStorage.setItem("tanie_client_social", val.trim());
                    } catch (_) {}
                  }}
                  placeholder={t.hero.inputPlaceholder}
                  className="w-full bg-transparent text-sm sm:text-base !text-[#0a192f] placeholder-sky-900/50 focus:outline-none py-2 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.hero.ctaButton}</span>
                <span>{locale === "ur" ? "←" : "→"}</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THE 4-STEP INTERACTIVE QUESTIONNAIRE (GOALS DIRECTLY -> MODULES -> ...) */}
      {/* ========================================================================= */}
      {currentStep > 0 && (
        <div className="max-w-3xl mx-auto py-2 sm:py-6 space-y-8 animate-fadeIn">
          {/* STEP HEADER & PROGRESS */}
          <div className="flex items-center justify-between border-b border-sky-200/80 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black !text-[#0a192f] tracking-tight" style={{ color: '#0a192f' }}>
                {currentStep === 1 && (t.funnel.step1Title || "Step 1: What is Your Main Goal or Challenge?")}
                {currentStep === 2 && (t.funnel.step2Title || "Step 2: Recommended Package & Custom Modules")}
                {currentStep === 3 && (t.funnel.step3Title || "Step 3: Launch Timing & Budget Comfort")}
                {currentStep === 4 && (t.funnel.step4Title || "Step 4: Review & Unlock Your Custom Estimate")}
              </h2>
              <p className="text-xs text-sky-950/80 mt-1 font-medium" style={{ color: '#0a192f' }}>
                {locale === "ur" ? `مرحلہ ${currentStep} از 4 • پروجیکٹ: ` : `Step ${currentStep} of 4 • Project: `}
                <span className="font-bold !text-[#0a192f]" style={{ color: '#0a192f' }}>{socialAccount || businessName || (locale === "ur" ? "میری ویب سائٹ" : "My Project")}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === currentStep
                        ? "w-8 bg-[#0a192f]"
                        : s < currentStep
                        ? "w-4 bg-sky-600"
                        : "w-2 bg-sky-200"
                    }`}
                  />
                ))}
              </div>
            </div>

          {/* ------------------------------------------------------------- */}
          {/* STEP 1: WHAT IS YOUR MAIN GOAL / PROBLEM?                     */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="space-y-6">


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WEBSITE_GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleToggleGoal(goal.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md"
                          : "bg-white/70 hover:bg-white border-sky-200/80 hover:border-sky-400 shadow-xs"
                      }`}
                    >
                      <span className="text-xl shrink-0">{goal.icon}</span>
                      <span className="text-sm font-semibold text-[#0a192f] leading-snug">
                        {goal.title}
                      </span>
                      <span
                        className={`ml-auto h-4 w-4 rounded shrink-0 flex items-center justify-center text-[10px] font-black border transition ${
                          isSelected
                            ? "bg-sky-600 text-white border-sky-600"
                            : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sky-200/60">
                <button
                  type="button"
                  onClick={() => goToStep(0)}
                  className="px-6 py-2.5 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer"
                >
                  ← Back
                </button>
                <div className="flex items-center gap-3">
                  {selectedGoals.length === 0 && (
                    <span className="text-[11px] font-semibold text-rose-500 hidden sm:inline">
                      Select at least 1 goal to proceed
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={selectedGoals.length === 0}
                    onClick={() => goToStep(2)}
                    className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                      selectedGoals.length > 0
                        ? "bg-[#0a192f] hover:bg-slate-800 text-white cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    Next: Review Modules →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 2: FEATURE BUNDLES (EXACT 6 PACKAGES & MODULES)          */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {FEATURE_BUNDLES.map((bundle) => {
                  const isSelected = selectedBundles.includes(bundle.id);
                  const isEssential = bundle.isEssential;
                  const isExpanded = expandedBundle === bundle.id;
                  const macros = bundle.macroFeatures || [];

                  return (
                    <div
                      key={bundle.id}
                      className={`rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md"
                          : "bg-white/70 hover:bg-white border-sky-200/80 hover:border-sky-400 shadow-xs"
                      }`}
                    >
                      {/* Main row — clicking this toggles selection */}
                      <div
                        onClick={() => handleToggleBundle(bundle.id)}
                        className="flex items-center gap-3.5 p-4 cursor-pointer"
                      >
                        <span className="text-xl shrink-0">{bundle.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-[#0a192f] leading-snug">
                            {bundle.name}
                          </span>
                          {bundle.badge && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-900 border border-sky-200 align-middle">
                              {bundle.badge}
                            </span>
                          )}
                          <p className="text-[11px] text-sky-900/70 mt-0.5 truncate">{bundle.tagline}</p>
                        </div>
                        <span
                          className={`h-4 w-4 rounded shrink-0 flex items-center justify-center text-[10px] font-black border transition ${
                            isSelected
                              ? "bg-sky-600 text-white border-sky-600"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </div>

                      {/* Accordion trigger row */}
                      <div className="px-4 pb-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBundleAccordion(bundle.id);
                          }}
                          className="flex items-center gap-2 text-[11px] font-semibold text-sky-700 hover:text-sky-900 transition cursor-pointer"
                        >
                          <span className="w-4 h-4 rounded-full border border-sky-300 bg-sky-50 flex items-center justify-center text-[11px] font-bold">
                            {isExpanded ? "−" : "+"}
                          </span>
                          <span>
                            {isExpanded
                              ? "Hide Macro Features"
                              : `${macros.length} Macro Modules (${isEssential ? "Core Included" : "Expandable"})`}
                          </span>
                        </button>
                      </div>

                      {/* Expanded Macro Features Downwards Drawer */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-2 border-t border-sky-200/80 space-y-2 animate-in fade-in duration-150">
                          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                            {macros.map((macro) => {
                              const isMacroExpanded = expandedMacro === macro.id;
                              return (
                                <div
                                  key={macro.id}
                                  className={`rounded-xl border transition-all ${
                                    isMacroExpanded
                                      ? "bg-white border-sky-300 shadow-xs"
                                      : "bg-white/60 hover:bg-white/90 border-sky-100"
                                  }`}
                                >
                                  {/* Macro Header */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMacroAccordion(macro.id);
                                    }}
                                    className="w-full flex items-center justify-between p-2.5 text-left cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2 min-w-0 pr-2">
                                      {macro.icon && <span className="text-sm shrink-0">{macro.icon}</span>}
                                      <span className="text-xs font-semibold text-[#0a192f] truncate">
                                        {macro.name}
                                      </span>
                                    </div>
                                    <span className="shrink-0 w-4 h-4 rounded-full border border-sky-200 bg-sky-50 text-sky-600 text-[10px] font-bold flex items-center justify-center">
                                      {isMacroExpanded ? "−" : "+"}
                                    </span>
                                  </button>

                                  {/* Micro Features Drawer */}
                                  {isMacroExpanded && (
                                    <div className="px-3 pb-3 pt-1 border-t border-sky-100/80 space-y-1.5 text-[11px]">
                                      {macro.description && (
                                        <p className="text-[11px] text-slate-600 leading-snug mb-2 font-normal">
                                          {macro.description}
                                        </p>
                                      )}
                                      <div className="space-y-1 pl-1">
                                        {macro.microFeatures.map((micro, idx) => (
                                          <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                                            <span className="text-sky-500 font-bold mt-0.5">•</span>
                                            <span className="leading-tight">{micro}</span>
                                          </div>
                                        ))}
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

              <div className="flex items-center justify-between pt-4 border-t border-sky-200/60">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-6 py-2.5 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer"
                >
                  ← Back to Goals
                </button>
                <div className="flex items-center gap-3">
                  {selectedBundles.length === 0 && (
                    <span className="text-[11px] font-semibold text-rose-500 hidden sm:inline">
                      Select at least 1 package to proceed
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={selectedBundles.length === 0}
                    onClick={() => goToStep(3)}
                    className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                      selectedBundles.length > 0
                        ? "bg-[#0a192f] hover:bg-slate-800 text-white cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    Next: Budget & Timing →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 3: BUDGET & TIMELINE                                     */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Budget Range */}
              <div>
                <label className="block text-xs font-black !text-[#0a192f] uppercase tracking-wider mb-3">
                  {locale === "ur" ? "ہدف کا بجٹ *" : locale === "hi" ? "लक्ष्य बजट *" : locale === "es" ? "Presupuesto objetivo *" : locale === "fr" ? "Fourchette de budget *" : locale === "ja" ? "目標予算 *" : locale === "zh" ? "目标预算 *" : "Target Budget Bracket *"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    "₹15,000 – ₹25,000 (Starter)",
                    "₹25,000 – ₹50,000 (Growth)",
                    "₹50,000 – ₹1,00,000+ (Flagship)",
                    "Best Value Recommendation"
                  ].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setBudgetTier(tier)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        budgetTier === tier
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md !text-[#0a192f] font-black ring-2 ring-sky-500/15"
                          : "bg-[#c8ecff]/20 hover:bg-[#c8ecff]/40 border-sky-200/80 !text-[#0a192f] font-medium"
                      }`}
                    >
                      <div className="text-xs">{tier}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-black !text-[#0a192f] uppercase tracking-wider mb-3">
                  {locale === "ur" ? "ہدف کی رفتار *" : locale === "hi" ? "लॉन्च की समय सीमा *" : locale === "es" ? "Plazo de lanzamiento *" : locale === "fr" ? "Vitesse de lancement ciblée *" : locale === "ja" ? "公開希望時期 *" : locale === "zh" ? "目标上线周期 *" : "Target Launch Speed (Months) *"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      title: "⚡ 1 Month (Fast Sprint)",
                      note: "Realistic for Base Foundation only. Express acceleration surcharge applies for multi-module scopes."
                    },
                    {
                      title: "🚀 1–3 Months (Standard Single-Module)",
                      note: "Standard delivery timeline for Base Foundation + 1 Core Engine (Sales or Marketing)."
                    },
                    {
                      title: "🗓️ 3–5 Months (Multi-Module Ecosystem)",
                      note: "Balanced delivery pace for 2–3 complex modules (Portals, 3D Canvas, Staff Roster)."
                    },
                    {
                      title: "🏛️ 5–8+ Months (Custom SaaS & Full-Stack Platform)",
                      note: "Standard delivery for custom SaaS platforms, PostgreSQL database, auth & billing."
                    }
                  ].map((timeObj) => (
                    <button
                      key={timeObj.title}
                      type="button"
                      onClick={() => setTimeline(timeObj.title)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        timeline === timeObj.title
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md !text-[#0a192f] font-black ring-2 ring-sky-500/15"
                          : "bg-[#c8ecff]/20 hover:bg-[#c8ecff]/40 border-sky-200/80 !text-[#0a192f] font-medium"
                      }`}
                    >
                      <div className="text-xs font-bold">{timeObj.title}</div>
                      <div className="text-[10px] text-sky-900/70 mt-1 leading-tight font-normal">{timeObj.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sky-200/80">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-6 py-2.5 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer"
                >
                  ← Back to Modules
                </button>
                <div className="flex items-center gap-3">
                  {(!budgetTier || !timeline) && (
                    <span className="text-[11px] font-semibold text-rose-500 hidden sm:inline">
                      Please select both a budget and launch speed
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!budgetTier || !timeline}
                    onClick={() => goToStep(4)}
                    className={`px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                      budgetTier && timeline
                        ? "bg-[#0a192f] hover:bg-slate-800 text-white cursor-pointer shadow-md"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {t.funnel.calculateBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 4: RESULT (LOCKED BEHIND SIGN UP / LOGIN IF GUEST)       */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 4 && (
            <CostCalculatorStepResult
              locale={locale}
              t={t}
              goToStep={goToStep}
              isUnlocked={isUnlocked}
              setIsUnlocked={setLocalAuthenticated}
              authLoading={authLoading}
              authError={authError}
              setAuthError={setAuthError}
              isAuthSubmitting={isAuthSubmitting}
              setIsAuthSubmitting={setIsAuthSubmitting}
              authMode={authMode}
              setAuthMode={setAuthMode}
              authName={authName}
              setAuthName={setAuthName}
              authEmail={authEmail}
              setAuthEmail={setAuthEmail}
              authPassword={authPassword}
              setAuthPassword={setAuthPassword}
              businessName={businessName}
              socialAccount={socialAccount}
              timeline={timeline}
              budgetTier={budgetTier}
              tierConfig={tierConfig}
              calculation={calculation}
              selectedBundles={selectedBundles}
              selectedGoal={selectedGoal}
              selectedGoals={selectedGoals}
              currency={currency}
              signInWithGoogle={signInWithGoogle}
              dispatchLeadCapture={dispatchLeadCapture}
              saveLeadProfile={saveLeadProfile}
              onProceedWithCustomQuote={onProceedWithCustomQuote}
              handleWhatsAppQuote={handleWhatsAppQuote}
              handleUnlockSubmit={handleUnlockSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
}
