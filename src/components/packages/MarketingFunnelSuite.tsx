"use client";

import React, { useState, useMemo, useEffect } from "react";

export type BusinessModel = "ecommerce" | "single_product" | "personal_brand";

export interface MarketingFunnelSuiteProps {
  currency: "USD" | "INR";
  onCurrencyChange?: (c: "USD" | "INR") => void;
  onBookMarketingPackage: (packageDetails: {
    packageName: string;
    businessModel: string;
    selectedItems: string[];
    priceInr: number;
    priceUsd: number;
    timeline: string;
  }) => void;
}

interface FunnelItem {
  id: string;
  title: string;
  tag: string;
  stage: "TOFU" | "MOFU" | "BOFU";
  color: string;
  shortDesc: string;
  contexts: {
    ecommerce: string;
    single_product: string;
    personal_brand: string;
  };
  mockupType: string;
}

export const FUNNEL_ITEMS: FunnelItem[] = [
  // -------------------------------------------------------------
  // BOFU (Bottom of Funnel - Green)
  // -------------------------------------------------------------
  {
    id: "checkout_mockup",
    title: "Check Out Mockup",
    tag: "High Conversion",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "1-Click frictionless checkout flow eliminating cart drop-offs.",
    contexts: {
      ecommerce: "Slide-over express cart with Apple Pay, UPI, Razorpay & instant checkout.",
      single_product: "Dedicated single-SKU one-page checkout with express order bump.",
      personal_brand: "High-ticket deposit checkout or calendar application billing."
    },
    mockupType: "checkout"
  },
  {
    id: "countdown",
    title: "Countdown",
    tag: "Urgency Driver",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Real-time urgency countdown clocks driving immediate purchase action.",
    contexts: {
      ecommerce: "Flash sale countdown timer synced with limited batch drops.",
      single_product: "Launch phase timer: 'Early Bird pricing expires in 04h : 18m'.",
      personal_brand: "Cohort enrollment closing clock: 'Doors close at midnight'."
    },
    mockupType: "countdown"
  },
  {
    id: "offer_banners",
    title: "Offer first banners",
    tag: "Hook & Incentive",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Sticky, animated announcement bars showcasing irresistible upfront deals.",
    contexts: {
      ecommerce: "Top ticker: '20% OFF FIRST ORDER + Free Worldwide Shipping with code DROP20'.",
      single_product: "Sticky floating bar: 'Get the Founder Bundle + $150 in Free Gear'.",
      personal_brand: "Announcement bar: 'Complimentary 30-Min Diagnostic Session (3 spots left)'."
    },
    mockupType: "offer_banner"
  },
  {
    id: "product_images",
    title: "Product images",
    tag: "Visual Clarity",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Ultra-crisp 4K multi-angle gallery with dynamic zoom & color switcher.",
    contexts: {
      ecommerce: "Multi-variant gallery with pinch-to-zoom and colorway toggle.",
      single_product: "360-degree interactive rotatable hero product shot.",
      personal_brand: "High-res editorial portraiture & signature program asset kit."
    },
    mockupType: "product_images"
  },
  {
    id: "studio_shoots",
    title: "Studio shoots",
    tag: "Editorial Polish",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Professional studio-lit product renders and 3D exploded views.",
    contexts: {
      ecommerce: "Clean white-seamless & lifestyle contextual in-use studio photography.",
      single_product: "3D CAD exploded product breakdown highlighting internal engineering.",
      personal_brand: "Behind-the-mic studio session photography and keynote stage shots."
    },
    mockupType: "studio_shoots"
  },
  {
    id: "ugc_testimonials",
    title: "UGC testimonials",
    tag: "Peer Proof",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Authentic vertical short-form user reviews with star ratings.",
    contexts: {
      ecommerce: "Unboxing TikTok/Reel clips with 'Verified Buyer' purchase badge.",
      single_product: "Beta-tester video reviews showing real-world durability and results.",
      personal_brand: "Client video interviews breaking down 10x ROI and business growth."
    },
    mockupType: "ugc"
  },
  {
    id: "price_comparison",
    title: "Price comparision",
    tag: "Value Anchoring",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Direct value-anchoring matrix proving superior ROI against alternatives.",
    contexts: {
      ecommerce: "'Our Premium Formulation' vs 'Standard Store Brands' feature breakdown.",
      single_product: "'Single Drop All-In' vs 'Buying Individual Pieces Separately' ($450 savings).",
      personal_brand: "'Private Advisory with Founder' vs 'Hiring Full-Time Agency' (1/5th cost)."
    },
    mockupType: "price_matrix"
  },
  {
    id: "fomo_offer",
    title: "FOMO offer",
    tag: "Scarcity",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Live stock indicators & real-time verified order notification popups.",
    contexts: {
      ecommerce: "Real-time toast: 'Sarah in New York just purchased Obsidian Jacket (Only 4 left)'.",
      single_product: "Inventory progress bar: '88% of batch 1 claimed — Next batch ships in 60 days'.",
      personal_brand: "Strict cohort capacity: 'Limited to 12 executives. 9 seats already locked'."
    },
    mockupType: "fomo"
  },
  {
    id: "freebies",
    title: "Freebies",
    tag: "Lead Magnet",
    stage: "BOFU",
    color: "#22c55e",
    shortDesc: "Zero-risk lead magnets, bonus gifts, and instant digital downloads.",
    contexts: {
      ecommerce: "Free gift automatically added to cart when order exceeds $100.",
      single_product: "Bonus hard-cover guidebook + lifetime firmware upgrades included.",
      personal_brand: "Free proprietary 40-page growth blueprint PDF upon email entry."
    },
    mockupType: "freebies"
  },

  // -------------------------------------------------------------
  // MOFU (Middle of Funnel - Yellow)
  // -------------------------------------------------------------
  {
    id: "comment_response",
    title: "Comment Response",
    tag: "Community Trust",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "Highlighting public community interactions and transparent founder replies.",
    contexts: {
      ecommerce: "Social comments addressing ingredient quality or sizing questions.",
      single_product: "Reddit/Twitter AMA replies addressing technical durability.",
      personal_brand: "YouTube / LinkedIn viral comment replies explaining methodology."
    },
    mockupType: "comment_response"
  },
  {
    id: "case_studies",
    title: "Case studies",
    tag: "Evidence & ROI",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "In-depth transformation stories with concrete data points and metrics.",
    contexts: {
      ecommerce: "Customer journey: How switching products solved a long-term pain point.",
      single_product: "Engineering tear-down and stress-test data report.",
      personal_brand: "Full client breakdown: How a client scaled from $20k to $180k/mo."
    },
    mockupType: "case_studies"
  },
  {
    id: "certification_badges",
    title: "Certification Badges",
    tag: "Authority Seals",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "Recognized third-party certifications, lab audits & compliance seals.",
    contexts: {
      ecommerce: "Dermatologist Tested, Organic Certified, FDA Facility Registered seals.",
      single_product: "FCC Certified, IP68 Waterproof, Patented Engineering badges.",
      personal_brand: "Forbes Council, Ivy League Alum, ISO 9001 Certified Coach badges."
    },
    mockupType: "badges"
  },
  {
    id: "educational",
    title: "Educational",
    tag: "Nurturing",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "Interactive carousels that teach the customer the science behind your solution.",
    contexts: {
      ecommerce: "Interactive guide: 'How to pick your perfect shade/fit in 3 steps'.",
      single_product: "Diagram showing how our proprietary mechanism outlasts competitors.",
      personal_brand: "Free mini-masterclass breaking down our 4-pillar proprietary framework."
    },
    mockupType: "educational"
  },
  {
    id: "expert_explainer",
    title: "Expert explainer",
    tag: "Scientific Backing",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "Doctor, engineer, or specialist video breakdown breaking down the mechanics.",
    contexts: {
      ecommerce: "Chief Chemist video explaining zero-filler botanical formulation.",
      single_product: "Lead Architect walking through precision CNC aluminum machining.",
      personal_brand: "Founder keynote explaining macroeconomic trends and market timing."
    },
    mockupType: "expert"
  },
  {
    id: "faqs",
    title: "FAQs",
    tag: "Friction Buster",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "Comprehensive expandable accordion resolving every buyer hesitation.",
    contexts: {
      ecommerce: "Shipping times, hassle-free 30-day returns, and international duties.",
      single_product: "Battery life, warranty coverage, and backwards compatibility.",
      personal_brand: "Time commitment required, NDA confidentiality, and guarantee terms."
    },
    mockupType: "faqs"
  },
  {
    id: "how_to_podcast",
    title: "How to podcast",
    tag: "Audio Immersion",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "Embedded podcast player with key timestamps and voice insights.",
    contexts: {
      ecommerce: "Brand podcast exploring craftsmanship, sourcing, and lifestyle ethics.",
      single_product: "Founder episode on high-tech manufacturing challenges and breakthroughs.",
      personal_brand: "Top-charting podcast episodes discussing industry secrets & tactics."
    },
    mockupType: "podcast"
  },
  {
    id: "social_proof_collage",
    title: "Social proof collage",
    tag: "Social Validation",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "High-density masonry wall of tweets, DMs, customer photos and shoutouts.",
    contexts: {
      ecommerce: "Instagram tagged customer selfies and enthusiastic unboxing photos.",
      single_product: "Discord and Reddit community screenshots praising product build.",
      personal_brand: "WhatsApp praise DMs and LinkedIn recommendation screenshots."
    },
    mockupType: "collage"
  },
  {
    id: "text_heavy_statics",
    title: "Text heavy Statics",
    tag: "Brand Manifesto",
    stage: "MOFU",
    color: "#eab308",
    shortDesc: "Editorial manifesto cards with uncompromising brand philosophy.",
    contexts: {
      ecommerce: "Open letter against fast fashion and cheap disposable consumerism.",
      single_product: "Our Design Principles: Why we spent 2 years obsessing over 1 millimeter.",
      personal_brand: "The Unfiltered Truth: Why 90% of traditional advice fails today."
    },
    mockupType: "manifesto"
  },

  // -------------------------------------------------------------
  // TOFU (Top of Funnel - Red)
  // -------------------------------------------------------------
  {
    id: "before_and_after",
    title: "Befor & After",
    tag: "Visual Hook",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "High-contrast visual comparison slider proving instant transformation.",
    contexts: {
      ecommerce: "Side-by-side skin transformation or messy vs organized wardrobe.",
      single_product: "Desk setup before our all-in-one dock vs cleanly cable-free after.",
      personal_brand: "Client pipeline before working with us ($0/mo) vs after ($50k/mo)."
    },
    mockupType: "before_after"
  },
  {
    id: "behind_the_scene",
    title: "Behind the scene",
    tag: "Authenticity",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "Raw, candid workshop, factory, or office reels humanizing the brand.",
    contexts: {
      ecommerce: "Artisans hand-stitching leather or packing orders in the warehouse.",
      single_product: "Prototype testing lab failures on the way to perfection.",
      personal_brand: "Preparation room before stepping out in front of 5,000 attendees."
    },
    mockupType: "bts"
  },
  {
    id: "memes",
    title: "Memes",
    tag: "Viral Relatability",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "Culturally resonant meme marketing tapping into trending creator humor.",
    contexts: {
      ecommerce: "Funny relatable memes about package tracking addiction or laundry dread.",
      single_product: "Memes poking fun at frustrating tangled wires and fragile competitors.",
      personal_brand: "Sharp industry satire on corporate buzzwords and bad agency pitch decks."
    },
    mockupType: "meme"
  },
  {
    id: "celebrity",
    title: "Celebrity",
    tag: "Halo Effect",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "High-profile creator, athlete, or industry celebrity endorsements.",
    contexts: {
      ecommerce: "Celebrity stylist endorsement and paparazzi organic street spotting.",
      single_product: "Tier-1 tech influencer unboxing video featured on homepage.",
      personal_brand: "Fireside chat photograph with industry titans and global authors."
    },
    mockupType: "celebrity"
  },
  {
    id: "billboard",
    title: "Billboard",
    tag: "Massive Scale",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "Bold out-of-home (OOH) 3D digital billboard mockup and skyline takeover.",
    contexts: {
      ecommerce: "Times Square 3D digital anamorphic billboard launch campaign.",
      single_product: "Iconic minimalist billboard on Silicon Valley highway: 'Hardware is Back'.",
      personal_brand: "Financial District massive banner promoting the bestselling book drop."
    },
    mockupType: "billboard"
  },
  {
    id: "event_announcement",
    title: "Event annoucement",
    tag: "Hype Builder",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "Cinematic keynote drop, VIP launch party, or global live stream teaser.",
    contexts: {
      ecommerce: "Paris Fashion Week pop-up activation with limited physical invites.",
      single_product: "Live Apple-style keynote broadcast RSVP with calendar sync.",
      personal_brand: "Exclusive invite-only mastermind summit at Lake Como."
    },
    mockupType: "event"
  },
  {
    id: "founder_led",
    title: "Founder led",
    tag: "Founder Story",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "Direct-to-camera founder story explaining the 'Why' behind the company.",
    contexts: {
      ecommerce: "Founder sharing why they risked their life savings to fix a broken industry.",
      single_product: "Inventor demonstrating how this singular tool took 4 years to engineer.",
      personal_brand: "Founder manifesto on personal journey, failures, and hard-earned lessons."
    },
    mockupType: "founder"
  },
  {
    id: "phone_call_mockup",
    title: "Phone call mockup",
    tag: "Curiosity Pique",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "Interactive iPhone call or iMessage chat mockup creating instant curiosity.",
    contexts: {
      ecommerce: "Incoming Call: 'Warehouse Manager: We're almost out of stock!'",
      single_product: "iMessage thread: 'Dude, where did you get that device?! Everyone is asking'.",
      personal_brand: "WhatsApp notification: 'Client just signed $120k retainer from the advice'."
    },
    mockupType: "phone_call"
  },
  {
    id: "news_mockup",
    title: "News mockup",
    tag: "Earned Media",
    stage: "TOFU",
    color: "#ef4444",
    shortDesc: "Editorial PR press clippings from Bloomberg, TechCrunch & Forbes.",
    contexts: {
      ecommerce: "Vogue & GQ: 'The Disruptor Brand Taking Over Milan This Season'.",
      single_product: "TechCrunch: 'How This Stealth Hardware Startup Sold Out in 42 Minutes'.",
      personal_brand: "Forbes 30 Under 30 & Wall Street Journal feature interview."
    },
    mockupType: "news"
  }
];

export default function MarketingFunnelSuite({
  currency,
  onCurrencyChange,
  onBookMarketingPackage
}: MarketingFunnelSuiteProps) {
  // Business Model: E-Commerce, Singular Product Drop, Personal Brand
  const [businessModel, setBusinessModel] = useState<BusinessModel>("ecommerce");

  // Active Stage Filter: All, TOFU, MOFU, BOFU
  const [stageFilter, setStageFilter] = useState<"ALL" | "TOFU" | "MOFU" | "BOFU">("ALL");

  // Selected item for interactive inspector
  const [activeItem, setActiveItem] = useState<FunnelItem>(FUNNEL_ITEMS[0]);

  // UTM Source Generator State
  const [targetUrl, setTargetUrl] = useState("https://yourbrand.com/drop");
  const [utmSource, setUtmSource] = useState("meta_ads");
  const [utmMedium, setUtmMedium] = useState("paid_social");
  const [utmCampaign, setUtmCampaign] = useState("summer_drop_bofu");
  const [utmContent, setUtmContent] = useState("ugc_video_v1");
  const [utmTerm, setUtmTerm] = useState("high_intent_lookalike");
  const [copiedLink, setCopiedLink] = useState(false);

  // Selected items to package into the final quote
  const [selectedFunnelIds, setSelectedFunnelIds] = useState<string[]>([
    "checkout_mockup",
    "countdown",
    "offer_banners",
    "case_studies",
    "certification_badges",
    "before_and_after",
    "founder_led"
  ]);

  // Live ticking countdown for demo preview
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

  // Filter items by stage
  const displayedItems = useMemo(() => {
    if (stageFilter === "ALL") return FUNNEL_ITEMS;
    return FUNNEL_ITEMS.filter((item) => item.stage === stageFilter);
  }, [stageFilter]);

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
    setSelectedFunnelIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Book Marketing Package
  const handleTriggerBooking = () => {
    const modelLabels: Record<BusinessModel, string> = {
      ecommerce: "E-Commerce Multi-Product",
      single_product: "Singular Hero Product Drop",
      personal_brand: "Personal Brand & Authority"
    };

    const selectedTitles = FUNNEL_ITEMS
      .filter((item) => selectedFunnelIds.includes(item.id))
      .map((item) => `${item.stage}: ${item.title}`);

    onBookMarketingPackage({
      packageName: "Full-Funnel Growth & Marketing Campaign Engine",
      businessModel: modelLabels[businessModel],
      selectedItems: selectedTitles,
      priceInr: 259000,
      priceUsd: 3199,
      timeline: "2–4 Weeks"
    });
  };

  return (
    <div className="w-full space-y-12">
      {/* ------------------------------------------------------------- */}
      {/* HEADER & ARCHITECTURE BANNER                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-sky-400/30 bg-gradient-to-br from-white/90 via-[#e3f4ff]/90 to-sky-100/90 p-8 shadow-xl backdrop-blur-2xl sm:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-900">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Full-Funnel Growth Package
              </span>
              <span className="rounded-full bg-sky-200/80 px-3 py-1 text-xs font-bold text-sky-900">
                Wide-Scoped Architecture
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              Turn Cold Traffic into <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 bg-clip-text text-transparent">
                High-Converting Customers
              </span>
            </h2>

            <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
              Engineered directly around the proven 3-tier conversion pyramid: 
              <span className="font-bold text-rose-600"> TOFU Awareness</span>, 
              <span className="font-bold text-amber-600"> MOFU Consideration</span>, and 
              <span className="font-bold text-emerald-600"> BOFU Conversion</span>, paired with full-spectrum UTM multi-source tracking.
            </p>
          </div>

          {/* Pricing & Quick Action Card */}
          <div className="flex flex-col items-center sm:items-end justify-center rounded-3xl border border-sky-300/80 bg-white/90 p-6 shadow-md backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Complete Package Investment
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-950">
                {currency === "INR" ? "₹2,59,000" : "$3,199"}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {currency === "INR" ? "INR" : "USD"}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-4 text-center sm:text-right">
              Includes all 27 funnel assets, tracking dashboard & 30-day conversion warranty
            </p>
            <button
              type="button"
              onClick={handleTriggerBooking}
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 px-6 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              🚀 Book This Campaign Engine
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BUSINESS MODEL SWITCHER (Wide-Scoped Versatility)             */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-10 border-t border-sky-200/80 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Adapt For Your Business Model:
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Select Your Industry Archetype
              </h3>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full self-start sm:self-auto">
              Current: {businessModel === "ecommerce" ? "E-Commerce Store" : businessModel === "single_product" ? "Singular Hero Product Drop" : "Personal Brand & Authority"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* E-Commerce Option */}
            <button
              type="button"
              onClick={() => setBusinessModel("ecommerce")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                businessModel === "ecommerce"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/70 text-slate-800 border-sky-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">🛒</span>
              <div>
                <div className="text-sm font-bold">E-Commerce & Retail</div>
                <div className={`text-xs ${businessModel === "ecommerce" ? "text-slate-300" : "text-slate-500"}`}>
                  Multi-SKU, cart upsells, flash drops & shipping calculator
                </div>
              </div>
            </button>

            {/* Singular Hero Product Drop */}
            <button
              type="button"
              onClick={() => setBusinessModel("single_product")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                businessModel === "single_product"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/70 text-slate-800 border-sky-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">📦</span>
              <div>
                <div className="text-sm font-bold">Singular Hero Product</div>
                <div className={`text-xs ${businessModel === "single_product" ? "text-slate-300" : "text-slate-500"}`}>
                  Pre-order drop, 3D CAD breakdown & Kickstarter-style hype
                </div>
              </div>
            </button>

            {/* Personal Brand & High-Ticket Authority */}
            <button
              type="button"
              onClick={() => setBusinessModel("personal_brand")}
              className={`flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                businessModel === "personal_brand"
                  ? "bg-slate-950 text-white border-slate-900 shadow-lg scale-[1.01]"
                  : "bg-white/70 text-slate-800 border-sky-200 hover:bg-white"
              }`}
            >
              <span className="text-2xl">🎙️</span>
              <div>
                <div className="text-sm font-bold">Personal Brand & Authority</div>
                <div className={`text-xs ${businessModel === "personal_brand" ? "text-slate-300" : "text-slate-500"}`}>
                  Founders, podcasts, high-ticket applications & keynote speaking
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3-STAGE VISUAL FUNNEL BREAKDOWN (Graphic Mirror)              */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Interactive Funnel Navigator
              </span>
              <span className="rounded-full bg-slate-900 text-white px-2 py-0.5 text-[10px] font-bold">
                27 Elements
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-950">
              The 3-Funnel Pyramid: Click Any Component to Inspect
            </h3>
          </div>

          {/* Funnel Stage Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStageFilter("ALL")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                stageFilter === "ALL"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white/80 text-slate-800 border-sky-300 hover:bg-white"
              }`}
            >
              All Stages (27)
            </button>
            <button
              type="button"
              onClick={() => setStageFilter("TOFU")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                stageFilter === "TOFU"
                  ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                  : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
              }`}
            >
              🔺 TOFU (Top of Funnel - 9)
            </button>
            <button
              type="button"
              onClick={() => setStageFilter("MOFU")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                stageFilter === "MOFU"
                  ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                  : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
              }`}
            >
              ⚠️ MOFU (Middle of Funnel - 9)
            </button>
            <button
              type="button"
              onClick={() => setStageFilter("BOFU")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                stageFilter === "BOFU"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              🔻 BOFU (Bottom of Funnel - 9)
            </button>
          </div>
        </div>

        {/* 3-Column / Grid View of the 3 Funnels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TOFU Column (Red) */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-rose-200/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white font-black text-xs">
                  ▲
                </span>
                <div>
                  <h4 className="text-sm font-black text-rose-950 uppercase tracking-wide">
                    TOFU (Awareness)
                  </h4>
                  <p className="text-[11px] text-rose-700">Stop the scroll & capture viral attention</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                9 Assets
              </span>
            </div>

            <div className="space-y-2">
              {FUNNEL_ITEMS.filter((i) => i.stage === "TOFU").map((item) => {
                const isSelected = selectedFunnelIds.includes(item.id);
                const isActive = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`group flex items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer border ${
                      isActive
                        ? "bg-rose-600 text-white border-rose-700 shadow-md translate-x-1"
                        : "bg-white/80 hover:bg-rose-100/70 text-slate-800 border-rose-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isActive ? "text-white" : "text-rose-600"}`}>•</span>
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectModule(item.id);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                          isSelected
                            ? isActive ? "bg-white text-rose-600" : "bg-emerald-600 text-white"
                            : isActive ? "bg-rose-700 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                        title="Include in custom scope"
                      >
                        {isSelected ? "✓ Included" : "+ Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOFU Column (Yellow) */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white font-black text-xs">
                  ■
                </span>
                <div>
                  <h4 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                    MOFU (Consideration)
                  </h4>
                  <p className="text-[11px] text-amber-700">Educate, prove claims & build intense trust</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                9 Assets
              </span>
            </div>

            <div className="space-y-2">
              {FUNNEL_ITEMS.filter((i) => i.stage === "MOFU").map((item) => {
                const isSelected = selectedFunnelIds.includes(item.id);
                const isActive = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`group flex items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer border ${
                      isActive
                        ? "bg-amber-500 text-white border-amber-600 shadow-md translate-x-1"
                        : "bg-white/80 hover:bg-amber-100/70 text-slate-800 border-amber-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isActive ? "text-white" : "text-amber-500"}`}>•</span>
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectModule(item.id);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                          isSelected
                            ? isActive ? "bg-white text-amber-700" : "bg-emerald-600 text-white"
                            : isActive ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                        title="Include in custom scope"
                      >
                        {isSelected ? "✓ Included" : "+ Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOFU Column (Green) */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
                  ▼
                </span>
                <div>
                  <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                    BOFU (Conversion)
                  </h4>
                  <p className="text-[11px] text-emerald-700">Close orders with urgency & zero friction</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                9 Assets
              </span>
            </div>

            <div className="space-y-2">
              {FUNNEL_ITEMS.filter((i) => i.stage === "BOFU").map((item) => {
                const isSelected = selectedFunnelIds.includes(item.id);
                const isActive = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`group flex items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer border ${
                      isActive
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-md translate-x-1"
                        : "bg-white/80 hover:bg-emerald-100/70 text-slate-800 border-emerald-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isActive ? "text-white" : "text-emerald-600"}`}>•</span>
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectModule(item.id);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                          isSelected
                            ? isActive ? "bg-white text-emerald-700" : "bg-emerald-600 text-white"
                            : isActive ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                        title="Include in custom scope"
                      >
                        {isSelected ? "✓ Included" : "+ Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE COMPONENT INSPECTOR & LIVE MOCKUP PREVIEW          */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-[2.2rem] border border-sky-300/80 bg-white/95 p-6 sm:p-10 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Component Details & Strategy Context */}
          <div className="lg:w-1/2 space-y-6">
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white"
                style={{ backgroundColor: activeItem.color }}
              >
                {activeItem.stage} • {activeItem.tag}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Element #{FUNNEL_ITEMS.findIndex((i) => i.id === activeItem.id) + 1} of 27
              </span>
            </div>

            <div>
              <h3 className="text-3xl font-black text-slate-950">
                {activeItem.title}
              </h3>
              <p className="text-base text-slate-600 mt-2 font-medium">
                {activeItem.shortDesc}
              </p>
            </div>

            {/* Contextual Implementation for Selected Business Model */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-900">
                <span>🎯 Tailored Strategy for</span>
                <span className="underline">
                  {businessModel === "ecommerce" ? "E-Commerce" : businessModel === "single_product" ? "Single Product Launch" : "Personal Brand Authority"}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {activeItem.contexts[businessModel]}
              </p>
            </div>

            {/* Inclusion Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleSelectModule(activeItem.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedFunnelIds.includes(activeItem.id)
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                <span>{selectedFunnelIds.includes(activeItem.id) ? "✓ Included in Your Custom Scope" : "+ Add to Selected Funnel Package"}</span>
              </button>
              <span className="text-xs text-slate-500 font-medium">
                ({selectedFunnelIds.length} of 27 components currently selected)
              </span>
            </div>
          </div>

          {/* Right: Live Interactive Mockup Render */}
          <div className="lg:w-1/2 w-full">
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl overflow-hidden relative min-h-[340px] flex flex-col justify-center">
              <div className="absolute top-3 left-4 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">live_component_mockup.tsx</span>
              </div>

              <div className="pt-6">
                {/* 1. Checkout Mockup */}
                {activeItem.id === "checkout_mockup" && (
                  <div className="space-y-4 max-w-sm mx-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-sky-900/60 border border-sky-700/50 flex items-center justify-center text-lg">
                          💎
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Full-Funnel Growth Suite</div>
                          <div className="text-[10px] text-slate-400">1x License • Instant Access</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400">$3,199</div>
                        <div className="text-[9px] text-slate-500 line-through">$4,500</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue="LAUNCH25"
                        readOnly
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 w-full"
                      />
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap">
                        -25% Applied
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" className="bg-white text-black font-black text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                        <span>Pay</span>
                      </button>
                      <button type="button" className="bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm">
                        <span>⚡ 1-Click Buy</span>
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                      <span>🔒 256-Bit SSL Encrypted</span>
                      <span>•</span>
                      <span>30-Day Money Back</span>
                    </div>
                  </div>
                )}

                {/* 2. Countdown Mockup */}
                {activeItem.id === "countdown" && (
                  <div className="text-center space-y-4 py-4">
                    <span className="inline-block bg-rose-950 text-rose-300 border border-rose-800 text-xs font-extrabold uppercase px-3 py-1 rounded-full animate-pulse">
                      🔥 Price Increases When Timer Hits Zero
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
                    <p className="text-xs text-slate-400">Batch 01 tier locking — Only 4 spots remaining</p>
                  </div>
                )}

                {/* 3. Offer First Banners */}
                {activeItem.id === "offer_banners" && (
                  <div className="space-y-4 py-6">
                    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-white shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="animate-bounce">🎁</span>
                        <span>SUMMER DROP: Free Gift + 20% OFF with code</span>
                        <span className="bg-black/30 px-2 py-0.5 rounded font-mono">BOFU20</span>
                      </div>
                      <button type="button" className="bg-white text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-md shadow-xs">
                        Claim Now →
                      </button>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-300">⚡ 100% Guaranteed 30-Day Conversion Lift</span>
                      <span className="text-emerald-400 font-bold">Included</span>
                    </div>
                  </div>
                )}

                {/* 4. Before & After */}
                {activeItem.id === "before_and_after" && (
                  <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">❌ Before (Generic)</span>
                        <div className="text-slate-300 text-xs font-medium">Standard template, 0.8% conversion rate, no source attribution, cold dropoffs.</div>
                      </div>
                      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">✓ After (Our Funnel)</span>
                        <div className="text-slate-200 text-xs font-medium">3.8% conversion rate, 1-click checkout, UTM multichannel telemetry, instant WhatsApp pings.</div>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="w-[20%] bg-rose-500" />
                      <div className="w-[80%] bg-emerald-500" />
                    </div>
                    <div className="text-[10px] text-center text-slate-400 font-mono">+375% Average Conversion Lift</div>
                  </div>
                )}

                {/* 5. Phone Call / Chat Mockup */}
                {activeItem.id === "phone_call_mockup" && (
                  <div className="max-w-xs mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[10px] text-slate-400">WhatsApp Business</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Now</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none text-xs">
                        &quot;Hey Tanie, our ad just went live with the new BOFU checkout page!&quot;
                      </div>
                      <div className="bg-emerald-900 text-emerald-100 p-2.5 rounded-xl rounded-tr-none text-xs ml-auto max-w-[90%]">
                        &quot;Already got 14 orders in the first 20 minutes! That countdown timer is working crazy well 🚀&quot;
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Case Studies Mockup */}
                {activeItem.id === "case_studies" && (
                  <div className="space-y-3 max-w-sm mx-auto">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                      <span className="text-slate-400 font-bold">Case Study: Brand Transformation</span>
                      <span className="text-emerald-400 font-mono font-bold">+412% Revenue</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-lg font-black text-white">3.4x</div>
                        <div className="text-[9px] text-slate-400">ROAS Lift</div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-lg font-black text-emerald-400">64%</div>
                        <div className="text-[9px] text-slate-400">Cart Drop Reduction</div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-lg font-black text-sky-400">&lt;1.2s</div>
                        <div className="text-[9px] text-slate-400">Load Speed</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Certification Badges */}
                {activeItem.id === "certification_badges" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center py-4">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <div className="text-xl mb-1">🛡️</div>
                      <div className="text-[10px] font-bold text-white">SSL 256-Bit</div>
                      <div className="text-[8px] text-slate-400">Verified Secure</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <div className="text-xl mb-1">⚡</div>
                      <div className="text-[10px] font-bold text-white">Stripe Verified</div>
                      <div className="text-[8px] text-slate-400">1-Click Fast Pay</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <div className="text-xl mb-1">✨</div>
                      <div className="text-[10px] font-bold text-white">30-Day Guarantee</div>
                      <div className="text-[8px] text-slate-400">Zero Risk Refund</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <div className="text-xl mb-1">🎖️</div>
                      <div className="text-[10px] font-bold text-white">Google Partner</div>
                      <div className="text-[8px] text-slate-400">Certified Setup</div>
                    </div>
                  </div>
                )}

                {/* 8. Fallback / Generic Interactive Mockup for other items */}
                {![
                  "checkout_mockup",
                  "countdown",
                  "offer_banners",
                  "before_and_after",
                  "phone_call_mockup",
                  "case_studies",
                  "certification_badges"
                ].includes(activeItem.id) && (
                  <div className="text-center py-6 space-y-3">
                    <div className="h-12 w-12 rounded-2xl mx-auto flex items-center justify-center text-2xl border" style={{ backgroundColor: `${activeItem.color}20`, borderColor: activeItem.color }}>
                      🚀
                    </div>
                    <h4 className="text-lg font-bold text-white">{activeItem.title}</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Engineered component with high-contrast copy, mobile responsive viewports, and custom Framer Motion micro-interactions.
                    </p>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[10px] font-mono text-slate-300">
                      <span>Interactive {activeItem.stage} Production Module</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SOURCES MANAGEMENT & UTM ATTRIBUTION ENGINE                   */}
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
              Multi-Channel UTM Campaign & Source Generator
            </h3>
            <p className="text-sm font-medium text-slate-600 mt-1 max-w-2xl">
              Track exactly where every dollar, inquiry, and booking comes from. Every page we build includes built-in first-touch and last-touch attribution capture.
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
              Destination Landing Page URL
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
              Traffic Source (Platform)
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
              Ad Creative Hook (utm_content)
            </label>
            <input
              type="text"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
              placeholder="before_after_slider_v1"
              className="w-full rounded-xl border border-sky-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none shadow-xs"
            />
          </div>

          {/* Keyword / Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audience / Term (utm_term)
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
              Automatic lead recording on /admin & /client
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FINAL PACKAGE SUMMARY & DIRECT BOOKING ACTION                 */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-[2.2rem] border border-emerald-400/40 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 p-8 sm:p-12 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 border border-emerald-700/60 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <span>💎 Ready for Launch</span>
              <span>•</span>
              <span>{selectedFunnelIds.length} Modules Included</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Launch Your Full-Funnel Marketing Engine
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We design, code, and deploy the complete marketing machine: from high-converting TOFU hook pages to frictionless BOFU 1-click checkouts, integrated with multi-source UTM attribution and analytics.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 font-medium">Included Standard:</span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                Figma Design Kit
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                Production Code (Next.js)
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                Pixel & UTM Telemetry
              </span>
              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                30-Day Conversion Support
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
              Package Investment
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white my-1">
              {currency === "INR" ? "₹2,59,000" : "$3,199"}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mb-5">
              Turnaround: 2–4 Weeks • 50% Milestone Deposit
            </div>

            <button
              type="button"
              onClick={handleTriggerBooking}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              🚀 Book Campaign Engine Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
