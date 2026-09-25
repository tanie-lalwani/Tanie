"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  DEFAULT_PACKAGES,
  getWebsitePackages,
  submitLead,
  submitBooking,
  createClientProject,
  type WebsitePackage
} from "@/lib/portalServices";
import {
  AESTHETIC_STYLES,
  calculateMultipleAestheticRecommendations,
  type AestheticStyle,
  type WizardAnswers
} from "@/data/aestheticDatabase";
import WebsiteCostCalculatorFunnel from "@/components/packages/WebsiteCostCalculatorFunnel";
import AestheticsGridSection from "@/components/packages/AestheticsGridSection";
import AestheticPreviewModal from "@/components/packages/AestheticPreviewModal";
import ProjectIntakeModal from "@/components/packages/ProjectIntakeModal";
import { saveCalculatedQuote } from "@/components/client-hub/clientHubStorage";
import { useLanguage } from "@/context/LanguageContext";
import { packagesTranslations } from "@/data/packagesTranslations";
import { useGeoPricing } from "@/context/GeoPricingContext";

export default function PackagesView() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, signInWithPassword, signUp, signOut } = useAuth();
  const { copy, locale } = useLanguage();
  const pkgCopy = packagesTranslations[locale] || packagesTranslations.en;
  const { formatAddonPrice, formatPackagePrice, tierConfig } = useGeoPricing();

  // Active View Tab: "home" (Overview & Scope), "marketing" (Full-Funnel Campaign Engine), "calculator" (Interactive Estimator), "breakdown" (Granular Scope Breakdown), "gallery" (Browse Aesthetics), "wizard" (Make Your Website Questionnaire), "results" (Curated Suggestions)
  const [activeTab, setActiveTab] = useState<"home" | "marketing" | "calculator" | "breakdown" | "gallery" | "wizard" | "results">("home");

  // Currency toggle: USD or INR
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  // Packages state (loaded from portalServices)
  const [packagesList, setPackagesList] = useState<WebsitePackage[]>(DEFAULT_PACKAGES);


  // Gallery Filter Category
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [previewStyleModal, setPreviewStyleModal] = useState<AestheticStyle | null>(null);

  // Questionnaire State (5 Steps)
  const [funnelStep, setFunnelStep] = useState(0);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardAnswers, setWizardAnswers] = useState<Partial<WizardAnswers> & {
    buildingType?: string;
    visitorFeeling?: string;
    references?: string;
    scopeSize?: string;
  }>({
    buildingType: "Business",
    vibe: "Luxury",
    visitorFeeling: "I want it to feel expensive and artistic.",
    references: "",
    scopeSize: "4–7 pages (Business)"
  });

  // Selected Aesthetic for Request flow
  const [selectedAestheticForRequest, setSelectedAestheticForRequest] = useState<AestheticStyle | null>(null);
  const [selectedScopeTier, setSelectedScopeTier] = useState<string>("Business");

  // Project Intake Form Modal
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [websitePurpose, setWebsitePurpose] = useState("");
  const [pagesRequired, setPagesRequired] = useState("4–7 pages");
  const [featuresList, setFeaturesList] = useState<string[]>(["Lead Capture Form", "Interactive Animations"]);
  const [contentStatus, setContentStatus] = useState<"Ready" | "In Progress" | "Need Copywriting">("In Progress");
  const [targetDeadline, setTargetDeadline] = useState("3–4 Weeks");
  const [existingWebsite, setExistingWebsite] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [mustHaves, setMustHaves] = useState("");
  const [dealbreakers, setDealbreakers] = useState("");
  const [estimatedPriceUsd, setEstimatedPriceUsd] = useState<number | null>(2899);
  const [estimatedPriceInr, setEstimatedPriceInr] = useState<number | null>(2899);
  const [estimatedPriceAmount, setEstimatedPriceAmount] = useState<number | null>(2899);
  const [estimatedPriceCurrency, setEstimatedPriceCurrency] = useState<string>("INR");
  const [estimatedPriceSymbol, setEstimatedPriceSymbol] = useState<string>("₹");

  // Liked Aesthetics State (persisted so Tanie / Admin sees what designs client liked)
  const [likedAesthetics, setLikedAesthetics] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("tanie_liked_aesthetics");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const toggleLikeAesthetic = (styleName: string) => {
    setLikedAesthetics((prev) => {
      const isLiked = prev.includes(styleName);
      const updated = isLiked ? prev.filter((s) => s !== styleName) : [...prev, styleName];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("tanie_liked_aesthetics", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  // Sync pricing currency/symbol with detected market
  useEffect(() => {
    if (tierConfig) {
      setEstimatedPriceCurrency(tierConfig.currencyCode);
      setEstimatedPriceSymbol(tierConfig.currencySymbol);
    }
  }, [tierConfig]);

  // Auto-fill from user or stored profile
  useEffect(() => {
    if (user?.email && !clientEmail) {
      setClientEmail(user.email);
    }
    if (user?.user_metadata?.full_name && !clientName) {
      setClientName(user.user_metadata.full_name);
    }
    try {
      const savedEmail = typeof window !== "undefined" ? localStorage.getItem("tanie_client_email") : null;
      if (savedEmail && !clientEmail) setClientEmail(savedEmail);
      const savedName = typeof window !== "undefined" ? localStorage.getItem("tanie_client_name") : null;
      if (savedName && !clientName) setClientName(savedName);
      const savedPhone = typeof window !== "undefined" ? localStorage.getItem("tanie_client_phone") : null;
      if (savedPhone && !contactPhone) setContactPhone(savedPhone);
    } catch {}
  }, [user]);

  // Auth / Account Step in Intake
  const [authStepRequired, setAuthStepRequired] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [intakeSuccess, setIntakeSuccess] = useState(false);

  // Palette preview state in modal
  const [activePaletteIdx, setActivePaletteIdx] = useState(0);


  // Fetch packages on mount
  useEffect(() => {
    async function loadPackages() {
      try {
        const pkgs = await getWebsitePackages();
        if (pkgs && pkgs.length > 0) {
          setPackagesList(pkgs);
        }
      } catch (e) {
        console.warn("Failed to load packages:", e);
      }
    }
    loadPackages();
  }, []);

  // Compute curated recommendations from wizard answers
  const recommendationData = useMemo(() => {
    return calculateMultipleAestheticRecommendations({
      industry: wizardAnswers.buildingType || "Business",
      vibe: wizardAnswers.vibe || "Luxury",
      scope: wizardAnswers.scopeSize || "4–7 pages"
    });
  }, [wizardAnswers]);

  // Categories for gallery filter
  const categories = [
    "All",
    "Editorial & Luxury",
    "Modern SaaS & Bento",
    "3D & Spatial",
    "Pop & Brutalist",
    "Tactile & Organic",
    "Retro, Cyber & Y2K",
    "Artistic & Avant-Garde"
  ];

  const filteredStyles = useMemo(() => {
    if (activeCategory === "All") return AESTHETIC_STYLES;
    return AESTHETIC_STYLES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  // Handle starting the questionnaire
  const handleStartQuestionnaire = () => {
    setActiveTab("wizard");
    setWizardStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle browsing aesthetics
  const handleBrowseAesthetics = () => {
    setActiveTab("gallery");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle choosing an aesthetic from gallery or recommendations
  const handleChooseAesthetic = (style: AestheticStyle, defaultScope = "Business") => {
    setSelectedAestheticForRequest(style);
    setSelectedScopeTier(defaultScope);
    setPreviewStyleModal(null);
    setReferenceLinks(wizardAnswers.references || "");
    setFeaturesList(["Lead Capture & Contact System", "Interactive Micro-Animations", "SEO & Performance Architecture"]);

    // Calculate clear estimated pricing based on scope tier and active country market tier
    const sprintBase = tierConfig?.packages["luxury-landing-sprint"] ?? 1999;
    const bofuBase = tierConfig?.packages["growth-marketing-campaigns"] ?? 2899;
    const customBase = tierConfig?.packages["interactive-3d-experience"] ?? 3499;
    const fullstackBase = tierConfig?.packages["fullstack-web-app"] ?? 4299;

    let marketAmount = bofuBase;
    if (defaultScope.toLowerCase().includes("starter") || defaultScope.toLowerCase().includes("1–3")) {
      marketAmount = sprintBase;
    } else if (defaultScope.toLowerCase().includes("flagship") || defaultScope.toLowerCase().includes("custom") || defaultScope.toLowerCase().includes("3d")) {
      marketAmount = customBase;
    } else if (defaultScope.toLowerCase().includes("fullstack") || defaultScope.toLowerCase().includes("app")) {
      marketAmount = fullstackBase;
    }

    setEstimatedPriceAmount(marketAmount);
    setEstimatedPriceCurrency(tierConfig?.currencyCode || "INR");
    setEstimatedPriceSymbol(tierConfig?.currencySymbol || "₹");
    setEstimatedPriceUsd(marketAmount);
    setEstimatedPriceInr(marketAmount);

    setShowIntakeModal(true);
    setAuthStepRequired(false);
  };

  // Handle opening calculator
  const handleOpenCalculator = () => {
    setActiveTab("calculator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle custom scope proceeding from calculator
  const handleProceedWithScope = (quoteData: {
    projectName: string;
    industry: string;
    selectedFeatureNames: string[];
    selectedItems: Record<string, number>;
    finalTotalInr: number;
    finalTotalUsd: number;
    currency: "INR" | "USD";
  }) => {
    setProjectName(quoteData.projectName);
    setCompanyName(quoteData.projectName);
    setFeaturesList(quoteData.selectedFeatureNames);
    const amount = tierConfig.currencyCode === "INR" ? quoteData.finalTotalInr : quoteData.finalTotalUsd;
    setEstimatedPriceAmount(amount);
    setEstimatedPriceCurrency(tierConfig.currencyCode);
    setEstimatedPriceSymbol(tierConfig.currencySymbol);
    setEstimatedPriceInr(quoteData.finalTotalInr);
    setEstimatedPriceUsd(quoteData.finalTotalUsd);
    setCurrency(quoteData.currency);
    setSelectedScopeTier(`${quoteData.industry} Custom Scope`);
    setTargetDeadline("3–4 Weeks");
    setShowIntakeModal(true);
    setAuthStepRequired(false);
  };

  // Handle custom quote submission from WebsiteCostCalculatorFunnel
  const handleProceedWithCostCalculatorFunnel = (quoteData: any) => {
    const business = quoteData.businessName || quoteData.projectName || "Custom Web Project";
    setProjectName(business);
    setCompanyName(quoteData.socialAccount ? `${business} (${quoteData.socialAccount})` : business);
    setFeaturesList(quoteData.bundles ? quoteData.bundles.map((b: any) => b.name) : quoteData.selectedBundles || []);
    
    // Safely extract price with market support
    const marketAmount = quoteData.finalTotalMarket ?? (tierConfig.currencyCode === "INR" ? quoteData.finalTotalInr : quoteData.finalTotalUsd) ?? 2899;
    setEstimatedPriceAmount(marketAmount);
    setEstimatedPriceCurrency(tierConfig.currencyCode);
    setEstimatedPriceSymbol(tierConfig.currencySymbol);
    setEstimatedPriceInr(marketAmount);
    setEstimatedPriceUsd(marketAmount);

    const goalLabel = quoteData.goal || quoteData.industry || "Custom Bespoke Build";
    setSelectedScopeTier(`Goal: ${goalLabel}`);
    setTargetDeadline(quoteData.timeline || "3–4 Weeks");
    if (quoteData.likedAesthetics && Array.isArray(quoteData.likedAesthetics) && quoteData.likedAesthetics.length > 0) {
      setLikedAesthetics(quoteData.likedAesthetics);
    }
    setShowIntakeModal(true);
    setAuthStepRequired(false);
  };

  // Handle custom scope proceeding from PackagePricingBreakdown
  const handleProceedWithCustomScopeFromBreakdown = (scopeData: {
    packageId: string;
    packageName: string;
    originalPriceInr: number;
    originalPriceUsd: number;
    customPriceInr: number;
    customPriceUsd: number;
    currency: "INR" | "USD";
    includedMacroFeatures: string[];
    removedMacroFeatures: string[];
  }) => {
    setProjectName(scopeData.packageName);
    setCompanyName(scopeData.packageName);
    setFeaturesList(scopeData.includedMacroFeatures);
    setMustHaves(scopeData.includedMacroFeatures.join(", "));
    setDealbreakers(scopeData.removedMacroFeatures.length > 0 ? `Excluded optional modules: ${scopeData.removedMacroFeatures.join(", ")}` : "");
    const amount = tierConfig.currencyCode === "INR" ? scopeData.customPriceInr : scopeData.customPriceUsd;
    setEstimatedPriceAmount(amount);
    setEstimatedPriceCurrency(tierConfig.currencyCode);
    setEstimatedPriceSymbol(tierConfig.currencySymbol);
    setEstimatedPriceInr(scopeData.customPriceInr);
    setEstimatedPriceUsd(scopeData.customPriceUsd);
    setCurrency(scopeData.currency);
    setSelectedScopeTier(`Custom Package Scope: ${scopeData.packageName}`);
    setTargetDeadline("2–4 Weeks");
    setShowIntakeModal(true);
    setAuthStepRequired(false);
  };

  // Handle direct booking from Marketing Funnel Suite
  const handleBookMarketingPackage = (marketingData: {
    packageName: string;
    businessModel: string;
    selectedItems: string[];
    priceInr?: number;
    priceUsd?: number;
    priceAmount?: number;
    currencyCode?: string;
    currencySymbol?: string;
    formattedPrice?: string;
    timeline: string;
  }) => {
    const title = `${marketingData.packageName} (${marketingData.businessModel})`;
    setProjectName(title);
    setCompanyName(marketingData.businessModel);
    setFeaturesList(marketingData.selectedItems);
    const amount = marketingData.priceAmount ?? tierConfig.packages["growth-marketing-campaigns"] ?? 2899;
    setEstimatedPriceAmount(amount);
    setEstimatedPriceCurrency(marketingData.currencyCode || tierConfig.currencyCode);
    setEstimatedPriceSymbol(marketingData.currencySymbol || tierConfig.currencySymbol);
    setEstimatedPriceInr(amount);
    setEstimatedPriceUsd(amount);
    setSelectedScopeTier(`Marketing Funnel: ${marketingData.businessModel}`);
    setTargetDeadline(marketingData.timeline || "2–4 Weeks");
    setShowIntakeModal(true);
    setAuthStepRequired(false);
  };

  // Handle Intake Form Submission
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !contactPhone.trim()) return;
    await finalizeProjectSubmission();
  };

  // Finalize Submission
  const finalizeProjectSubmission = async () => {
    setIsSubmitting(true);
    try {
      const aestheticName = selectedAestheticForRequest?.name || "Bespoke Custom Direction";
      const currentAmount = estimatedPriceAmount ?? tierConfig.packages["growth-marketing-campaigns"] ?? 2899;
      const formattedInvestment = `${estimatedPriceSymbol}${currentAmount.toLocaleString()} ${estimatedPriceCurrency} (${tierConfig.countryName} Market Pricing)`;
      const usdPrice = estimatedPriceUsd ?? currentAmount;
      const inrPrice = estimatedPriceInr ?? currentAmount;

      const likedListStr = likedAesthetics.length > 0 ? likedAesthetics.join(", ") : "None specified";

      const fullDescription = `
[Website Booking Intake]
📞 Phone / WhatsApp: ${contactPhone.trim()}
💎 Aesthetic & Scope: ${aestheticName} • ${selectedScopeTier}
❤️ Liked Design Aesthetics: ${likedListStr}
💰 Estimated Investment: ${formattedInvestment}
⚡ Options / Selected Modules: ${featuresList.length > 0 ? featuresList.join(", ") : "Standard Core Architecture"}
📝 Client Note: ${clientMessage.trim() || "No additional note provided."}
${companyName.trim() ? `🏢 Company / Brand: ${companyName.trim()}` : ""}
      `.trim();

      // 1. Submit Booking Record
      await submitBooking({
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        phone: contactPhone.trim(),
        company_name: companyName.trim() || projectName.trim() || undefined,
        package_id: `${aestheticName} - ${selectedScopeTier}`,
        selected_aesthetic: likedAesthetics.length > 0 ? `${aestheticName} (Liked: ${likedListStr})` : aestheticName,
        scope_tier: selectedScopeTier,
        selected_addons: featuresList,
        estimated_budget_usd: usdPrice,
        estimated_budget_inr: inrPrice,
        timeline_requirement: targetDeadline || "3–4 Weeks",
        project_description: fullDescription,
        client_message: clientMessage.trim() ? `${clientMessage.trim()}\n\n[Liked Aesthetics: ${likedListStr}]` : `[Liked Aesthetics: ${likedListStr}]`
      });

      // 2. Submit Lead Record
      await submitLead({
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        phone: contactPhone.trim(),
        company_name: companyName.trim() || undefined,
        package_interest: likedAesthetics.length > 0 ? `${aestheticName} (${selectedScopeTier}) [Liked: ${likedListStr}]` : `${aestheticName} (${selectedScopeTier})`,
        timeline: targetDeadline || "3–4 Weeks",
        source: "Marketplace Project Intake",
        project_description: fullDescription
      });

      // 3. Create client project so client sees it immediately on /client!
      await createClientProject({
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        company_name: companyName.trim() || undefined,
        title: `${aestheticName} Website Project`,
        description: clientMessage.trim() ? `${clientMessage.trim()} • Liked Aesthetics: ${likedListStr}` : `Scope: ${selectedScopeTier}. Selected Features: ${featuresList.join(", ")}. Liked Aesthetics: ${likedListStr}`,
        selected_aesthetic: likedAesthetics.length > 0 ? `${aestheticName} (Liked: ${likedListStr})` : aestheticName,
        scope_tier: selectedScopeTier,
        budget_usd: usdPrice,
        budget_inr: inrPrice,
        features_requested: featuresList,
        status: "Discovery",
        progress_percent: 15,
      });

      // Save calculated quote to client hub storage
      saveCalculatedQuote({
        scope_tier: selectedScopeTier,
        selected_aesthetic: aestheticName,
        liked_aesthetics: likedAesthetics,
        features: featuresList,
        timeline: targetDeadline || "3–4 Weeks",
        calculated_price: currentAmount,
        currency: estimatedPriceCurrency || "USD",
        symbol: estimatedPriceSymbol || "$",
        saved_at: new Date().toISOString(),
        social_handle: contactPhone.trim() || undefined,
      });

      // Save to localStorage so /client auto-loads the user's project
      if (typeof window !== "undefined") {
        localStorage.setItem("tanie_client_email", clientEmail.trim().toLowerCase());
        localStorage.setItem("tanie_client_name", clientName.trim());
        localStorage.setItem("tanie_client_phone", contactPhone.trim());
        localStorage.setItem("tanie_liked_aesthetics", JSON.stringify(likedAesthetics));
      }

      setIntakeSuccess(true);
      setTimeout(() => {
        setShowIntakeModal(false);
        setIntakeSuccess(false);
        router.push("/client");
      }, 1800);
    } catch (err) {
      console.error("Submission error:", err);
      setIntakeSuccess(true);
      setTimeout(() => {
        setShowIntakeModal(false);
        router.push("/client");
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Account Create / Login in Intake
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    setIsSubmitting(true);
    setAuthError("");
    try {
      if (authMode === "signup") {
        const { error } = await signUp(authEmail, authPassword);
        if (error) throw error;
      } else {
        const { error } = await signInWithPassword(authEmail, authPassword);
        if (error) throw error;
      }
      await finalizeProjectSubmission();
    } catch (err: unknown) {
      setAuthError((err as Error)?.message || "Auth error. You can click 1-Click Instant Demo below to proceed.");
      setIsSubmitting(false);
    }
  };

  // 1-Click Instant Demo Submission
  const handleInstantDemoSubmit = async () => {
    await finalizeProjectSubmission();
  };

  // Toggle Feature in Intake Checklist
  const toggleFeature = (feat: string) => {
    setFeaturesList((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const categoryKeys: Record<string, keyof typeof pkgCopy.categories> = {
    "All": "all",
    "Editorial & Luxury": "editorial",
    "Modern SaaS & Bento": "saas",
    "3D & Spatial": "spatial3d",
    "Pop & Brutalist": "brutalist",
    "Tactile & Organic": "tactile",
    "Retro, Cyber & Y2K": "cyber",
    "Artistic & Avant-Garde": "artistic"
  };

  return (
    <main
      style={{
        "--color-text-heading": "#0a192f",
        "--color-text-main": "#0a192f",
        color: "#0a192f"
      } as React.CSSProperties}
      className="min-h-screen bg-[#dff4ff] text-[#0a192f] font-sans selection:bg-sky-200 selection:text-black theme-ocean-light pricing-page-theme"
      dir={locale === "ur" ? "rtl" : "ltr"}
    >
      
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT VERTICAL NAVIGATION (DESKTOP - HIDDEN IN FLOW)        */}
      {/* ------------------------------------------------------------- */}
      {funnelStep === 0 && (
        <nav
          aria-label="Side navigation"
          className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-start gap-6 border-r border-black/10 bg-[#dff4ff]/88 py-8 backdrop-blur-xl md:flex"
        >
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/"
              className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
                pathname === "/" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
              }`}
              title={pkgCopy.nav.home}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
              </svg>
              <span className="text-[10px] font-semibold">{pkgCopy.nav.home}</span>
            </Link>

            <Link
              href="/projects"
              className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
                pathname === "/projects" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
              }`}
              title={pkgCopy.nav.projects}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-[10px] font-semibold">{pkgCopy.nav.projects}</span>
            </Link>

            <Link
              href="/pricing"
              className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
                pathname === "/pricing" || pathname === "/packages" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
              }`}
              title={pkgCopy.nav.pricing}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-[10px] font-semibold">{pkgCopy.nav.pricing}</span>
            </Link>

            {user && (
              <Link
                href="/client"
                className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
                  pathname === "/client" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
                }`}
                title={pkgCopy.nav.clientHub}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] font-semibold">{pkgCopy.nav.clientHub}</span>
              </Link>
            )}

            <Link
              href="/qna"
              className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
                pathname === "/qna" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
              }`}
              title={pkgCopy.nav.qna}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-semibold">{pkgCopy.nav.qna}</span>
            </Link>

            {user ? (
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all !text-black hover:bg-rose-500/15 hover:!text-rose-600 cursor-pointer"
                title="Sign Out"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-[10px] font-semibold">Logout</span>
              </button>
            ) : (
              <Link
                href="/auth"
                className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
                  pathname === "/auth" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
                }`}
                title="Sign In"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="text-[10px] font-semibold">Login</span>
              </Link>
            )}

            <Link
              href="/contact"
              className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
                pathname === "/contact" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
              }`}
              title={pkgCopy.nav.contact}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
              </svg>
              <span className="text-[10px] font-semibold">{pkgCopy.nav.contact}</span>
            </Link>
          </div>
        </nav>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MOBILE TOP HEADER (HIDDEN IN FLOW)                         */}
      {/* ------------------------------------------------------------- */}
      {funnelStep === 0 && (
        <header className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/10 bg-[#dff4ff]/90 px-4 backdrop-blur-xl md:hidden">
          <Link href="/" className="flex items-center gap-1.5 !no-underline !text-black font-semibold text-sm">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{pkgCopy.nav.home}</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-800">
            {pkgCopy.nav.mobileMarketplace}
          </span>
          <button
            type="button"
            onClick={handleStartQuestionnaire}
            className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-white shadow-xs cursor-pointer"
          >
            {pkgCopy.nav.mobileBuild}
          </button>
        </header>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN PAGE CONTAINER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className={`${funnelStep === 0 ? "pl-0 md:pl-20" : "pl-0 flex items-center justify-center"} min-h-screen flex flex-col`}>
        {/* SECTION 1: HERO & 4-QUESTION COST CALCULATOR FUNNEL (COVERS WHOLE SCREEN) */}
        <section
          className={
            funnelStep === 0
              ? "min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 relative w-full pt-16 md:pt-0"
              : "w-full py-8 sm:py-16 mx-auto max-w-7xl px-4"
          }
        >
          <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center">
            <WebsiteCostCalculatorFunnel
              onStepChange={setFunnelStep}
              onProceedWithCustomQuote={handleProceedWithCostCalculatorFunnel}
            />
          </div>

          {/* Visual indicator showing Section 2 starts later below */}
          {funnelStep === 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity pointer-events-none">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#0a192f] font-bold">
                Scroll for Design Aesthetics
              </span>
              <span className="animate-bounce text-sm text-[#0a192f]">↓</span>
            </div>
          )}
        </section>

        {/* SECTION 2: DIRECT AESTHETICS LISTING & FILTER BAR (Starts later below the fold) */}
        {funnelStep === 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-8 pt-20 pb-28 border-t border-sky-300/40 w-full">
            <AestheticsGridSection
              likedAesthetics={likedAesthetics}
              onToggleLike={toggleLikeAesthetic}
              onSelectPreview={setPreviewStyleModal}
              pkgCopy={pkgCopy}
            />
          </section>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. AESTHETIC PREVIEW MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      <AestheticPreviewModal
        style={previewStyleModal}
        isLiked={previewStyleModal ? likedAesthetics.includes(previewStyleModal.name) : false}
        onToggleLike={toggleLikeAesthetic}
        onClose={() => setPreviewStyleModal(null)}
        pkgCopy={pkgCopy}
      />

      {/* ------------------------------------------------------------- */}
      {/* 5. PROJECT INTAKE & ONBOARDING DRAWER                         */}
      {/* ------------------------------------------------------------- */}
      <ProjectIntakeModal
        isOpen={showIntakeModal}
        onClose={() => setShowIntakeModal(false)}
        onSubmit={handleIntakeSubmit}
        isSubmitting={isSubmitting}
        intakeSuccess={intakeSuccess}
        selectedAesthetic={selectedAestheticForRequest}
        selectedScopeTier={selectedScopeTier}
        estimatedPriceAmount={estimatedPriceAmount}
        estimatedPriceSymbol={estimatedPriceSymbol}
        estimatedPriceCurrency={estimatedPriceCurrency}
        countryName={tierConfig.countryName}
        featuresList={featuresList}
        likedAesthetics={likedAesthetics}
        clientName={clientName}
        setClientName={setClientName}
        clientEmail={clientEmail}
        setClientEmail={setClientEmail}
        contactPhone={contactPhone}
        setContactPhone={setContactPhone}
        companyName={companyName}
        setCompanyName={setCompanyName}
        clientMessage={clientMessage}
        setClientMessage={setClientMessage}
        locale={locale}
      />

    </main>
  );
}
