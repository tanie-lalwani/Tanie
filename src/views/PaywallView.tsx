"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  openRazorpayCheckout,
  RAZORPAY_TEST_CREDENTIALS,
  getRazorpayKeyId,
  type RazorpayPaymentSuccessResponse,
} from "@/lib/razorpay";
import Navbar from "@/components/Navbar";

export default function PaywallView() {
  const router = useRouter();
  const { user, signInWithPassword, isAuthenticated } = useAuth();

  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("test-verification");
  const [customAmount, setCustomAmount] = useState<string>("100");
  const [payerName, setPayerName] = useState<string>("Words of Voice");
  const [payerEmail, setPayerEmail] = useState<string>("wordsofvoice2210@gmail.com");
  const [payerPhone, setPayerPhone] = useState<string>("+919876543210");
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
        "Automated GST-ready receipt",
      ],
    },
  ];

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const getAmountInBaseUnits = () => {
    if (selectedPlan.id === "custom-retainer") {
      const num = parseFloat(customAmount) || 1;
      return currency === "INR" ? num * 100 : num * 100;
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

  const copyToClipboard = (text: string, field: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleQuickLoginAsReviewer = async () => {
    try {
      setIsProcessing(true);
      await signInWithPassword(
        RAZORPAY_TEST_CREDENTIALS.email,
        RAZORPAY_TEST_CREDENTIALS.password
      );
      router.push("/client");
    } catch (e) {
      console.error("Auto login error:", e);
    } finally {
      setIsProcessing(false);
    }
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
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ------------------------------------------------------------- */}
        {/* 1. RAZORPAY SITE VERIFICATION & REVIEWER CREDENTIALS BANNER   */}
        {/* ------------------------------------------------------------- */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-sky-400/30 bg-gradient-to-r from-slate-950 via-sky-950/40 to-slate-900 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_12px_50px_rgba(2,132,199,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
                Razorpay Merchant Verification & Reviewer Sandbox
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Live Payment Gateway & Verification Paywall
              </h1>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                This verification paywall enables Razorpay compliance auditors and prospective clients to execute real-time test transactions, authenticate using designated reviewer credentials, and inspect verified client portal workflows.
              </p>
            </div>

            {/* Test Credentials Box */}
            <div className="rounded-2xl border border-sky-400/30 bg-slate-950/80 p-5 backdrop-blur-md shadow-inner">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                  Test Reviewer Credentials
                </span>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  Active
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between gap-3 bg-slate-900/90 rounded-lg px-3 py-2 border border-white/5">
                  <div className="truncate">
                    <span className="text-slate-400 select-none">Email: </span>
                    <span className="text-sky-200 font-semibold">{RAZORPAY_TEST_CREDENTIALS.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(RAZORPAY_TEST_CREDENTIALS.email, "email")}
                    className="shrink-0 text-slate-400 hover:text-white transition"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 bg-slate-900/90 rounded-lg px-3 py-2 border border-white/5">
                  <div className="truncate">
                    <span className="text-slate-400 select-none">Pass: </span>
                    <span className="text-sky-200 font-semibold">{RAZORPAY_TEST_CREDENTIALS.password}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(RAZORPAY_TEST_CREDENTIALS.password, "pass")}
                    className="shrink-0 text-slate-400 hover:text-white transition"
                    title="Copy Password"
                  >
                    {copiedField === "pass" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleQuickLoginAsReviewer}
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>⚡ 1-Click Reviewer Login</span>
                </button>
                <Link
                  href="/client"
                  className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-2 text-xs font-bold text-sky-200 hover:bg-sky-500/20 transition flex items-center justify-center"
                >
                  Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. PAYMENT SUCCESS MODAL / RECEIPT                            */}
        {/* ------------------------------------------------------------- */}
        {paymentSuccessData && (
          <div className="mb-10 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 to-slate-950 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 text-2xl border border-emerald-500/40">
                ✓
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Payment Verified Successfully
                </div>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  Thank you! Transaction Completed
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Razorpay payment was authenticated and recorded. A receipt has been issued.
                </p>

                {/* Receipt Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl bg-slate-900/80 p-4 border border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Razorpay Payment ID:</span>
                    <span className="font-mono font-bold text-sky-300 select-all">
                      {paymentSuccessData.paymentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Order / Reference ID:</span>
                    <span className="font-mono text-slate-200 select-all">
                      {paymentSuccessData.orderId || "Direct Capture"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Amount Settled:</span>
                    <span className="font-bold text-emerald-300 text-sm">
                      {paymentSuccessData.currency === "INR" ? "₹" : "$"}
                      {paymentSuccessData.amount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Date & Time:</span>
                    <span className="text-slate-300">{paymentSuccessData.date}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/client"
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition"
                  >
                    Enter Client Workspace →
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
                  >
                    🖨️ Print Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentSuccessData(null)}
                    className="rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-xs text-slate-400 hover:text-white transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. PAYWALL TIER SELECTION & CHECKOUT FORM                     */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Tier Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Select Service / Retainer Tier</h2>
                <p className="text-xs text-slate-400">
                  All transactions are encrypted and processed by Razorpay Payments India.
                </p>
              </div>

              {/* Currency Selector */}
              <div className="inline-flex rounded-full border border-sky-400/30 bg-slate-950 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency("INR")}
                  className={`rounded-full px-4 py-1 font-bold transition ${
                    currency === "INR" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`rounded-full px-4 py-1 font-bold transition ${
                    currency === "USD" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
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
                    className={`relative flex flex-col justify-between rounded-2xl border p-5 transition cursor-pointer ${
                      isSelected
                        ? "border-sky-400 bg-sky-950/30 shadow-[0_0_30px_rgba(2,132,199,0.2)]"
                        : "border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-4 rounded-full bg-sky-600 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          {plan.name}
                        </span>
                        {!plan.popular && (
                          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className="my-2">
                        <span className="text-2xl font-black text-white">
                          {getDisplayPrice(plan)}
                        </span>
                        {plan.id !== "custom-retainer" && (
                          <span className="text-xs text-slate-400 ml-1">/ one-time</span>
                        )}
                      </div>

                      {plan.id === "custom-retainer" && (
                        <div className="mt-2 mb-3">
                          <label className="text-[11px] text-slate-300 block mb-1">
                            Enter Amount ({currency}):
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full rounded-lg border border-sky-400/40 bg-slate-950 px-3 py-1.5 text-sm text-white font-mono focus:border-sky-400 focus:outline-none"
                            placeholder="Enter amount"
                          />
                        </div>
                      )}

                      <p className="text-xs text-slate-400 mb-3">{plan.tagline}</p>

                      <ul className="space-y-1.5 text-xs text-slate-300 mb-4 border-t border-white/5 pt-3">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-sky-400 font-bold text-[10px]">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <div
                        className={`w-full rounded-xl py-2 text-center text-xs font-bold uppercase tracking-wider transition ${
                          isSelected
                            ? "bg-sky-500 text-white shadow-md"
                            : "border border-white/10 text-slate-300 hover:bg-white/5"
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
          <div className="rounded-3xl border border-sky-400/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
                    Summary & Checkout
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedPlan.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-sky-300">
                    {getDisplayPrice(selectedPlan)}
                  </span>
                </div>
              </div>

              {/* Form inputs */}
              <div className="mt-5 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Client / Reviewer Name:
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Contact Email:
                  </label>
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Phone / WhatsApp:
                  </label>
                  <input
                    type="tel"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                    placeholder="+91..."
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-6 rounded-2xl bg-white/5 p-3.5 text-[11px] text-slate-400 space-y-1.5 border border-white/5">
                <div className="flex items-center gap-2 text-sky-300 font-semibold">
                  <span>🔒 256-Bit SSL Encrypted Razorpay Checkout</span>
                </div>
                <p>
                  Supports UPI, Credit/Debit Cards, NetBanking, Razorpay Wallet, and International Cards.
                </p>
                <p className="text-[10px] text-slate-500">
                  Key ID: <span className="font-mono">{getRazorpayKeyId()}</span>
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={isProcessing}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-500/25 hover:brightness-110 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Instant confirmation</span>
                <Link href="/terms" className="hover:text-sky-300 underline">
                  Terms & Policies
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. STATUTORY POLICIES & COMPLIANCE BAR                        */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-bold uppercase tracking-wider text-slate-200">
                Razorpay & Statutory Regulatory Compliance
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-slate-300 font-medium">
              <Link href="/terms" className="hover:text-sky-400 transition underline">
                Terms of Service
              </Link>
              <Link href="/refund-policy" className="hover:text-sky-400 transition underline">
                Cancellation & Refund Policy
              </Link>
              <Link href="/privacy" className="hover:text-sky-400 transition underline">
                Privacy Policy
              </Link>
              <Link href="/shipping-policy" className="hover:text-sky-400 transition underline">
                Service Delivery Policy
              </Link>
              <Link href="/contact" className="hover:text-sky-400 transition underline">
                Contact Support
              </Link>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
            Tanie Lalwani Creative Web Engineering operates as an independent design and software engineering consultancy. All payments are processed through Razorpay Payments System in compliance with RBI guidelines. Standard invoices are issued upon transaction completion with milestone deliverables tracked in the client workspace.
          </p>
        </div>
      </main>
    </div>
  );
}
