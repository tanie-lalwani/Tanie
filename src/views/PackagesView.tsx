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
import CustomScopeCalculator from "@/components/CustomScopeCalculator";
import WebsiteCostCalculatorFunnel from "@/components/packages/WebsiteCostCalculatorFunnel";
import MarketingFunnelSuite from "@/components/packages/MarketingFunnelSuite";
import { useLanguage } from "@/context/LanguageContext";
import { packagesTranslations } from "@/data/packagesTranslations";

export default function PackagesView() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, signInWithPassword, signUp, signOut } = useAuth();
  const { copy, locale } = useLanguage();
  const pkgCopy = packagesTranslations[locale] || packagesTranslations.en;

  // Active View Tab: "home" (Overview & Scope), "marketing" (Full-Funnel Campaign Engine), "calculator" (Interactive Estimator), "gallery" (Browse Aesthetics), "wizard" (Make Your Website Questionnaire), "results" (Curated Suggestions)
  const [activeTab, setActiveTab] = useState<"home" | "marketing" | "calculator" | "gallery" | "wizard" | "results">("home");

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
  const [estimatedPriceInr, setEstimatedPriceInr] = useState<number | null>(240000);

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

  // FAQ open index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

    // Calculate clear estimated pricing based on scope tier
    let usd = 2899;
    let inr = 240000;
    if (defaultScope.toLowerCase().includes("starter")) {
      usd = 1499;
      inr = 120000;
    } else if (defaultScope.toLowerCase().includes("flagship") || defaultScope.toLowerCase().includes("custom") || defaultScope.toLowerCase().includes("3d")) {
      usd = 4999;
      inr = 400000;
    }
    setEstimatedPriceUsd(usd);
    setEstimatedPriceInr(inr);

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
    
    // Safely extract price without undefined!
    const inr = quoteData.finalTotalInr ?? quoteData.totalPriceInr ?? 240000;
    const usd = quoteData.finalTotalUsd ?? quoteData.totalPriceUsd ?? 2899;
    setEstimatedPriceInr(inr);
    setEstimatedPriceUsd(usd);
    if (quoteData.currency) setCurrency(quoteData.currency);

    const goalLabel = quoteData.goal || quoteData.industry || "Custom Bespoke Build";
    setSelectedScopeTier(`Goal: ${goalLabel}`);
    setTargetDeadline(quoteData.timeline || "3–4 Weeks");
    setShowIntakeModal(true);
    setAuthStepRequired(false);
  };

  // Handle direct booking from Marketing Funnel Suite
  const handleBookMarketingPackage = (marketingData: {
    packageName: string;
    businessModel: string;
    selectedItems: string[];
    priceInr: number;
    priceUsd: number;
    timeline: string;
  }) => {
    const title = `${marketingData.packageName} (${marketingData.businessModel})`;
    setProjectName(title);
    setCompanyName(marketingData.businessModel);
    setFeaturesList(marketingData.selectedItems);
    setEstimatedPriceInr(marketingData.priceInr);
    setEstimatedPriceUsd(marketingData.priceUsd);
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
      const inrPrice = estimatedPriceInr ?? (currency === "INR" ? 240000 : Math.round(2899 * 83));
      const usdPrice = estimatedPriceUsd ?? (currency === "USD" ? 2899 : Math.round(240000 / 83));

      const fullDescription = `
[Website Booking Intake]
📞 Phone / WhatsApp: ${contactPhone.trim()}
💎 Aesthetic & Scope: ${aestheticName} • ${selectedScopeTier}
💰 Estimated Investment: ₹${inrPrice.toLocaleString()} ($${usdPrice.toLocaleString()} USD)
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
        selected_aesthetic: aestheticName,
        scope_tier: selectedScopeTier,
        selected_addons: featuresList,
        estimated_budget_usd: usdPrice,
        estimated_budget_inr: inrPrice,
        timeline_requirement: targetDeadline || "3–4 Weeks",
        project_description: fullDescription,
        client_message: clientMessage.trim()
      });

      // 2. Submit Lead Record
      await submitLead({
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        phone: contactPhone.trim(),
        company_name: companyName.trim() || undefined,
        package_interest: `${aestheticName} (${selectedScopeTier})`,
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
        description: clientMessage.trim() || `Scope: ${selectedScopeTier}. Selected Features: ${featuresList.join(", ")}`,
        selected_aesthetic: aestheticName,
        scope_tier: selectedScopeTier,
        budget_usd: usdPrice,
        budget_inr: inrPrice,
        features_requested: featuresList,
        status: "Discovery",
        progress_percent: 15,
      });

      // Save to localStorage so /client auto-loads the user's project
      if (typeof window !== "undefined") {
        localStorage.setItem("tanie_client_email", clientEmail.trim().toLowerCase());
        localStorage.setItem("tanie_client_name", clientName.trim());
        localStorage.setItem("tanie_client_phone", contactPhone.trim());
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
            <div className="space-y-12">
            {/* Category Filter Pills & Detailed Matrix Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      if (activeTab === "calculator") setActiveTab("home");
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === cat && activeTab !== "calculator"
                        ? "bg-[#0a192f] text-white shadow-sm"
                        : "bg-[#c8ecff]/30 text-sky-950 hover:bg-[#c8ecff]/50 border border-sky-300/80"
                    }`}
                  >
                    {categoryKeys[cat] ? pkgCopy.categories[categoryKeys[cat]] : cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "marketing" ? "home" : "marketing")}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-1.5 ${
                    activeTab === "marketing"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 font-black shadow-md scale-105"
                      : "bg-emerald-100/80 text-emerald-950 hover:bg-emerald-200/90 border-emerald-300 font-extrabold"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>🚀 BOFU Website Engine & Sources</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "calculator" ? "home" : "calculator")}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    activeTab === "calculator"
                      ? "bg-sky-600 text-white border-sky-500 font-bold shadow-md"
                      : "bg-[#c8ecff]/30 text-sky-950 hover:bg-[#c8ecff]/50 border border-sky-300/80"
                  }`}
                >
                  <span>⚡</span>
                  <span className="ml-1.5">{activeTab === "calculator" ? pkgCopy.aesthetics.showCatalog : pkgCopy.aesthetics.showMatrix}</span>
                </button>
              </div>
            </div>

            {/* VIEW: MARKETING CAMPAIGNS FULL-FUNNEL PACKAGE (MARKETING TAB) */}
            {activeTab === "marketing" && (
              <div className="space-y-8 animate-fadeIn">
                <MarketingFunnelSuite
                  currency={currency}
                  onCurrencyChange={setCurrency}
                  onBookMarketingPackage={handleBookMarketingPackage}
                />
              </div>
            )}

            {/* VIEW: INTERACTIVE SCOPE & PRICE ESTIMATOR (CALCULATOR TAB) */}
            {activeTab === "calculator" && (
              <div className="space-y-8">
                <CustomScopeCalculator
                  currency={currency}
                  onCurrencyChange={setCurrency}
                  onProceedWithScope={handleProceedWithScope}
                />
              </div>
            )}

            {/* PROMO BANNER FOR MARKETING SUITE (SHOWN ON HOME) */}
            {activeTab === "home" && (
              <div className="relative overflow-hidden rounded-3xl border border-emerald-300/80 bg-gradient-to-r from-emerald-100/90 via-teal-50/90 to-sky-100/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 shrink-0 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                    🚀
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                        New Launch
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        BOFU Website Marketing & Sources Management Package
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      Need 1-click checkouts, urgency countdowns, offer banners, 4K galleries, and multi-channel UTM source tracking on your website?
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("marketing")}
                  className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-sm"
                >
                  Explore BOFU Suite →
                </button>
              </div>
            )}

            {/* DIRECT AESTHETICS CARDS GRID */}
            {activeTab === "home" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStyles.map((style) => (
                  <div
                    key={style.id}
                    className="flex flex-col justify-between rounded-[2.2rem] border border-sky-300/80 bg-[#c8ecff]/30 hover:bg-[#c8ecff]/50 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div>
                      {/* Badge & Category */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-sky-100 border border-sky-200 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-950">
                          {style.category}
                        </span>
                        <span className="text-[11px] font-bold text-sky-800/80">
                          {style.badge}
                        </span>
                      </div>

                      {/* Mock Mini Wireframe Preview */}
                      <div
                        className="rounded-2xl p-4 mb-5 border border-black/10 overflow-hidden cursor-pointer"
                        style={{ backgroundColor: style.mockWireframe.bgColor, color: style.mockWireframe.textColor }}
                        onClick={() => setPreviewStyleModal(style)}
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
                      <h3 className="text-xl font-bold mb-1 text-[#0a192f]">
                        {style.name}
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

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-sky-200/80">
                      <button
                        type="button"
                        onClick={() => setPreviewStyleModal(style)}
                        className="flex-1 rounded-xl border border-sky-300/80 bg-white/70 py-2 text-xs font-bold text-[#0a192f] hover:bg-white transition cursor-pointer"
                      >
                        {pkgCopy.aesthetics.inspectPreview}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChooseAesthetic(style, "Business")}
                        className="flex-1 rounded-xl bg-[#0a192f] py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                      >
                        {pkgCopy.aesthetics.chooseStyle}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Currency & Addon Modules */}
            <div className="rounded-[2.4rem] border border-sky-300/80 bg-[#c8ecff]/30 p-6 sm:p-10 shadow-md backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">{pkgCopy.addons.tag}</span>
                  <h3 className="text-2xl font-bold text-[#0a192f] mt-0.5">{pkgCopy.addons.title}</h3>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-sky-300/80 bg-white/70 p-1">
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${currency === "USD" ? "bg-[#0a192f] text-white" : "text-sky-950 hover:text-sky-700"}`}
                  >
                    $ USD
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("INR")}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${currency === "INR" ? "bg-[#0a192f] text-white" : "text-sky-950 hover:text-sky-700"}`}
                  >
                    ₹ INR
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {[
                  { name: pkgCopy.addons.cms.name, usd: 499, inr: 41000, desc: pkgCopy.addons.cms.desc },
                  { name: pkgCopy.addons.ai.name, usd: 599, inr: 49000, desc: pkgCopy.addons.ai.desc },
                  { name: pkgCopy.addons.audio.name, usd: 299, inr: 24000, desc: pkgCopy.addons.audio.desc }
                ].map((a, i) => (
                  <div key={i} className="rounded-2xl border border-sky-200/80 bg-white/50 p-4">
                    <div className="flex items-center justify-between font-bold text-[#0a192f] mb-1">
                      <span>{a.name}</span>
                      <span className="text-sky-700">{currency === "USD" ? `+$${a.usd}` : `+₹${a.inr.toLocaleString()}`}</span>
                    </div>
                    <p className="text-sky-900/70 text-[11px]">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="rounded-[2.4rem] border border-sky-300/80 bg-[#c8ecff]/30 p-6 sm:p-10 shadow-md backdrop-blur-xl">
              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">Client FAQ</span>
                <h3 className="text-2xl font-bold text-[#0a192f] mt-0.5">How Working Together Works</h3>
              </div>
              <div className="space-y-3">
                {[
                  { q: "How does the aesthetic + scope model work?", a: "You select any aesthetic visual archetype you like from our gallery (or discover one via our questionnaire). Then, depending on whether you need a 1-3 page landing page, a 4-7 page business site, or a full 3D custom web app, we scope the project milestones transparently." },
                  { q: "What happens after I request a website?", a: "Your project is instantly created on your dedicated Client Board (/client). You can review the milestone scope, upload assets to the dropzone, request modifications, and execute the digital agreement." },
                  { q: "Can I request changes during development?", a: "Yes! Your Client Board includes an interactive Changes & Requests log where you can submit revision requests (e.g. 'make hero less dark', 'round buttons') and track them in real time." }
                ].map((faq, idx) => (
                  <div key={idx} className="rounded-2xl border border-sky-200/80 bg-white/50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-sm text-[#0a192f] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-sky-700">{openFaqIndex === idx ? "−" : "+"}</span>
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-5 pb-4 text-xs text-sky-950/80 leading-relaxed border-t border-sky-200/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          {/* ------------------------------------------------------------- */}
          {/* VIEW C: "MAKE YOUR WEBSITE" 5-QUESTION FLOW                   */}
          {/* ------------------------------------------------------------- */}
          {activeTab === "wizard" && (
            <div className="max-w-3xl mx-auto">
              
              {/* Top Bar for Wizard */}
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className="rounded-full bg-white/80 border border-black/10 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
                <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Question {wizardStep} of 5
                </div>
              </div>

              <div className="rounded-[2.4rem] border border-black/10 bg-white/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                
                {/* STEP 1: What are you building? */}
                {wizardStep === 1 && (
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Step 1 of 5</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 mb-2">
                      What are you building?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mb-6">
                      Pick the primary purpose of your new website.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Portfolio", "Business", "Restaurant", "Agency", "SaaS", "Personal Brand", "E-Commerce", "Other"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setWizardAnswers((p) => ({ ...p, buildingType: item }));
                            setWizardStep(2);
                          }}
                          className={`rounded-2xl border p-4 text-center transition-all cursor-pointer font-bold text-sm ${
                            wizardAnswers.buildingType === item
                              ? "border-sky-500 bg-sky-50 text-sky-950 ring-2 ring-sky-300 shadow-sm"
                              : "border-black/8 bg-white/70 hover:bg-white text-slate-800"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: What's the vibe? */}
                {wizardStep === 2 && (
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Step 2 of 5</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 mb-2">
                      What&apos;s the vibe?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mb-6">
                      Select the primary emotional aesthetic and atmosphere you want to evoke.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        "Elegant & Serif",
                        "Luxury Minimal",
                        "Bold & Playful",
                        "Dark & Cinematic",
                        "Soft & Organic",
                        "Modern SaaS Bento",
                        "Brutalist",
                        "Y2K & Chromecore",
                        "Futuristic & Cyber",
                        "3D Spatial",
                        "Kinetic Typography",
                        "Ethereal Mist"
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setWizardAnswers((p) => ({ ...p, vibe: item }));
                            setWizardStep(3);
                          }}
                          className={`rounded-2xl border p-3.5 text-center transition-all cursor-pointer font-bold text-xs ${
                            wizardAnswers.vibe === item
                              ? "border-sky-500 bg-sky-50 text-sky-950 ring-2 ring-sky-300 shadow-sm"
                              : "border-black/8 bg-white/70 hover:bg-white text-slate-800"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: What should visitors feel? */}
                {wizardStep === 3 && (
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Step 3 of 5</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 mb-2">
                      What should visitors feel?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mb-6">
                      Click a quick preset or type your vision in your own words.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        "I want it to feel expensive and artistic.",
                        "Clean, authoritative, and trustworthy.",
                        "High energy, playful, and unforgettable.",
                        "Calm, serene, organic, and grounded.",
                        "Cutting-edge, futuristic, and high-tech."
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setWizardAnswers((p) => ({ ...p, visitorFeeling: preset }))}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition cursor-pointer ${
                            wizardAnswers.visitorFeeling === preset
                              ? "bg-sky-600 text-white border-sky-600"
                              : "bg-slate-100 text-slate-700 border-black/8 hover:bg-white"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={wizardAnswers.visitorFeeling}
                      onChange={(e) => setWizardAnswers((p) => ({ ...p, visitorFeeling: e.target.value }))}
                      placeholder="e.g. I want visitors to feel like they just walked into an exclusive high-end design gallery..."
                      className="w-full rounded-2xl border border-black/15 bg-white p-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 resize-none"
                    />

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setWizardStep(4)}
                        className="rounded-full bg-slate-950 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg hover:bg-slate-800 transition cursor-pointer"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: References */}
                {wizardStep === 4 && (
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Step 4 of 5</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 mb-2">
                      Do you have references?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mb-6">
                      Paste websites, studios, or mood links that inspire you (optional).
                    </p>

                    <textarea
                      rows={3}
                      value={wizardAnswers.references}
                      onChange={(e) => setWizardAnswers((p) => ({ ...p, references: e.target.value }))}
                      placeholder="e.g. apple.com, stripe.com, minimal editorial portfolios..."
                      className="w-full rounded-2xl border border-black/15 bg-white p-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 resize-none"
                    />

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setWizardStep(5)}
                        className="rounded-full bg-slate-950 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg hover:bg-slate-800 transition cursor-pointer"
                      >
                        Next Step →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: How big is the website? */}
                {wizardStep === 5 && (
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Step 5 of 5</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 mb-2">
                      How big is the website?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mb-6">
                      Pick your estimated scope.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { title: "1–3 pages", desc: "Starter / High-Impact Landing Page" },
                        { title: "4–7 pages", desc: "Business / Full Company Experience" },
                        { title: "8+ pages", desc: "Custom Flagship / WebGL / Portal" }
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => {
                            setWizardAnswers((p) => ({ ...p, scopeSize: item.title }));
                            setActiveTab("results");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                            wizardAnswers.scopeSize?.includes(item.title)
                              ? "border-sky-500 bg-sky-50 text-sky-950 ring-2 ring-sky-300 shadow-md"
                              : "border-black/8 bg-white/70 hover:bg-white text-slate-800"
                          }`}
                        >
                          <div className="font-extrabold text-base mb-1 text-slate-950">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stepper Progress Bar */}
                <div className="mt-8 pt-6 border-t border-black/8 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setWizardStep((p) => Math.max(1, p - 1))}
                    disabled={wizardStep === 1}
                    className="font-bold text-slate-500 hover:text-black disabled:opacity-30 cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <div className="h-2 w-32 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-sky-600 transition-all duration-300"
                      style={{ width: `${(wizardStep / 5) * 100}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW D: CURATED SUGGESTIONS RESULTS                           */}
          {/* ------------------------------------------------------------- */}
          {activeTab === "results" && (
            <div className="space-y-8">
              
              {/* Results Top Header */}
              <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 border border-sky-200 px-3.5 py-1 text-xs font-bold text-sky-950 mb-2">
                  <span>✓</span>
                  <span>Recommendation Generated</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0a192f] mb-2">
                  We found {recommendationData.matches.length} aesthetics for your vision.
                </h2>
                <p className="text-xs sm:text-sm text-sky-900/80">
                  Based on your {wizardAnswers.buildingType} project and desired {wizardAnswers.vibe} aesthetic, here are the top curated visual archetypes. Click any direction to request your build.
                </p>
              </div>

              {/* Matched Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendationData.matches.map(({ style, matchScore, matchReason }, idx) => (
                  <div
                    key={style.id}
                    className={`flex flex-col justify-between rounded-[2.2rem] border p-6 transition-all duration-300 backdrop-blur-xl ${
                      idx === 0
                        ? "border-sky-400 bg-gradient-to-b from-[#c8ecff]/40 via-sky-50/70 to-[#c8ecff]/40 shadow-xl ring-2 ring-sky-300/40"
                        : "border-sky-300/80 bg-[#c8ecff]/30 shadow-md hover:-translate-y-1 hover:shadow-xl hover:bg-[#c8ecff]/50"
                    }`}
                  >
                    <div>
                      {/* Top Match Score Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-sky-100 border border-sky-200 px-2.5 py-0.5 text-[10px] font-extrabold text-sky-950">
                          {matchScore}% Match
                        </span>
                        <span className="text-[11px] font-bold text-sky-800/80">{style.category}</span>
                      </div>

                      {/* Mini Wireframe Mockup */}
                      <div
                        className="rounded-2xl p-4 mb-4 border border-black/8 overflow-hidden cursor-pointer"
                        style={{ backgroundColor: style.mockWireframe.bgColor, color: style.mockWireframe.textColor }}
                        onClick={() => setPreviewStyleModal(style)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="h-2 w-10 rounded-full" style={{ backgroundColor: style.mockWireframe.accentColor }} />
                          <span className="text-[9px] font-mono opacity-60">{style.mockWireframe.badgeText}</span>
                        </div>
                        <h4 className="text-xs font-bold line-clamp-1 mb-1">{style.mockWireframe.heroHeading}</h4>
                        <p className="text-[10px] opacity-70 line-clamp-2 leading-relaxed">{style.mockWireframe.heroSubheading}</p>
                      </div>

                      <h3 className="text-xl font-bold text-[#0a192f] mb-1">{style.name}</h3>
                      <p className="text-xs text-sky-900/80 line-clamp-2 mb-3 leading-relaxed">{style.tagline}</p>

                      <div className="rounded-xl bg-white/60 border border-sky-200/80 p-2.5 mb-4 text-[11px] text-sky-950">
                        💡 {matchReason}
                      </div>

                      {/* Color Palette */}
                      <div className="mb-4">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-800 mb-1">
                          Signature Colors
                        </span>
                        <div className="flex items-center gap-2">
                          {style.defaultPalette.map((swatch) => (
                            <div
                              key={swatch.name}
                              className="h-5 w-5 rounded-full border border-black/15 shadow-2xs"
                              style={{ backgroundColor: swatch.hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-3 border-t border-sky-200/80 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewStyleModal(style)}
                        className="flex-1 rounded-xl border border-sky-300/80 bg-white/70 py-2 text-xs font-bold text-[#0a192f] hover:bg-white transition cursor-pointer"
                      >
                        Preview DNA
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChooseAesthetic(style, wizardAnswers.scopeSize || "Business")}
                        className="flex-1 rounded-xl bg-[#0a192f] py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                      >
                        Choose This →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Retake or Browse */}
              <div className="text-center pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setWizardStep(1);
                    setActiveTab("wizard");
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-black underline underline-offset-4 cursor-pointer"
                >
                  🔄 Retake Questionnaire with different parameters
                </button>
              </div>

            </div>
          )}
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

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">
              {previewStyleModal.category}
            </span>
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

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-black/8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewStyleModal(null)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
              >
                {pkgCopy.intakeModal.close}
              </button>
              <button
                type="button"
                onClick={() => handleChooseAesthetic(previewStyleModal, "Business")}
                className="rounded-full bg-slate-950 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 transition cursor-pointer shadow-md"
              >
                {pkgCopy.aesthetics.chooseStyle}
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
                        {currency === "INR"
                          ? `₹${(estimatedPriceInr ?? 240000).toLocaleString()}`
                          : `$${(estimatedPriceUsd ?? 2899).toLocaleString()}`}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {currency === "INR"
                          ? `(Approx. $${(estimatedPriceUsd ?? 2899).toLocaleString()} USD)`
                          : `(Approx. ₹${(estimatedPriceInr ?? 240000).toLocaleString()})`}
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
