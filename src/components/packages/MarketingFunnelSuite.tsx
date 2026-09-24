"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useGeoPricing } from "@/context/GeoPricingContext";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

export type WebsiteMarketingScope = "ecommerce" | "single_product" | "personal_brand";

export interface MarketingFunnelSuiteProps {
  currency?: "USD" | "INR";
  onCurrencyChange?: (c: "USD" | "INR") => void;
  onBookMarketingPackage: (packageDetails: {
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
  }) => void;
}

export interface BofuPageModule {
  id: string;
  title: string;
  badge: string;
  icon: string;
  shortDesc: string;
  websiteScope: {
    ecommerce: string;
    single_product: string;
    personal_brand: string;
  };
  conversionMetric: string;
}

export const BOFU_PAGE_MODULES: BofuPageModule[] = [
  {
    id: "checkout_flow",
    title: "Check Out Mockup & Flow",
    badge: "Revenue Engine",
    icon: "💳",
    shortDesc: "Frictionless 1-page checkout flow with express mobile wallets and zero distraction.",
    websiteScope: {
      ecommerce: "Slide-over cart with 1-click Apple Pay, Google Pay, Razorpay, UPI & credit card support.",
      single_product: "One-page high-converting checkout landing page with 1-click order bump upsell.",
      personal_brand: "Secure consultation deposit checkout, contract billing, or stripe subscription invoice."
    },
    conversionMetric: "Cuts cart abandonment by up to 35%"
  },
  {
    id: "countdown_timers",
    title: "Countdown Urgency Clocks",
    badge: "Urgency Driver",
    icon: "⏳",
    shortDesc: "Real-time urgency countdown tickers on landing pages driving immediate purchase commitment.",
    websiteScope: {
      ecommerce: "Flash sale countdown timer embedded on collection headers and product pages.",
      single_product: "Launch phase timer: 'Early Bird batch pricing locks in 04h : 18m'.",
      personal_brand: "Enrollment closing timer: 'Doors close Sunday at midnight — 3 spots remain'."
    },
    conversionMetric: "Boosts immediate checkout rate by 28%"
  },
  {
    id: "offer_first_banners",
    title: "Offer First Banners",
    badge: "Attention Hook",
    icon: "🏷️",
    shortDesc: "Sticky, dismissible announcement bars spotlighting coupons, free shipping, and bundles.",
    websiteScope: {
      ecommerce: "Top announcement ticker: '20% OFF FIRST ORDER + Free Express Shipping with code DROP20'.",
      single_product: "Sticky floating bar: 'Get the Founder Launch Kit + $120 in Free Bonus Accessories'.",
      personal_brand: "Top bar: 'Complimentary 30-Min Diagnostic Audit (Only 4 available this week)'."
    },
    conversionMetric: "Increases coupon redemption and average order value"
  },
  {
    id: "product_images_gallery",
    title: "Product Images & 4K Viewer",
    badge: "Visual Anchor",
    icon: "🔍",
    shortDesc: "High-resolution multi-angle image gallery with responsive pinch-to-zoom and variant switchers.",
    websiteScope: {
      ecommerce: "Multi-variant photo grid with real-time colorway switcher and zoom loupe.",
      single_product: "360-degree interactive rotatable hero product visual on the landing page.",
      personal_brand: "Editorial high-res portraits, program curriculum previews, and digital book mockups."
    },
    conversionMetric: "Reduces buyer hesitation and return rates"
  },
  {
    id: "studio_shoots_presentation",
    title: "Studio Shoots Presentation",
    badge: "Editorial Polish",
    icon: "📸",
    shortDesc: "Web-optimized presentation layouts for studio photography, 3D CAD renders, and exploded views.",
    websiteScope: {
      ecommerce: "Seamless white-studio product photography and contextual lifestyle showcase blocks.",
      single_product: "Interactive 3D exploded view section highlighting internal engineering and materials.",
      personal_brand: "Behind-the-mic studio photo grids, keynote stage shots, and executive press kits."
    },
    conversionMetric: "Elevates perceived brand value & supports luxury pricing"
  },
  {
    id: "ugc_testimonials_wall",
    title: "UGC Testimonials & Video Wall",
    badge: "Social Validation",
    icon: "⭐",
    shortDesc: "On-site video review carousel and verified buyer testimonial wall with rich star snippet schema.",
    websiteScope: {
      ecommerce: "Vertical TikTok/Reel style customer video review carousel with 'Verified Buyer' tags.",
      single_product: "Customer unboxing video reel and beta-tester feedback cards embedded on-page.",
      personal_brand: "Video interview endorsements from high-profile clients breaking down concrete ROI."
    },
    conversionMetric: "Increases cold traffic trust by 84%"
  },
  {
    id: "price_comparison_matrix",
    title: "Price Comparison Matrix",
    badge: "Value Anchoring",
    icon: "📊",
    shortDesc: "Interactive feature-by-feature comparison table proving overwhelming value against alternatives.",
    websiteScope: {
      ecommerce: "'Our Premium Formula' vs 'Standard Drugstore Brands' feature & ingredient breakdown.",
      single_product: "'Founder Drop All-In' vs 'Buying Individual Parts Separately' ($340 savings breakdown).",
      personal_brand: "'Private Advisory' vs 'Hiring an Expensive In-House Director' (Save 70% + faster results)."
    },
    conversionMetric: "Anchors premium pricing and speeds up purchase decision"
  },
  {
    id: "fomo_scarcity_notifiers",
    title: "FOMO Offer Mechanics",
    badge: "Scarcity Engine",
    icon: "🔥",
    shortDesc: "Non-intrusive live order popup toasts and dynamic remaining inventory stock meters.",
    websiteScope: {
      ecommerce: "Live toast: 'Alex from Austin just purchased Slate Jacket (Only 3 left in Size M)'.",
      single_product: "Inventory scarcity progress bar: '88% of First Production Batch Claimed'.",
      personal_brand: "Strict capacity indicator: 'Limited to 10 executives per quarter — 8 spots locked'."
    },
    conversionMetric: "Creates urgent fear of missing out without deceptive dark patterns"
  },
  {
    id: "freebie_lead_magnets",
    title: "Freebies & Lead Magnets",
    badge: "Lead Capture",
    icon: "🎁",
    shortDesc: "On-site email & WhatsApp opt-in capture forms delivering instant free bonuses or trial perks.",
    websiteScope: {
      ecommerce: "Free gift automatically added to cart when order reaches threshold (e.g. $75+).",
      single_product: "Free digital companion handbook + firmware lifetime access with pre-order.",
      personal_brand: "Free proprietary 35-page growth playbook PDF sent automatically upon email entry."
    },
    conversionMetric: "Captures 15–25% of visitors who aren't ready to buy today"
  }
];

export default function MarketingFunnelSuite({
  currency,
  onCurrencyChange,
  onBookMarketingPackage
}: MarketingFunnelSuiteProps) {
  const { tierConfig, formatPackagePrice } = useGeoPricing();
  const bofuPrice = formatPackagePrice("growth-marketing-campaigns");

  // Website Scope Mode
  const [websiteScope, setWebsiteScope] = useState<WebsiteMarketingScope>("ecommerce");

  // Selected BOFU module for live preview
  const [activeModule, setActiveModule] = useState<BofuPageModule>(BOFU_PAGE_MODULES[0]);

  // Selected Modules checklist
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    "checkout_flow",
    "countdown_timers",
    "offer_first_banners",
    "ugc_testimonials_wall",
    "price_comparison_matrix",
    "fomo_scarcity_notifiers",
    "freebie_lead_magnets"
  ]);

  // UTM Source Generator State (On-Site Sources Management)
  const [targetUrl, setTargetUrl] = useState("https://yourbrand.com/drop");
  const [utmSource, setUtmSource] = useState("meta_ads");
  const [utmMedium, setUtmMedium] = useState("paid_social");
  const [utmCampaign, setUtmCampaign] = useState("summer_drop_bofu");
  const [utmContent, setUtmContent] = useState("before_after_hook_v1");
  const [utmTerm, setUtmTerm] = useState("high_intent_buyers");
  const [copiedLink, setCopiedLink] = useState(false);

  // Live countdown timer for interactive preview
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 42 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Computed Full UTM Link
  const fullUtmUrl = useMemo(() => {
    try {
      const base = targetUrl.trim() || "https://yourbrand.com";
      const url = new URL(base.startsWith("http") ? base : `https://${base}`);
      url.searchParams.set("utm_source", utmSource);
      url.searchParams.set("utm_medium", utmMedium);
      url.searchParams.set("utm_campaign", utmCampaign);
      if (utmContent) url.searchParams.set("utm_content", utmContent);
      if (utmTerm) url.searchParams.set("utm_term", utmTerm);
      return url.toString();
    } catch {
      return `${targetUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    }
  }, [targetUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm]);

  // Copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUtmUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Toggle module selection
  const toggleSelectModule = (id: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Trigger Booking with clean details
  const handleTriggerBooking = () => {
    const scopeLabels: Record<WebsiteMarketingScope, string> = {
      ecommerce: "E-Commerce Website & Checkout",
      single_product: "Singular Hero Product Drop Page",
      personal_brand: "Personal Brand & Authority Website"
    };

    const selectedTitles = BOFU_PAGE_MODULES
      .filter((item) => selectedModuleIds.includes(item.id))
      .map((item) => item.title);

    onBookMarketingPackage({
      packageName: "BOFU Website Marketing & Sources Management Package",
      businessModel: scopeLabels[websiteScope],
      selectedItems: [
        ...selectedTitles,
        "Multi-Channel UTM Attribution Engine",
        "Meta Pixel / CAPI & GA4 Telemetry"
      ],
      priceAmount: bofuPrice.amount,
      currencyCode: bofuPrice.currency,
      currencySymbol: bofuPrice.symbol,
      formattedPrice: `${bofuPrice.symbol}${bofuPrice.formatted}`,
      priceInr: tierConfig.currencyCode === "INR" ? bofuPrice.amount : undefined,
      priceUsd: tierConfig.currencyCode === "USD" ? bofuPrice.amount : undefined,
      timeline: "2–3 Weeks"
    });
  };

  return (
    <div className="w-full space-y-10">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO & POSITIONING (WEBSITE BOFU ENGINE)                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-400/40 bg-gradient-to-br from-white/95 via-emerald-50/70 to-sky-50/90 p-8 sm:p-12 shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-900">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Website-Only Marketing Package
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                All 9 BOFU Pages & Modules
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              The Website BOFU Engine: <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 bg-clip-text text-transparent">
                Where Cold Clicks Turn Into Cash
              </span>
            </h2>

            <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
              External ads and social media get you the traffic — but <strong>your website is the Bottom of Funnel (BOFU) terminal</strong> where decisions are made. 
              We build high-converting checkout flows, countdowns, offer banners, and on-site source tracking so every visitor converts.
            </p>
          </div>

          {/* Pricing & Booking Card */}
          <div className="flex flex-col items-center sm:items-end justify-center rounded-3xl border border-emerald-300/80 bg-white/90 p-6 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between w-full mb-2 gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                BOFU Website Package
              </span>
              <MarketRegionSelector compact />
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-950">
                {bofuPrice.symbol}{bofuPrice.formatted}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {bofuPrice.currency}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full mb-3 flex items-center gap-1.5">
              <span>{tierConfig.flag}</span>
              <span>{tierConfig.countryName} Local Market Rate</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 text-center sm:text-right">
              All 9 BOFU modules + multi-channel UTM source tracker & pixel telemetry
            </p>
            <button
              type="button"
              onClick={handleTriggerBooking}
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 px-6 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              🚀 Book BOFU Website Engine
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. THREE WEBSITE TYPES (WIDE SCOPE)                           */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-10 border-t border-emerald-200/80 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Adaptable For Any Business Type:
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Select Your Website Focus
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
              Current: {websiteScope === "ecommerce" ? "E-Commerce Store Website" : websiteScope === "single_product" ? "Singular Hero Product Launch Page" : "Personal Brand & Authority Website"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* E-Commerce Website */}
            <button
              type="button"
              onClick={() => setWebsiteScope("ecommerce")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                websiteScope === "ecommerce"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/80 text-slate-800 border-emerald-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">🛒</span>
              <div>
                <div className="text-sm font-bold">E-Commerce Website</div>
                <div className={`text-xs ${websiteScope === "ecommerce" ? "text-slate-300" : "text-slate-500"}`}>
                  Multi-product catalog, slide-over cart, checkout upsells & order tracking
                </div>
              </div>
            </button>

            {/* Singular Hero Product Drop Page */}
            <button
              type="button"
              onClick={() => setWebsiteScope("single_product")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                websiteScope === "single_product"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/80 text-slate-800 border-emerald-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">📦</span>
              <div>
                <div className="text-sm font-bold">Singular Hero Product</div>
                <div className={`text-xs ${websiteScope === "single_product" ? "text-slate-300" : "text-slate-500"}`}>
                  Dedicated pre-order landing page, 360 viewer & 1-page checkout
                </div>
              </div>
            </button>

            {/* Personal Brand & High-Ticket Authority Site */}
            <button
              type="button"
              onClick={() => setWebsiteScope("personal_brand")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                websiteScope === "personal_brand"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/80 text-slate-800 border-emerald-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">🎙️</span>
              <div>
                <div className="text-sm font-bold">Personal Brand Site</div>
                <div className={`text-xs ${websiteScope === "personal_brand" ? "text-slate-300" : "text-slate-500"}`}>
                  High-ticket client application, VIP booking calendar & lead magnet funnels
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. THE 9 BOFU WEBSITE PAGES & MODULES GRID                    */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                On-Site Conversion Components
              </span>
              <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold">
                All 9 BOFU Deliverables
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-950">
              The 9 On-Website BOFU Pages & Modules
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>{selectedModuleIds.length} of 9 modules selected for your build</span>
          </div>
        </div>

        {/* 9 BOFU Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOFU_PAGE_MODULES.map((mod) => {
            const isSelected = selectedModuleIds.includes(mod.id);
            const isActive = activeModule.id === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => setActiveModule(mod)}
                className={`flex flex-col justify-between rounded-2xl p-5 border transition-all cursor-pointer shadow-sm ${
                  isActive
                    ? "bg-slate-950 text-white border-slate-900 shadow-lg ring-2 ring-emerald-500 scale-[1.01]"
                    : isSelected
                    ? "bg-white text-slate-900 border-emerald-300 hover:bg-emerald-50/50"
                    : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{mod.icon}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-emerald-500 text-black font-black"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold mb-1">{mod.title}</h4>
                  <p className={`text-xs leading-relaxed mb-3 ${isActive ? "text-slate-300" : "text-slate-600"}`}>
                    {mod.shortDesc}
                  </p>

                  <div className={`text-[11px] p-2.5 rounded-xl border mb-4 ${
                    isActive ? "bg-slate-900 border-slate-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-950 font-medium"
                  }`}>
                    <strong>Website Role:</strong> {mod.websiteScope[websiteScope]}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <span className={`text-[10px] font-mono ${isActive ? "text-slate-400" : "text-slate-500"}`}>
                    {mod.conversionMetric}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectModule(mod.id);
                    }}
                    className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {isSelected ? "✓ Included" : "+ Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. LIVE INTERACTIVE COMPONENT PREVIEW INSPECTOR               */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-[2.2rem] border border-sky-300/80 bg-white/95 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Details & Specs */}
          <div className="lg:w-1/2 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeModule.icon}</span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                  BOFU Website Feature
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  {activeModule.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {activeModule.shortDesc}
            </p>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 space-y-1.5">
              <div className="text-xs font-black uppercase text-sky-900">
                🎯 Contextual Setup for: {websiteScope === "ecommerce" ? "E-Commerce Store" : websiteScope === "single_product" ? "Single Product Drop" : "Personal Brand Authority"}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                {activeModule.websiteScope[websiteScope]}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => toggleSelectModule(activeModule.id)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                  selectedModuleIds.includes(activeModule.id)
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {selectedModuleIds.includes(activeModule.id) ? "✓ Included in Your Website Scope" : "+ Add to Selected Modules"}
              </button>
              <span className="text-xs text-slate-500 font-medium">
                {activeModule.conversionMetric}
              </span>
            </div>
          </div>

          {/* Interactive Live Component Simulation */}
          <div className="lg:w-1/2 w-full">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-2xl relative min-h-[340px] flex flex-col justify-center">
              <div className="absolute top-3 left-4 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">bofu_website_module.tsx</span>
              </div>

              <div className="pt-6">
                {/* 1. Checkout Flow Simulation */}
                {activeModule.id === "checkout_flow" && (
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-lg">
                          🛍️
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Express Checkout Cart</div>
                          <div className="text-[10px] text-slate-400">1-Page Frictionless Pay</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400">$2,899</div>
                        <div className="text-[9px] text-slate-500 line-through">$3,800</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue="BOFU20"
                        readOnly
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-full"
                      />
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap">
                        -20% Code Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" className="bg-white text-black font-black text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                        <span>Pay / GPay</span>
                      </button>
                      <button type="button" className="bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                        <span>⚡ 1-Click Buy</span>
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                      <span>🔒 256-Bit SSL Encrypted</span>
                      <span>•</span>
                      <span>Razorpay & Stripe Enabled</span>
                    </div>
                  </div>
                )}

                {/* 2. Countdown Timers Simulation */}
                {activeModule.id === "countdown_timers" && (
                  <div className="text-center space-y-4 py-4">
                    <span className="inline-block bg-rose-950 text-rose-300 border border-rose-800 text-xs font-extrabold uppercase px-3 py-1 rounded-full animate-pulse">
                      🔥 Drop Pricing Locks When Timer Reaches Zero
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 min-w-[64px]">
                        <div className="text-2xl sm:text-3xl font-black text-white font-mono">0{timeLeft.hours}</div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Hours</div>
                      </div>
                      <span className="text-2xl font-bold text-slate-600">:</span>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 min-w-[64px]">
                        <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Minutes</div>
                      </div>
                      <span className="text-2xl font-bold text-slate-600">:</span>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 min-w-[64px]">
                        <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Seconds</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Batch 01 tier locking — Only 4 units remaining in stock</p>
                  </div>
                )}

                {/* 3. Offer First Banners Simulation */}
                {activeModule.id === "offer_first_banners" && (
                  <div className="space-y-4 py-6">
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 p-3.5 rounded-xl flex items-center justify-between text-xs font-bold text-white shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="animate-bounce">🎁</span>
                        <span>EXCLUSIVE DROP: 20% OFF First Order with code</span>
                        <span className="bg-black/30 px-2 py-0.5 rounded font-mono">BOFU20</span>
                      </div>
                      <button type="button" className="bg-white text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-md shadow-xs">
                        Claim Deal →
                      </button>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-300">📦 Free Worldwide Shipping on orders over $100</span>
                      <span className="text-emerald-400 font-bold">Auto-Applied</span>
                    </div>
                  </div>
                )}

                {/* 4. Product Images Gallery Simulation */}
                {activeModule.id === "product_images_gallery" && (
                  <div className="space-y-3 max-w-sm mx-auto">
                    <div className="h-40 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                      <span className="text-4xl mb-1">📸</span>
                      <span className="text-xs font-bold text-white">Interactive 360° Zoom Viewer</span>
                      <span className="text-[10px] text-slate-400">Hover / Drag to inspect craftsmanship</span>
                      <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400">
                        4K Ultra-Sharp
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-10 rounded-lg bg-emerald-950 border border-emerald-500 flex items-center justify-center text-xs">Angle 1</div>
                      <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">Angle 2</div>
                      <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">Macro</div>
                      <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">In-Use</div>
                    </div>
                  </div>
                )}

                {/* 5. Studio Shoots Presentation Simulation */}
                {activeModule.id === "studio_shoots_presentation" && (
                  <div className="space-y-3 py-4 text-center">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <div className="text-lg mb-1">📐</div>
                        <div className="font-bold text-white">Exploded CAD View</div>
                        <div className="text-[9px] text-slate-400">Highlights internal alloy & precision parts</div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                        <div className="text-lg mb-1">💡</div>
                        <div className="font-bold text-white">Studio Seamless Lighting</div>
                        <div className="text-[9px] text-slate-400">Crisp shadows & true-to-life colors</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">Web-optimized WebP & AVIF format (98+ PageSpeed)</div>
                  </div>
                )}

                {/* 6. UGC Wall Simulation */}
                {activeModule.id === "ugc_testimonials_wall" && (
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                      <div className="flex items-center text-amber-400 text-xs">★★★★★</div>
                      <div className="text-xs font-bold text-white">&quot;Arrived in 2 days, 10x better than photos!&quot;</div>
                      <div className="text-[10px] text-emerald-400">✓ Verified Buyer • Sarah M.</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                      <div className="flex items-center text-amber-400 text-xs">★★★★★</div>
                      <div className="text-xs font-bold text-white">&quot;The checkout was so fast with Apple Pay.&quot;</div>
                      <div className="text-[10px] text-emerald-400">✓ Verified Buyer • Daniel K.</div>
                    </div>
                  </div>
                )}

                {/* 7. Price Comparison Matrix Simulation */}
                {activeModule.id === "price_comparison_matrix" && (
                  <div className="space-y-2 py-2 max-w-sm mx-auto">
                    <div className="text-center text-xs font-bold text-slate-300 mb-1">Value Comparison Table</div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      <div className="p-2 bg-slate-900 rounded-lg text-slate-400 text-[10px]">Feature</div>
                      <div className="p-2 bg-emerald-950 border border-emerald-600 rounded-lg text-emerald-300 font-bold text-[10px]">Our Engine</div>
                      <div className="p-2 bg-slate-900 rounded-lg text-slate-400 text-[10px]">Generic Store</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      <div className="p-2 bg-slate-900/60 rounded-lg text-slate-400 text-[10px]">1-Click Checkout</div>
                      <div className="p-2 bg-emerald-950/60 rounded-lg text-emerald-400 font-bold text-[10px]">✓ Included</div>
                      <div className="p-2 bg-slate-900/60 rounded-lg text-rose-400 text-[10px]">✗ Multi-step</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      <div className="p-2 bg-slate-900/60 rounded-lg text-slate-400 text-[10px]">UTM Attribution</div>
                      <div className="p-2 bg-emerald-950/60 rounded-lg text-emerald-400 font-bold text-[10px]">✓ Built-in</div>
                      <div className="p-2 bg-slate-900/60 rounded-lg text-rose-400 text-[10px]">✗ Blind spend</div>
                    </div>
                  </div>
                )}

                {/* 8. FOMO Scarcity Notifiers Simulation */}
                {activeModule.id === "fomo_scarcity_notifiers" && (
                  <div className="space-y-4 py-4 max-w-sm mx-auto">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-lg">
                      <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                        🛒
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">Just Ordered!</div>
                        <div className="text-[10px] text-slate-400">Marcus in San Francisco purchased 2 units (Only 3 left)</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Stock Remaining:</span>
                        <span className="text-rose-400 font-bold">Only 12% Left</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 w-[88%]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Freebie Lead Magnets Simulation */}
                {activeModule.id === "freebie_lead_magnets" && (
                  <div className="space-y-3 py-4 max-w-sm mx-auto text-center">
                    <span className="text-2xl">🎁</span>
                    <h4 className="text-sm font-bold text-white">Claim Your Free Resource / Gift</h4>
                    <p className="text-[10px] text-slate-400">Instant PDF Blueprint delivered to your email within 10 seconds.</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="founder@yourbrand.com"
                        readOnly
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 w-full"
                      />
                      <button type="button" className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                        Download Free →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. SOURCES MANAGEMENT & UTM ATTRIBUTION ENGINE                */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-[2.5rem] border border-sky-400/40 bg-gradient-to-br from-white via-sky-50 to-[#dff4ff] p-8 sm:p-12 shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-sky-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-200 text-sky-950 font-black text-[10px] uppercase px-3 py-1">
                Full-Spectrum Telemetry
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase px-3 py-1 border border-emerald-300">
                Sources Management Included
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">
              Website Multi-Channel Sources Management & Tracking
            </h3>
            <p className="text-sm font-medium text-slate-600 mt-1 max-w-2xl">
              Track exactly where every dollar, order, and lead comes from. Every page we build automatically grabs UTM parameters on arrival and attaches them to the checkout receipt and lead profile in your admin dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Attribution Ready:</span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
              Meta CAPI • GA4 • GTM • TikTok
            </span>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {/* Target URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Target Website Landing Page
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://yourbrand.com/drop"
              className="w-full rounded-xl border border-sky-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none shadow-xs"
            />
          </div>

          {/* Traffic Source Channel */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Source Channel (utm_source)
            </label>
            <select
              value={utmSource}
              onChange={(e) => {
                setUtmSource(e.target.value);
                if (e.target.value === "google_ads") setUtmMedium("cpc");
                if (e.target.value === "email_newsletter") setUtmMedium("email");
                if (e.target.value === "meta_ads" || e.target.value === "tiktok_ads") setUtmMedium("paid_social");
              }}
              className="w-full rounded-xl border border-sky-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none shadow-xs"
            >
              <option value="meta_ads">🔵 Meta Ads (Instagram & Facebook)</option>
              <option value="google_ads">🔴 Google Ads (Search & PMax)</option>
              <option value="tiktok_ads">🎵 TikTok Ads</option>
              <option value="youtube_ad">📺 YouTube (Video Ad / Description)</option>
              <option value="email_newsletter">✉️ Email Newsletter (Klaviyo/Resend)</option>
              <option value="influencer_partner">🤝 Influencer / Creator Affiliate</option>
              <option value="twitter_x">𝕏 X / Twitter Paid & Organic</option>
              <option value="organic_referral">🌐 Organic Referral / PR Press</option>
            </select>
          </div>

          {/* Marketing Medium */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Medium (utm_medium)
            </label>
            <input
              type="text"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              placeholder="paid_social, cpc, email"
              className="w-full rounded-xl border border-sky-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none shadow-xs"
            />
          </div>

          {/* Campaign Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Campaign Name (utm_campaign)
            </label>
            <input
              type="text"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              placeholder="summer_drop_bofu"
              className="w-full rounded-xl border border-sky-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none shadow-xs"
            />
          </div>

          {/* Ad Creative / Content Hook */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ad Variant / Creative Hook (utm_content)
            </label>
            <input
              type="text"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
              placeholder="before_after_hook_v1"
              className="w-full rounded-xl border border-sky-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none shadow-xs"
            />
          </div>

          {/* Keyword / Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Target Audience / Keyword (utm_term)
            </label>
            <input
              type="text"
              value={utmTerm}
              onChange={(e) => setUtmTerm(e.target.value)}
              placeholder="high_intent_buyers"
              className="w-full rounded-xl border border-sky-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Live Generated Link Output Box */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Generated Attribution Tracking URL:
                </span>
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-200 break-all bg-slate-900 p-3 rounded-xl border border-slate-800">
                {fullUtmUrl}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`shrink-0 rounded-xl px-5 py-3 text-xs font-black transition-all cursor-pointer shadow-md ${
                copiedLink
                  ? "bg-emerald-500 text-white scale-105"
                  : "bg-gradient-to-r from-sky-500 to-emerald-500 text-white hover:opacity-95"
              }`}
            >
              {copiedLink ? "✓ Link Copied!" : "📋 Copy UTM Link"}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span>Source: <strong className="text-white">{utmSource}</strong></span>
              <span>•</span>
              <span>Medium: <strong className="text-white">{utmMedium}</strong></span>
              <span>•</span>
              <span>Campaign: <strong className="text-white">{utmCampaign}</strong></span>
            </div>
            <div className="text-emerald-400 font-bold">
              Automatic lead attribution recording on /admin & /client
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. FINAL SUMMARY & DIRECT BOOKING ACTION                      */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-[2.2rem] border border-emerald-400/40 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 p-8 sm:p-12 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 border border-emerald-700/60 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <span>💎 Ready for Launch</span>
              <span>•</span>
              <span>{selectedModuleIds.length} BOFU Modules Selected</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Launch Your High-Converting BOFU Website Engine
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We design, code, and deploy the entire Bottom-of-Funnel architecture directly on your website: 1-click checkouts, urgency countdowns, offer banners, 4K galleries, price comparisons, and multi-source UTM attribution.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 font-medium">Included Standard:</span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                All 9 BOFU Pages & Modules
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                1-Click Express Checkout
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                UTM & Sources Tracking
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                Meta CAPI & GA4 Telemetry
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
              Package Investment ({tierConfig.countryName})
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white my-1">
              {bofuPrice.symbol}{bofuPrice.formatted}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mb-5">
              {bofuPrice.currency} • Turnaround: 2–3 Weeks • 50% Milestone Deposit
            </div>

            <button
              type="button"
              onClick={handleTriggerBooking}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              🚀 Book BOFU Website Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
