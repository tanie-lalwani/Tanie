"use client";

import { useState, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { faqTranslations } from "@/data/faqTranslations";

export default function FaqView() {
  const { locale } = useLanguage();
  const copy = useMemo(() => faqTranslations[locale] || faqTranslations.en, [locale]);
  const isRtl = locale === "ur";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["services-offered", "payment-milestones"]));
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on activeCategory and searchQuery
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return copy.items.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }

      if (!query) return true;

      const qMatch = item.question.toLowerCase().includes(query);
      const aMatch = item.answer.some((line) => line.toLowerCase().includes(query));
      const kMatch = item.keyPoints?.some((pt) => pt.toLowerCase().includes(query));
      const cMatch = item.categoryLabel.toLowerCase().includes(query);

      return qMatch || aMatch || kMatch || cMatch;
    });
  }, [copy.items, activeCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredItems.map((item) => item.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div className="min-h-screen bg-[#dff4ff] text-slate-900 font-sans selection:bg-sky-200 selection:text-black">
      <Navbar phase="default" />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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

            {/* Filter Status & Controls */}
            <div className="mt-2.5 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
              <span>{copy.questionsFound(filteredItems.length)}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={expandAll}
                  className="hover:text-sky-800 transition underline cursor-pointer"
                >
                  {copy.expandAll}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="hover:text-sky-800 transition underline cursor-pointer"
                >
                  {copy.collapseAll}
                </button>
              </div>
            </div>
          </div>

          {/* TOPIC FILTER CHIPS */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {copy.categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/20"
                      : "border border-sky-300/80 bg-white/90 text-slate-700 hover:border-sky-400 hover:bg-sky-50"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* ACCORDION ITEMS - WITH NATIVE DIRECTION & ALIGNMENT */}
        <div dir={isRtl ? "rtl" : "ltr"} className={`space-y-4 ${isRtl ? "text-right" : "text-left"}`}>
          {filteredItems.length === 0 ? (
            <div className="rounded-[2rem] border border-sky-200 bg-white/95 p-12 text-center shadow-lg">
              <p className="text-base font-bold text-slate-800 mb-2">{copy.noQuestionsTitle(searchQuery)}</p>
              <p className="text-xs text-slate-500 mb-6">{copy.noQuestionsSubtitle}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition cursor-pointer"
              >
                {copy.resetButton}
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = expandedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  id={item.id}
                  className="rounded-2xl border border-sky-300/70 bg-white/95 backdrop-blur-xl shadow-md transition hover:border-sky-400 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="space-y-1.5">
                      <span className="inline-block rounded-md bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-sky-900 border border-sky-200">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`shrink-0 rounded-full border border-sky-200 bg-sky-50 p-1.5 text-sky-800 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 bg-sky-200" : ""
                      }`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-sm text-slate-700 leading-relaxed border-t border-sky-100">
                      <div className="space-y-3 font-medium">
                        {item.answer.map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>

                      {item.keyPoints && item.keyPoints.length > 0 && (
                        <div className="mt-4 rounded-xl bg-sky-50/60 p-4 border border-sky-100">
                          <p className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-2">
                            {copy.keyTakeawaysLabel}
                          </p>
                          <ul className={`list-disc ${isRtl ? "pr-5" : "pl-5"} space-y-1 text-xs sm:text-sm text-slate-700`}>
                            {item.keyPoints.map((pt, kIdx) => (
                              <li key={kIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM CONTACT CALLOUT */}
        <div className="mt-12 rounded-[2rem] border border-sky-300 bg-linear-to-br from-white to-sky-50/80 p-8 text-center shadow-lg">
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-2">
            {copy.bottomCta.title}
          </h3>
          <p className="text-sm font-medium text-slate-600 max-w-lg mx-auto mb-6">
            {copy.bottomCta.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition !no-underline"
            >
              <span>{copy.bottomCta.explorePricing}</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white px-6 py-3 text-xs font-bold text-slate-800 hover:bg-sky-50 transition !no-underline"
            >
              <span>{copy.bottomCta.contactDirectly}</span>
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-xs font-bold text-sky-800 hover:underline !no-underline"
            >
              <span>{copy.bottomCta.termsLink}</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
