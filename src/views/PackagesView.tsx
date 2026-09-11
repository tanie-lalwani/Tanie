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
  type WebsitePackage
} from "@/lib/portalServices";
import {
  AESTHETIC_STYLES,
  calculateMultipleAestheticRecommendations,
  type AestheticStyle,
  type WizardAnswers
} from "@/data/aestheticDatabase";

export default function PackagesView() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, signInWithPassword, signUp } = useAuth();

  // Active View Tab: "home" (Overview & Scope), "gallery" (Browse Aesthetics), "wizard" (Make Your Website Questionnaire), "results" (Curated Suggestions)
  const [activeTab, setActiveTab] = useState<"home" | "gallery" | "wizard" | "results">("home");

  // Currency toggle: USD or INR
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  // Packages state (loaded from portalServices)
  const [packagesList, setPackagesList] = useState<WebsitePackage[]>(DEFAULT_PACKAGES);

  // Gallery Filter Category
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [previewStyleModal, setPreviewStyleModal] = useState<AestheticStyle | null>(null);

  // Questionnaire State (5 Steps)
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
  const [companyName, setCompanyName] = useState("");
  const [websitePurpose, setWebsitePurpose] = useState("");
  const [pagesRequired, setPagesRequired] = useState("4–7 pages");
  const [featuresList, setFeaturesList] = useState<string[]>(["Lead Capture Form", "Interactive Animations"]);
  const [contentStatus, setContentStatus] = useState<"Ready" | "In Progress" | "Need Copywriting">("In Progress");
  const [targetDeadline, setTargetDeadline] = useState("4 Weeks");
  const [existingWebsite, setExistingWebsite] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [mustHaves, setMustHaves] = useState("");
  const [dealbreakers, setDealbreakers] = useState("");

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
    setWebsitePurpose(wizardAnswers.visitorFeeling || "");
    setShowIntakeModal(true);
    setAuthStepRequired(false);
  };

  // Handle Intake Form Submission
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    if (!user && !isAuthenticated) {
      setAuthEmail(clientEmail.trim());
      setAuthStepRequired(true);
      return;
    }

    await finalizeProjectSubmission();
  };

  // Finalize Submission
  const finalizeProjectSubmission = async () => {
    setIsSubmitting(true);
    try {
      const aestheticName = selectedAestheticForRequest?.name || "Bespoke Custom Direction";
      const fullDescription = `
[Website Design Marketplace Intake]
Selected Aesthetic: ${aestheticName} (${selectedAestheticForRequest?.category || "Custom"})
Scope Foundation: ${selectedScopeTier} (${pagesRequired})
Website Purpose: ${websitePurpose}
Target Audience / Vibe: ${wizardAnswers.vibe || "Modern"}
Content Status: ${contentStatus}
Target Deadline: ${targetDeadline}
Existing Website: ${existingWebsite || "None"}
Reference Websites: ${referenceLinks || "None"}
Must-Haves: ${mustHaves || "None specified"}
Dealbreakers / Don't Wants: ${dealbreakers || "None specified"}
Features: ${featuresList.join(", ")}
      `.trim();

      await submitBooking({
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        company_name: companyName.trim() || projectName.trim() || undefined,
        package_id: selectedScopeTier.toLowerCase().includes("starter")
          ? "luxury-landing-sprint"
          : selectedScopeTier.toLowerCase().includes("custom")
          ? "interactive-3d-experience"
          : "fullstack-web-app",
        selected_addons: featuresList,
        timeline_requirement: targetDeadline,
        project_description: fullDescription
      });

      await submitLead({
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        company_name: companyName.trim() || undefined,
        package_interest: `${aestheticName} - ${selectedScopeTier}`,
        timeline: targetDeadline,
        source: "Marketplace Project Intake",
        project_description: fullDescription
      });

      setIntakeSuccess(true);
      setTimeout(() => {
        setShowIntakeModal(false);
        setIntakeSuccess(false);
        router.push("/client");
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      setIntakeSuccess(true);
      setTimeout(() => {
        setShowIntakeModal(false);
        router.push("/client");
      }, 2000);
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

  return (
    <main className="min-h-screen bg-[#dff4ff] text-black font-sans selection:bg-sky-200 selection:text-black">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT VERTICAL NAVIGATION (DESKTOP)                         */}
      {/* ------------------------------------------------------------- */}
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
            title="Home"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <Link
            href="/projects"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/projects" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Projects"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-semibold">Projects</span>
          </Link>

          <Link
            href="/packages"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/packages" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Marketplace & Aesthetics"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-[10px] font-semibold">Aesthetics</span>
          </Link>

          <Link
            href="/client"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/client" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Client Board"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-semibold">Client Hub</span>
          </Link>

          <Link
            href="/qna"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/qna" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Q&A"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-semibold">Q&A</span>
          </Link>

          <Link
            href="/contact"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/contact" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Contact"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-[10px] font-semibold">Contact</span>
          </Link>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. MOBILE TOP HEADER                                          */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/10 bg-[#dff4ff]/90 px-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-1.5 !no-underline !text-black font-semibold text-sm">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-800">
          Website Marketplace
        </span>
        <button
          type="button"
          onClick={handleStartQuestionnaire}
          className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-white shadow-xs cursor-pointer"
        >
          ✨ Build
        </button>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN PAGE CONTAINER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="pl-0 md:pl-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8 sm:pt-14 sm:pb-24">
          
          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: HERO WITH DUAL PRIMARY PATHS                       */}
          {/* ------------------------------------------------------------- */}
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-xs mb-4" style={{ color: "#0f172a" }}>
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              Website Design Marketplace & Onboarding
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-6xl mb-4" style={{ color: "#090d16" }}>
              Make your website. Your way.
            </h1>
            <p className="text-base sm:text-xl max-w-2xl mx-auto leading-relaxed text-slate-700 font-medium">
              Pick a package, explore aesthetics, or tell us what you&apos;re imagining and we&apos;ll find the right direction.
            </p>

            {/* DUAL PRIMARY ACTION CARDS */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              {/* Path 1: Build My Website (Questionnaire) */}
              <button
                type="button"
                onClick={handleStartQuestionnaire}
                className="group relative flex flex-col justify-between rounded-3xl border border-sky-400/50 bg-gradient-to-br from-white via-sky-50/70 to-indigo-50/60 p-6 sm:p-7 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-sky-500 cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white text-2xl shadow-md">
                      ✨
                    </span>
                    <span className="rounded-full bg-sky-100 border border-sky-300 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-900">
                      60 Sec Matcher
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-1.5 group-hover:text-sky-700 transition">
                    Build My Website
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Tell us about your business & desired vibe → get instant tailored aesthetic recommendations → choose one → request your build.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-sky-700">
                  <span>Start Questionnaire</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </button>

              {/* Path 2: Browse Aesthetics (Gallery) */}
              <button
                type="button"
                onClick={handleBrowseAesthetics}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/10 bg-white/80 p-6 sm:p-7 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-black/25 cursor-pointer text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white text-2xl shadow-md">
                      🎨
                    </span>
                    <span className="rounded-full bg-slate-100 border border-black/8 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                      12 Archetypes
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-1.5 group-hover:text-slate-800 transition">
                    Browse Aesthetics
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Explore ready-made visual directions from Editorial and Luxury Minimal to Dark Mode & Y2K → pick one → customize your request.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-900">
                  <span>Explore Design Matrix</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </button>
            </div>

            {/* Quick Segmented Mode Switcher */}
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-black/10 bg-white/75 p-1.5 shadow-sm backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "home"
                    ? "bg-slate-950 text-white shadow-md"
                    : "text-slate-700 hover:text-black hover:bg-black/5"
                }`}
              >
                <span>📦</span>
                <span>Scope Foundations</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "gallery"
                    ? "bg-slate-950 text-white shadow-md"
                    : "text-slate-700 hover:text-black hover:bg-black/5"
                }`}
              >
                <span>🎨</span>
                <span>Browse All Aesthetics ({AESTHETIC_STYLES.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("wizard")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "wizard" || activeTab === "results"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-700 hover:text-black hover:bg-black/5"
                }`}
              >
                <span>✨</span>
                <span>Make Your Website (Quiz)</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* VIEW A: SCOPE FOUNDATIONS & EXPLANATION (HOME TAB)            */}
          {/* ------------------------------------------------------------- */}
          {activeTab === "home" && (
            <div className="space-y-16">
              
              {/* Studio Scope Philosophy Banner */}
              <div className="rounded-[2.4rem] border border-sky-300/60 bg-gradient-to-br from-white/95 via-sky-50/70 to-indigo-50/60 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
                <div className="max-w-3xl">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                    Aesthetic + Scope Framework
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold mt-1.5 mb-3 text-slate-950">
                    You choose the visual soul. Scope sets the foundation.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Instead of generic cookie-cutter pricing tiers, every build is crafted around an **aesthetic archetype** you love, applied across the exact **page & technical scope** your business requires.
                  </p>
                </div>

                {/* 3 Scope Foundations Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Starter Tier */}
                  <div className="flex flex-col justify-between rounded-3xl border border-black/8 bg-white/80 p-6 shadow-sm hover:shadow-md transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800">
                          1–3 Pages
                        </span>
                        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                          1–2 Weeks
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 mb-1">Starter</h3>
                      <p className="text-xs text-slate-500 mb-4">
                        High-converting landing page, personal portfolio, or single-product launchpad.
                      </p>
                      <div className="rounded-2xl bg-slate-50 p-3 mb-4 text-xs space-y-1.5 text-slate-700">
                        <div className="flex items-center gap-2"><span className="text-sky-600 font-bold">✓</span><span>Bespoke chosen aesthetic</span></div>
                        <div className="flex items-center gap-2"><span className="text-sky-600 font-bold">✓</span><span>Framer Motion animations</span></div>
                        <div className="flex items-center gap-2"><span className="text-sky-600 font-bold">✓</span><span>Lead capture & SEO 95+</span></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChooseAesthetic(AESTHETIC_STYLES[1], "Starter")}
                      className="w-full rounded-full bg-slate-950 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 transition cursor-pointer"
                    >
                      Request Starter Scope →
                    </button>
                  </div>

                  {/* Business Tier */}
                  <div className="flex flex-col justify-between rounded-3xl border-2 border-sky-400 bg-gradient-to-b from-white via-sky-50/50 to-white p-6 shadow-lg hover:shadow-xl transition relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sky-600 px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                      Most Common
                    </span>
                    <div>
                      <div className="flex items-center justify-between mb-3 mt-1">
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-900">
                          4–7 Pages
                        </span>
                        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                          3–5 Weeks
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-950 mb-1">Business</h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Full multi-page company website, agency showcase, or SaaS growth platform.
                      </p>
                      <div className="rounded-2xl bg-sky-50/70 p-3 mb-4 text-xs space-y-1.5 text-slate-700">
                        <div className="flex items-center gap-2"><span className="text-sky-600 font-bold">✓</span><span>Complete multi-page flow</span></div>
                        <div className="flex items-center gap-2"><span className="text-sky-600 font-bold">✓</span><span>Subtle 3D or bento micro-interactions</span></div>
                        <div className="flex items-center gap-2"><span className="text-sky-600 font-bold">✓</span><span>Client hub & e-contract portal</span></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChooseAesthetic(AESTHETIC_STYLES[3], "Business")}
                      className="w-full rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:brightness-110 transition cursor-pointer"
                    >
                      Request Business Scope →
                    </button>
                  </div>

                  {/* Custom Flagship Tier */}
                  <div className="flex flex-col justify-between rounded-3xl border border-black/8 bg-slate-950 text-white p-6 shadow-md hover:shadow-xl transition">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-300">
                          8+ Pages / WebGL
                        </span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          6–8+ Weeks
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">Custom Flagship</h3>
                      <p className="text-xs text-slate-400 mb-4">
                        Complex WebGL 3D spatial experiences, database auth, custom configurators.
                      </p>
                      <div className="rounded-2xl bg-white/5 p-3 mb-4 text-xs space-y-1.5 text-slate-300">
                        <div className="flex items-center gap-2"><span className="text-sky-400 font-bold">✓</span><span>Custom Three.js 3D canvas</span></div>
                        <div className="flex items-center gap-2"><span className="text-sky-400 font-bold">✓</span><span>Full-Stack Supabase DB + Auth</span></div>
                        <div className="flex items-center gap-2"><span className="text-sky-400 font-bold">✓</span><span>Dedicated 60-day hypercare warranty</span></div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChooseAesthetic(AESTHETIC_STYLES[0], "Custom Flagship")}
                      className="w-full rounded-full bg-white text-slate-950 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition cursor-pointer"
                    >
                      Request Custom Scope →
                    </button>
                  </div>
                </div>

                {/* Razorpay Retainer & Instant Checkout Callout */}
                <div className="mt-8 rounded-3xl border border-sky-400/40 bg-gradient-to-r from-slate-950 via-sky-950/40 to-slate-900 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400 text-2xl border border-sky-400/30">
                      💳
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 border border-sky-400/30 mb-1">
                        Razorpay Live Gateway
                      </div>
                      <h4 className="text-lg font-bold text-white">
                        Lock In Your Sprint Queue via Retainer Deposit
                      </h4>
                      <p className="text-xs text-slate-300">
                        Secure instant queue priority, unlock private client workspace, and execute e-contracts via Razorpay.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 shrink-0">
                    <Link
                      href="/paywall"
                      className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md hover:brightness-110 transition"
                    >
                      Open Razorpay Paywall →
                    </Link>
                    <Link
                      href="/client"
                      className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
                    >
                      Reviewer Access
                    </Link>
                  </div>
                </div>
              </div>

              {/* Browse Aesthetics Carousel / Grid Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">
                      Visual Archetypes Gallery
                    </span>
                    <h3 className="text-2xl font-bold text-slate-950 mt-0.5">
                      Explore Ready-Made Aesthetics
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleBrowseAesthetics}
                    className="rounded-full bg-white border border-black/10 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                  >
                    View All {AESTHETIC_STYLES.length} Aesthetics →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {AESTHETIC_STYLES.slice(0, 6).map((style) => (
                    <div
                      key={style.id}
                      className="group flex flex-col justify-between rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-md"
                    >
                      <div>
                        {/* Mini wireframe */}
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

                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                            {style.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">{style.badge}</span>
                        </div>

                        <h4 className="text-lg font-bold text-slate-950 mt-1 mb-1">{style.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{style.tagline}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-black/6">
                        <button
                          type="button"
                          onClick={() => setPreviewStyleModal(style)}
                          className="flex-1 rounded-xl border border-black/10 bg-slate-50 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChooseAesthetic(style, "Business")}
                          className="flex-1 rounded-xl bg-slate-950 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                        >
                          Choose Style →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency & Addon Modules */}
              <div className="rounded-[2.4rem] border border-black/10 bg-white/80 p-6 sm:p-10 shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Modular Add-ons</span>
                    <h3 className="text-2xl font-bold text-slate-950 mt-0.5">Sprint Enhancements</h3>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${currency === "USD" ? "bg-slate-950 text-white" : "text-slate-600"}`}
                    >
                      $ USD
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("INR")}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${currency === "INR" ? "bg-slate-950 text-white" : "text-slate-600"}`}
                    >
                      ₹ INR
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {[
                    { name: "Headless CMS (Sanity / Contentful)", usd: 499, inr: 41000, desc: "Visual self-serve content & blog manager." },
                    { name: "Gemini / OpenAI AI Copilot", usd: 599, inr: 49000, desc: "Custom-trained domain assistant & lead capture." },
                    { name: "Original Soundscape & Micro Audio", usd: 299, inr: 24000, desc: "Reactive sound design and ambient audio toggle." }
                  ].map((a, i) => (
                    <div key={i} className="rounded-2xl border border-black/6 bg-slate-50/70 p-4">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span>{a.name}</span>
                        <span className="text-sky-700">{currency === "USD" ? `+$${a.usd}` : `+₹${a.inr.toLocaleString()}`}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="rounded-[2.4rem] border border-black/10 bg-white/80 p-6 sm:p-10 shadow-lg backdrop-blur-xl">
                <div className="mb-6">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Client FAQ</span>
                  <h3 className="text-2xl font-bold text-slate-950 mt-0.5">How Working Together Works</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { q: "How does the aesthetic + scope model work?", a: "You select any aesthetic visual archetype you like from our gallery (or discover one via our questionnaire). Then, depending on whether you need a 1-3 page landing page, a 4-7 page business site, or a full 3D custom web app, we scope the project milestones transparently." },
                    { q: "What happens after I request a website?", a: "Your project is instantly created on your dedicated Client Board (/client). You can review the milestone scope, upload assets to the dropzone, request modifications, and execute the digital agreement." },
                    { q: "Can I request changes during development?", a: "Yes! Your Client Board includes an interactive Changes & Requests log where you can submit revision requests (e.g. 'make hero less dark', 'round buttons') and track them in real time." }
                  ].map((faq, idx) => (
                    <div key={idx} className="rounded-2xl border border-black/8 bg-slate-50/80 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-sm text-slate-900 cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span className="text-slate-400">{openFaqIndex === idx ? "−" : "+"}</span>
                      </button>
                      {openFaqIndex === idx && (
                        <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-black/4 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW B: BROWSE AESTHETICS (VISUAL GALLERY OF CARDS)           */}
          {/* ------------------------------------------------------------- */}
          {activeTab === "gallery" && (
            <div className="space-y-8">
              
              {/* Category Filter Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white/70 text-slate-700 hover:bg-white border border-black/8"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Aesthetic Cards Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStyles.map((style) => (
                  <div
                    key={style.id}
                    className="flex flex-col justify-between rounded-[2.2rem] border border-black/10 bg-white/85 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div>
                      {/* Badge & Category */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-800">
                          {style.category}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
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
                      <h3 className="text-xl font-bold mb-1 text-slate-950">
                        {style.name}
                      </h3>
                      <p className="text-xs mb-4 leading-relaxed text-slate-600 line-clamp-2">
                        {style.tagline}
                      </p>

                      {/* Color Palette Swatches */}
                      <div className="mb-4">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Signature Color DNA
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
                            className="rounded-md border border-black/8 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4 border-t border-black/8">
                      <button
                        type="button"
                        onClick={() => setPreviewStyleModal(style)}
                        className="flex-1 rounded-xl border border-black/12 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Inspect Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChooseAesthetic(style, "Business")}
                        className="flex-1 rounded-xl bg-slate-950 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                      >
                        Choose Aesthetic →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-2">
                  <span>✓</span>
                  <span>Recommendation Generated</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-2">
                  We found {recommendationData.matches.length} aesthetics for your vision.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
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
                        ? "border-sky-400 bg-gradient-to-b from-white via-sky-50/70 to-white shadow-xl ring-2 ring-sky-300/40"
                        : "border-black/10 bg-white/85 shadow-md hover:-translate-y-1 hover:shadow-xl"
                    }`}
                  >
                    <div>
                      {/* Top Match Score Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                          {matchScore}% Match
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{style.category}</span>
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

                      <h3 className="text-xl font-bold text-slate-950 mb-1">{style.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{style.tagline}</p>

                      <div className="rounded-xl bg-slate-50 border border-black/6 p-2.5 mb-4 text-[11px] text-slate-600">
                        💡 {matchReason}
                      </div>

                      {/* Color Palette */}
                      <div className="mb-4">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
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
                    <div className="pt-3 border-t border-black/8 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewStyleModal(style)}
                        className="flex-1 rounded-xl border border-black/10 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Preview DNA
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChooseAesthetic(style, wizardAnswers.scopeSize || "Business")}
                        className="flex-1 rounded-xl bg-slate-950 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
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
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. AESTHETIC PREVIEW MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      {previewStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
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
                Close
              </button>
              <button
                type="button"
                onClick={() => handleChooseAesthetic(previewStyleModal, "Business")}
                className="rounded-full bg-slate-950 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 transition cursor-pointer shadow-md"
              >
                Choose This Aesthetic →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. "REQUEST THIS WEBSITE" PROJECT INTAKE & ONBOARDING DRAWER  */}
      {/* ------------------------------------------------------------- */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-[2.4rem] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowIntakeModal(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full border border-black/10 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              ×
            </button>

            {intakeSuccess ? (
              <div className="text-center py-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl mb-4">
                  🎉
                </div>
                <h3 className="text-2xl font-black text-slate-950 mb-2">Project Registered!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
                  Your project brief with selected aesthetic <strong>{selectedAestheticForRequest?.name}</strong> has been created. Redirecting to your dedicated Client Board...
                </p>
                <div className="animate-spin h-5 w-5 border-2 border-sky-600 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : !authStepRequired ? (
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">
                  Project Request Brief
                </span>
                <h3 className="text-2xl font-black text-slate-950 mt-1 mb-1">
                  Request This Website
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Selected Aesthetic: <span className="font-bold text-slate-900">{selectedAestheticForRequest?.name}</span>
                </p>

                <form onSubmit={handleIntakeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Project / Business Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Apex Living Ltd."
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Scope Foundation
                      </label>
                      <select
                        value={selectedScopeTier}
                        onChange={(e) => setSelectedScopeTier(e.target.value)}
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                      >
                        <option value="Starter">Starter (1–3 Pages / Fast Sprint)</option>
                        <option value="Business">Business (4–7 Pages / Full Experience)</option>
                        <option value="Custom Flagship">Custom Flagship (8+ Pages / 3D WebGL)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Website Purpose & Key Goals
                    </label>
                    <textarea
                      rows={2}
                      value={websitePurpose}
                      onChange={(e) => setWebsitePurpose(e.target.value)}
                      placeholder="What should this website achieve? (e.g. Generate high-ticket bookings, showcase architecture portfolio...)"
                      className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Content Status
                      </label>
                      <select
                        value={contentStatus}
                        onChange={(e) => setContentStatus(e.target.value as any)}
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                      >
                        <option value="Ready">Copy & images are ready</option>
                        <option value="In Progress">In progress / Gathering</option>
                        <option value="Need Copywriting">Need copywriting & assistance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Target Deadline
                      </label>
                      <input
                        type="text"
                        value={targetDeadline}
                        onChange={(e) => setTargetDeadline(e.target.value)}
                        placeholder="e.g. 4-6 Weeks / October 2026"
                        className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Must-Haves (Specific elements you want)
                    </label>
                    <input
                      type="text"
                      value={mustHaves}
                      onChange={(e) => setMustHaves(e.target.value)}
                      placeholder="e.g. Booking calendar, dark mode toggle, video showreel"
                      className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Dealbreakers (Things you absolutely DO NOT want)
                    </label>
                    <input
                      type="text"
                      value={dealbreakers}
                      onChange={(e) => setDealbreakers(e.target.value)}
                      placeholder="e.g. No heavy popups, no stock cartoon graphics, no auto-playing sound"
                      className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-slate-950 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 disabled:opacity-50 cursor-pointer mt-2"
                  >
                    Continue to Client Board Setup →
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {/* Account Gate: Free exploration, require account only on project submission */}
                <div className="text-center mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 text-xl mb-3">
                    🔐
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">
                    Create Your Account to Continue
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your account grants you instant access to your private Client Board with project milestones, contract signing, and the change request log.
                  </p>
                </div>

                {authError && (
                  <div className="rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200 mb-3">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-xs outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs py-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")}
                      className="text-sky-600 font-bold hover:underline cursor-pointer"
                    >
                      {authMode === "signup" ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-slate-950 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : authMode === "signup" ? "Create Account & Submit Project" : "Sign In & Submit Project"}
                  </button>
                </form>

                {/* 1-Click Instant Demo Bypass */}
                <div className="mt-4 pt-4 border-t border-black/8 text-center">
                  <button
                    type="button"
                    onClick={handleInstantDemoSubmit}
                    className="w-full rounded-full border border-sky-300 bg-sky-50 py-2.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition cursor-pointer"
                  >
                    ⚡ Test Instantly with 1-Click Demo (No Password Required)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
