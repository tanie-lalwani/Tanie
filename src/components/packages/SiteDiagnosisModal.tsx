"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { saveLeadProfile } from "@/features/lead-capture/lib/cookieHelper";

interface SiteDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWebsite?: string;
}

export default function SiteDiagnosisModal({
  isOpen,
  onClose,
  initialWebsite = "",
}: SiteDiagnosisModalProps) {
  const { locale } = useLanguage();

  const [websiteUrl, setWebsiteUrl] = useState(initialWebsite);
  const [selectedIssue, setSelectedIssue] = useState<string>("Low conversion / visitors leaving without buying");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const issueOptions = [
    {
      id: "conversion",
      icon: "📉",
      label: locale === "hi" ? "Low Conversion Rate" : "Low Conversion Rate",
      desc: locale === "hi" ? "Visitors aate hain par inquiries ya sales nahi hoti" : "Visitors arrive but leave without inquiring or buying"
    },
    {
      id: "speed",
      icon: "⚡",
      label: locale === "hi" ? "Slow Speed & Lag" : "Slow Speed & Poor Mobile Score",
      desc: locale === "hi" ? "Phone par site slow chalti hai aur Lighthouse score low hai" : "Takes too long to load on mobile with high bounce rates"
    },
    {
      id: "aesthetic",
      icon: "🎨",
      label: locale === "hi" ? "Outdated Design" : "Outdated / Unprofessional Look",
      desc: locale === "hi" ? "Design modern nahi lagta, premium trust build nahi hota" : "Doesn't reflect brand quality or command premium prices"
    },
    {
      id: "checkout_bugs",
      icon: "🐛",
      label: locale === "hi" ? "Bugs / Broken Checkout" : "Broken Checkout & Booking Flow",
      desc: locale === "hi" ? "Payment, form submission ya booking flow me error aate hain" : "Glitches during forms, calendar booking, or payments"
    },
    {
      id: "seo",
      icon: "🔍",
      label: locale === "hi" ? "Poor SEO Ranking" : "Low Google SEO Ranking",
      desc: locale === "hi" ? "Google search me site rank nahi karti aur organic traffic nahi aata" : "Not ranking on Google searches for target keywords"
    },
    {
      id: "overhaul",
      icon: "💡",
      label: locale === "hi" ? "Full General Audit" : "Full Website Health Check",
      desc: locale === "hi" ? "Overall UX, architecture aur design improvements ka roadmap chahiye" : "Comprehensive audit roadmap covering UX, code & speed"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl.trim()) {
      setErrorMessage(locale === "hi" ? "Kripya apni website URL enter karein" : "Please enter your website URL");
      return;
    }
    if (!clientEmail.trim() && !clientPhone.trim()) {
      setErrorMessage(locale === "hi" ? "Kripya email ya phone number provide karein" : "Please provide an email or phone number for the report");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const payload = {
        websiteUrl: websiteUrl.trim(),
        selectedIssue,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        additionalNotes: additionalNotes.trim(),
        source: "website_diagnosis_request",
        status: "diagnosis_requested"
      };

      saveLeadProfile({
        name: clientName.trim(),
        email: clientEmail.trim(),
        socialAccount: clientPhone.trim() || undefined,
        businessName: websiteUrl.trim()
      });

      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to submit diagnosis request");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppInstantReview = () => {
    const text = `Hi Tanie! I just requested a site diagnosis for my website:
🌐 *Website URL:* ${websiteUrl}
🎯 *Primary Concern:* ${selectedIssue}
👤 *Name / Contact:* ${clientName || "Brand Owner"} (${clientEmail || clientPhone})
📝 *Notes:* ${additionalNotes || "Please review conversion bottlenecks and UX speed improvements."}

Could you take a quick look and share what needs to be improved?`;

    window.open(`https://wa.me/916351515091?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl max-h-[90vh] bg-[#f0f9ff] border border-sky-300 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-sky-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-2 rounded-xl bg-sky-100 border border-sky-200">🩺</span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 block">
                {locale === "hi" ? "Expert Website Review" : "Expert Website Review"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0a192f]">
                {locale === "hi" ? "Request Site Diagnosis" : "Request Site Diagnosis"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white border border-sky-300 flex items-center justify-center text-xs font-black text-[#0a192f] hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-5">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 text-3xl border border-emerald-200">
              ✓
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#0a192f]">
                {locale === "hi" ? "Diagnosis Request Received!" : "Diagnosis Request Received!"}
              </h3>
              <p className="text-xs sm:text-sm text-sky-950/80 max-w-md mx-auto leading-relaxed font-medium">
                {locale === "hi"
                  ? `Main aapki website (${websiteUrl}) ka UX, speed score, conversion blockers aur mobile design analyze karke 24 ghante me personalized diagnosis report send karunga.`
                  : `I will inspect your website (${websiteUrl}) for UX bottlenecks, conversion drop-offs, speed issues, and mobile aesthetics, and deliver an actionable diagnosis within 24 hours.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sky-200 space-y-2 text-left text-xs text-sky-900">
              <div className="font-bold flex items-center gap-1.5">
                <span>📋 What will be checked:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                <li>Lighthouse Performance & Mobile Speed scores</li>
                <li>Conversion friction points & CTA positioning</li>
                <li>Typography, spacing & modern luxury aesthetic gaps</li>
                <li>SEO meta architecture & social OpenGraph tags</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppInstantReview}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>💬</span>
                <span>{locale === "hi" ? "Instant WhatsApp Review Maangein" : "Send URL on WhatsApp for Instant Review"}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                {locale === "hi" ? "Done / Band Karein" : "Close"}
              </button>
            </div>
          </div>
        ) : (
          /* INPUT FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-sky-950/80 leading-relaxed font-medium">
              {locale === "hi"
                ? "Apni website link batayein aur choose karein ki aapko sabse badi dikkat kya aa rahi hai. Hum audit karke exactly batayenge ki kahan improvement ki zarurat hai."
                : "Enter your website URL and select what is currently holding your business back. I'll inspect your live site and highlight the exact bottlenecks and improvements needed."}
            </p>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* WEBSITE URL */}
            <div>
              <label htmlFor="diag_website_url" className="block text-xs font-bold text-[#0a192f] mb-1">
                {locale === "hi" ? "Aapki Website URL / Domain *" : "Your Website URL / Domain *"}
              </label>
              <input
                id="diag_website_url"
                type="text"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="e.g. https://yourbrand.com or yourbrand.com"
                className="w-full bg-white border border-sky-300 rounded-xl px-3.5 py-2.5 text-sm text-[#0a192f] font-semibold focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            {/* PRIMARY CONCERN RADIO GRID */}
            <div>
              <label className="block text-xs font-bold text-[#0a192f] mb-2">
                {locale === "hi" ? "Aapko main dikkat kya aa rahi hai?" : "What is the primary issue you are facing?"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {issueOptions.map((issue) => {
                  const isSelected = selectedIssue === issue.label;
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => setSelectedIssue(issue.label)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-sky-50 border-2 border-sky-600 shadow-xs"
                          : "bg-white/80 hover:bg-white border-sky-200"
                      }`}
                    >
                      <span className="text-lg shrink-0">{issue.icon}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#0a192f] block truncate">
                          {issue.label}
                        </span>
                        <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                          {issue.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTACT DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label htmlFor="diag_client_name" className="block text-xs font-bold text-[#0a192f] mb-1">
                  {locale === "hi" ? "Aapka Naam" : "Your Name"}
                </label>
                <input
                  id="diag_client_name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Aman Gupta"
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs text-[#0a192f] font-medium focus:outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label htmlFor="diag_client_contact" className="block text-xs font-bold text-[#0a192f] mb-1">
                  {locale === "hi" ? "Work Email / WhatsApp *" : "Work Email / WhatsApp *"}
                </label>
                <input
                  id="diag_client_contact"
                  type="text"
                  required
                  value={clientEmail || clientPhone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.includes("@")) {
                      setClientEmail(val);
                    } else {
                      setClientPhone(val);
                      setClientEmail(val);
                    }
                  }}
                  placeholder="name@company.com or phone"
                  className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs text-[#0a192f] font-medium focus:outline-none focus:border-sky-600"
                />
              </div>
            </div>

            {/* ADDITIONAL NOTES */}
            <div>
              <label htmlFor="diag_notes" className="block text-xs font-bold text-[#0a192f] mb-1">
                {locale === "hi" ? "Specific questions ya details (Optional)" : "Specific questions or details (Optional)"}
              </label>
              <textarea
                id="diag_notes"
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Checkout drop-offs on mobile, want to increase inquiries by 3x"
                className="w-full bg-white border border-sky-300 rounded-xl px-3 py-2 text-xs text-[#0a192f] font-medium focus:outline-none focus:border-sky-600 resize-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Requesting Diagnosis...</span>
                ) : (
                  <>
                    <span>🩺</span>
                    <span>{locale === "hi" ? "Request Site Diagnosis (Free Audit)" : "Request Site Diagnosis (Free Audit)"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
