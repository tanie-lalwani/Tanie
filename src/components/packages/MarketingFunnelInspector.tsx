"use client";

import React, { useState, useEffect } from "react";
import type { BofuPageModule, WebsiteMarketingScope } from "./marketingFunnelData";

interface MarketingFunnelInspectorProps {
  activeModule: BofuPageModule;
  websiteScope: WebsiteMarketingScope;
  selectedModuleIds: string[];
  onToggleSelectModule: (id: string) => void;
}

export default function MarketingFunnelInspector({
  activeModule,
  websiteScope,
  selectedModuleIds,
  onToggleSelectModule,
}: MarketingFunnelInspectorProps) {
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

  return (
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
              🎯 Contextual Setup for:{" "}
              {websiteScope === "ecommerce"
                ? "E-Commerce Store"
                : websiteScope === "single_product"
                ? "Single Product Drop"
                : "Personal Brand Authority"}
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
              {activeModule.websiteScope[websiteScope]}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onToggleSelectModule(activeModule.id)}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                selectedModuleIds.includes(activeModule.id)
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {selectedModuleIds.includes(activeModule.id)
                ? "✓ Included in Your Website Scope"
                : "+ Add to Selected Modules"}
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
              <span className="text-[10px] font-mono text-slate-500 ml-2">
                bofu_website_module.tsx
              </span>
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
                    <button
                      type="button"
                      className="bg-white text-black font-black text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Pay / GPay</span>
                    </button>
                    <button
                      type="button"
                      className="bg-emerald-600 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                    >
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
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                        0{timeLeft.hours}
                      </div>
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
                  <p className="text-xs text-slate-400">
                    Batch 01 tier locking — Only 4 units remaining in stock
                  </p>
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
                    <button
                      type="button"
                      className="bg-white text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-md shadow-xs"
                    >
                      Claim Deal →
                    </button>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      📦 Free Worldwide Shipping on orders over $100
                    </span>
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
                    <div className="h-10 rounded-lg bg-emerald-950 border border-emerald-500 flex items-center justify-center text-xs">
                      Angle 1
                    </div>
                    <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">
                      Angle 2
                    </div>
                    <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">
                      Macro
                    </div>
                    <div className="h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">
                      In-Use
                    </div>
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
                      <div className="text-[9px] text-slate-400">
                        Highlights internal alloy & precision parts
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <div className="text-lg mb-1">💡</div>
                      <div className="font-bold text-white">Studio Seamless Lighting</div>
                      <div className="text-[9px] text-slate-400">Crisp shadows & true-to-life colors</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    Web-optimized WebP & AVIF format (98+ PageSpeed)
                  </div>
                </div>
              )}

              {/* 6. UGC Wall Simulation */}
              {activeModule.id === "ugc_wall" && (
                <div className="grid grid-cols-2 gap-3 py-2">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                    <div className="flex items-center text-amber-400 text-xs">★★★★★</div>
                    <div className="text-xs font-bold text-white">
                      &quot;Arrived in 2 days, 10x better than photos!&quot;
                    </div>
                    <div className="text-[10px] text-emerald-400">✓ Verified Buyer • Sarah M.</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                    <div className="flex items-center text-amber-400 text-xs">★★★★★</div>
                    <div className="text-xs font-bold text-white">
                      &quot;The checkout was so fast with Apple Pay.&quot;
                    </div>
                    <div className="text-[10px] text-emerald-400">✓ Verified Buyer • Daniel K.</div>
                  </div>
                </div>
              )}

              {/* 7. Price Comparison Matrix Simulation */}
              {activeModule.id === "price_comparison_matrix" && (
                <div className="space-y-2 py-2 max-w-sm mx-auto">
                  <div className="text-center text-xs font-bold text-slate-300 mb-1">
                    Value Comparison Table
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400 text-[10px]">
                      Feature
                    </div>
                    <div className="p-2 bg-emerald-950 border border-emerald-600 rounded-lg text-emerald-300 font-bold text-[10px]">
                      Our Engine
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg text-slate-400 text-[10px]">
                      Generic Store
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-2 bg-slate-900/60 rounded-lg text-slate-400 text-[10px]">
                      1-Click Checkout
                    </div>
                    <div className="p-2 bg-emerald-950/60 rounded-lg text-emerald-400 font-bold text-[10px]">
                      ✓ Included
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-lg text-rose-400 text-[10px]">
                      ✗ Multi-step
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-2 bg-slate-900/60 rounded-lg text-slate-400 text-[10px]">
                      UTM Attribution
                    </div>
                    <div className="p-2 bg-emerald-950/60 rounded-lg text-emerald-400 font-bold text-[10px]">
                      ✓ Built-in
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-lg text-rose-400 text-[10px]">
                      ✗ Blind spend
                    </div>
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
                      <div className="text-[10px] text-slate-400">
                        Marcus in San Francisco purchased 2 units (Only 3 left)
                      </div>
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
                  <h4 className="text-sm font-bold text-white">
                    Claim Your Free Resource / Gift
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Instant PDF Blueprint delivered to your email within 10 seconds.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="founder@yourbrand.com"
                      readOnly
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 w-full"
                    />
                    <button
                      type="button"
                      className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg whitespace-nowrap"
                    >
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
  );
}
