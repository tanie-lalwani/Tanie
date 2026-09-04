"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VISUAL_STYLES, type VisualStyleOption } from "@/data/configuratorCatalog";
import { submitLead } from "@/lib/portalServices";

export default function PackagesView() {
  const pathname = usePathname();

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Inspected Aesthetic Modal State
  const [inspectedAesthetic, setInspectedAesthetic] = useState<VisualStyleOption | null>(null);

  // Quick Inquiry Modal State
  const [inquiryAesthetic, setInquiryAesthetic] = useState<VisualStyleOption | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryCompany, setInquiryCompany] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Filter Categories
  const categories = [
    "All",
    "Modern & Clean",
    "Artistic & Avant-Garde",
    "Retro & Cyber",
    "Luxury & Editorial",
    "Tactile & Experimental",
  ];

  const filteredStyles = useMemo(() => {
    if (activeCategory === "All") return VISUAL_STYLES;
    return VISUAL_STYLES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryAesthetic) return;

    setIsSubmittingInquiry(true);
    try {
      await submitLead({
        client_name: inquiryName.trim(),
        client_email: inquiryEmail.trim(),
        company_name: inquiryCompany.trim() || undefined,
        timeline: "Immediate",
        project_description: `Selected Aesthetic: ${inquiryAesthetic.name} (${inquiryAesthetic.category}). ${inquiryMessage}`.trim(),
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
    <main className="site-shell min-h-screen bg-[#dff4ff] text-black selection:bg-sky-200 selection:text-black">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDE NAVIGATION (Matches Projects & QnA pages)         */}
      {/* ------------------------------------------------------------- */}
      <nav
        aria-label="Side navigation"
        className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-between border-r border-black/10 bg-[#dff4ff]/88 py-8 backdrop-blur-xl md:flex"
      >
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/"
                ? "bg-[#c8ecff] !text-black shadow-xs"
                : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Home"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <Link
            href="/projects"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/projects"
                ? "bg-[#c8ecff] !text-black shadow-xs"
                : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Projects"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="text-[10px] font-semibold">Projects</span>
          </Link>

          <Link
            href="/packages"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/packages"
                ? "bg-[#c8ecff] !text-black shadow-xs"
                : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Aesthetics & Packages"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span className="text-[10px] font-semibold">Aesthetic</span>
          </Link>

          <Link
            href="/client"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/client"
                ? "bg-[#c8ecff] !text-black shadow-xs"
                : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Client Portal"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-[10px] font-semibold">Client</span>
          </Link>

          <Link
            href="/qna"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/qna"
                ? "bg-[#c8ecff] !text-black shadow-xs"
                : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Interview Q&A"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-[10px] font-semibold">Q&A</span>
          </Link>

          <Link
            href="/contact"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/contact"
                ? "bg-[#c8ecff] !text-black shadow-xs"
                : "!text-black hover:bg-white/55 hover:!text-black"
            }`}
            title="Contact"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
              className="mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-[10px] font-semibold">Contact</span>
          </Link>
        </div>

        {/* Social Icons */}
        <div className="mb-2 flex flex-col items-center gap-3.5">
          <a
            href="https://github.com/tanie-lalwani"
            target="_blank"
            rel="me noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-black/10 bg-white/45 !text-black transition hover:bg-white/70 hover:!text-black"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/tanie-lalwani/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-black/10 bg-white/45 !text-black transition hover:bg-white/70 hover:!text-black"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 1 1 0-3.96 1.98 1.98 0 0 1 0 3.96zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. MOBILE TOP BAR                                             */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/10 bg-[#dff4ff]/90 px-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-1.5 !no-underline !text-black font-semibold text-sm">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-800">
          Aesthetics
        </span>
        <Link
          href="/client"
          className="!no-underline !text-black text-xs font-semibold px-3 py-1 rounded-full bg-white/60 border border-black/10"
        >
          Client Hub
        </Link>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN CONTENT: CHOOSE YOUR AESTHETIC                         */}
      {/* ------------------------------------------------------------- */}
      <div className="pl-0 md:pl-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8 sm:pt-14 sm:pb-24">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/60 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-xs mb-4">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              Types of Designs & Visual Directions
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 font-serif">
              Choose Your Aesthetic
            </h1>
            
            <p className="mt-3.5 text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
              Explore curated design styles, interaction frameworks, and bespoke visual directions crafted for modern web experiences.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-150 ${
                  activeCategory === cat
                    ? "bg-[#c8ecff] text-black border border-sky-400/80 shadow-xs scale-105"
                    : "bg-white/65 text-slate-700 border border-black/8 hover:bg-white hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 4. DESIGN AESTHETIC CARDS GRID                                */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredStyles.map((style) => (
              <article
                key={style.id}
                className="group flex flex-col justify-between rounded-3xl border border-black/8 bg-white/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-sky-400/50 hover:bg-white hover:shadow-[0_16px_40px_rgba(56,189,248,0.15)]"
              >
                <div>
                  {/* Category & Mood */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full bg-[#c8ecff]/70 px-3 py-1 text-[11px] font-bold text-slate-900 border border-sky-300/40">
                      {style.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 truncate" title={style.mood}>
                      {style.mood}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold tracking-tight text-slate-950 mt-1">
                    {style.name}
                  </h2>

                  {/* Palette Swatches */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {style.palette.map((color, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full border-2 border-white shadow-xs"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 ml-1">
                      Signature Palette
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-xs text-slate-700 leading-relaxed">
                    {style.description}
                  </p>

                  {/* Typography Pairing Badge */}
                  <div className="mt-4 rounded-xl border border-black/6 bg-[#dff4ff]/60 px-3 py-2 text-[11px] text-slate-800">
                    <span className="font-bold text-slate-900">Type: </span>
                    <span className="text-slate-700">{style.typography}</span>
                  </div>

                  {/* Exemplar Keyword Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {style.exemplarKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-black/6"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 flex items-center gap-2.5 border-t border-black/8 pt-4">
                  <button
                    type="button"
                    onClick={() => setInspectedAesthetic(style)}
                    className="flex-1 rounded-xl bg-[#dff4ff] py-2.5 text-center text-xs font-bold text-slate-900 border border-sky-300/60 transition hover:bg-[#c8ecff]"
                  >
                    Inspect Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiryAesthetic(style)}
                    className="flex-1 rounded-xl bg-slate-950 py-2.5 text-center text-xs font-bold text-white transition hover:bg-slate-800 shadow-sm"
                  >
                    Inquire Style ↗
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Consultation Banner */}
          <div className="mt-16 rounded-3xl border border-sky-300/50 bg-gradient-to-r from-white/90 via-[#eaf7ff]/90 to-white/90 p-8 text-center backdrop-blur-xl shadow-lg max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-950 font-serif">
              Looking for a custom hybrid direction?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-700 max-w-xl mx-auto">
              Every project is engineered with bespoke typography, 3D elements, and interaction design tailored specifically to your brand identity.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800"
              >
                Discuss Custom Project →
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-black/12 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:bg-slate-100"
              >
                View Live Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. INSPECT AESTHETIC MODAL                                    */}
      {/* ------------------------------------------------------------- */}
      {inspectedAesthetic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl border border-sky-300/60 bg-[#eaf7ff]/95 p-6 sm:p-8 text-slate-950 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectedAesthetic(null)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-sm font-bold text-slate-800 transition hover:bg-black/20"
            >
              ✕
            </button>

            <div className="inline-block rounded-full bg-[#c8ecff] px-3 py-1 text-xs font-bold text-slate-900 border border-sky-300/60 mb-2">
              {inspectedAesthetic.category}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 font-serif">
              {inspectedAesthetic.name}
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-600">{inspectedAesthetic.mood}</p>

            {/* Description */}
            <div className="mt-5 rounded-2xl border border-black/8 bg-white/80 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Visual Philosophy
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {inspectedAesthetic.description}
              </p>
            </div>

            {/* Color Palette Details */}
            <div className="mt-4 rounded-2xl border border-black/8 bg-white/80 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Color Palette & Tokens
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {inspectedAesthetic.palette.map((hex, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl bg-[#dff4ff]/50 p-2 border border-black/6">
                    <div
                      className="h-6 w-6 shrink-0 rounded-lg border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[11px] font-mono font-bold text-slate-800">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Exemplar Prompt */}
            <div className="mt-4 rounded-2xl border border-black/8 bg-white/80 p-4 space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Typography Pairing
                </h4>
                <p className="text-xs font-semibold text-slate-900">{inspectedAesthetic.typography}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Concept Prompt Direction
                </h4>
                <p className="text-xs text-slate-700 italic bg-[#dff4ff]/40 p-2.5 rounded-xl border border-black/6">
                  "{inspectedAesthetic.exemplarPrompt}"
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-black/10">
              <button
                type="button"
                onClick={() => setInspectedAesthetic(null)}
                className="rounded-full border border-black/12 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-black/5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = inspectedAesthetic;
                  setInspectedAesthetic(null);
                  setInquiryAesthetic(target);
                }}
                className="rounded-full bg-slate-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-slate-800"
              >
                Choose this Aesthetic →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. DIRECT INQUIRY MODAL                                       */}
      {/* ------------------------------------------------------------- */}
      {inquiryAesthetic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-sky-300/60 bg-[#eaf7ff]/95 p-6 sm:p-8 text-slate-950 shadow-2xl backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => setInquiryAesthetic(null)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-sm font-bold text-slate-800 transition hover:bg-black/20"
            >
              ✕
            </button>

            <span className="rounded-full bg-[#c8ecff] px-3 py-1 text-[11px] font-bold text-slate-900 border border-sky-300/60">
              Project Inquiry
            </span>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 font-serif">
              Inquire with {inquiryAesthetic.name}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Let's create something extraordinary together with this visual aesthetic.
            </p>

            {inquirySuccess ? (
              <div className="my-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center text-xs font-bold text-emerald-800">
                🎉 Thank you! Your inquiry has been received. Tanie will reach out within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
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
                    placeholder="Acme Studio"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Vision / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Briefly tell me about your brand, goals, or timeline..."
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="w-full rounded-xl bg-slate-950 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800 disabled:opacity-50 mt-2"
                >
                  {isSubmittingInquiry ? "Submitting..." : "Send Project Inquiry →"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
