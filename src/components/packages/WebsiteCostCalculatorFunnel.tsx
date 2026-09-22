"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { saveClientCustomQuote } from "@/lib/portalServices";
import { getSavedLeadProfile, saveLeadProfile } from "@/features/lead-capture/lib/cookieHelper";

interface FeatureBundle {
  id: string;
  name: string;
  icon: string;
  priceInr: number;
  priceUsd: number;
  badge?: string;
  tagline: string;
  description: string;
  includedFeatures: string[];
  isEssential?: boolean;
}

export const FEATURE_BUNDLES: FeatureBundle[] = [
  {
    id: "essential_core",
    name: "Essential Website Core Architecture",
    icon: "🏛️",
    priceInr: 5000,
    priceUsd: 75,
    isEssential: true,
    badge: "Base Included",
    tagline: "Ultra-fast modern responsive foundation with pristine typography.",
    description: "Responsive layout for mobile/tablet/desktop, About story, Service pages, Contact form with email notifications, 95+ Lighthouse speed, SSL and Edge CDN hosting setup.",
    includedFeatures: [
      "Bespoke Responsive Layout (Mobile + Desktop)",
      "About Us & Services Directory Pages",
      "Contact Inquiry Form with Instant Email Alerts",
      "Speed Optimization (Lighthouse 95+)",
      "SSL Certificate & Domain DNS Configuration"
    ]
  },
  {
    id: "ecommerce_ordering",
    name: "E-Commerce & Online Storefront Suite",
    icon: "🛍️",
    priceInr: 9500,
    priceUsd: 135,
    badge: "High-ROI",
    tagline: "Product catalog, variants, cart, Razorpay/Stripe checkout & GST invoices.",
    description: "Sell products seamlessly with inventory management, color/size variants, faceted search, discount coupon codes, automated tax invoice PDFs, and abandoned cart recovery.",
    includedFeatures: [
      "Product Catalog with Variants (Size, Color, SKU)",
      "Slide-Over Cart & Frictionless One-Page Checkout",
      "Razorpay, Stripe & UPI Payment Gateway Integration",
      "Real-Time Stock Inventory & Low-Stock Alerts",
      "GST Compliant Automated PDF Invoices"
    ]
  },
  {
    id: "booking_appointments",
    name: "Smart Appointment & Booking Engine",
    icon: "📅",
    priceInr: 8500,
    priceUsd: 120,
    badge: "Popular",
    tagline: "Live slot picker, stylist/doctor selection & automated WhatsApp reminders.",
    description: "Allow clients to book appointments 24/7 with real-time calendar slot blocking, staff availability schedules, deposit payments, and automated WhatsApp/SMS notifications.",
    includedFeatures: [
      "Interactive Calendar Slot Availability Blocker",
      "Staff, Stylist, or Doctor Specialist Selector",
      "Booking Deposit & Prepayment Gateway Integration",
      "Automated WhatsApp & Email 24h/2h Reminders",
      "Self-Service Rescheduling & Cancellation Link"
    ]
  },
  {
    id: "lead_crm",
    name: "Lead Capture & Sales CRM Funnel",
    icon: "🎯",
    priceInr: 6500,
    priceUsd: 95,
    tagline: "Quote builders, lead database, instant WhatsApp pings & sales pipeline.",
    description: "Turn casual visitors into paying clients with high-converting inquiry forms, centralized searchable lead database, instant WhatsApp alerts to owners, and follow-up reminders.",
    includedFeatures: [
      "Multi-Step Consultation & Quote Request Modals",
      "Centralized Searchable Lead Repository",
      "Instant WhatsApp & Telegram Notification to Owner",
      "Lead Status Pipeline (New, Contacted, Qualified, Won)",
      "HubSpot / Zoho CRM Webhook Synchronization"
    ]
  },
  {
    id: "ai_assistant",
    name: "AI Copilot & Conversational Chatbot",
    icon: "🧠",
    priceInr: 8000,
    priceUsd: 115,
    badge: "AI Native",
    tagline: "Context-aware AI assistant trained on your business docs, products & FAQs.",
    description: "Empower visitors with a streaming AI assistant that answers questions accurately, recommends relevant services/products, and qualifies prospects before booking.",
    includedFeatures: [
      "Streaming Gemini / OpenAI Conversational Widget",
      "Custom Knowledge Base Trained on Your Business",
      "Smart 24/7 FAQ & Policy Resolution",
      "AI Product & Service Recommendation Engine",
      "Natural Language Lead Qualification Chat"
    ]
  },
  {
    id: "design_3d_gsap",
    name: "Luxury 3D WebGL & GSAP Choreography",
    icon: "🎨",
    priceInr: 7500,
    priceUsd: 110,
    badge: "Awwwards Tier",
    tagline: "Interactive Three.js 3D viewport, Lenis smooth scroll & magnetic physics.",
    description: "Give your brand a breathtaking digital presence with interactive 3D model orbiters, particle shaders, scroll-driven typography reveals, and silky smooth transitions.",
    includedFeatures: [
      "Three.js / WebGL Interactive 3D Model Canvas",
      "Lenis Smooth Scrolling with Pinned Story Chapters",
      "Kinetic Magnetic Buttons & Fluid Micro-Interactions",
      "Custom Dark / Light Mode Palette Engine",
      "GSAP High-Performance Hardware-Accelerated Timelines"
    ]
  },
  {
    id: "staff_portal",
    name: "Employee & Staff Management Portal",
    icon: "👥",
    priceInr: 6000,
    priceUsd: 85,
    tagline: "Staff logins, shift scheduling roster, attendance & commission tracking.",
    description: "Equip your internal team with dedicated logins, daily appointment rosters, shift schedules, task checklists, and automated performance commission reports.",
    includedFeatures: [
      "Dedicated Employee Login & Profile Space",
      "Weekly Shift Scheduling & Availability Calendar",
      "Digital Attendance & Timesheet Tracking",
      "Lead & Booking Assignment per Specialist",
      "Automated Sales Commission & Performance Reports"
    ]
  },
  {
    id: "multi_location",
    name: "Multi-Location & Branch Network Hub",
    icon: "🏢",
    priceInr: 5500,
    priceUsd: 80,
    tagline: "Branch landing pages, geolocation store locator & local booking routing.",
    description: "Engineered for growing businesses with multiple clinics, salons, restaurants, or offices across different cities with individual contact info and schedules.",
    includedFeatures: [
      "Individual SEO Landing Pages per City / Branch",
      "Zip-Code & Geolocation Google Store Locator",
      "Location-Specific Pricing & Service Menus",
      "Routing of Inquiries & Bookings to Local Managers",
      "Multi-Branch Centralized Admin Dashboard"
    ]
  },
  {
    id: "growth_seo",
    name: "Advanced Local SEO & Ad Pixel Suite",
    icon: "📈",
    priceInr: 5000,
    priceUsd: 75,
    tagline: "Google Business Profile, Meta Pixel, GA4 analytics & local search schema.",
    description: "Dominate search engines for high-intent queries with localized schema markup, Google Maps citation, Meta Pixel conversion events, and GA4 telemetry.",
    includedFeatures: [
      "Google Search Console & Business Profile Integration",
      "Local Business JSON-LD Schema Rich Snippets",
      "Meta (Facebook/Instagram) Pixel with Event Tracking",
      "Google Analytics 4 (GA4) Custom Funnel Setup",
      "Core Web Vitals & Image Alt-Text Optimization"
    ]
  },
  {
    id: "devops_care",
    name: "Cloud DevOps, Daily Backups & Care Retainer",
    icon: "🛡️",
    priceInr: 4500,
    priceUsd: 65,
    tagline: "Automated daily cloud backups, 60-day warranty & monthly maintenance.",
    description: "Worry-free production stability with automated database snapshots, 24/7 uptime monitoring, security patches, and direct priority developer support.",
    includedFeatures: [
      "Vercel Edge CDN & Production Database Provisioning",
      "Automated Daily Code & Data Cloud Backups",
      "24/7 Uptime & Error Crash Monitoring (Sentry)",
      "60-Day Extended Hypercare Bug Fix Warranty",
      "3-Month Monthly Software & Content Maintenance Retainer"
    ]
  }
];

export interface IndustryOption {
  id: string;
  name: string;
  icon: string;
  recommendedBundles: string[];
  sampleBusinessName: string;
}

export const INDUSTRIES: IndustryOption[] = [
  {
    id: "salon",
    name: "Salon, Spa & Aesthetics",
    icon: "💇‍♀️",
    sampleBusinessName: "Lumina Hair & Beauty Lounge",
    recommendedBundles: ["essential_core", "booking_appointments", "growth_seo", "design_3d_gsap"]
  },
  {
    id: "fashion",
    name: "Fashion & E-Commerce D2C",
    icon: "👗",
    sampleBusinessName: "Velvet & Silk Apparel",
    recommendedBundles: ["essential_core", "ecommerce_ordering", "growth_seo", "ai_assistant"]
  },
  {
    id: "clinic",
    name: "Doctor, Dental & Healthcare",
    icon: "🩺",
    sampleBusinessName: "Apex Dental & Wellness Care",
    recommendedBundles: ["essential_core", "booking_appointments", "lead_crm", "growth_seo"]
  },
  {
    id: "restaurant",
    name: "Restaurant, Bar & Cafe",
    icon: "🍽️",
    sampleBusinessName: "Artisan Bistro & Espresso",
    recommendedBundles: ["essential_core", "ecommerce_ordering", "booking_appointments", "growth_seo"]
  },
  {
    id: "real_estate",
    name: "Real Estate & Builders",
    icon: "🏢",
    sampleBusinessName: "Skyline Realty & Estates",
    recommendedBundles: ["essential_core", "lead_crm", "design_3d_gsap", "growth_seo"]
  },
  {
    id: "b2b",
    name: "B2B Manufacturer & Exporter",
    icon: "🏭",
    sampleBusinessName: "PrimeTech Industrial Goods",
    recommendedBundles: ["essential_core", "lead_crm", "multi_location", "growth_seo"]
  },
  {
    id: "portfolio",
    name: "Creator, Studio & Freelancer",
    icon: "🎨",
    sampleBusinessName: "Kinetics Visual Design Studio",
    recommendedBundles: ["essential_core", "design_3d_gsap", "lead_crm"]
  },
  {
    id: "saas",
    name: "SaaS App & Digital Platform",
    icon: "⚡",
    sampleBusinessName: "FlowMetric AI Cloud Platform",
    recommendedBundles: ["essential_core", "ai_assistant", "design_3d_gsap", "devops_care"]
  },
  {
    id: "education",
    name: "Education, Coaching & Academy",
    icon: "🎓",
    sampleBusinessName: "NextGen Learning Institute",
    recommendedBundles: ["essential_core", "booking_appointments", "lead_crm", "ai_assistant"]
  },
  {
    id: "custom",
    name: "Custom Bespoke Business",
    icon: "🛠️",
    sampleBusinessName: "Signature Enterprise Project",
    recommendedBundles: ["essential_core", "lead_crm", "design_3d_gsap"]
  }
];

interface WebsiteCostCalculatorFunnelProps {
  onProceedWithCustomQuote?: (quoteData: any) => void;
  onStepChange?: (step: number) => void;
}

export default function WebsiteCostCalculatorFunnel({
  onProceedWithCustomQuote,
  onStepChange
}: WebsiteCostCalculatorFunnelProps) {
  const { user, isAuthenticated, signInWithPassword, signUp } = useAuth();

  // Lead ID for deduplication across steps
  const [leadId, setLeadId] = useState<string>("");

  // Current Funnel Step: "hero" (0) -> "step1" (Foundation) -> "step2" (Industry) -> "step3" (Bundles) -> "step4" (Budget & Timeline) -> "result" (Estimated Breakdown)
  const [currentStep, setCurrentStep] = useState<number>(0);

  // User input states
  const [businessName, setBusinessName] = useState("");
  const [websiteType, setWebsiteType] = useState<"business" | "portfolio" | "ecommerce" | "saas">("business");
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryOption>(INDUSTRIES[0]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>(["essential_core", "booking_appointments", "growth_seo"]);
  const [budgetTier, setBudgetTier] = useState<string>("₹25,000 – ₹50,000 (Growth Suite)");
  const [timeline, setTimeline] = useState<string>("3–4 Weeks (Standard Launch)");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Auth unlock gate state
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authError, setAuthError] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const funnelContainerRef = useRef<HTMLDivElement>(null);

  // Prepopulate from cookies/localStorage on mount
  useEffect(() => {
    const saved = getSavedLeadProfile();
    if (saved.businessName && !businessName) {
      setBusinessName(saved.businessName);
    }
    if (saved.name && !authName) {
      setAuthName(saved.name);
    }
    if (saved.email && !authEmail) {
      setAuthEmail(saved.email);
    }
    if (saved.leadId && !leadId) {
      setLeadId(saved.leadId);
    }
  }, []);

  // Background lead capture dispatcher
  const dispatchLeadCapture = async (data: Record<string, any>) => {
    try {
      const payload = {
        id: leadId || undefined,
        businessName: businessName.trim() || undefined,
        businessType: websiteType,
        industry: selectedIndustry.name,
        selectedBundles,
        budgetTier,
        timeline,
        source: "hero_cost_calculator",
        ...data
      };

      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success && json.leadId) {
        setLeadId(json.leadId);
        saveLeadProfile({ leadId: json.leadId });
      }
    } catch (e) {
      console.warn("Background lead capture error:", e);
    }
  };

  // Debounced typing capture for the hero input field
  useEffect(() => {
    if (businessName.trim().length < 2) return;

    const timer = setTimeout(() => {
      dispatchLeadCapture({
        businessName: businessName.trim(),
        step: "Hero Search Input",
        status: "typing"
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [businessName]);

  // If already authenticated, automatically unlock results
  useEffect(() => {
    if (isAuthenticated) {
      setIsUnlocked(true);
    }
  }, [isAuthenticated]);

  // Math Calculations
  const calculation = useMemo(() => {
    let subtotalInr = 0;
    let subtotalUsd = 0;

    selectedBundles.forEach((bundleId) => {
      const bundle = FEATURE_BUNDLES.find((b) => b.id === bundleId);
      if (bundle) {
        subtotalInr += bundle.priceInr;
        subtotalUsd += bundle.priceUsd;
      }
    });

    // Package discount (20% for 3+ bundles, 25% for 5+ bundles)
    let discountPercent = 0;
    if (selectedBundles.length >= 5) discountPercent = 25;
    else if (selectedBundles.length >= 3) discountPercent = 20;
    else if (selectedBundles.length >= 2) discountPercent = 15;

    const discountAmountInr = Math.round((subtotalInr * discountPercent) / 100);
    const discountAmountUsd = Math.round((subtotalUsd * discountPercent) / 100);

    const finalTotalInr = subtotalInr - discountAmountInr;
    const finalTotalUsd = subtotalUsd - discountAmountUsd;

    return {
      subtotalInr,
      subtotalUsd,
      discountPercent,
      discountAmountInr,
      discountAmountUsd,
      finalTotalInr,
      finalTotalUsd,
      bundleCount: selectedBundles.length
    };
  }, [selectedBundles]);

  // Quick Pick preset click in Hero
  const handleQuickPick = (industry: IndustryOption) => {
    setSelectedIndustry(industry);
    setBusinessName(industry.sampleBusinessName);
    setSelectedBundles(industry.recommendedBundles);
    setCurrentStep(1);
    onStepChange?.(1);

    dispatchLeadCapture({
      businessName: industry.sampleBusinessName,
      industry: industry.name,
      selectedBundles: industry.recommendedBundles,
      step: "Quick Choice Picked",
      status: "in_progress"
    });

    scrollToFunnel();
  };

  // Click on Hero "CALCULATE COST" button
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setBusinessName("My Website Project");
    }
    setCurrentStep(1);
    onStepChange?.(1);

    dispatchLeadCapture({
      businessName: businessName.trim() || "My Website Project",
      step: "Step 1: Website Foundation",
      status: "in_progress"
    });

    scrollToFunnel();
  };

  const scrollToFunnel = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Toggle bundle selection
  const handleToggleBundle = (bundleId: string) => {
    if (bundleId === "essential_core") return; // Essential core is always required
    setSelectedBundles((prev) => {
      const next = prev.includes(bundleId)
        ? prev.filter((id) => id !== bundleId)
        : [...prev, bundleId];

      dispatchLeadCapture({
        selectedBundles: next,
        step: "Step 3: Feature Bundles",
        status: "in_progress"
      });

      return next;
    });
  };

  // Handle Question Step navigation
  const goToStep = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
    dispatchLeadCapture({
      step: `Step ${step}`,
      status: step === 5 ? "unlocked" : "in_progress"
    });
    scrollToFunnel();
  };

  // Auth unlock submission
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthSubmitting(true);

    try {
      if (authMode === "signup") {
        const res = await signUp(authEmail.trim().toLowerCase(), authPassword);
        if (res?.error) {
          setAuthError(res.error.message);
          setIsAuthSubmitting(false);
          return;
        }
      } else {
        const res = await signInWithPassword(authEmail.trim().toLowerCase(), authPassword);
        if (res?.error) {
          setAuthError(res.error.message);
          setIsAuthSubmitting(false);
          return;
        }
      }

      // Lead unlocked
      setIsUnlocked(true);
      await dispatchLeadCapture({
        clientEmail: authEmail.trim().toLowerCase(),
        clientName: authName.trim() || businessName.trim(),
        step: "Result Unlocked",
        status: "unlocked",
        estimatedCostInr: calculation.finalTotalInr,
        estimatedCostUsd: calculation.finalTotalUsd,
        discountPercent: calculation.discountPercent
      });

      // Save custom quote draft to database
      if (user?.email || authEmail) {
        await saveClientCustomQuote({
          client_email: user?.email || authEmail.trim().toLowerCase(),
          client_name: authName.trim() || businessName.trim(),
          project_name: businessName || `${selectedIndustry.name} Project`,
          industry_template: selectedIndustry.id,
          selected_features: selectedBundles.reduce((acc, id) => ({ ...acc, [id]: 1 }), {}),
          base_price_inr: 5000,
          base_price_usd: 75,
          itemized_total_inr: calculation.subtotalInr - 5000,
          itemized_total_usd: calculation.subtotalUsd - 75,
          discount_percent: calculation.discountPercent,
          discount_amount_inr: calculation.discountAmountInr,
          discount_amount_usd: calculation.discountAmountUsd,
          final_total_inr: calculation.finalTotalInr,
          final_total_usd: calculation.finalTotalUsd,
          currency: currency,
          status: "submitted"
        });
      }

      setSaveToast("Quote successfully calculated & saved to your account!");
      setTimeout(() => setSaveToast(null), 4000);
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // WhatsApp share
  const handleWhatsAppQuote = () => {
    const text = `Hi Tanie! I just calculated my website cost on your website:
🏢 *Business:* ${businessName} (${selectedIndustry.name})
📦 *Selected Modules (${calculation.bundleCount}):*
${selectedBundles
  .map((id) => {
    const b = FEATURE_BUNDLES.find((item) => item.id === id);
    return `• ${b?.name}`;
  })
  .join("\n")}
💰 *Calculated Price:* ${currency === "INR" ? `₹${calculation.finalTotalInr.toLocaleString()}` : `$${calculation.finalTotalUsd.toLocaleString()}`} (includes ${calculation.discountPercent}% bundle discount)
⏱️ *Timeline:* ${timeline}

Let's discuss getting started!`;

    window.open(`https://wa.me/919326048128?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div ref={funnelContainerRef} className="w-full">
      {/* SUCCESS TOAST */}
      {saveToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#0a192f] text-white text-xs px-5 py-3 rounded-xl shadow-xl border border-sky-400/30 flex items-center gap-2">
          <span>✨</span>
          <span>{saveToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: MINIMALIST "CALCULATE YOUR WEBSITE COST" (Only Step 0)   */}
      {/* ========================================================================= */}
      {currentStep === 0 && (
        <div className="max-w-4xl mx-auto text-center pt-4 pb-8 sm:pb-12">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight !text-[#0a192f] leading-tight">
            Calculate your <span className="text-sky-700">website cost</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-sky-950/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Get an instant, transparent price estimate tailored to your exact industry and features.
          </p>

          {/* FILL-IN SEARCH CTA FORM */}
          <form onSubmit={handleHeroSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-full bg-white/85 border border-sky-300 shadow-md focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/15 transition-all">
              <div className="flex items-center gap-3 w-full pl-4">
                <span className="text-sky-500 text-lg">🔍</span>
                <input
                  id="calc_hero_business_name"
                  name="organization"
                  autoComplete="organization"
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    saveLeadProfile({ businessName: e.target.value });
                  }}
                  placeholder="Enter your business or project name (e.g. Lumina Hair Lounge)..."
                  className="w-full bg-transparent text-sm sm:text-base !text-[#0a192f] placeholder-sky-900/40 focus:outline-none py-2 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CALCULATE COST</span>
                <span>→</span>
              </button>
            </div>
          </form>

          {/* QUICK CHOICE SUGGESTIONS PILLS */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-sky-950/70 mr-1">Quick choice:</span>
            {INDUSTRIES.slice(0, 7).map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => handleQuickPick(ind)}
                className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-sky-200/80 hover:border-sky-400 text-xs font-semibold text-[#0a192f] hover:text-sky-900 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{ind.icon}</span>
                <span>{ind.name.split(",")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THE 4-STEP INTERACTIVE QUESTIONNAIRE (ONLY THING ON SCREEN IN FLOW)    */}
      {/* ========================================================================= */}
      {currentStep > 0 && (
        <div className="max-w-3xl mx-auto py-2 sm:py-6 space-y-8 animate-fadeIn">
          {/* STEP HEADER & PROGRESS */}
          <div className="flex items-center justify-between border-b border-sky-200/80 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black !text-[#0a192f] tracking-tight" style={{ color: '#0a192f' }}>
                {currentStep === 1 && "What type of website are you building?"}
                {currentStep === 2 && "What is your specific industry?"}
                {currentStep === 3 && "Select the features & capabilities you need"}
                {currentStep === 4 && "Target budget & launch timeline"}
                {currentStep === 5 && "Calculated Cost & Deliverable Breakdown"}
              </h2>
              <p className="text-xs text-sky-950/80 mt-1 font-medium" style={{ color: '#0a192f' }}>
                Step {currentStep} of 4 • Project: <span className="font-bold !text-[#0a192f]" style={{ color: '#0a192f' }}>{businessName || "My Website"}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === currentStep
                      ? "w-8 bg-[#0a192f]"
                      : s < currentStep
                      ? "w-4 bg-sky-600"
                      : "w-2 bg-sky-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 1: WEBSITE TYPE                                      */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: "business",
                    title: "Business / Company Website",
                    icon: "🏢",
                    desc: "For local salons, clinics, restaurants, consulting firms, builders & services."
                  },
                  {
                    id: "ecommerce",
                    title: "E-Commerce / D2C Online Store",
                    icon: "🛍️",
                    desc: "For selling physical or digital products with cart, payments & automated invoices."
                  },
                  {
                    id: "portfolio",
                    title: "Personal Brand / Creative Studio",
                    icon: "🎨",
                    desc: "For freelancers, photographers, designers, creators, and executive portfolios."
                  },
                  {
                    id: "saas",
                    title: "Custom SaaS / Web Application",
                    icon: "⚡",
                    desc: "For digital platforms, member dashboards, user accounts, and AI workflows."
                  }
                ].map((type) => {
                  const isSelected = websiteType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setWebsiteType(type.id as any);
                        goToStep(2);
                      }}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md ring-2 ring-sky-500/15"
                          : "bg-white/70 hover:bg-white border-sky-200/80 hover:border-sky-400 shadow-xs"
                      }`}
                    >
                      <div className="text-2xl p-2.5 rounded-xl bg-sky-100/80 shrink-0 text-[#0a192f]">
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-black !text-[#0a192f] mb-1" style={{ color: '#0a192f' }}>{type.title}</h3>
                        <p className="text-xs text-sky-950/80 leading-relaxed font-medium" style={{ color: '#082f49' }}>{type.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-8 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Continue to Industry →
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 2: INDUSTRY SELECTION                                */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {INDUSTRIES.map((ind) => {
                  const isSelected = selectedIndustry.id === ind.id;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => {
                        setSelectedIndustry(ind);
                        setSelectedBundles(ind.recommendedBundles);
                        goToStep(3);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md ring-2 ring-sky-500/15"
                          : "bg-white/70 hover:bg-white border-sky-200/80 hover:border-sky-400 shadow-xs"
                      }`}
                    >
                      <div className="text-2xl mb-2">{ind.icon}</div>
                      <div>
                        <div className="text-xs font-black !text-[#0a192f]">{ind.name}</div>
                        <div className="text-[10px] text-sky-800 font-bold mt-1">
                          {ind.recommendedBundles.length} Bundles Pre-set
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-8 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Continue to Features →
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 3: FEATURE BUNDLES (CURATED 10 MODULES)               */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-950 bg-[#c8ecff]/30 border border-sky-300/80 rounded-xl p-3.5">
                <span className="font-medium" style={{ color: '#0a192f' }}>
                  💡 Select the feature modules you need for your website. We will calculate the total development investment at the end.
                </span>
                <span className="font-black !text-[#0a192f] shrink-0" style={{ color: '#0a192f' }}>
                  {selectedBundles.length} Modules Selected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {FEATURE_BUNDLES.map((bundle) => {
                  const isSelected = selectedBundles.includes(bundle.id);
                  const isEssential = bundle.isEssential;

                  return (
                    <div
                      key={bundle.id}
                      onClick={() => handleToggleBundle(bundle.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md ring-2 ring-sky-500/20"
                          : "bg-[#c8ecff]/20 hover:bg-[#c8ecff]/40 border-sky-200/80 hover:border-sky-400"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl p-1.5 rounded-lg bg-sky-100/80 shrink-0 text-[#0a192f]">
                              {bundle.icon}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black !text-[#0a192f]" style={{ color: '#0a192f' }}>{bundle.name}</h3>
                                {bundle.badge && (
                                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-950 border border-sky-200">
                                    {bundle.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-sky-900/80 mt-0.5 font-medium" style={{ color: '#0c4a6e' }}>{bundle.tagline}</p>
                            </div>
                          </div>

                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                              isSelected
                                ? "bg-[#0a192f] text-white"
                                : "border border-sky-300 bg-white/60"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </div>
                        </div>

                        {/* Deliverable Bullets */}
                        <div className="space-y-1 pt-2 border-t border-sky-200/60">
                          {bundle.includedFeatures.map((feat, i) => (
                            <div key={i} className="text-[11px] text-sky-950 flex items-center gap-1.5 font-medium">
                              <span className="text-sky-600 font-bold">✓</span>
                              <span className="!text-[#0a192f]" style={{ color: '#0a192f' }}>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-sky-200/60 flex items-center justify-between text-xs font-semibold">
                        <span className="text-sky-900 font-bold" style={{ color: '#0a192f' }}>
                          {isEssential ? "Core Foundation Architecture" : "Interactive Module"}
                        </span>
                        <span className={`text-[11px] font-bold ${isSelected ? "text-sky-800" : "text-sky-600"}`}>
                          {isSelected ? "✓ Included" : "+ Select Module"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="px-8 py-3 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Continue to Budget & Timeline →
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* QUESTION 4: BUDGET & TIMELINE                                 */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 4 && (
            <div className="space-y-8">
              {/* Budget Range */}
              <div>
                <label className="block text-xs font-black !text-[#0a192f] uppercase tracking-wider mb-3">
                  Target Budget Bracket (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    "₹15,000 – ₹25,000 (Starter)",
                    "₹25,000 – ₹50,000 (Growth)",
                    "₹50,000 – ₹1,00,000+ (Flagship)",
                    "Best Value Recommendation"
                  ].map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setBudgetTier(tier)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        budgetTier === tier
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md !text-[#0a192f] font-black ring-2 ring-sky-500/15"
                          : "bg-[#c8ecff]/20 hover:bg-[#c8ecff]/40 border-sky-200/80 !text-[#0a192f] font-medium"
                      }`}
                    >
                      <div className="text-xs">{tier}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-black !text-[#0a192f] uppercase tracking-wider mb-3">
                  Target Launch Speed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "⚡ 1–2 Weeks (Express Sprint)",
                    "🚀 3–4 Weeks (Standard Launch)",
                    "🗓️ 4–6+ Weeks (Flexible)"
                  ].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setTimeline(time)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        timeline === time
                          ? "bg-sky-50/90 border-2 border-sky-600 shadow-md !text-[#0a192f] font-black ring-2 ring-sky-500/15"
                          : "bg-[#c8ecff]/20 hover:bg-[#c8ecff]/40 border-sky-200/80 !text-[#0a192f] font-medium"
                      }`}
                    >
                      <div className="text-xs">{time}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-sky-200/80">
                <button
                  type="button"
                  onClick={() => goToStep(5)}
                  className="px-8 py-3.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  UNLOCK ESTIMATE & TIMELINE →
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 5: RESULT (LOCKED BEHIND SIGN UP / LOGIN IF GUEST)       */}
          {/* ------------------------------------------------------------- */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {!isUnlocked ? (
                /* ================= LOCKED RESULT GATE ================= */
                <div className="relative rounded-3xl bg-[#c8ecff]/30 border border-sky-300/90 p-6 sm:p-10 shadow-lg text-center overflow-hidden backdrop-blur-md">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-[#0a192f] text-2xl mb-4 border border-sky-200">
                    🔒
                  </div>

                  <h3 className="text-2xl font-black !text-[#0a192f]">
                    Unlock Your Custom Quotation & Roadmap
                  </h3>
                  <p className="text-xs text-sky-950/80 max-w-md mx-auto mt-2 mb-6 leading-relaxed font-medium">
                    Your website architecture for <span className="font-bold text-[#0a192f]">{businessName || "your project"}</span> with {selectedBundles.length} selected modules is ready. Sign in or create a free account to calculate your itemized pricing, timeline deliverables, and lock in your development sprint.
                  </p>

                  {authError && (
                    <div className="max-w-md mx-auto mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleUnlockSubmit} className="max-w-md mx-auto space-y-3.5 text-left" autoComplete="on">
                    {authMode === "signup" && (
                      <div>
                        <label htmlFor="calc_auth_name" className="block text-xs font-bold !text-[#0a192f] mb-1">Your Full Name</label>
                        <input
                          id="calc_auth_name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          value={authName}
                          onChange={(e) => {
                            setAuthName(e.target.value);
                            saveLeadProfile({ name: e.target.value });
                          }}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-white/80 border border-sky-300 rounded-xl px-3.5 py-2.5 text-sm !text-[#0a192f] focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 font-medium"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="calc_auth_email" className="block text-xs font-bold !text-[#0a192f] mb-1">Email Address</label>
                      <input
                        id="calc_auth_email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={authEmail}
                        onChange={(e) => {
                          setAuthEmail(e.target.value);
                          saveLeadProfile({ email: e.target.value });
                        }}
                        placeholder="name@company.com"
                        className="w-full bg-white/80 border border-sky-300 rounded-xl px-3.5 py-2.5 text-sm !text-[#0a192f] focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 font-medium"
                      />
                    </div>

                    <div>
                      <label htmlFor="calc_auth_password" className="block text-xs font-bold !text-[#0a192f] mb-1">Password</label>
                      <input
                        id="calc_auth_password"
                        name="password"
                        type="password"
                        autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/80 border border-sky-300 rounded-xl px-3.5 py-2.5 text-sm !text-[#0a192f] focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthSubmitting}
                      className="w-full py-3.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      {isAuthSubmitting
                        ? "Calculating & Unlocking..."
                        : authMode === "signup"
                        ? "CALCULATE & UNLOCK CUSTOM QUOTE →"
                        : "SIGN IN & UNLOCK QUOTE →"}
                    </button>
                  </form>

                  <div className="mt-4 text-xs text-sky-950/80">
                    {authMode === "signup" ? (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthMode("signin")}
                          className="text-sky-700 hover:underline font-black cursor-pointer"
                        >
                          Sign In
                        </button>
                      </>
                    ) : (
                      <>
                        New client?{" "}
                        <button
                          type="button"
                          onClick={() => setAuthMode("signup")}
                          className="text-sky-700 hover:underline font-black cursor-pointer"
                        >
                          Create Free Account
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* ================= UNLOCKED RESULT ================= */
                <div className="space-y-6">
                  {/* QUOTATION SUMMARY CARD */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#c8ecff]/35 border border-sky-300/90 backdrop-blur-md shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-950 text-xs font-bold mb-2 border border-sky-200">
                        ✓ Verified Quotation for {businessName}
                      </span>
                      <h3 className="text-2xl font-black !text-[#0a192f]">
                        Total Estimated Investment
                      </h3>
                      <p className="text-xs text-sky-950/80 mt-1 font-medium">
                        Timeline: <span className="font-bold !text-[#0a192f]">{timeline}</span> • Budget: <span className="font-bold !text-[#0a192f]">{budgetTier}</span>
                      </p>
                    </div>

                    <div className="text-center md:text-right">
                      <div className="text-4xl sm:text-5xl font-black !text-[#0a192f] tracking-tight">
                        {currency === "INR" ? `₹${calculation.finalTotalInr.toLocaleString()}` : `$${calculation.finalTotalUsd.toLocaleString()}`}
                      </div>
                      <div className="text-xs text-sky-700 font-bold mt-1">
                        Includes {calculation.discountPercent}% Bundle Discount (-₹{calculation.discountAmountInr.toLocaleString()})
                      </div>
                    </div>
                  </div>

                  {/* ITEMISED BREAKDOWN */}
                  <div className="p-6 rounded-2xl bg-[#c8ecff]/25 border border-sky-200/80 shadow-xs space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-sky-800">
                      Included Scope Modules ({calculation.bundleCount})
                    </h4>

                    <div className="divide-y divide-sky-200/50">
                      {selectedBundles.map((bundleId) => {
                        const bundle = FEATURE_BUNDLES.find((b) => b.id === bundleId);
                        if (!bundle) return null;

                        return (
                          <div
                            key={bundle.id}
                            className="py-3 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{bundle.icon}</span>
                              <div>
                                <span className="font-black !text-[#0a192f]">{bundle.name}</span>
                                <span className="text-sky-800/80 hidden sm:inline ml-2 font-medium">• {bundle.tagline}</span>
                              </div>
                            </div>
                            <span className="font-black text-sky-950 shrink-0">
                              {bundle.isEssential ? "Included" : `+₹${bundle.priceInr.toLocaleString()}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onProceedWithCustomQuote) {
                          onProceedWithCustomQuote({
                            projectName: businessName,
                            industry: selectedIndustry.name,
                            selectedBundles,
                            finalTotalInr: calculation.finalTotalInr,
                            finalTotalUsd: calculation.finalTotalUsd,
                            currency
                          });
                        }
                      }}
                      className="py-3.5 px-6 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center cursor-pointer"
                    >
                      REQUEST SPRINT / LOCK IN QUEUE →
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppQuote}
                      className="py-3.5 px-6 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>💬</span>
                      <span>DISCUSS ON WHATSAPP</span>
                    </button>
                  </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
}
