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
      <div className={`${funnelStep === 0 ? "pl-0 md:pl-20" : "pl-0 flex items-center justify-center"} min-h-screen`}>
        <div className={`mx-auto max-w-7xl px-4 ${funnelStep === 0 ? "pt-20 pb-16 sm:px-8 sm:pt-14 sm:pb-24" : "py-8 sm:py-16 w-full"}`}>
          
          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: HERO & 4-QUESTION COST CALCULATOR FUNNEL          */}
          {/* ------------------------------------------------------------- */}
          <div className={funnelStep === 0 ? "mb-16" : "w-full"}>
            <WebsiteCostCalculatorFunnel
              onStepChange={setFunnelStep}
              onProceedWithCustomQuote={handleProceedWithCostCalculatorFunnel}
            />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 2: DIRECT AESTHETICS LISTING & FILTER BAR (Step 0)    */}
          {/* ------------------------------------------------------------- */}
          {funnelStep === 0 && (
            <div className="space-y-8">
              {/* Section 2 Header: Pure Design Aesthetics & Inspirations */}
              <div className="text-center max-w-2xl mx-auto pt-4">
                <h2 className="text-3xl sm:text-4xl font-black text-[#0a192f] tracking-tight">
                  Choose Your Design Aesthetic
                </h2>
                {likedAesthetics.length > 0 && (
                  <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-rose-50/90 border border-rose-200/90 px-4 py-1.5 text-xs text-rose-900 shadow-2xs">
                    <span className="font-bold flex items-center gap-1.5 text-rose-700">
                      <span>❤️</span>
                      <span>Liked Aesthetics ({likedAesthetics.length}):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {likedAesthetics.map((name) => (
                        <span
                          key={name}
                          className="inline-flex items-center gap-1 rounded-lg bg-white border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-800 shadow-2xs"
                        >
                          <span>{name}</span>
                          <button
                            type="button"
                            onClick={() => toggleLikeAesthetic(name)}
                            className="text-rose-400 hover:text-rose-700 ml-0.5 text-xs font-black cursor-pointer"
                            title="Remove like"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DIRECT AESTHETICS CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                {AESTHETIC_STYLES.map((style) => {
                  const isLiked = likedAesthetics.includes(style.name);
                  return (
                    <div
                      key={style.id}
                      onClick={() => setPreviewStyleModal(style)}
                      className={`flex flex-col justify-between rounded-[2.2rem] border p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${
                        isLiked
                          ? "border-rose-300/90 bg-rose-50/30 hover:bg-rose-50/50 ring-2 ring-rose-400/40"
                          : "border-sky-300/80 bg-[#c8ecff]/30 hover:bg-[#c8ecff]/50"
                      }`}
                    >
                      <div>
                        {/* Badge, Category & Direct Like Button */}
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <span className="rounded-full bg-sky-100 border border-sky-200 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-950">
                            {style.category}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-sky-800/80 hidden sm:inline">
                              {style.badge}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLikeAesthetic(style.name);
                              }}
                              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition shadow-2xs cursor-pointer border ${
                                isLiked
                                  ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-rose-200"
                                  : "bg-white/85 hover:bg-white text-slate-700 border-black/10 hover:text-rose-600"
                              }`}
                              title={isLiked ? "Unlike this design aesthetic" : "Like this design aesthetic"}
                            >
                              <span>{isLiked ? "❤️" : "🤍"}</span>
                              <span>{isLiked ? "Liked" : "Like"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Mock Mini Wireframe Preview */}
                        <div
                          className="rounded-2xl p-4 mb-5 border border-black/10 overflow-hidden"
                          style={{ backgroundColor: style.mockWireframe.bgColor, color: style.mockWireframe.textColor }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="h-2 w-12 rounded-full" style={{ backgroundColor: style.mockWireframe.accentColor }} />
                            <span className="text-[9px] font-mono opacity-60">{style.mockWireframe.badgeText}</span>
                          </div>
                          <h4 className="text-xs font-bold line-clamp-1 mb-1" style={{ color: style.mockWireframe.textColor }}>
                            {style.mockWireframe.heroHeading}
                          </h4>
                          <p className="text-[10px] opacity-70 line-clamp-2 leading-relaxed mb-3">
                            {style.mockWireframe.heroSubheading}
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className="rounded-md px-2.5 py-1 text-[9px] font-bold"
                              style={{ backgroundColor: style.mockWireframe.accentColor, color: style.mockWireframe.bgColor === "#02040a" || style.mockWireframe.bgColor.includes("#0") ? "#fff" : "#000" }}
                            >
                              {style.mockWireframe.ctaText}
                            </div>
                          </div>
                        </div>

                        {/* Title & Tagline */}
                        <h3 className="text-xl font-bold mb-1 text-[#0a192f] flex items-center justify-between">
                          <span>{style.name}</span>
                          {isLiked && <span className="text-sm text-rose-500 font-normal">❤️</span>}
                        </h3>
                        <p className="text-xs mb-4 leading-relaxed text-sky-950/80 line-clamp-2">
                          {style.tagline}
                        </p>

                        {/* Color Palette Swatches */}
                        <div className="mb-4">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-800 mb-1.5">
                            {pkgCopy.aesthetics.colorDna}
                          </span>
                          <div className="flex items-center gap-2">
                            {style.defaultPalette.map((swatch) => (
                              <div
                                key={swatch.name}
                                className="h-6 w-6 rounded-full border border-black/15 shadow-2xs"
                                style={{ backgroundColor: swatch.hex }}
                                title={`${swatch.name} (${swatch.hex})`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack Badges */}
                        <div className="mb-6 flex flex-wrap gap-1.5">
                          {style.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-sky-200/60 bg-sky-100/70 px-2 py-0.5 text-[10px] font-semibold text-sky-900"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons: Inspect & Like */}
                      <div className="pt-4 border-t border-sky-200/80 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewStyleModal(style);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0a192f] py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
                        >
                          <span>Inspect Design Vibe</span>
                          <span>👁️</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeAesthetic(style.name);
                          }}
                          className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer border shadow-xs ${
                            isLiked
                              ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600"
                              : "bg-white hover:bg-rose-50 text-slate-800 border-sky-300 hover:text-rose-600"
                          }`}
                        >
                          <span>{isLiked ? "❤️" : "🤍"}</span>
                          <span>{isLiked ? "Liked" : "Like"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. AESTHETIC PREVIEW MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      {previewStyleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewStyleModal(null);
          }}
        >
          <div className="relative w-full max-w-2xl rounded-[2.4rem] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPreviewStyleModal(null)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full border border-black/10 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              ×
            </button>

            <div className="flex items-center justify-between mb-1 pr-10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">
                {previewStyleModal.category}
              </span>
              <button
                type="button"
                onClick={() => toggleLikeAesthetic(previewStyleModal.name)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition shadow-xs cursor-pointer border ${
                  likedAesthetics.includes(previewStyleModal.name)
                    ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600"
                    : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                }`}
              >
                <span>{likedAesthetics.includes(previewStyleModal.name) ? "❤️" : "🤍"}</span>
                <span>{likedAesthetics.includes(previewStyleModal.name) ? "Liked" : "Like This Vibe"}</span>
              </button>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mt-1 mb-1 text-slate-950">
              {previewStyleModal.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">
              {previewStyleModal.vibeSummary || "High-fidelity digital direction · Bespoke typography · Custom shaders"}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              {previewStyleModal.description}
            </p>

            {/* Visual DNA Principles */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Visual DNA Principles</h4>
              <ul className="space-y-1.5">
                {previewStyleModal.visualDna.map((dna) => (
                  <li key={dna} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-sky-600 font-bold">✓</span>
                    <span>{dna}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Palette Preview */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Color Palette Swatches</h4>
              <div className="flex flex-wrap gap-2">
                {previewStyleModal.palettes.map((p, idx) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setActivePaletteIdx(idx)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-xs cursor-pointer ${
                      activePaletteIdx === idx ? "border-sky-500 bg-sky-50 ring-1 ring-sky-300" : "border-black/10 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center -space-x-1">
                      {p.swatches.map((s) => (
                        <div key={s.name} className="h-4 w-4 rounded-full border border-black/20" style={{ backgroundColor: s.hex }} />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800 text-[11px]">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action: Like & Close */}
            <div className="pt-4 border-t border-black/8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleLikeAesthetic(previewStyleModal.name)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border shadow-sm ${
                  likedAesthetics.includes(previewStyleModal.name)
                    ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600"
                    : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300"
                }`}
              >
                <span>{likedAesthetics.includes(previewStyleModal.name) ? "❤️" : "🤍"}</span>
                <span>
                  {likedAesthetics.includes(previewStyleModal.name)
                    ? "Design Aesthetic Liked!"
                    : "Like This Aesthetic"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewStyleModal(null)}
                className="rounded-full bg-[#0a192f] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition cursor-pointer shadow-sm"
              >
                {pkgCopy.intakeModal.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. "REQUEST THIS WEBSITE" PROJECT INTAKE & ONBOARDING DRAWER  */}
      {/* ------------------------------------------------------------- */}
      {showIntakeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowIntakeModal(false);
          }}
        >
          <div
            className="relative w-full max-w-xl rounded-[2.4rem] border border-sky-300/80 bg-[#dff4ff]/95 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl"
            dir={locale === "ur" ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={() => setShowIntakeModal(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full border border-sky-300/80 text-lg flex items-center justify-center text-sky-900 hover:bg-sky-100 cursor-pointer"
            >
              ×
            </button>

            {intakeSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 border border-sky-200 text-[#0a192f] text-3xl mb-4">
                  🎉
                </div>
                <h3 className="text-2xl font-black text-[#0a192f] mb-2">Booking & Scope Saved!</h3>
                <p className="text-xs text-sky-900/80 mb-4">
                  Your project and estimated pricing have been saved to your workspace. Redirecting to your Client Hub...
                </p>
                <div className="animate-spin h-5 w-5 border-2 border-sky-600 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100/70 border border-sky-200 px-2.5 py-0.5 rounded-full">
                    Fast Booking • Direct to Studio
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#0a192f] mt-1 mb-1">
                  Book Your Website Project
                </h3>
                <p className="text-xs text-sky-900/80 mb-4">
                  Confirm your contact details. Your selected options and estimated price are saved directly for both you and Tanie.
                </p>

                {/* SELECTED OPTIONS & ESTIMATED PRICE SUMMARY CARD */}
                <div className="rounded-2xl border border-sky-300/90 bg-white/80 p-4 mb-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Selected Direction</span>
                      <div className="text-sm font-black text-[#0a192f]">
                        {selectedAestheticForRequest?.name || "Bespoke Web Design"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Foundation: <span className="font-bold text-slate-800">{selectedScopeTier}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Estimated Investment</span>
                      <div className="text-xl sm:text-2xl font-black text-[#0a192f]">
                        {estimatedPriceSymbol}{(estimatedPriceAmount ?? 2899).toLocaleString()} {estimatedPriceCurrency}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-700">
                        📍 {tierConfig.countryName} Market Pricing
                      </div>
                    </div>
                  </div>

                  {featuresList.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Selected Modules & Features ({featuresList.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {featuresList.map((feat, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-sky-50 border border-sky-200/80 px-2 py-0.5 text-[10px] font-semibold text-sky-950"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {likedAesthetics.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-sky-100">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1.5">
                        Liked Aesthetics Attached ({likedAesthetics.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {likedAesthetics.map((liked) => (
                          <span
                            key={liked}
                            className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-800"
                          >
                            ❤️ {liked}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ESSENTIAL LEAD FORM */}
                <form onSubmit={handleIntakeSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210 / +1..."
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Company or Brand (Optional)
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Apex Living Ltd."
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Project Message & Notes
                    </label>
                    <textarea
                      rows={3}
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      placeholder="Briefly describe what you're building, specific inspirations, or desired launch timeline..."
                      className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 disabled:opacity-50 cursor-pointer mt-2 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Booking & Scope...</span>
                      </>
                    ) : (
                      <span>Confirm Booking & Save Scope →</span>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    🔒 Saved directly to Tanie's studio portal. You can review your saved estimate anytime on the Client Hub.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
