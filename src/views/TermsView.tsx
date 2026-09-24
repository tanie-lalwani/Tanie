"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { termsTranslations } from "@/data/termsTranslations";

export default function TermsView() {
  const { locale } = useLanguage();
  const copy = useMemo(() => termsTranslations[locale] || termsTranslations.en, [locale]);
  const isRtl = locale === "ur";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync with URL Hash on mount or change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (!hash) return;

      if (["terms", "privacy", "refunds", "delivery", "payments", "ip", "support"].includes(hash)) {
        setActiveTopic(hash);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Filter sections based on active topic and search query
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return copy.sections.filter((section) => {
      // Topic filter check
      if (activeTopic !== "all" && section.topicId !== activeTopic) {
        return false;
      }

      // Search query check
      if (!query) return true;

      const titleMatch = section.title.toLowerCase().includes(query);
      const topicMatch = section.topic.toLowerCase().includes(query);
      const clauseMatch = section.clauses.some((clause) =>
        clause.heading.toLowerCase().includes(query) ||
        clause.content.some((text) => text.toLowerCase().includes(query))
      );

      return titleMatch || topicMatch || clauseMatch;
    });
  }, [copy.sections, activeTopic, searchQuery]);

  const totalClauses = useMemo(() => {
    return filteredSections.reduce((acc, s) => acc + s.clauses.length, 0);
  }, [filteredSections]);

  return (
    <div className="min-h-screen bg-[#dff4ff] text-slate-900 font-sans selection:bg-sky-200 selection:text-black">
      <Navbar phase="default" />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* HERO SECTION WITH SEARCH BY TOPICS */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-100/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-950 shadow-xs mb-4">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            {copy.badge}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-3">
            {copy.title}
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium text-slate-600 leading-relaxed mb-8">
            {copy.subtitle}
          </p>

          {/* SEARCH BY TOPICS INPUT */}
          <div className="relative mx-auto max-w-xl">
            <div className="relative flex items-center">
              <svg
                className={`absolute ${isRtl ? "right-4" : "left-4"} h-5 w-5 text-sky-600/70 pointer-events-none`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                ref={searchInputRef}
                type="text"
                dir={isRtl ? "rtl" : "ltr"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className={`w-full rounded-2xl border-2 border-sky-300/80 bg-white py-3.5 ${
                  isRtl ? "pr-12 pl-12" : "pl-12 pr-12"
                } text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/5 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200/50 transition`}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer`}
                  aria-label="Clear search"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Match Counter Feedback */}
            <div className="mt-2.5 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
              <span>{copy.filterLabel}</span>
              <span>
                {filteredSections.length === 0
                  ? isRtl ? "کوئی شق نہیں ملی" : "No matching clauses found"
                  : copy.showingCount(filteredSections.length, totalClauses)}
              </span>
            </div>
          </div>

          {/* TOPIC FILTER CHIPS */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {copy.filters.map((filter) => {
              const isActive = activeTopic === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    setActiveTopic(filter.id);
                    if (filter.id !== "all") {
                      window.location.hash = filter.id;
                      const targetEl = document.getElementById(filter.id);
                      if (targetEl) {
                        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    } else {
                      window.history.replaceState(null, "", window.location.pathname);
                    }
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                      : "border border-sky-300/80 bg-white/90 text-slate-700 hover:border-sky-400 hover:bg-sky-50"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* CONTENT CONTAINER - WRAPPED WITH NATIVE DIRECTION & ALIGNMENT */}
        <div dir={isRtl ? "rtl" : "ltr"} className={`space-y-8 ${isRtl ? "text-right" : "text-left"}`}>
          {filteredSections.length === 0 ? (
            <div className="rounded-[2rem] border border-sky-200 bg-white/95 p-12 text-center shadow-lg">
              <p className="text-base font-bold text-slate-800 mb-2">{copy.noResultsTitle(searchQuery)}</p>
              <p className="text-xs text-slate-500 mb-6">{copy.noResultsSubtitle}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTopic("all");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition cursor-pointer"
              >
                {copy.resetButton}
              </button>
            </div>
          ) : (
            filteredSections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-[2rem] border border-sky-300/70 bg-white/95 p-6 sm:p-10 backdrop-blur-xl shadow-xl transition hover:border-sky-400"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-lg bg-sky-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-sky-900 border border-sky-200">
                      {section.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {section.lastUpdated}
                    </span>
                  </div>

                  <a
                    href={`#${section.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition !no-underline"
                    title="Direct Link to Section"
                  >
                    <span>{copy.sectionLinkLabel}</span>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </a>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-6">
                  {section.title}
                </h2>

                <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
                  {section.clauses.map((clause, idx) => (
                    <div key={idx} className="rounded-xl bg-sky-50/40 p-4 border border-sky-100/80">
                      <h3 className="text-base font-bold text-slate-900 mb-2">
                        {clause.heading}
                      </h3>
                      <div className="space-y-2 text-slate-700">
                        {clause.content.map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>

        {/* QUICK BOTTOM LINKS */}
        <div className="mt-12 rounded-2xl border border-sky-200 bg-white/80 p-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-sky-900">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/faq" className="hover:underline flex items-center gap-1">
              <span>{copy.quickLinks.faq}</span>
            </Link>
            <Link href="/pricing" className="hover:underline flex items-center gap-1">
              <span>{copy.quickLinks.pricing}</span>
            </Link>
            <Link href="/contact" className="hover:underline flex items-center gap-1">
              <span>{copy.quickLinks.contact}</span>
            </Link>
          </div>
          <p className="text-slate-500 font-medium">
            {copy.quickLinks.supportNote}
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
