"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

type PolicySection = {
  id: string;
  topic: string;
  topicId: "terms" | "payments" | "ip" | "refunds" | "delivery" | "privacy" | "support";
  title: string;
  badge: string;
  lastUpdated: string;
  clauses: {
    heading: string;
    content: string[];
  }[];
};

const TOPIC_FILTERS = [
  { id: "all", label: "All Policies", labelUrdu: "تمام پالیسیاں" },
  { id: "terms", label: "Terms of Service", labelUrdu: "سروس کی شرائط" },
  { id: "privacy", label: "Privacy Policy", labelUrdu: "رازداری کی پالیسی" },
  { id: "refunds", label: "Refunds & Cancellations", labelUrdu: "ریفنڈ اور منسوخی" },
  { id: "delivery", label: "Service Delivery", labelUrdu: "ڈیلیوری پالیسی" },
  { id: "payments", label: "Payment Security", labelUrdu: "ادائیگی اور سیکیورٹی" },
  { id: "ip", label: "Intellectual Property", labelUrdu: "ملکیتی حقوق" },
] as const;

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: "terms",
    topic: "Terms of Service",
    topicId: "terms",
    title: "1. Terms of Engagement & Service Scope",
    badge: "Engagement Agreement",
    lastUpdated: "September 11, 2026",
    clauses: [
      {
        heading: "1.1 Overview & Scope of Services",
        content: [
          "These Terms and Conditions govern the provision of bespoke creative engineering, UI/UX design, 3D WebGL development, interactive web applications, and full-stack software development services provided by Tanie Lalwani (\"Developer\", \"Studio\") to clients (\"Client\").",
          "By commissioning a project, purchasing a package, or submitting a payment through our checkout systems, you acknowledge and agree to these terms in full.",
        ],
      },
      {
        heading: "1.2 Project Milestones & Client Workspace",
        content: [
          "Each engagement is structured into transparent, agreed-upon milestones (e.g. Discovery & Wireframing, 3D Interaction & UI Design, Frontend Development, Staging Review, and Final Production Launch).",
          "Project deliverables, design staging links, sprint statuses, and asset transfers are centrally tracked and recorded inside the Client Workspace.",
        ],
      },
      {
        heading: "1.3 Client Obligations & Timely Feedback",
        content: [
          "To adhere to agreed project timelines, the Client agrees to provide necessary brand assets, copywriting materials, API access credentials, and timely milestone feedback within standard review windows.",
        ],
      },
      {
        heading: "1.4 30-Day Hypercare Warranty & Post-Launch Support",
        content: [
          "All completed website builds and custom web applications include a complimentary 30-day post-launch warranty period commencing immediately upon domain cutover.",
          "This hypercare warranty covers critical bug fixes, layout stability across modern desktop/mobile browsers, and performance stabilization at no additional charge.",
        ],
      },
      {
        heading: "1.5 Limitation of Liability",
        content: [
          "To the maximum extent permitted by law, the Developer shall not be liable for incidental, indirect, or consequential damages resulting from third-party hosting outages (e.g., Vercel, AWS), external API deprecations, or domain registrar DNS delays beyond our direct control.",
        ],
      },
    ],
  },
  {
    id: "payments",
    topic: "Payment Security",
    topicId: "payments",
    title: "2. Payment Terms & Razorpay Processing",
    badge: "Billing & Security",
    lastUpdated: "September 11, 2026",
    clauses: [
      {
        heading: "2.1 Retainer Deposits & Milestone Billing",
        content: [
          "Standard custom engagements require a 50% upfront retainer deposit upon contract execution prior to sprint commencement. The remaining 50% balance is invoiced upon final staging deployment approval prior to production DNS cutover or source repository transfer.",
          "For turnkey packages purchased via our instant checkout funnel, payment is fulfilled securely upfront with instant invoice issuance and automated Client Workspace onboarding.",
        ],
      },
      {
        heading: "2.2 Razorpay Payment Gateway & Compliance",
        content: [
          "All online payments, credit card authorizations, UPI transactions, and international transfers are processed through Razorpay Payments System.",
          "We do NOT store credit card numbers, CVVs, or banking credentials on our local servers. Razorpay is fully PCI-DSS Level 1 compliant and strictly adheres to Reserve Bank of India (RBI) security mandates.",
        ],
      },
      {
        heading: "2.3 Invoicing & Currencies",
        content: [
          "Invoices and payment receipts are issued automatically via email and archived within the Client Workspace. Accepted billing currencies include INR (₹), USD ($), EUR (€), and AED (د.إ).",
        ],
      },
    ],
  },
  {
    id: "ip",
    topic: "Intellectual Property",
    topicId: "ip",
    title: "3. Intellectual Property Rights & Code Ownership",
    badge: "Asset Ownership",
    lastUpdated: "September 11, 2026",
    clauses: [
      {
        heading: "3.1 Source Code & Asset Transfer",
        content: [
          "Upon receipt of 100% full payment for all project milestones, all bespoke source code, visual components, 3D interactive scenes, and custom design tokens authored specifically for the project are permanently transferred to the Client.",
          "The Client owns full commercial usage rights and may modify, deploy, or re-license the deliverable without ongoing royalty obligations.",
        ],
      },
      {
        heading: "3.2 Third-Party & Open Source Libraries",
        content: [
          "Web projects may incorporate open-source libraries (such as React, Next.js, Three.js, Tailwind CSS) distributed under permissive licenses (MIT, Apache 2.0). Client ownership applies to bespoke code authored for the project.",
        ],
      },
      {
        heading: "3.3 Portfolio & Showcase Rights",
        content: [
          "The Developer retains the non-exclusive right to display non-confidential visual previews, design mockups, and video demonstrations of the completed work in professional design portfolios, case studies, and reels.",
        ],
      },
    ],
  },
  {
    id: "refunds",
    topic: "Refunds & Cancellations",
    topicId: "refunds",
    title: "4. Cancellation & Milestone Refund Policy",
    badge: "Refund Guidelines",
    lastUpdated: "September 11, 2026",
    clauses: [
      {
        heading: "4.1 Nature of Digital Engineering Services",
        content: [
          "Tanie Lalwani Studio delivers bespoke digital design, 3D WebGL development, and full-stack software development. Because our work involves custom engineering hours and dedicated sprint allocations, refunds are administered strictly on a milestone-based policy.",
        ],
      },
      {
        heading: "4.2 48-Hour Pre-Sprint Cancellation (Full Refund)",
        content: [
          "If the Client requests cancellation in writing within 48 hours of paying a deposit and prior to the commencement of discovery or wireframing work, a 100% full refund (minus third-party payment gateway processing fees) will be issued immediately.",
        ],
      },
      {
        heading: "4.3 Milestone-Based Refund Structure",
        content: [
          "Discovery & Wireframe Stage: If the Client is dissatisfied with initial wireframes and elects to terminate the contract before code is authored, 50% of the initial deposit is refunded.",
          "Development & Staging Phase: Once software development and 3D scenes have commenced and live staging has been deployed, the initial deposit is non-refundable. However, all subsequent milestone billing is permanently waived and the engagement is concluded.",
          "Fully Completed & Approved Projects: Fees for completed deliverables approved by the Client are strictly non-refundable.",
        ],
      },
      {
        heading: "4.4 Refund Processing Timeline",
        content: [
          "All approved refunds are remitted through Razorpay directly to the original payment method (Credit/Debit Card, NetBanking, UPI, or Bank Account) within 5 to 7 business days, subject to standard banking settlement windows.",
        ],
      },
      {
        heading: "4.5 How to Request a Cancellation or Refund",
        content: [
          "To submit a cancellation or refund inquiry, email us with your project name and Razorpay Payment ID at wordsofvoice2210@gmail.com. We review and acknowledge all requests within 24 to 48 business hours.",
        ],
      },
    ],
  },
  {
    id: "delivery",
    topic: "Service Delivery",
    topicId: "delivery",
    title: "5. Digital Service Delivery & Fulfillment Policy",
    badge: "Fulfillment Policy",
    lastUpdated: "September 11, 2026",
    clauses: [
      {
        heading: "5.1 100% Digital Delivery (No Physical Goods)",
        content: [
          "All services rendered by Tanie Lalwani (including WebGL 3D experiences, responsive websites, design prototypes, and SaaS applications) are delivered 100% digitally. No physical parcels, boxes, or tangible merchandise are shipped.",
        ],
      },
      {
        heading: "5.2 Delivery Channels & Digital Assets",
        content: [
          "Live Staging URL: Deployed preview environment hosted on Vercel or secure custom subdomain for interactive testing.",
          "Source Code Handover: Private GitHub repository ownership transfer or compressed zip archive containing production builds.",
          "Design Kits & Assets: Figma workspace collaborator access, exported 3D GLB/GLTF assets, and optimized vector graphics.",
          "Client Workspace Vault: Central repository for invoices, milestone sign-offs, and documentation.",
        ],
      },
      {
        heading: "5.3 Delivery Timelines by Service Tier",
        content: [
          "High-Converting Landing Pages: 1 to 2 weeks turnaround.",
          "3D Interactive & Brand Web Experiences: 3 to 5 weeks turnaround.",
          "Full-Stack Web Applications & MVPs: 4 to 6 weeks turnaround.",
        ],
      },
      {
        heading: "5.4 Staging Review & Final Acceptance",
        content: [
          "Upon staging deployment, clients are granted a dedicated 7-day review period to test deliverables, request revisions, and sign off prior to production DNS cutover.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    topic: "Privacy Policy",
    topicId: "privacy",
    title: "6. Privacy Policy & Data Security",
    badge: "Data Protection",
    lastUpdated: "September 11, 2026",
    clauses: [
      {
        heading: "6.1 Information We Collect",
        content: [
          "We collect personal and business information provided directly by you when submitting contact forms, requesting project estimates, registering for the Client Workspace, or completing payments via Razorpay.",
          "This includes your full name, business email address, company name, telephone number, project briefs, and technical specifications.",
        ],
      },
      {
        heading: "6.2 How Your Information is Used",
        content: [
          "Your information is utilized strictly to provide digital design and development services, coordinate milestone approvals in the Client Workspace, issue invoices, and communicate project status updates.",
          "We never sell, rent, monetize, or trade your personal information to third-party advertisers or data brokers.",
        ],
      },
      {
        heading: "6.3 Third-Party Infrastructure & Subprocessors",
        content: [
          "We rely on industry-standard infrastructure providers to deliver our services securely: Supabase (encrypted database and authentication), Vercel (secure edge hosting and deployment), and Razorpay (PCI-DSS compliant payment processing).",
        ],
      },
      {
        heading: "6.4 Data Retention & Your Rights",
        content: [
          "You hold the right to review, update, or permanently delete your account data, project briefs, and stored contact details from our systems at any time upon written request.",
        ],
      },
    ],
  },
  {
    id: "support",
    topic: "Contact & Support",
    topicId: "support",
    title: "7. Official Contact & Dispute Resolution",
    badge: "Official Support",
    lastUpdated: "September 11, 2026",
    clauses: [
      {
        heading: "7.1 Contact Information",
        content: [
          "For inquiries regarding terms, privacy inquiries, milestone questions, or payment receipts, reach out directly at: wordsofvoice2210@gmail.com",
          "Website: https://tanie.me | Operating from India, serving clients worldwide.",
        ],
      },
    ],
  },
];

export default function TermsView() {
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const isUrdu = locale === "ur";
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

    return POLICY_SECTIONS.filter((section) => {
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
  }, [activeTopic, searchQuery]);

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
            {isUrdu ? "قانونی شرائط و پالیسیاں" : "Legal, Compliance & Client Agreements"}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-3">
            {isUrdu ? "شرائط، پالیسیاں اور ضمانتیں" : "Terms & Policies"}
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base font-medium text-slate-600 leading-relaxed mb-8">
            {isUrdu
              ? "ہمارے کلائنٹ معاہدے، رازداری کے قواعد، مائل اسٹون ریفنڈ پالیسی، اور ڈیجیٹل ڈیلیوری کی تمام شرائط ایک ہی جگہ پر تلاش کریں۔"
              : "Explore our unified Terms of Service, Privacy Policy, Milestone-Based Refund Rules, and Digital Service Delivery Agreement in one searchable hub."}
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
                placeholder={isUrdu ? "کسی بھی موضوع یا شرط کو تلاش کریں (مثلاً: ریفنڈ، سیکیورٹی، ریزرپے)..." : "Search topics & clauses (e.g. refunds, Razorpay, source code, warranty, delivery)..."}
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

            {/* Match Counter Feedback */}
            <div className="mt-2.5 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
              <span>
                {isUrdu ? "موضوع کے لحاظ سے فلٹر کریں" : "Filter by Topic:"}
              </span>
              <span>
                {filteredSections.length === 0
                  ? isUrdu ? "کوئی شق نہیں ملی" : "No matching clauses found"
                  : `${filteredSections.length} ${isUrdu ? "سیکشنز" : "Sections"} (${totalClauses} ${isUrdu ? "شقیں" : "Clauses"})`}
              </span>
            </div>
          </div>

          {/* TOPIC FILTER CHIPS */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {TOPIC_FILTERS.map((filter) => {
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
                  {isUrdu ? filter.labelUrdu : filter.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* CONTENT CONTAINER - WRAPPED IN dir="ltr" text-left TO PRESERVE TYPOGRAPHY */}
        <div dir="ltr" className="space-y-8 text-left">
          {filteredSections.length === 0 ? (
            <div className="rounded-[2rem] border border-sky-200 bg-white/95 p-12 text-center shadow-lg">
              <p className="text-base font-bold text-slate-800 mb-2">No clauses match your search for &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-slate-500 mb-6">Try searching for broader keywords like &quot;refund&quot;, &quot;payment&quot;, &quot;warranty&quot;, or reset your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTopic("all");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition"
              >
                Reset Search Filters
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
                      Last Updated: {section.lastUpdated}
                    </span>
                  </div>

                  <a
                    href={`#${section.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition !no-underline"
                    title="Direct Link to Section"
                  >
                    <span>Section Link</span>
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
              <span>View FAQ</span>
              <span>→</span>
            </Link>
            <Link href="/pricing" className="hover:underline flex items-center gap-1">
              <span>Cost Calculator & Packages</span>
              <span>→</span>
            </Link>
            <Link href="/contact" className="hover:underline flex items-center gap-1">
              <span>Get in Touch</span>
              <span>→</span>
            </Link>
          </div>
          <p className="text-slate-500 font-medium">
            Tanie Lalwani Studio · Direct Support: wordsofvoice2210@gmail.com
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
