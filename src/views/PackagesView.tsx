"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getWebsitePackages,
  submitBooking,
  type WebsitePackage,
  DEFAULT_PACKAGES,
} from "@/lib/portalServices";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function PackagesView() {
  const [packages, setPackages] = useState<WebsitePackage[]>(DEFAULT_PACKAGES);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [selectedPackage, setSelectedPackage] = useState<WebsitePackage>(DEFAULT_PACKAGES[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [timelineReq, setTimelineReq] = useState("Flexible (3-5 weeks)");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getWebsitePackages();
      if (data && data.length > 0) {
        setPackages(data);
        setSelectedPackage(data[0]);
      }
    }
    load();
  }, []);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Calculate dynamic total price
  const basePrice = currency === "USD" ? selectedPackage.price_usd : selectedPackage.price_inr;
  const addonsTotal = selectedPackage.addons
    ? selectedPackage.addons
        .filter((a) => selectedAddons.includes(a.id))
        .reduce((sum, a) => sum + (currency === "USD" ? a.price_usd : a.price_usd * 83), 0)
    : 0;
  const grandTotal = basePrice + addonsTotal;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitBooking({
        client_name: clientName,
        client_email: clientEmail,
        company_name: companyName,
        package_id: selectedPackage.id,
        selected_addons: selectedAddons,
        estimated_budget_usd: currency === "USD" ? grandTotal : Math.round(grandTotal / 83),
        timeline_requirement: timelineReq,
        project_description: projectDescription,
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to submit booking inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-300">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            Website Engineering & Creative Packages
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Bespoke Digital Experiences Engineered to Convert.
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Transparent investment tiers tailored for high-profile portfolios, visionary tech startups, and luxury
            brands. Every project includes full client portal access, asset management, and digital e-contracts.
          </p>

          {/* Currency Switcher */}
          <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-slate-950/80 p-1 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`rounded-full px-5 py-1.5 text-xs font-bold transition ${
                currency === "USD" ? "bg-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]" : "text-slate-400 hover:text-white"
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("INR")}
              className={`rounded-full px-5 py-1.5 text-xs font-bold transition ${
                currency === "INR" ? "bg-sky-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]" : "text-slate-400 hover:text-white"
              }`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* PACKAGE TIERS CARDS */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
          {packages.map((pkg) => {
            const isSelected = selectedPackage.id === pkg.id;
            const price = currency === "USD" ? `$${pkg.price_usd.toLocaleString("en-US")}` : `₹${pkg.price_inr.toLocaleString("en-IN")}`;

            return (
              <div
                key={pkg.id}
                onClick={() => {
                  setSelectedPackage(pkg);
                  setSelectedAddons([]);
                }}
                className={`relative flex flex-col justify-between rounded-3xl border p-8 backdrop-blur-2xl transition-all cursor-pointer ${
                  isSelected
                    ? "border-sky-400 bg-gradient-to-b from-sky-950/60 via-slate-950/90 to-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.25)] scale-[1.02]"
                    : "border-white/10 bg-slate-950/70 hover:border-sky-400/40 hover:bg-slate-900/60"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3.5 right-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.4)]">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-sky-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-300 border border-sky-400/30">
                      {pkg.badge || "Tier"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">⏳ {pkg.turnaround_weeks}</span>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-white">{pkg.name}</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">{pkg.tagline}</p>

                  {/* Price */}
                  <div className="my-6 border-y border-white/8 py-4">
                    <div className="text-3xl font-black text-white">{price}</div>
                    <div className="text-xs text-slate-400 mt-0.5">Fixed Investment • 30-Day Hypercare Included</div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Scope</div>
                    <ul className="space-y-2 text-xs text-slate-200">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sky-400 shrink-0 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/8 pt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackage(pkg);
                      setIsBookingOpen(true);
                    }}
                    className={`w-full rounded-2xl py-3 text-xs font-bold uppercase tracking-wider transition ${
                      isSelected
                        ? "bg-gradient-to-r from-sky-400 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:brightness-110"
                        : "bg-slate-900 text-white border border-white/10 hover:bg-sky-500/20 hover:text-sky-200"
                    }`}
                  >
                    Select & Book Tier →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* INTERACTIVE ADD-ONS & ESTIMATOR */}
        <div className="rounded-3xl border border-sky-400/20 bg-slate-950/80 p-8 backdrop-blur-2xl shadow-2xl mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
                <span>⚙️</span> Interactive Scope Customizer
              </div>
              <h3 className="mt-1 text-2xl font-bold text-white">
                Customize: {selectedPackage.name}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-slate-400">Estimated Total Investment</span>
              <div className="text-3xl font-black text-sky-300">
                {currency === "USD" ? `$${grandTotal.toLocaleString("en-US")}` : `₹${grandTotal.toLocaleString("en-IN")}`}{" "}
                <span className="text-xs font-normal text-slate-400">{currency}</span>
              </div>
            </div>
          </div>

          {/* Add-ons Selector */}
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Optional Add-Ons & Architectural Modules
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {selectedPackage.addons?.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                const addonPrice =
                  currency === "USD" ? `$${addon.price_usd}` : `₹${(addon.price_usd * 83).toLocaleString("en-IN")}`;

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      isChecked
                        ? "border-sky-400/80 bg-sky-500/15 shadow-[0_0_16px_rgba(56,189,248,0.2)]"
                        : "border-white/8 bg-slate-900/60 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{addon.name}</span>
                      <span className="h-4 w-4 rounded border flex items-center justify-center text-[10px] font-bold border-sky-400 text-sky-300">
                        {isChecked ? "✓" : ""}
                      </span>
                    </div>
                    <div className="mt-2 text-xs font-mono text-sky-300 font-semibold">+{addonPrice}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
            <div className="text-xs text-slate-400 max-w-md">
              Selected package includes source code handover, Vercel deployment, client portal onboarding, and e-contract execution.
            </div>
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-8 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:brightness-110"
            >
              Proceed to Booking & Contract Kickoff →
            </button>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 backdrop-blur-xl mb-12">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 text-xs">
            <div className="rounded-2xl border border-white/6 bg-slate-900/40 p-5">
              <h4 className="font-bold text-white text-sm">How does the contract and payment flow work?</h4>
              <p className="mt-2 text-slate-300 leading-relaxed">
                Once booked, a tailored digital agreement is generated in your Client Portal. You can sign directly via our e-signature pad. Engagements standardly require a 50% kickoff deposit and 50% upon final delivery.
              </p>
            </div>

            <div className="rounded-2xl border border-white/6 bg-slate-900/40 p-5">
              <h4 className="font-bold text-white text-sm">Can I upload assets and provide copy directly?</h4>
              <p className="mt-2 text-slate-300 leading-relaxed">
                Yes! Your Client Workspace features a dedicated Asset Dropzone powered by Supabase Cloud Storage. You can upload SVGs, PNGs, PDFs, fonts, and copy files at any time during development.
              </p>
            </div>

            <div className="rounded-2xl border border-white/6 bg-slate-900/40 p-5">
              <h4 className="font-bold text-white text-sm">What happens after launch?</h4>
              <p className="mt-2 text-slate-300 leading-relaxed">
                Every tier includes a 30-day (or 45-day) hypercare warranty covering technical stabilization, bug fixes, and continuous Lighthouse performance optimization.
              </p>
            </div>

            <div className="rounded-2xl border border-white/6 bg-slate-900/40 p-5">
              <h4 className="font-bold text-white text-sm">Do you offer custom enterprise engineering?</h4>
              <p className="mt-2 text-slate-300 leading-relaxed">
                Absolutely. For custom 3D web applications, custom CMS architectures, or bespoke WebGL pipelines, reach out directly through our contact form.
              </p>
            </div>
          </div>
        </div>

        {/* MODAL: BOOKING INTAKE */}
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-3xl border border-sky-400/30 bg-slate-950 p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Book Package: {selectedPackage.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Estimated Investment:{" "}
                    <strong className="text-sky-300 font-mono">
                      {currency === "USD" ? `$${grandTotal.toLocaleString("en-US")}` : `₹${grandTotal.toLocaleString("en-IN")}`} {currency}
                    </strong>
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
                  <h4 className="text-xl font-bold text-white">Booking Inquiry Submitted!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you, {clientName}! Your project brief has been recorded. We will initialize your project contract in your Client Portal.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <Link
                      href="/client"
                      className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110"
                    >
                      Go to Client Portal →
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
                      <label className="block font-medium uppercase tracking-wider text-slate-300">Company / Brand (Optional)</label>
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
                      Project Vision & Key Requirements
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Briefly describe your goals, required pages, reference links, and target audience..."
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
                      {isSubmitting ? "Submitting Intake..." : "Confirm Booking & Start Contract"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
