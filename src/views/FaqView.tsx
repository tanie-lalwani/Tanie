"use client";

import { useState, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

type FaqItem = {
  id: string;
  category: "services" | "pricing" | "timeline" | "tech" | "portal" | "warranty";
  categoryLabel: string;
  question: string;
  answer: string[];
  keyPoints?: string[];
};

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions", labelUrdu: "تمام سوالات" },
  { id: "services", label: "Services & Scope", labelUrdu: "خدمات اور اسکوپ" },
  { id: "pricing", label: "Pricing & Payments", labelUrdu: "قیمتیں اور ادائیگی" },
  { id: "timeline", label: "Timeline & Delivery", labelUrdu: "وقت اور ڈیلیوری" },
  { id: "tech", label: "3D & Tech Stack", labelUrdu: "تھری ڈی اور ٹیکنالوجی" },
  { id: "portal", label: "Client Workspace", labelUrdu: "کلائنٹ ورک اسپیس" },
  { id: "warranty", label: "Warranty & Support", labelUrdu: "وارنٹی اور مدد" },
] as const;

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "services-offered",
    category: "services",
    categoryLabel: "Services & Scope",
    question: "What kind of websites and digital experiences do you build?",
    answer: [
      "I specialize in high-converting bespoke digital experiences: high-performance landing pages, luxury product showcases, interactive 3D WebGL websites, and full-stack Next.js web applications with authenticated client dashboards.",
      "Every project is crafted from scratch using clean code and modern aesthetics without bloated WordPress templates or generic page builders.",
    ],
    keyPoints: [
      "Custom UI/UX designed in Figma with fluid micro-interactions",
      "Interactive 3D WebGL scenes using Three.js and React Three Fiber",
      "Ultra-fast Next.js architecture with instant page transitions",
    ],
  },
  {
    id: "custom-vs-packages",
    category: "services",
    categoryLabel: "Services & Scope",
    question: "What is the difference between turnkey packages and custom scope?",
    answer: [
      "Turnkey packages (like our High-Converting Landing Page or 3D Brand Experience) offer fixed pricing and predefined deliverables ideal for fast launch.",
      "Our interactive Cost Calculator allows you to dynamically configure custom requirements, page counts, bespoke 3D physics models, backend authentication, and multi-currency billing tailored exactly to your business.",
    ],
  },
  {
    id: "figma-design-first",
    category: "services",
    categoryLabel: "Services & Scope",
    question: "Do you design in Figma before authoring code?",
    answer: [
      "Yes. Every build starts in Figma with visual moodboards, typography pairing, wireframes, and interactive click-through prototypes.",
      "You review and approve the design direction before development begins, ensuring zero surprises and total creative alignment.",
    ],
  },
  {
    id: "payment-milestones",
    category: "pricing",
    categoryLabel: "Pricing & Payments",
    question: "How do payment milestones and deposits work?",
    answer: [
      "Custom projects are split into a standard 50% upfront retainer deposit upon contract signing, and the remaining 50% upon final staging review prior to production DNS cutover.",
      "For turnkey packages purchased directly through the site, payment is securely captured upfront with automated invoice issuance and instant onboarding to your private Client Workspace.",
    ],
    keyPoints: [
      "50% deposit to commence sprint discovery and wireframing",
      "50% balance upon final staging approval before domain cutover",
      "Official tax receipts and invoices generated automatically",
    ],
  },
  {
    id: "payment-methods",
    category: "pricing",
    categoryLabel: "Pricing & Payments",
    question: "What payment methods and currencies are supported?",
    answer: [
      "All transactions are processed through Razorpay Payments System, supporting Visa, Mastercard, American Express, UPI, NetBanking, and international card authorizations.",
      "We accept payments in INR (₹), USD ($), EUR (€), and AED (د.إ) with zero currency conversion friction.",
    ],
  },
  {
    id: "hidden-fees",
    category: "pricing",
    categoryLabel: "Pricing & Payments",
    question: "Are there any hidden recurring fees or unexpected costs?",
    answer: [
      "Never. All quotes provide upfront, all-inclusive pricing for development labor. Standard infrastructure like Vercel edge hosting and Supabase database tiers are free or low-cost and configured directly under your ownership.",
    ],
  },
  {
    id: "turnaround-timeline",
    category: "timeline",
    categoryLabel: "Timeline & Delivery",
    question: "How long does a website take from start to launch?",
    answer: [
      "Typical delivery schedules depend on package scope:",
    ],
    keyPoints: [
      "High-Converting Landing Pages: 1 to 2 weeks",
      "3D Interactive & Brand Web Experiences: 3 to 5 weeks",
      "Full-Stack Web Applications & MVPs: 4 to 6 weeks",
      "Rush turnaround options are available for urgent product launches",
    ],
  },
  {
    id: "delivery-handover",
    category: "timeline",
    categoryLabel: "Timeline & Delivery",
    question: "How are deliverables handed over at the end of the project?",
    answer: [
      "Everything is delivered 100% digitally. We transfer private GitHub repository ownership, grant full collaborator rights to your Figma project, export high-resolution assets, and assist with production domain DNS cutover.",
    ],
    keyPoints: [
      "Complete bespoke source code ownership transfer via GitHub",
      "Full Figma design workspace transfer with all components",
      "Zero-downtime DNS deployment to Vercel or your hosting of choice",
    ],
  },
  {
    id: "what-i-need-to-provide",
    category: "timeline",
    categoryLabel: "Timeline & Delivery",
    question: "What materials do I need to prepare before we start?",
    answer: [
      "To hit the ground running, share your logo or brand guide, any existing copy or text drafts, and 2-3 visual references of websites you admire.",
      "If you don't have finalized copy or brand imagery yet, don't worry—we assist with strategic wireframing, content layout, and licensing high-end visual assets.",
    ],
  },
  {
    id: "tech-stack-details",
    category: "tech",
    categoryLabel: "3D & Tech Stack",
    question: "What technologies and frameworks do you build with?",
    answer: [
      "We build with an ultra-modern, battle-tested engineering stack:",
    ],
    keyPoints: [
      "Next.js 15 (App Router, Server Components, SSR for peak SEO)",
      "TypeScript for type-safe, resilient code architecture",
      "Three.js & React Three Fiber for custom WebGL graphics and shaders",
      "Tailwind CSS & Framer Motion for buttery-smooth micro-interactions",
      "Supabase (PostgreSQL, row-level security, auth) for dynamic apps",
    ],
  },
  {
    id: "mobile-3d-performance",
    category: "tech",
    categoryLabel: "3D & Tech Stack",
    question: "Will 3D graphics slow down my website or drain battery on mobile devices?",
    answer: [
      "No. All 3D scenes are built with strict performance budgets: compressed GLB Draco meshes, level-of-detail (LOD) management, GPU draw call batching, and adaptive pixel ratios that maintain 60 FPS on both mobile and desktop.",
      "For low-power mobile devices, graceful progressive enhancements guarantee zero lag and instantaneous interactions.",
    ],
  },
  {
    id: "seo-lighthouse",
    category: "tech",
    categoryLabel: "3D & Tech Stack",
    question: "Will my website rank on Google and pass Core Web Vitals?",
    answer: [
      "Yes. Every page is structured with semantic HTML5, pre-rendered server-side tags, OpenGraph social previews, dynamic sitemaps, and optimized font/asset loading.",
      "We target 90+ scores on Google Lighthouse for Performance, Accessibility, Best Practices, and SEO.",
    ],
  },
  {
    id: "client-workspace-features",
    category: "portal",
    categoryLabel: "Client Workspace",
    question: "What is the Client Workspace and how do I access it?",
    answer: [
      "The Client Workspace is your dedicated private dashboard on tanie.me where you can view live sprint roadmaps, review interactive staging links, download project invoices, and message me directly.",
      "You receive instant access upon booking with secure passwordless email authentication.",
    ],
  },
  {
    id: "revisions-feedback",
    category: "warranty",
    categoryLabel: "Warranty & Support",
    question: "How do revisions work if I need changes?",
    answer: [
      "Each milestone (Wireframes, Visual UI, and Staging Review) includes dedicated feedback loops. We iterate until the typography, color hierarchy, and animations match your exact specifications.",
      "Upon staging deployment, you have a 7-day acceptance window to test everything thoroughly.",
    ],
  },
  {
    id: "warranty-period",
    category: "warranty",
    categoryLabel: "Warranty & Support",
    question: "What happens after the website is launched? Is there a warranty?",
    answer: [
      "Yes! Every project includes a 30-day complimentary post-launch hypercare warranty. If any unexpected bugs, cross-browser rendering quirks, or layout shifts arise, they are resolved immediately at zero additional cost.",
      "Ongoing monthly retainer partnerships are also available for continuous feature updates, AB testing, and performance tuning.",
    ],
  },
];

export default function FaqView() {
  const { locale } = useLanguage();
  const isUrdu = locale === "ur";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["services-offered", "payment-milestones"]));
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on activeCategory and searchQuery
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FAQ_ITEMS.filter((item) => {
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
  }, [activeCategory, searchQuery]);

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
            {isUrdu ? "مدد اور عمومی سوالات" : "Help Center & Frequently Asked Questions"}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-3">
            {isUrdu ? "آپ کے تمام سوالات کے جوابات" : "Frequently Asked Questions"}
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium text-slate-600 leading-relaxed mb-8">
            {isUrdu
              ? "پروجیکٹ اسکوپ، قیمتیں، ڈیلیوری کا وقت، تھری ڈی ویب گل، اور کلائنٹ ورک اسپیس کے بارے میں اپنے سوالات کے فوری جوابات تلاش کریں۔"
              : "Clear answers to common questions about project scopes, pricing, 3D WebGL experiences, delivery timelines, and client deliverables."}
          </p>

          {/* SEARCH BY TOPICS INPUT */}
          <div className="relative mx-auto max-w-xl">
            <div className="relative flex items-center">
              <svg
                className="absolute left-4 h-5 w-5 text-sky-600/70 pointer-events-none"
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
                dir="ltr"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isUrdu ? "کوئی بھی سوال یا موضوع تلاش کریں (مثلاً: قیمت، ٹائم لائن، 3D، ریفنڈ)..." : "Search questions & topics (e.g. pricing, timeline, 3D, Razorpay, warranty)..."}
                className="w-full rounded-2xl border-2 border-sky-300/80 bg-white py-3.5 pl-12 pr-12 text-sm font-semibold text-slate-900 shadow-lg shadow-sky-500/5 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-200/50 transition"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3.5 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
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
              <span>
                {filteredItems.length} {isUrdu ? "سوالات ملے" : "questions found"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={expandAll}
                  className="hover:text-sky-800 transition underline cursor-pointer"
                >
                  {isUrdu ? "سب کھولیں" : "Expand All"}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="hover:text-sky-800 transition underline cursor-pointer"
                >
                  {isUrdu ? "سب بند کریں" : "Collapse All"}
                </button>
              </div>
            </div>
          </div>

          {/* TOPIC FILTER CHIPS */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {FAQ_CATEGORIES.map((cat) => {
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
                  {isUrdu ? cat.labelUrdu : cat.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* ACCORDION ITEMS - WRAPPED IN dir="ltr" text-left TO PRESERVE TYPOGRAPHY */}
        <div dir="ltr" className="space-y-4 text-left">
          {filteredItems.length === 0 ? (
            <div className="rounded-[2rem] border border-sky-200 bg-white/95 p-12 text-center shadow-lg">
              <p className="text-base font-bold text-slate-800 mb-2">No questions match &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-slate-500 mb-6">Have a specific question not covered here? Feel free to reach out directly.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition"
              >
                Reset Search
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
                          <p className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-2">Key Takeaways:</p>
                          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
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
            Have a unique project or custom inquiry?
          </h3>
          <p className="text-sm font-medium text-slate-600 max-w-lg mx-auto mb-6">
            Let&apos;s build something memorable together. Schedule a discovery discussion or calculate your custom project investment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition !no-underline"
            >
              <span>Explore Pricing & Packages</span>
              <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white px-6 py-3 text-xs font-bold text-slate-800 hover:bg-sky-50 transition !no-underline"
            >
              <span>Contact Directly</span>
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-xs font-bold text-sky-800 hover:underline !no-underline"
            >
              <span>Terms & Policies →</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
