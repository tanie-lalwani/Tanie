"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  WEBSITE_FORMATS,
  EXPERIENCE_LAYERS,
  VISUAL_STYLES,
  CONFIGURATOR_ADDONS,
  type FormatOption,
  type ExperienceLayer,
  type VisualStyleOption,
  type FeatureAddon,
} from "@/data/configuratorCatalog";
import { submitBooking, submitLead } from "@/lib/portalServices";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function PackagesView() {
  // Configurator Selection State
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>(WEBSITE_FORMATS[0]);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(["webgl-physics"]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["surrealism", "dark-mode-luxury"]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["headless-cms"]);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  // Visual Style Filter
  const [styleFilter, setStyleFilter] = useState<string>("All");

  // Lead Collection & Gated Rate State
  const [isPricingUnlocked, setIsPricingUnlocked] = useState(false);
  const [unlockedEmail, setUnlockedEmail] = useState<string>("");
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadTimeline, setLeadTimeline] = useState("Immediate (1-2 weeks)");
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [timelineReq, setTimelineReq] = useState("Flexible (3-5 weeks)");
  const [projectDescription, setProjectDescription] = useState("");

  // Inspect Style Detail Modal
  const [inspectedStyle, setInspectedStyle] = useState<VisualStyleOption | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLead = localStorage.getItem("pricing_unlocked_lead");
      if (savedLead) {
        setIsPricingUnlocked(true);
        setUnlockedEmail(savedLead);
        setClientEmail(savedLead);
      }
    }

    async function checkUser() {
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            setIsPricingUnlocked(true);
            setUnlockedEmail(data.session.user.email || "");
            setClientEmail(data.session.user.email || "");
          }
        } catch (e) {
          console.warn("Session check error:", e);
        }
      }
    }
    checkUser();
  }, []);

  // Filtered Styles
  const filteredStyles = useMemo(() => {
    if (styleFilter === "All") return VISUAL_STYLES;
    return VISUAL_STYLES.filter((s) => s.category === styleFilter);
  }, [styleFilter]);

  // Selection Toggles
  const toggleExperience = (id: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        // Keep max 3 combinations for focused aesthetic
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Dynamic Investment Calculation
  const formatBasePrice =
    currency === "USD" ? selectedFormat.basePriceUsd : selectedFormat.basePriceInr;

  const experienceCost = EXPERIENCE_LAYERS.filter((e) => selectedExperiences.includes(e.id)).reduce(
    (sum, e) => sum + (currency === "USD" ? e.priceUsd : e.priceUsd * 83),
    0
  );

  const addonCost = CONFIGURATOR_ADDONS.filter((a) => selectedAddons.includes(a.id)).reduce(
    (sum, a) => sum + (currency === "USD" ? a.priceUsd : a.priceUsd * 83),
    0
  );

  const grandTotal = formatBasePrice + experienceCost + addonCost;

  // Selected Style Names for Blueprint Summary
  const selectedStyleObjects = VISUAL_STYLES.filter((s) => selectedStyles.includes(s.id));
  const styleCombinationSummary =
    selectedStyleObjects.length > 0
      ? selectedStyleObjects.map((s) => s.name).join(" + ")
      : "Custom Direction";

  // Handle Lead Unlock Submit
  const handleLeadUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim() || !leadName.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    setIsUnlocking(true);
    try {
      await submitLead({
        client_name: leadName.trim(),
        client_email: leadEmail.trim(),
        company_name: leadCompany.trim(),
        phone: leadPhone.trim(),
        package_interest: `${selectedFormat.name} (${styleCombinationSummary})`,
        timeline: leadTimeline,
        source: "Configurator Rate Gate",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("pricing_unlocked_lead", leadEmail.trim());
      }
      setIsPricingUnlocked(true);
      setUnlockedEmail(leadEmail.trim());
      setClientName(leadName.trim());
      setClientEmail(leadEmail.trim());
      setCompanyName(leadCompany.trim());
      setIsUnlockModalOpen(false);
    } catch (err) {
      console.error("Error unlocking pricing:", err);
      setIsPricingUnlocked(true);
      setIsUnlockModalOpen(false);
    } finally {
      setIsUnlocking(false);
    }
  };

  // Handle Booking Submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullBlueprintDescription = `
Configured Blueprint:
• Format: ${selectedFormat.name} (${selectedFormat.tagline})
• Visual Direction: ${styleCombinationSummary}
• Experience Layers: ${
      selectedExperiences.length > 0
        ? EXPERIENCE_LAYERS.filter((e) => selectedExperiences.includes(e.id))
            .map((e) => e.name)
            .join(", ")
        : "Standard Interaction"
    }
• Add-ons & Modules: ${
      selectedAddons.length > 0
        ? CONFIGURATOR_ADDONS.filter((a) => selectedAddons.includes(a.id))
            .map((a) => a.name)
            .join(", ")
        : "None"
    }

Client Vision & Notes:
${projectDescription}
    `.trim();

    try {
      await submitBooking({
        client_name: clientName,
        client_email: clientEmail,
        company_name: companyName,
        package_id: selectedFormat.id,
        selected_addons: [...selectedExperiences, ...selectedAddons],
        estimated_budget_usd: currency === "USD" ? grandTotal : Math.round(grandTotal / 83),
        timeline_requirement: timelineReq,
        project_description: fullBlueprintDescription,
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to submit booking blueprint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-300">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            Creative Developer Experience & Style Catalogue
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Website Experience & Design Configurator
          </h1>

          <p className="mt-4 text-base text-slate-300 sm:text-lg max-w-2xl mx-auto">
            Combine your bespoke <strong>Website Format</strong>, <strong>Interaction Layer</strong>, and{" "}
            <strong>Visual Aesthetics</strong> into a custom digital blueprint.
          </p>

          {/* FORMULA PILL LOCKUP */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-sky-400/30 bg-slate-950/90 p-3 text-xs backdrop-blur-2xl shadow-[0_10px_35px_rgba(2,8,23,0.6)]">
            <span className="rounded-full bg-sky-500/20 px-3 py-1 font-bold text-sky-300 border border-sky-400/30">
              {selectedFormat.name}
            </span>
            <span className="text-slate-500 font-bold">×</span>
            <span className="rounded-full bg-teal-500/20 px-3 py-1 font-bold text-teal-300 border border-teal-400/30">
              {selectedExperiences.length} Experience Layers
            </span>
            <span className="text-slate-500 font-bold">×</span>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 font-bold text-purple-300 border border-purple-400/30">
              {styleCombinationSummary}
            </span>
            <span className="text-slate-500 font-bold">×</span>
            <span className="rounded-full bg-amber-500/20 px-3 py-1 font-bold text-amber-300 border border-amber-400/30">
              {selectedAddons.length} Modules
            </span>
          </div>

          {/* Pricing Unlock Status & Currency Switcher */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {isPricingUnlocked ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
                <span>✓</span> Rates Unlocked for <strong className="text-white">{unlockedEmail}</strong>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition"
              >
                <span>🔒</span> Unlock Exact Rate Card & Customizer
              </button>
            )}

            {isPricingUnlocked && (
              <div className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/80 p-1">
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`rounded-full px-4 py-1 text-xs font-bold transition ${
                    currency === "USD"
                      ? "bg-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`rounded-full px-4 py-1 text-xs font-bold transition ${
                    currency === "INR"
                      ? "bg-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* STEP 1: WEBSITE FORMAT (CORE ARCHITECTURE) */}
        <section className="mb-16">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-sky-400">01. Architecture</div>
              <h2 className="text-2xl font-bold text-white">Choose Your Website Format</h2>
            </div>
            <span className="text-xs text-slate-400">Select the foundational technical platform</span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WEBSITE_FORMATS.map((format) => {
              const isSelected = selectedFormat.id === format.id;
              const formatPrice =
                currency === "USD"
                  ? `$${format.basePriceUsd.toLocaleString("en-US")}`
                  : `₹${format.basePriceInr.toLocaleString("en-IN")}`;

              return (
                <div
                  key={format.id}
                  onClick={() => setSelectedFormat(format)}
                  className={`cursor-pointer rounded-3xl border p-6 backdrop-blur-xl transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? "border-sky-400 bg-gradient-to-b from-sky-950/70 via-slate-950/90 to-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.25)] scale-[1.02]"
                      : "border-white/10 bg-slate-950/60 hover:border-sky-400/40 hover:bg-slate-900/50"
                  }`}
                >
                  {format.badge && (
                    <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                      {format.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{format.icon}</span>
                      <span className="text-xs text-slate-400 font-mono">⏳ {format.turnaround}</span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">{format.name}</h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">{format.tagline}</p>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">{format.description}</p>

                    {/* Deliverables summary */}
                    <div className="mt-4 border-t border-white/8 pt-3 space-y-1.5">
                      {format.keyDeliverables.slice(0, 2).map((deliv, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <span className="text-sky-400">•</span>
                          <span className="truncate">{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                    {isPricingUnlocked ? (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                          Base Architecture
                        </span>
                        <span className="text-base font-black text-white">{formatPrice}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-sky-300 font-medium">🔒 Rate Card Gated</span>
                    )}

                    <button
                      type="button"
                      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                        isSelected
                          ? "bg-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                          : "bg-slate-900 text-slate-300 border border-white/10 hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 2: INTERACTION & EXPERIENCE LAYER */}
        <section className="mb-16 rounded-3xl border border-sky-400/20 bg-slate-950/80 p-8 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-teal-400">02. Interaction</div>
              <h2 className="text-2xl font-bold text-white">Experience & Physics Layers</h2>
            </div>
            <span className="text-xs text-slate-400">Select multi-sensory and interactive mechanics</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERIENCE_LAYERS.map((exp) => {
              const isSelected = selectedExperiences.includes(exp.id);
              const price =
                currency === "USD" ? `+$${exp.priceUsd}` : `+₹${(exp.priceUsd * 83).toLocaleString("en-IN")}`;

              return (
                <div
                  key={exp.id}
                  onClick={() => toggleExperience(exp.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition flex flex-col justify-between ${
                    isSelected
                      ? "border-teal-400 bg-teal-500/15 shadow-[0_0_20px_rgba(45,212,191,0.2)]"
                      : "border-white/8 bg-slate-900/60 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{exp.icon}</span>
                      <span
                        className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                          isSelected ? "border-teal-400 bg-teal-400 text-slate-950" : "border-white/20 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-white">{exp.name}</h4>
                    <p className="mt-1 text-xs text-slate-300">{exp.tagline}</p>
                    <p className="mt-2 text-[11px] text-slate-400">{exp.description}</p>
                  </div>

                  <div className="mt-4 border-t border-white/8 pt-3 text-xs font-mono text-teal-300 font-bold">
                    {isPricingUnlocked ? price : "🔒 Unlocks with brief"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 3: VISUAL DIRECTION & AESTHETIC CATALOGUE */}
        <section className="mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-purple-400">03. Aesthetics</div>
              <h2 className="text-2xl font-bold text-white">Visual Direction Catalogue</h2>
              <p className="text-xs text-slate-300 mt-1">
                Select 1 to 3 styles to fuse your unique visual identity (e.g.{" "}
                <strong className="text-purple-300">Surrealism + Wabi-Sabi</strong> or{" "}
                <strong className="text-purple-300">Cyberpunk + Pixel Art</strong>).
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 rounded-full bg-slate-950/80 p-1 border border-white/10 text-xs">
              {[
                "All",
                "Modern & Clean",
                "Artistic & Avant-Garde",
                "Retro & Cyber",
                "Luxury & Editorial",
                "Tactile & Experimental",
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setStyleFilter(cat)}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    styleFilter === cat
                      ? "bg-purple-500/30 text-purple-200 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Style Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStyles.map((style) => {
              const isSelected = selectedStyles.includes(style.id);

              return (
                <div
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`cursor-pointer rounded-3xl border p-6 backdrop-blur-xl transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? "border-purple-400 bg-gradient-to-b from-purple-950/70 via-slate-950/90 to-slate-950 shadow-[0_0_35px_rgba(168,85,247,0.25)] scale-[1.02]"
                      : "border-white/10 bg-slate-950/60 hover:border-purple-400/40 hover:bg-slate-900/50"
                  }`}
                >
                  <div>
                    {/* Header with Category & Selection Checkbox */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-400/20">
                        {style.category}
                      </span>
                      <span
                        className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? "border-purple-400 bg-purple-400 text-slate-950"
                            : "border-white/20 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">{style.name}</h3>
                    <div className="text-xs text-purple-300 font-medium">{style.mood}</div>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">{style.description}</p>

                    {/* Color Swatch Preview */}
                    <div className="mt-4">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1.5">
                        Palette DNA
                      </span>
                      <div className="flex items-center gap-1.5">
                        {style.palette.map((color, idx) => (
                          <div
                            key={idx}
                            style={{ backgroundColor: color }}
                            className="h-4 flex-1 rounded border border-white/10 shadow-sm"
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Typography Note */}
                    <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-xl border border-white/6">
                      <span className="text-slate-300 font-semibold">Typography:</span> {style.typography}
                    </div>

                    {/* Keywords Badges */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {style.exemplarKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-white/6"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-5 border-t border-white/8 pt-3 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedStyle(style);
                      }}
                      className="text-purple-300 hover:text-white underline underline-offset-4"
                    >
                      Inspect Blueprint Note ↗
                    </button>
                    <span className="font-bold text-slate-300">
                      {isSelected ? "Active in Formula ✓" : "+ Add to Formula"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 4: FEATURES & ADD-ONS */}
        <section className="mb-16 rounded-3xl border border-amber-400/20 bg-slate-950/80 p-8 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400">04. Features & Add-Ons</div>
              <h2 className="text-2xl font-bold text-white">Architectural Modules & Integrations</h2>
            </div>
            <span className="text-xs text-slate-400">Add content studios, localization, or AI intelligence</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIGURATOR_ADDONS.map((addon) => {
              const isSelected = selectedAddons.includes(addon.id);
              const price =
                currency === "USD" ? `+$${addon.priceUsd}` : `+₹${(addon.priceUsd * 83).toLocaleString("en-IN")}`;

              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/15 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                      : "border-white/8 bg-slate-900/60 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{addon.icon}</span>
                      <span
                        className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? "border-amber-400 bg-amber-400 text-slate-950"
                            : "border-white/20 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-white">{addon.name}</h4>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">{addon.description}</p>
                  </div>

                  <div className="mt-4 border-t border-white/8 pt-3 text-xs font-mono text-amber-300 font-bold">
                    {isPricingUnlocked ? price : "🔒 Unlocks with brief"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LIVE BLUEPRINT SUMMARY & BOOKING DOCK */}
        <div className="rounded-3xl border border-sky-400/40 bg-gradient-to-r from-slate-950 via-sky-950/60 to-slate-950 p-8 backdrop-blur-2xl shadow-2xl mb-16">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
                <span>💎</span> Configured Project Blueprint
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {selectedFormat.name} × {styleCombinationSummary}
              </h3>
              <p className="mt-1 text-xs text-slate-300 max-w-2xl">
                Includes private GitHub source code handover, Vercel Edge CDN setup, Client Workspace asset vault, and
                e-contract signing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 text-right min-w-[240px]">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400 block">
                Estimated Total Investment
              </span>
              {isPricingUnlocked ? (
                <div>
                  <div className="text-3xl font-black text-white">
                    {currency === "USD"
                      ? `$${grandTotal.toLocaleString("en-US")}`
                      : `₹${grandTotal.toLocaleString("en-IN")}`}{" "}
                    <span className="text-xs font-normal text-slate-400">{currency}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Turnaround: {selectedFormat.turnaround}</span>
                </div>
              ) : (
                <div className="text-lg font-bold text-sky-300 font-mono">🔒 Locked until sign-up</div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-300 space-y-1">
              <div>
                • <strong>Core Format:</strong> {selectedFormat.name} ({selectedFormat.turnaround})
              </div>
              <div>
                • <strong>Visual Aesthetics:</strong> {styleCombinationSummary}
              </div>
              <div>
                • <strong>Experience Mechanics:</strong> {selectedExperiences.length} selected
              </div>
              <div>
                • <strong>Add-on Modules:</strong> {selectedAddons.length} selected
              </div>
            </div>

            {isPricingUnlocked ? (
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 transition cursor-pointer"
              >
                Book This Configured Blueprint →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 transition cursor-pointer"
              >
                Unlock Pricing & Book Blueprint →
              </button>
            )}
          </div>
        </div>

        {/* MODAL 1: PRICING UNLOCK & LEAD GATE */}
        {isUnlockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-sky-400/40 bg-slate-950 p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-300">
                    <span>⚡</span> Instant Rate Card Access
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">Unlock Full Pricing & Scope Matrix</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(false)}
                  className="rounded-lg bg-slate-900 p-1.5 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-3">
                Share a few quick details about your project to instantly unlock exact pricing tiers, add-on rates, and
                intake scheduling.
              </p>

              <form onSubmit={handleLeadUnlockSubmit} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-medium uppercase tracking-wider text-slate-300">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Alex Sterling"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">Work Email</label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Company / Studio
                    </label>
                    <input
                      type="text"
                      value={leadCompany}
                      onChange={(e) => setLeadCompany(e.target.value)}
                      placeholder="e.g. Aetheria Studios"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Target Project Timeline
                    </label>
                    <select
                      value={leadTimeline}
                      onChange={(e) => setLeadTimeline(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                    >
                      <option value="Immediate (1-2 weeks sprint)">Immediate (1-2 weeks sprint)</option>
                      <option value="Standard (3-5 weeks)">Standard (3-5 weeks)</option>
                      <option value="Next Month">Next Month</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isUnlocking}
                    className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 py-3 font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:brightness-110 disabled:opacity-50"
                  >
                    {isUnlocking ? "Unlocking Rates..." : "Unlock Full Pricing & Scope Matrix →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: BOOKING INTAKE FOR CONFIGURED BLUEPRINT */}
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-3xl border border-sky-400/30 bg-slate-950 p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Book Configured Blueprint</h3>
                  <p className="text-xs text-sky-300 mt-0.5">
                    {selectedFormat.name} × {styleCombinationSummary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsBookingOpen(false);
                    setBookingSuccess(false);
                  }}
                  className="rounded-lg bg-slate-900 p-1.5 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl border border-emerald-400/40 text-emerald-300">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-white">Configured Blueprint Booked!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you, {clientName}! Your custom configuration has been saved. Your project agreement and asset
                    vault are initialized in your Client Workspace.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <Link
                      href="/client"
                      className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110"
                    >
                      Open Client Workspace →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4 text-xs">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-medium uppercase tracking-wider text-slate-300">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Alex Sterling"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium uppercase tracking-wider text-slate-300">Email Address</label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block font-medium uppercase tracking-wider text-slate-300">
                        Company / Brand (Optional)
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Aetheria Studios"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium uppercase tracking-wider text-slate-300">Target Timeline</label>
                      <select
                        value={timelineReq}
                        onChange={(e) => setTimelineReq(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                      >
                        <option value="Immediate (1-2 weeks sprint)">Immediate (1-2 weeks sprint)</option>
                        <option value="Flexible (3-5 weeks)">Standard (3-5 weeks)</option>
                        <option value="Next Month">Next Month</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium uppercase tracking-wider text-slate-300">
                      Additional Vision & Reference Links
                    </label>
                    <textarea
                      rows={3}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Share reference URLs, branding notes, or specific shader/3D expectations..."
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(false)}
                      className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-6 py-2.5 font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:brightness-110 disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting Blueprint..." : "Confirm Blueprint & Start Contract"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 3: STYLE BLUEPRINT INSPECTOR */}
        {inspectedStyle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-purple-400/30 bg-slate-950 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    {inspectedStyle.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{inspectedStyle.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedStyle(null)}
                  className="rounded-lg bg-slate-900 p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium uppercase tracking-wider">Aesthetic Mood</span>
                  <p className="text-slate-200 text-sm font-semibold mt-0.5">{inspectedStyle.mood}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium uppercase tracking-wider">Philosophy & Direction</span>
                  <p className="text-slate-300 leading-relaxed mt-0.5">{inspectedStyle.description}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium uppercase tracking-wider">Color Swatch DNA</span>
                  <div className="mt-1.5 flex gap-2">
                    {inspectedStyle.palette.map((c, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div
                          style={{ backgroundColor: c }}
                          className="h-8 w-full rounded-lg border border-white/10 shadow-md"
                        />
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-medium uppercase tracking-wider">Typography Stack</span>
                  <p className="text-purple-300 font-mono mt-0.5">{inspectedStyle.typography}</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      toggleStyle(inspectedStyle.id);
                      setInspectedStyle(null);
                    }}
                    className="rounded-xl bg-purple-500 px-5 py-2 font-bold text-slate-950 hover:bg-purple-400"
                  >
                    {selectedStyles.includes(inspectedStyle.id) ? "Remove from Formula" : "Add to Formula +"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
