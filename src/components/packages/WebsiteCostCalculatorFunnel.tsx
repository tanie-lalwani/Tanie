"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { packagesTranslations } from "@/data/packagesTranslations";
import { saveClientCustomQuote } from "@/lib/portalServices";
import { getSavedLeadProfile, saveLeadProfile } from "@/features/lead-capture/lib/cookieHelper";
import { useGeoPricing } from "@/context/GeoPricingContext";
import CostCalculatorStepResult from "./CostCalculatorStepResult";
import SiteDiagnosisModal from "./SiteDiagnosisModal";

import {
  type FeatureBundle,
  FEATURE_BUNDLES,
  type UniversalAddon,
  UNIVERSAL_ADDONS,
  type BuildingOption,
  BUILDING_OPTIONS,
  type IndustryOption,
  INDUSTRIES,
} from "./calculatorData";

export { FEATURE_BUNDLES, UNIVERSAL_ADDONS, BUILDING_OPTIONS, INDUSTRIES };

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
  const { marketTier, tierConfig, formatBundlePrice, formatPackagePrice, formatAddonPrice } = useGeoPricing();

  // ─── Funnel draft key ─────────────────────────────────────────────────────
  const DRAFT_KEY = "tanie_funnel_draft";
  const readDraft = () => {
    try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null"); } catch { return null; }
  };
  const _draft = typeof window !== "undefined" ? readDraft() : null;

  // Lead ID for deduplication across steps
  const [leadId, setLeadId] = useState<string>(_draft?.leadId || "");

  // Current Funnel Step: 0 = Hero, 1 = What are you building, 2 = Universal Addons, 3 = Timeline & Budget, 4 = Result
  const [currentStep, setCurrentStep] = useState<number>(_draft?.currentStep ?? 0);

  // Selected standalone package (Single selection, direct suggestion)
  const [selectedPackageId, setSelectedPackageId] = useState<string>(_draft?.selectedPackageId || "landing");

  // Selected universal addons
  const [selectedAddons, setSelectedAddons] = useState<string[]>(_draft?.selectedAddons || []);

  // User brand / profile states
  const [businessName, setBusinessName] = useState(_draft?.businessName || "");
  const [socialAccount, setSocialAccount] = useState(_draft?.socialAccount || "");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryOption>(INDUSTRIES[0]);
  const [budgetTier, setBudgetTier] = useState<string>(_draft?.budgetTier || "");
  const [timeline, setTimeline] = useState<string>(_draft?.timeline || "");
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>(_draft?.selectedAesthetic || "Luxury Minimalist");
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

  const [showDiagnosisModal, setShowDiagnosisModal] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [expandedMacro, setExpandedMacro] = useState<string | null>(null);

  const toggleMacroAccordion = (macroId: string) => {
    setExpandedMacro((prev) => (prev === macroId ? null : macroId));
  };

  const funnelContainerRef = useRef<HTMLDivElement>(null);

  // Active package definition
  const activePackage = useMemo(() => {
    return FEATURE_BUNDLES.find((b) => b.id === selectedPackageId) || FEATURE_BUNDLES[0];
  }, [selectedPackageId]);

  // If SaaS is chosen, disallow fast 1-2 week timeline
  useEffect(() => {
    if (selectedPackageId === "saas" && timeline.includes("1–2 Weeks")) {
      setTimeline("🚀 Standard Delivery (3–4 Weeks)");
    }
  }, [selectedPackageId, timeline]);

  // ─── Persist funnel draft to sessionStorage on every state change ─────────
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
        leadId, currentStep, businessName, socialAccount,
        selectedPackageId, selectedAddons, budgetTier, timeline, selectedAesthetic
      }));
    } catch (_) {}
  }, [leadId, currentStep, businessName, socialAccount, selectedPackageId, selectedAddons, budgetTier, timeline, selectedAesthetic]);

  // ─── Prepopulate from cookies/localStorage on mount (only if no draft) ────
  useEffect(() => {
    if (_draft) return;
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
      const payload = {
        id: leadId || undefined,
        businessName: businessName.trim() || socialAccount.trim() || undefined,
        socialAccount: socialAccount.trim() || undefined,
        packageId: selectedPackageId,
        packageName: activePackage.name,
        selectedAddons,
        budgetTier,
        timeline,
        selectedAesthetic,
        source: "website_calculator_funnel",
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

  // Persist full calculator state to localStorage so the dedicated breakdown page can load it
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        businessName: businessName.trim() || socialAccount.trim() || "My Project",
        socialAccount: socialAccount.trim() || undefined,
        selectedPackageId,
        selectedAddons,
        timeline,
        budgetTier,
        selectedAesthetic,
        authName,
        authEmail,
        leadId,
        timestamp: Date.now()
      };
      localStorage.setItem("tanie_calculator_state", JSON.stringify(payload));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  }, [businessName, socialAccount, selectedPackageId, selectedAddons, timeline, budgetTier, selectedAesthetic, authName, authEmail, leadId]);

  // Calculation for standalone package + universal addons
  const calculation = useMemo(() => {
    const isINR = tierConfig.currencyCode === "INR";
    const pkgInr = activePackage.priceInr;
    const pkgUsd = activePackage.priceUsd;
    const pkgMarket = formatPackagePrice(activePackage.id).amount;

    let addonsInr = 0;
    let addonsUsd = 0;
    let addonsMarket = 0;

    const selectedAddonsList = selectedAddons.map((addonId) => {
      const addon = UNIVERSAL_ADDONS.find((a) => a.id === addonId);
      const inr = addon?.priceInr ?? 0;
      const usd = addon?.priceUsd ?? 0;
      const market = formatAddonPrice(addonId).amount;
      addonsInr += inr;
      addonsUsd += usd;
      addonsMarket += market;
      return {
        id: addonId,
        name: addon?.name || addonId,
        icon: addon?.icon || "🧩",
        priceInr: inr,
        priceUsd: usd,
        priceMarket: market
      };
    });

    const subtotalInr = pkgInr + addonsInr;
    const subtotalUsd = pkgUsd + addonsUsd;
    const subtotalMarket = pkgMarket + addonsMarket;

    // Urgency surcharge computation
    let urgencyPercent = 0;
    let urgencyReason = "";

    if (timeline.includes("1–2 Weeks") || timeline.includes("Express")) {
      urgencyPercent = 25;
      urgencyReason = "Express Sprint Priority Acceleration (+25%)";
    }

    const urgencyAmountInr = Math.round((subtotalInr * urgencyPercent) / 100);
    const urgencyAmountUsd = Math.round((subtotalUsd * urgencyPercent) / 100);
    const urgencyAmountMarket = Math.round((subtotalMarket * urgencyPercent) / 100);

    const finalTotalInr = subtotalInr + urgencyAmountInr;
    const finalTotalUsd = subtotalUsd + urgencyAmountUsd;
    const finalTotalMarket = subtotalMarket + urgencyAmountMarket;

    return {
      pkgInr,
      pkgUsd,
      pkgMarket,
      addonsInr,
      addonsUsd,
      addonsMarket,
      subtotalInr,
      subtotalUsd,
      subtotalMarket,
      urgencyPercent,
      urgencyReason,
      urgencyAmountInr,
      urgencyAmountUsd,
      urgencyAmountMarket,
      finalTotalInr,
      finalTotalUsd,
      finalTotalMarket,
      selectedAddonsList,
      moduleBreakdown: [
        {
          id: activePackage.id,
          name: activePackage.name,
          icon: activePackage.icon,
          tagline: activePackage.tagline,
          priceInr: pkgInr,
          priceUsd: pkgUsd,
          priceMarket: pkgMarket
        },
        ...selectedAddonsList
      ]
    };
  }, [activePackage, selectedAddons, tierConfig, timeline]);

  const scrollToFunnel = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Handle Question Step navigation
  const goToStep = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
    if (step === 0) {
      try { sessionStorage.removeItem(DRAFT_KEY); } catch (_) {}
    }
    dispatchLeadCapture({
      step: `Step ${step}`,
      status: step === 4 ? "unlocked" : "in_progress"
    });
    scrollToFunnel();
  };

  // Select building option -> Directly sets suggested package
  const handleSelectBuildingOption = (option: BuildingOption) => {
    setSelectedPackageId(option.targetPackageId);
    dispatchLeadCapture({
      packageId: option.targetPackageId,
      buildingOption: option.title,
      step: "Step 1: What are you building",
      status: "in_progress"
    });
    goToStep(2);
  };

  // Toggle universal addon
  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => {
      const next = prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId];

      dispatchLeadCapture({
        selectedAddons: next,
        step: "Step 2: Universal Add-ons",
        status: "in_progress"
      });

      return next;
    });
  };

  // Hero submit
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const handleOrContact = socialAccount.trim() || businessName.trim() || "My Project";
    if (!socialAccount.trim()) setSocialAccount(handleOrContact);
    if (!businessName.trim()) setBusinessName(handleOrContact);
    goToStep(1);

    dispatchLeadCapture({
      businessName: handleOrContact,
      socialAccount: socialAccount.trim() || undefined,
      step: "Step 1: What are you building",
      status: "in_progress"
    });
  };

  // Auth unlock submission
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthSubmitting(true);

    try {
      let loggedUser = user;
      if (!loggedUser) {
        if (authMode === "signup") {
          const res = await signUp(authEmail, authPassword);
          if (res.error) throw res.error;
          loggedUser = res.data?.user || null;
        } else {
          const res = await signInWithPassword(authEmail, authPassword);
          if (res.error) throw res.error;
          loggedUser = res.data?.user || null;
        }
      }

      setLocalAuthenticated(true);
      const quotePayload = {
        packageId: selectedPackageId,
        packageName: activePackage.name,
        businessName,
        socialAccount,
        selectedAddons: calculation.selectedAddonsList,
        bundles: calculation.moduleBreakdown,
        timeline,
        currency: tierConfig.currencyCode,
        finalTotalMarket: calculation.finalTotalMarket,
        finalTotalInr: calculation.finalTotalInr,
        finalTotalUsd: calculation.finalTotalUsd,
        estimatedTotal: calculation.finalTotalMarket,
        total: calculation.finalTotalMarket,
        timestamp: new Date().toISOString()
      };

      if (onProceedWithCustomQuote) {
        onProceedWithCustomQuote(quotePayload);
      }

      if (loggedUser?.email) {
        await saveClientCustomQuote({
          client_email: loggedUser.email,
          project_name: businessName || `${activePackage.name} Project`,
          industry_template: selectedIndustry.id,
          selected_features: { [selectedPackageId]: 1, ...selectedAddons.reduce((acc, id) => ({ ...acc, [id]: 1 }), {}) },
          base_price_inr: calculation.pkgInr,
          base_price_usd: calculation.pkgUsd,
          itemized_total_inr: calculation.subtotalInr,
          itemized_total_usd: calculation.subtotalUsd,
          discount_percent: 0,
          discount_amount_inr: 0,
          discount_amount_usd: 0,
          final_total_inr: calculation.finalTotalInr,
          final_total_usd: calculation.finalTotalUsd,
          currency: (tierConfig.currencyCode === "USD" ? "USD" : "INR"),
          status: "submitted"
        });
      }

      setSaveToast(locale === "hi" ? "Quote successfully calculate aur save ho gaya!" : "Quote successfully calculated & saved to your account!");
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // WhatsApp share
  const handleWhatsAppQuote = () => {
    const lines: string[] = [
      `  • ${activePackage.icon} *${activePackage.name} (Suggested Package):* ${tierConfig.currencySymbol}${calculation.pkgMarket.toLocaleString()} ${tierConfig.currencyCode}`
    ];

    calculation.selectedAddonsList.forEach((addon) => {
      lines.push(
        `  • ${addon.icon} ${addon.name} (Add-on): +${tierConfig.currencySymbol}${addon.priceMarket.toLocaleString()} ${tierConfig.currencyCode}`
      );
    });

    const urgencyLine =
      calculation.urgencyPercent > 0
        ? `⚡ *Timeline Acceleration Surcharge (+${calculation.urgencyPercent}%):* +${tierConfig.currencySymbol}${calculation.urgencyAmountMarket.toLocaleString()} ${tierConfig.currencyCode} (${calculation.urgencyReason})\n`
        : "";

    const text = `Hi Tanie! I just calculated my website estimate on your site:
🏢 *Brand / Project:* ${socialAccount || businessName || "My Project"}
📦 *Suggested Package:* ${activePackage.name}
✨ *Scope Breakdown:*
${lines.join("\n")}

📊 *Subtotal:* ${tierConfig.currencySymbol}${calculation.subtotalMarket.toLocaleString()} ${tierConfig.currencyCode}
${urgencyLine}💰 *Total Investment:* ${tierConfig.currencySymbol}${calculation.finalTotalMarket.toLocaleString()} ${tierConfig.currencyCode}
⏱️ *Timeline:* ${timeline || activePackage.turnaround || "Standard"}

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
      {/* 1. HERO SECTION (Step 0)                                                  */}
      {/* ========================================================================= */}
      {currentStep === 0 && (
        <div className="max-w-4xl mx-auto text-center pt-4 pb-8 sm:pb-12">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight !text-[#0a192f] leading-tight">
            {t.hero.titlePrefix}<span className="text-sky-700">{t.hero.titleHighlight}</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-sky-950/80 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* INPUT FORM */}
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

          {/* ALREADY HAVE A WEBSITE? DIAGNOSIS CTA */}
          <div className="mt-5 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowDiagnosisModal(true)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-950 hover:text-sky-900 bg-sky-100/80 hover:bg-sky-200/90 px-5 py-2.5 rounded-full border border-sky-300/90 transition-all cursor-pointer shadow-2xs group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">🩺</span>
              <span>
                {locale === "hi"
                  ? "Already have a website? Free diagnosis ke liye click karein →"
                  : "Already have a website? Click for diagnosis →"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* SITE DIAGNOSIS MODAL */}
      <SiteDiagnosisModal
        isOpen={showDiagnosisModal}
        onClose={() => setShowDiagnosisModal(false)}
        initialWebsite={socialAccount || businessName}
      />

      {/* ========================================================================= */}
      {/* 2. FUNNEL STEPS (1: Building? -> 2: Addons -> 3: Time -> 4: Result)       */}
      {/* ========================================================================= */}
      {currentStep > 0 && (
        <div className="max-w-3xl mx-auto py-2 sm:py-6 space-y-8 animate-fadeIn">
          {/* STEP HEADER & PROGRESS */}
          <div className="flex items-center justify-between border-b border-sky-200/80 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black !text-[#0a192f] tracking-tight" style={{ color: '#0a192f' }}>
                {currentStep === 1 && (locale === "hi" ? "Aap kya bana rahe hain?" : "What are you building?")}
                {currentStep === 2 && (locale === "hi" ? "Universal Add-Ons Chunein (Optional)" : "Select Universal Add-Ons (Optional)")}
                {currentStep === 3 && (locale === "hi" ? "Target Launch Timeline" : "Target Launch Timeline")}
                {currentStep === 4 && (locale === "hi" ? "Aapka Suggested Package & Estimate" : "Your Suggested Package & Custom Estimate")}
              </h2>
              <p className="text-xs text-sky-950/80 mt-1 font-medium" style={{ color: '#0a192f' }}>
                {`Step ${currentStep} of 4 • Project: `}
                <span className="font-bold !text-[#0a192f]" style={{ color: '#0a192f' }}>{socialAccount || businessName || "My Project"}</span>
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

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* STEP 1: WHAT ARE YOU BUILDING? (Minimal, No Pricing)                 */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BUILDING_OPTIONS.map((option) => {
                  const isSelected = selectedPackageId === option.targetPackageId;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectBuildingOption(option)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-sky-50/95 border-2 border-sky-600 shadow-md"
                          : "bg-white/70 hover:bg-white border-sky-200/80 hover:border-sky-400 shadow-xs"
                      }`}
                    >
                      <span className="text-xl shrink-0 p-2 rounded-xl bg-sky-100/70 border border-sky-200">
                        {option.icon}
                      </span>
                      <span className="text-sm font-bold text-[#0a192f] leading-snug">
                        {option.title}
                      </span>
                      <span
                        className={`ml-auto h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black border transition ${
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
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md bg-[#0a192f] hover:bg-slate-800 text-white cursor-pointer"
                >
                  Next: Universal Add-Ons →
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* STEP 2: UNIVERSAL ADD-ONS                                             */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-sky-100/60 border border-sky-300/70 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 block">Suggested Package</span>
                  <span className="text-sm font-black text-[#0a192f]">{activePackage.icon} {activePackage.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Base Investment</span>
                  <span className="text-sm font-black text-[#0a192f]">{formatPackagePrice(activePackage.id).formatted} {tierConfig.currencyCode}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-[#0a192f] mb-1">
                  {locale === "hi" ? "Optional Universal Add-Ons" : "Optional Universal Add-Ons"}
                </h3>
                <p className="text-xs text-slate-600">
                  {locale === "hi"
                    ? "Apne package ke saath inme se koi bhi universal feature add ya customize kar sakte hain:"
                    : "Augment your suggested package with any of these standalone enhancements:"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {UNIVERSAL_ADDONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  const addonPrice = formatAddonPrice(addon.id);

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-sky-50/95 border-2 border-sky-600 shadow-md"
                          : "bg-white/75 hover:bg-white border-sky-200/80 hover:border-sky-400 shadow-xs"
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-2 rounded-xl bg-sky-100 border border-sky-200">
                        {addon.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-black text-[#0a192f] truncate">
                            {addon.name}
                          </h4>
                          <span className="text-xs font-black text-sky-900 shrink-0">
                            +{addonPrice.formatted}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                          {addon.tagline}
                        </p>
                      </div>
                      <span
                        className={`h-4 w-4 rounded shrink-0 flex items-center justify-center text-[10px] font-black border transition mt-0.5 ${
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
                  onClick={() => goToStep(1)}
                  className="px-6 py-2.5 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md bg-[#0a192f] hover:bg-slate-800 text-white cursor-pointer"
                >
                  Next: Launch Timeline →
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* STEP 3: LAUNCH TIMELINE                                               */}
          {/* ───────────────────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* TIMELINE */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-sky-950/80 font-medium">
                  {locale === "hi"
                    ? "Apne project ke live hone ka target timeline chunein:"
                    : "Select your desired target launch timeframe:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "⚡ Express Sprint (1–2 Weeks)", value: "⚡ Express Sprint (1–2 Weeks)", isSaaSDisabled: true },
                    { label: "🚀 Standard Delivery (3–4 Weeks)", value: "🚀 Standard Delivery (3–4 Weeks)", isSaaSDisabled: false },
                    { label: "🏛️ Strategic Build (1–3 Months)", value: "🏛️ Strategic Build (1–3 Months)", isSaaSDisabled: false },
                    { label: "💎 Flexible / Enterprise (3+ Months)", value: "💎 Flexible / Enterprise (3+ Months)", isSaaSDisabled: false }
                  ].map((item) => {
                    const isDisabled = selectedPackageId === "saas" && item.isSaaSDisabled;
                    const isSelected = timeline === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setTimeline(item.value);
                          dispatchLeadCapture({ timeline: item.value });
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isDisabled
                            ? "opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed"
                            : isSelected
                            ? "bg-sky-50 border-2 border-sky-600 shadow-sm cursor-pointer"
                            : "bg-white/70 hover:bg-white border-sky-200/80 cursor-pointer"
                        }`}
                      >
                        <span className="text-xs font-black text-[#0a192f] block">
                          {item.label}
                        </span>
                        {isDisabled && (
                          <span className="text-[10px] text-rose-500 font-bold block mt-1">
                            (SaaS requires min 3–4 weeks)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-sky-200/60">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-6 py-2.5 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md bg-[#0a192f] hover:bg-slate-800 text-white cursor-pointer"
                >
                  Calculate Final Quote ✨
                </button>
              </div>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────────────── */}
          {/* STEP 4: RESULTS & TRANSPARENT BREAKDOWN                               */}
          {/* ───────────────────────────────────────────────────────────────────── */}
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
              selectedBundles={[selectedPackageId, ...selectedAddons]}
              selectedGoal={activePackage.name}
              selectedGoals={[selectedPackageId]}
              currency={tierConfig.currencyCode as any}
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
