"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { submitLead } from "@/lib/portalServices";
import {
  AESTHETIC_STYLES,
  FUNCTIONAL_FLOWS,
  WIZARD_QUESTIONS,
  calculateAestheticRecommendation,
  type AestheticStyle,
  type FunctionalFlow,
  type WizardAnswers,
  type ColorSwatch
} from "@/data/aestheticDatabase";

export default function PackagesView() {
  const pathname = usePathname();
  const { user, isAuthenticated, signInWithPassword, signUp } = useAuth();

  // Active View Tab: "wizard" (Interactive Quiz), "catalog" (Browse All), "blueprint" (Tailored Result)
  const [activeTab, setActiveTab] = useState<"wizard" | "catalog" | "blueprint">("wizard");

  // Wizard state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({
    industry: "real-estate",
    vibe: "3d-interactive",
    flow: "spatial-3d-walkthrough",
    scope: "custom-flagship"
  });

  // Lead Form in Wizard
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Gating & Auth Modal
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);

  // Catalog Filtering
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedStyleModal, setSelectedStyleModal] = useState<AestheticStyle | null>(null);

  // Live Palette Customizer State in Blueprint
  const [activePaletteIndex, setActivePaletteIndex] = useState(0);

  // Inquiry Modal State
  const [inquiryAesthetic, setInquiryAesthetic] = useState<AestheticStyle | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryCompany, setInquiryCompany] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Recommendation calculation
  const recommendation = useMemo(() => {
    return calculateAestheticRecommendation(answers);
  }, [answers]);

  // Check if blueprint is unlocked
  const isUnlocked = isAuthenticated || isDemoUnlocked || Boolean(user);

  // Categories for catalog filter
  const categories = ["All", "3D & Spatial", "Modern SaaS", "Editorial & Minimal", "Bold & Pop", "Cyber & Glow", "Organic & Warm"];

  const filteredStyles = useMemo(() => {
    if (activeCategory === "All") return AESTHETIC_STYLES;
    return AESTHETIC_STYLES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  // Handle Wizard Answer Selection
  const handleSelectOption = (questionId: "industry" | "vibe" | "flow" | "scope", optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    if (currentStepIndex < WIZARD_QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Handle Lead Submission in Wizard
  const handleWizardLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;

    setIsSubmittingLead(true);
    try {
      await submitLead({
        client_name: leadName.trim(),
        client_email: leadEmail.trim().toLowerCase(),
        company_name: leadCompany.trim() || undefined,
        package_interest: `${recommendation.primaryStyle.name} (${recommendation.matchedFlow.name})`,
        timeline: answers.scope || "4-6 Weeks",
        source: "Aesthetic Design Wizard",
        project_description: `[Aesthetic Quiz Answers] Industry: ${answers.industry} | Desired Vibe: ${answers.vibe} | Functional Flow: ${answers.flow} | Launch Scope: ${answers.scope}`
      });
      setLeadSubmitted(true);
      setAuthEmail(leadEmail.trim());

      if (isUnlocked) {
        setActiveTab("blueprint");
      } else {
        setShowUnlockModal(true);
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      // Fallback transition
      if (isUnlocked) setActiveTab("blueprint");
      else setShowUnlockModal(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Handle Modal Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    setIsAuthLoading(true);
    setAuthError("");

    try {
      if (authMode === "signup") {
        const { error } = await signUp(authEmail, authPassword);
        if (error) throw error;
      } else {
        const { error } = await signInWithPassword(authEmail, authPassword);
        if (error) throw error;
      }
      setShowUnlockModal(false);
      setActiveTab("blueprint");
    } catch (err: unknown) {
      setAuthError((err as Error)?.message || "Authentication failed. You can test with 1-Click Instant Demo below.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  // 1-Click Instant Demo Access
  const handleInstantDemo = () => {
    setIsDemoUnlocked(true);
    setShowUnlockModal(false);
    setActiveTab("blueprint");
  };

  // Handle Catalog Direct Inquiry
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryAesthetic) return;

    setIsSubmittingInquiry(true);
    try {
      await submitLead({
        client_name: inquiryName.trim(),
        client_email: inquiryEmail.trim(),
        company_name: inquiryCompany.trim() || undefined,
        package_interest: inquiryAesthetic.name,
        source: "Aesthetic Catalog Inquiry",
        project_description: `Selected Aesthetic: ${inquiryAesthetic.name} (${inquiryAesthetic.category}). Message: ${inquiryMessage}`.trim()
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
        setInquiryAesthetic(null);
        setInquiryName("");
        setInquiryEmail("");
        setInquiryCompany("");
        setInquiryMessage("");
      }, 3000);
    } catch (err) {
      console.error("Inquiry error:", err);
      alert("Encountered an issue submitting inquiry. Please try again or reach out via contact page.");
    } finally {
      setIsSubmittingInquiry(false);
    }
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
            title="Aesthetics"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-[10px] font-semibold">Aesthetic</span>
          </Link>

          <Link
            href="/client"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/client" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Client Portal"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-semibold">Client</span>
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
          Aesthetics & Styles
        </span>
        <Link
          href="/client"
          className="!no-underline !text-black text-xs font-semibold px-3 py-1 rounded-full bg-white/60 border border-black/10"
        >
          Client Hub
        </Link>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN PAGE CONTAINER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="pl-0 md:pl-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8 sm:pt-14 sm:pb-24">
          
          {/* Header Title & Segmented Switcher */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xs mb-3">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              Website Design Archetypes & Architecture
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
              Choose Your Aesthetic & Flow
            </h1>
            <p className="text-base text-slate-600 sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Every brand requires a distinct visual soul and functional flow. Use our 4-step interactive generator or explore the full design matrix below.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/70 p-1.5 shadow-sm backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab("wizard")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "wizard"
                    ? "bg-slate-950 text-white shadow-md"
                    : "text-slate-600 hover:text-black hover:bg-black/5"
                }`}
              >
                <span>🪄</span>
                <span>Design Wizard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("catalog")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-slate-950 text-white shadow-md"
                    : "text-slate-600 hover:text-black hover:bg-black/5"
                }`}
              >
                <span>🎨</span>
                <span>Explore All Styles ({AESTHETIC_STYLES.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (isUnlocked) setActiveTab("blueprint");
                  else setShowUnlockModal(true);
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "blueprint"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-600 hover:text-black hover:bg-black/5"
                }`}
              >
                <span>{isUnlocked ? "⚡" : "🔒"}</span>
                <span>My Tailored Blueprint</span>
                {!isUnlocked && (
                  <span className="ml-1 rounded bg-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-900">
                    Gated
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: DESIGN DISCOVERY WIZARD                                */}
          {/* ------------------------------------------------------------- */}
          {activeTab === "wizard" && (
            <div className="max-w-4xl mx-auto">
              <div className="rounded-[2.2rem] border border-black/10 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-10">
                
                {/* Stepper Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    <span>Step {currentStepIndex + 1} of {WIZARD_QUESTIONS.length + 1}</span>
                    <span>{Math.round(((currentStepIndex + 1) / (WIZARD_QUESTIONS.length + 1)) * 100)}% Complete</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / (WIZARD_QUESTIONS.length + 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Steps 0 to 3 */}
                {currentStepIndex < WIZARD_QUESTIONS.length && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 sm:text-3xl">
                      {WIZARD_QUESTIONS[currentStepIndex].title}
                    </h2>
                    <p className="text-sm text-slate-600 mb-6 sm:text-base">
                      {WIZARD_QUESTIONS[currentStepIndex].subtitle}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {WIZARD_QUESTIONS[currentStepIndex].options?.map((option) => {
                        const questionKey = WIZARD_QUESTIONS[currentStepIndex].id as "industry" | "vibe" | "flow" | "scope";
                        const isSelected = answers[questionKey] === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSelectOption(questionKey, option.id)}
                            className={`flex flex-col text-left rounded-2xl border p-4.5 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-sky-500 bg-sky-50/90 shadow-md ring-2 ring-sky-400/40"
                                : "border-black/8 bg-white/70 hover:border-black/20 hover:bg-white hover:shadow-xs"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-base font-bold text-slate-900">{option.label}</span>
                              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                                isSelected ? "bg-sky-600 text-white" : "border border-slate-300 text-transparent"
                              }`}>
                                ✓
                              </span>
                            </div>
                            {option.description && (
                              <p className="text-xs text-slate-500 leading-relaxed">{option.description}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="mt-8 flex items-center justify-between border-t border-black/8 pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentStepIndex === 0}
                        className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-black disabled:opacity-30 cursor-pointer"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                        className="rounded-full bg-slate-950 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-slate-800 cursor-pointer"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* Final Step: Lead Capture & Unlock */}
                {currentStepIndex === WIZARD_QUESTIONS.length && (
                  <div className="max-w-xl mx-auto text-center py-2">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl text-sky-600 mb-4">
                      ✨
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mb-2">
                      Your Customized Blueprint is Generated!
                    </h2>
                    <p className="text-sm text-slate-600 mb-6">
                      Enter your details below to save your personalized moodboard, interactive palette customizer, and functional scope estimate.
                    </p>

                    <form onSubmit={handleWizardLeadSubmit} className="space-y-4 text-left">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-black outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="sarah@company.com"
                          className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-black outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Company / Website (Optional)
                        </label>
                        <input
                          type="text"
                          value={leadCompany}
                          onChange={(e) => setLeadCompany(e.target.value)}
                          placeholder="e.g. Apex Living / apex.com"
                          className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-black outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition hover:opacity-95 disabled:opacity-60 cursor-pointer mt-2"
                      >
                        {isSubmittingLead ? "Generating Blueprint..." : "Unlock My Tailored Blueprint →"}
                      </button>
                    </form>

                    <p className="mt-4 text-[11px] text-slate-400">
                      🔒 No spam. Instant access to interactive moodboards, wireframes, and pricing breakdown.
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: EXPLORE ALL 8 SIGNATURE AESTHETICS (CATALOG)           */}
          {/* ------------------------------------------------------------- */}
          {activeTab === "catalog" && (
            <div>
              {/* Category Filter Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white/60 text-slate-700 hover:bg-white border border-black/8"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Aesthetic Grid */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredStyles.map((style) => (
                  <div
                    key={style.id}
                    className="flex flex-col justify-between rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {style.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                        {style.tagline}
                      </p>

                      {/* Color Palette Swatches */}
                      <div className="mb-4">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Signature Palette
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
                            className="rounded-md border border-black/8 bg-slate-100/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-black/8">
                      <button
                        type="button"
                        onClick={() => setSelectedStyleModal(style)}
                        className="flex-1 rounded-xl border border-black/12 bg-white py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-50 cursor-pointer"
                      >
                        Inspect DNA
                      </button>
                      <button
                        type="button"
                        onClick={() => setInquiryAesthetic(style)}
                        className="flex-1 rounded-xl bg-slate-950 py-2 text-xs font-bold text-white transition hover:bg-slate-800 cursor-pointer"
                      >
                        Inquire Style
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: UNLOCKED TAILORED BLUEPRINT & SCOPE WORKSPACE          */}
          {/* ------------------------------------------------------------- */}
          {activeTab === "blueprint" && (
            <div className="space-y-10">
              
              {/* Top Hero Banner with Match Score */}
              <div className="rounded-[2.4rem] border border-sky-300/60 bg-gradient-to-br from-white/90 via-sky-50/80 to-indigo-50/70 p-6 sm:p-10 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-3">
                      <span>✓</span>
                      <span>{recommendation.matchScore}% Match for Your Domain</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                      {recommendation.primaryStyle.name}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                      {recommendation.primaryStyle.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setInquiryAesthetic(recommendation.primaryStyle)}
                      className="rounded-full bg-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-slate-800 cursor-pointer text-center"
                    >
                      Request Sprint Scope →
                    </button>
                    <Link
                      href="/client"
                      className="rounded-full border border-black/15 bg-white/80 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-800 shadow-sm transition hover:bg-white text-center !no-underline"
                    >
                      Open Client Hub
                    </Link>
                  </div>
                </div>

                {/* Live Interactive Color Palette Switcher */}
                <div className="mt-8 pt-8 border-t border-black/8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Interactive Palette Explorer
                      </h4>
                      <p className="text-xs text-slate-500">Click a palette below to dynamically preview contrast and mood.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {recommendation.primaryStyle.palettes.map((pal, idx) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => setActivePaletteIndex(idx)}
                        className={`flex items-center gap-3 rounded-2xl border p-3 transition-all cursor-pointer ${
                          activePaletteIndex === idx
                            ? "border-sky-500 bg-white shadow-md ring-2 ring-sky-300"
                            : "border-black/10 bg-white/60 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center -space-x-1.5">
                          {pal.swatches.map((sw) => (
                            <div
                              key={sw.name}
                              className="h-6 w-6 rounded-full border border-black/20"
                              style={{ backgroundColor: sw.hex }}
                            />
                          ))}
                        </div>
                        <div className="text-left">
                          <span className="block text-xs font-bold text-slate-900">{pal.name}</span>
                          <span className="block text-[10px] text-slate-500">{pal.description.slice(0, 32)}...</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Functional Flow Blueprint */}
              <div className="rounded-[2.4rem] border border-black/10 bg-white/80 p-6 sm:p-10 shadow-lg backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600">
                      Tailored Architecture Blueprint
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">
                      {recommendation.matchedFlow.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {recommendation.matchedFlow.description}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3 text-right">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-700">Estimated Timeline</span>
                    <span className="text-sm font-extrabold text-slate-900">{recommendation.matchedFlow.typicalTimelineWeeks}</span>
                  </div>
                </div>

                {/* Step-by-Step Flow Wireframe */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendation.matchedFlow.steps.map((step) => (
                    <div
                      key={step.order}
                      className="rounded-2xl border border-black/8 bg-slate-50/70 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-7 w-7 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-bold mb-3">
                          {step.order}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                          {step.description}
                        </p>
                      </div>

                      <div className="space-y-1 pt-3 border-t border-black/6">
                        {step.keyComponents.map((comp) => (
                          <div key={comp} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
                            <span className="text-sky-500">▪</span>
                            <span>{comp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integrations & Tech */}
                <div className="mt-8 pt-6 border-t border-black/8 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Integrations:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendation.matchedFlow.keyIntegrations.map((item) => (
                        <span key={item} className="rounded-md bg-white border border-black/10 px-2.5 py-1 text-xs font-semibold text-slate-800">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    Investment Tier: <span className="text-slate-900 font-extrabold">{recommendation.matchedFlow.investmentTier}</span>
                  </div>
                </div>
              </div>

              {/* Alternative Archetypes */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Alternative Visual Directions to Consider
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendation.alternativeStyles.map((style) => (
                    <div
                      key={style.id}
                      className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-xs transition hover:shadow-md"
                    >
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">{style.category}</span>
                      <h4 className="text-base font-bold text-slate-900 mt-1 mb-1">{style.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{style.tagline}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedStyleModal(style)}
                        className="text-xs font-bold text-slate-900 underline underline-offset-4 cursor-pointer"
                      >
                        Inspect Blueprint →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. UNLOCK / AUTH MODAL (GATING)                               */}
      {/* ------------------------------------------------------------- */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-[2.2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowUnlockModal(false)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full border border-black/10 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 text-xl mb-3">
                🔐
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Unlock Your Tailored Blueprint
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Log in or test instantly to view your interactive moodboard, color switcher, and functional wireframes.
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authError && (
                <div className="rounded-xl bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm text-black outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")}
                  className="text-sky-600 font-bold hover:underline cursor-pointer"
                >
                  {authMode === "signup" ? "Have an account? Sign In" : "Need account? Sign Up"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full rounded-full bg-slate-950 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                {isAuthLoading ? "Verifying..." : authMode === "signup" ? "Create Account & Unlock" : "Sign In & Unlock"}
              </button>
            </form>

            {/* 1-Click Instant Demo Access */}
            <div className="mt-4 pt-4 border-t border-black/8 text-center">
              <button
                type="button"
                onClick={handleInstantDemo}
                className="w-full rounded-full border border-sky-300 bg-sky-50 py-2.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition cursor-pointer"
              >
                ⚡ 1-Click Instant Demo Mode (No Login Required)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. STYLE INSPECT DNA MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      {selectedStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-[2.2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedStyleModal(null)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full border border-black/10 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              ×
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">
              {selectedStyleModal.category}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-2">
              {selectedStyleModal.name}
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {selectedStyleModal.description}
            </p>

            {/* Visual DNA */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Visual DNA Principles</h4>
              <ul className="space-y-1.5">
                {selectedStyleModal.visualDna.map((dna) => (
                  <li key={dna} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-sky-500 font-bold">✓</span>
                    <span>{dna}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Recommended Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStyleModal.techStack.map((tech) => (
                  <span key={tech} className="rounded-md bg-slate-100 border border-black/8 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/8">
              <button
                type="button"
                onClick={() => {
                  setInquiryAesthetic(selectedStyleModal);
                  setSelectedStyleModal(null);
                }}
                className="rounded-full bg-slate-950 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-slate-800 cursor-pointer"
              >
                Inquire This Style
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. STYLE INQUIRY MODAL                                        */}
      {/* ------------------------------------------------------------- */}
      {inquiryAesthetic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-[2.2rem] border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setInquiryAesthetic(null)}
              className="absolute right-5 top-5 h-8 w-8 rounded-full border border-black/10 text-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              ×
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">
              Project Inquiry
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-1">
              {inquiryAesthetic.name}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Let&apos;s build a custom project in this aesthetic. Fill in your vision below to receive a scoped sprint proposal.
            </p>

            {inquirySuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center text-emerald-800">
                <p className="text-lg font-bold">Inquiry Received!</p>
                <p className="text-xs mt-1">We will review your project vision and send a scoped roadmap shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={inquiryCompany}
                    onChange={(e) => setInquiryCompany(e.target.value)}
                    placeholder="Apex Living Ltd."
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Vision & Goals
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Tell us about the key features, timeline, and audience for your website..."
                    className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="w-full rounded-full bg-slate-950 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-slate-800 disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isSubmittingInquiry ? "Submitting Inquiry..." : "Submit Project Inquiry →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
