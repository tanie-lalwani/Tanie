"use client";

import React, { useState, useMemo } from "react";

export default function UtmAttributionEngine() {
  const [targetUrl, setTargetUrl] = useState("https://yourbrand.com/drop");
  const [utmSource, setUtmSource] = useState("meta_ads");
  const [utmMedium, setUtmMedium] = useState("paid_social");
  const [utmCampaign, setUtmCampaign] = useState("summer_drop_bofu");
  const [utmContent, setUtmContent] = useState("before_after_hook_v1");
  const [utmTerm, setUtmTerm] = useState("high_intent_buyers");
  const [copiedLink, setCopiedLink] = useState(false);

  // Computed Full UTM Link
  const fullUtmUrl = useMemo(() => {
    try {
      const base = targetUrl.trim() || "https://yourbrand.com";
      const url = new URL(base.startsWith("http") ? base : `https://${base}`);
      url.searchParams.set("utm_source", utmSource);
      url.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
      if (utmContent) url.searchParams.set("utm_content", utmContent);
      if (utmTerm) url.searchParams.set("utm_term", utmTerm);
      return url.toString();
    } catch {
      return `${targetUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    }
  }, [targetUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUtmUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
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
            <span>
              Source: <strong className="text-white">{utmSource}</strong>
            </span>
            <span>•</span>
            <span>
              Medium: <strong className="text-white">{utmMedium}</strong>
            </span>
            <span>•</span>
            <span>
              Campaign: <strong className="text-white">{utmCampaign}</strong>
            </span>
          </div>
          <div className="text-emerald-400 font-bold">
            Automatic lead attribution recording on /admin & /client
          </div>
        </div>
      </div>
    </div>
  );
}
