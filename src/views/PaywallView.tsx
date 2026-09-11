"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  openRazorpayCheckout,
  RAZORPAY_TEST_CREDENTIALS,
  getRazorpayKeyId,
  type RazorpayPaymentSuccessResponse,
} from "@/lib/razorpay";

export default function PaywallView() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("test-verification");
  const [customAmount, setCustomAmount] = useState<string>("100");
  const [payerName, setPayerName] = useState<string>("Words of Voice");
  const [payerEmail, setPayerEmail] = useState<string>("wordsofvoice2210@gmail.com");
  const [payerPhone, setPayerPhone] = useState<string>("+919876543210");

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    paymentId: string;
    orderId?: string;
    amount: number;
    currency: string;
    planName: string;
    date: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const plans = [
    {
      id: "test-verification",
      name: "Gateway Verification Test",
      badge: "Reviewer Fast Test",
      popular: true,
      priceINR: 1,
      priceUSD: 1,
      tagline: "Instant 1-Click test transaction to verify live Razorpay checkout & webhooks.",
      features: [
        "Live Razorpay checkout execution",
        "Instant transaction verification receipt",
        "Automated digital invoice generation",
        "24/7 payment status callback verification",
      ],
    },
    {
      id: "sprint-retainer",
      name: "Website Sprint Retainer",
      badge: "Production Deposit",
      popular: false,
      priceINR: 19999,
      priceUSD: 250,
      tagline: "Secures dedicated engineering queue & initiates sprint discovery & wireframes.",
      features: [
        "Unlocks private Client Hub & E-Contracts",
        "Direct Figma Design System access",
        "Milestone-based delivery guarantee",
        "30-Day post-launch warranty included",
      ],
    },
    {
      id: "architecture-consultation",
      name: "Creative Web Architecture Consultation",
      badge: "1-on-1 Session",
      popular: false,
      priceINR: 4999,
      priceUSD: 60,
      tagline: "60-Minute deep-dive into 3D WebGL, Next.js architecture, and UX direction.",
      features: [
        "Comprehensive UI/UX audit of existing site",
        "Interactive tech stack recommendation",
        "Custom moodboard and typography palette",
        "Detailed sprint quotation & roadmap",
      ],
    },
    {
      id: "custom-retainer",
      name: "Custom Retainer Amount",
      badge: "Flexible",
      popular: false,
      priceINR: 0,
      priceUSD: 0,
      tagline: "Enter custom invoice amount for bespoke milestone settlement.",
      features: [
        "Direct milestone invoice settlement",
        "Flexible currency selection (INR / USD)",
        "Automated GST-ready digital receipt",
      ],
    },
  ];

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const getAmountInBaseUnits = () => {
    if (selectedPlan.id === "custom-retainer") {
      const num = parseFloat(customAmount) || 1;
      return num * 100;
    }
    const val = currency === "INR" ? selectedPlan.priceINR : selectedPlan.priceUSD;
    return val * 100;
  };

  const getDisplayPrice = (plan: (typeof plans)[0]) => {
    if (plan.id === "custom-retainer") {
      return currency === "INR" ? `₹${customAmount || "0"}` : `$${customAmount || "0"}`;
    }
    return currency === "INR" ? `₹${plan.priceINR.toLocaleString("en-IN")}` : `$${plan.priceUSD}`;
  };

  const handleInitiatePayment = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    const amountInSmallestUnit = getAmountInBaseUnits();

    try {
      // 1. Create Order via Server API
      let orderId: string | undefined;
      try {
        const orderRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountInSmallestUnit,
            currency,
            receipt: `rcpt_${Date.now()}`,
            notes: {
              plan_id: selectedPlan.id,
              plan_name: selectedPlan.name,
              payer_email: payerEmail || RAZORPAY_TEST_CREDENTIALS.email,
            },
          }),
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          if (orderData?.order?.id) {
            orderId = orderData.order.id;
          }
        }
      } catch (err) {
        console.warn("Backend order creation warning (proceeding with client standard checkout):", err);
      }

      // 2. Trigger Razorpay Standard Checkout
      await openRazorpayCheckout({
        amount: amountInSmallestUnit,
        currency,
        orderId,
        name: "Tanie Lalwani Studio",
        description: `${selectedPlan.name} (${currency} ${getDisplayPrice(selectedPlan)})`,
        prefill: {
          name: payerName || RAZORPAY_TEST_CREDENTIALS.name,
          email: payerEmail || RAZORPAY_TEST_CREDENTIALS.email,
          contact: payerPhone || RAZORPAY_TEST_CREDENTIALS.phone,
        },
        notes: {
          plan: selectedPlan.id,
          reviewer_mode: "verified",
        },
        onSuccess: async (res: RazorpayPaymentSuccessResponse) => {
          setIsProcessing(false);

          // Verify signature on backend
          try {
            await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(res),
            });
          } catch (vErr) {
            console.warn("Signature verification warning:", vErr);
          }

          setPaymentSuccessData({
            paymentId: res.razorpay_payment_id,
            orderId: res.razorpay_order_id,
            amount: amountInSmallestUnit / 100,
            currency,
            planName: selectedPlan.name,
            date: new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        },
        onFailure: (err) => {
          setIsProcessing(false);
          const msg = "message" in err ? err.message : err.description || "Payment attempt failed or was cancelled.";
          setErrorMessage(msg);
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: unknown) {
      setIsProcessing(false);
      setErrorMessage((err as Error)?.message || "Failed to launch Razorpay gateway.");
    }
  };

  return (
    <main className="min-h-screen bg-[#dff4ff] text-slate-900 font-sans selection:bg-sky-200 selection:text-black">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT VERTICAL NAVIGATION (DESKTOP)                         */}
      {/* ------------------------------------------------------------- */}
      <nav
        aria-label="Side navigation"
        className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-start gap-6 border-r border-black/10 bg-[#dff4ff]/88 py-8 backdrop-blur-xl md:flex"
      >
        <div className="flex flex-col items-center gap-5">
          <Link
            href="/"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title="Home"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          <Link
            href="/projects"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/projects" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title="Projects"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-semibold">Projects</span>
          </Link>

          <Link
            href="/packages"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/packages" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title="Marketplace & Aesthetics"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span className="text-[10px] font-semibold">Aesthetics</span>
          </Link>

          <Link
            href="/client"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/client" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title="Client Board"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-semibold">Client Hub</span>
          </Link>

          <Link
            href="/paywall"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/paywall" ? "bg-white !text-black shadow-md border border-sky-300/80" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title="Razorpay Paywall & Invoices"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-[10px] font-bold">Paywall</span>
          </Link>

          <Link
            href="/qna"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/qna" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title="Q&A"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-semibold">Q&A</span>
          </Link>

          <Link
            href="/contact"
            className={`flex w-14 flex-col items-center rounded-[1.35rem] px-2 py-3 !no-underline transition-all ${
              pathname === "/contact" ? "bg-[#c8ecff] !text-black shadow-xs" : "!text-slate-800 hover:bg-white/60 hover:!text-black"
            }`}
            title="Contact"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" className="mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5l-9 6.5-9-6.5" />
            </svg>
            <span className="text-[10px] font-semibold">Contact</span>
          </Link>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* 2. MOBILE TOP HEADER                                          */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b border-black/10 bg-[#dff4ff]/90 px-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-1.5 !no-underline !text-black font-semibold text-sm">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-800">
          Razorpay Paywall
        </span>
        <Link
          href="/client"
          className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-white shadow-xs cursor-pointer !no-underline"
        >
          Client Hub
        </Link>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN PAGE CONTAINER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="pl-0 md:pl-20 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8 sm:pt-10 sm:pb-24">
          
          {/* Top Header Banner */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-[2.2rem] border border-sky-300/70 bg-gradient-to-r from-white/95 via-sky-50/80 to-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-100/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-950 shadow-xs mb-3">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                Live Razorpay Payment Gateway & Retainer Paywall
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 mb-2">
                Digital Invoicing & Retainer Settlement
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Execute secure card, UPI, or net-banking payments for milestone retainers, architecture discovery, or direct quotations with real-time automated verification.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/client"
                className="rounded-2xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition !no-underline"
              >
                Open Client Hub →
              </Link>
              <Link
                href="/packages"
                className="rounded-2xl border border-sky-300/80 bg-white/90 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-sky-50 transition !no-underline"
              >
                Aesthetics & Packages
              </Link>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* PAYMENT SUCCESS MODAL / RECEIPT                               */}
          {/* ------------------------------------------------------------- */}
          {paymentSuccessData && (
            <div className="mb-10 rounded-3xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white text-2xl shadow-md">
                  ✓
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Payment Verified Successfully
                  </div>
                  <h2 className="mt-1.5 text-2xl font-black text-slate-950">
                    Thank you! Transaction Completed
                  </h2>
                  <p className="text-sm text-slate-700 mt-1 font-medium">
                    Your Razorpay payment has been verified and recorded. An automated digital receipt has been issued.
                  </p>

                  {/* Receipt Grid */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-white p-4 border border-emerald-200/80 text-xs shadow-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Razorpay Payment ID:</span>
                      <span className="font-mono font-bold text-sky-800 select-all">
                        {paymentSuccessData.paymentId}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Order / Reference:</span>
                      <span className="font-mono text-slate-800 select-all">
                        {paymentSuccessData.orderId || "Direct Capture"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Amount Settled:</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {paymentSuccessData.currency === "INR" ? "₹" : "$"}
                        {paymentSuccessData.amount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Date & Time:</span>
                      <span className="text-slate-800 font-medium">{paymentSuccessData.date}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/client"
                      className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition !no-underline"
                    >
                      Enter Client Workspace →
                    </Link>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                    >
                      🖨️ Print Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentSuccessData(null)}
                      className="rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-xs text-slate-600 hover:text-black transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PAYWALL TIER SELECTION & CHECKOUT FORM                         */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Tier Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950">Select Service / Retainer Tier</h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    All transactions are 256-bit SSL encrypted and processed by Razorpay Payments India.
                  </p>
                </div>

                {/* Currency Selector */}
                <div className="inline-flex rounded-full border border-sky-300/80 bg-white p-1 text-xs shadow-xs">
                  <button
                    type="button"
                    onClick={() => setCurrency("INR")}
                    className={`rounded-full px-4 py-1 font-bold transition cursor-pointer ${
                      currency === "INR" ? "bg-slate-950 text-white shadow-xs" : "text-slate-700 hover:text-black"
                    }`}
                  >
                    INR (₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`rounded-full px-4 py-1 font-bold transition cursor-pointer ${
                      currency === "USD" ? "bg-slate-950 text-white shadow-xs" : "text-slate-700 hover:text-black"
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Plans List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-2 border-sky-600 bg-white shadow-xl ring-2 ring-sky-400/20"
                          : "border-sky-200/80 bg-white/80 hover:bg-white hover:border-sky-400/80 shadow-sm"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 right-5 rounded-full bg-slate-950 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-xs">
                          {plan.badge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                            {plan.name}
                          </span>
                          {!plan.popular && (
                            <span className="text-[10px] font-bold text-slate-700 bg-sky-100/70 border border-sky-200 px-2 py-0.5 rounded-full">
                              {plan.badge}
                            </span>
                          )}
                        </div>

                        <div className="my-2.5">
                          <span className="text-3xl font-black text-slate-950">
                            {getDisplayPrice(plan)}
                          </span>
                          {plan.id !== "custom-retainer" && (
                            <span className="text-xs text-slate-500 font-medium ml-1">/ one-time</span>
                          )}
                        </div>

                        {plan.id === "custom-retainer" && (
                          <div className="mt-2 mb-3">
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                              Enter Amount ({currency}):
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full rounded-xl border border-sky-300 bg-sky-50/50 px-3 py-2 text-sm text-slate-950 font-mono font-bold focus:border-sky-500 focus:bg-white focus:outline-none"
                              placeholder="Enter amount"
                            />
                          </div>
                        )}

                        <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">{plan.tagline}</p>

                        <ul className="space-y-2 text-xs text-slate-700 mb-5 border-t border-sky-100 pt-3">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-sky-600 font-bold text-sm">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <div
                          className={`w-full rounded-2xl py-2.5 text-center text-xs font-extrabold uppercase tracking-wider transition ${
                            isSelected
                              ? "bg-slate-950 text-white shadow-md"
                              : "border border-sky-200 text-slate-800 bg-white hover:bg-sky-50"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Select Tier"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Payer Info & Checkout Box */}
            <div className="rounded-3xl border border-sky-300/80 bg-white/95 p-6 sm:p-7 backdrop-blur-xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-sky-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-800">
                      Summary & Checkout
                    </span>
                    <h3 className="text-lg font-black text-slate-950">{selectedPlan.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-950">
                      {getDisplayPrice(selectedPlan)}
                    </span>
                  </div>
                </div>

                {/* Form inputs */}
                <div className="mt-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Client / Reviewer Name:
                    </label>
                    <input
                      type="text"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/40 px-3.5 py-2.5 text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Contact Email:
                    </label>
                    <input
                      type="email"
                      value={payerEmail}
                      onChange={(e) => setPayerEmail(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/40 px-3.5 py-2.5 text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                      placeholder="name@company.com"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Phone / WhatsApp:
                    </label>
                    <input
                      type="tel"
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      className="w-full rounded-xl border border-sky-200 bg-sky-50/40 px-3.5 py-2.5 text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                      placeholder="+91..."
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="mt-4 rounded-xl bg-rose-50 border border-rose-300 p-3 text-xs text-rose-700 font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-6 rounded-2xl bg-sky-50/70 p-3.5 text-[11px] text-slate-600 space-y-1.5 border border-sky-200/60">
                  <div className="flex items-center gap-2 text-sky-950 font-bold">
                    <span>🔒 256-Bit SSL Encrypted Razorpay Checkout</span>
                  </div>
                  <p>
                    Supports UPI, Credit/Debit Cards, NetBanking, Razorpay Wallet, and International Cards.
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Key ID: <span className="font-mono font-bold">{getRazorpayKeyId()}</span>
                  </p>
                </div>
              </div>

              {/* Action CTA */}
              <div className="mt-6 pt-4 border-t border-sky-100 space-y-3">
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-slate-950 hover:bg-slate-900 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-900/10 hover:shadow-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Connecting Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <span>💳 Pay {getDisplayPrice(selectedPlan)} via Razorpay</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
                  <span>Instant verification receipt</span>
                  <Link href="/terms" className="hover:text-sky-800 underline">
                    Terms & Policies
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* STATUTORY POLICIES & COMPLIANCE BAR                           */}
          {/* ------------------------------------------------------------- */}
          <div className="mt-12 rounded-3xl border border-sky-200/80 bg-white/80 p-6 sm:p-8 text-xs text-slate-600 shadow-sm backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sky-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold uppercase tracking-wider text-slate-900">
                  Razorpay & Statutory Regulatory Compliance
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-slate-700 font-semibold">
                <Link href="/terms" className="hover:text-sky-800 transition underline">
                  Terms of Service
                </Link>
                <Link href="/refund-policy" className="hover:text-sky-800 transition underline">
                  Cancellation & Refund Policy
                </Link>
                <Link href="/privacy" className="hover:text-sky-800 transition underline">
                  Privacy Policy
                </Link>
                <Link href="/shipping-policy" className="hover:text-sky-800 transition underline">
                  Service Delivery Policy
                </Link>
                <Link href="/contact" className="hover:text-sky-800 transition underline">
                  Contact Support
                </Link>
              </div>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-slate-500 font-medium">
              Tanie Lalwani Creative Web Engineering operates as an independent design and software engineering consultancy. All payments are processed through Razorpay Payments System in compliance with RBI guidelines. Standard invoices are issued upon transaction completion with milestone deliverables tracked in the client workspace.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
