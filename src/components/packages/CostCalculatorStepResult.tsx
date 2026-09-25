"use client";

import { FEATURE_BUNDLES, WEBSITE_GOALS } from "./calculatorData";
import MarketRegionSelector from "@/components/ui/MarketRegionSelector";

interface CostCalculatorStepResultProps {
  locale: string;
  t: any;
  goToStep: (step: number) => void;
  isUnlocked: boolean;
  setIsUnlocked?: (val: boolean) => void;
  authLoading?: boolean;
  authError: string;
  setAuthError: (val: string) => void;
  isAuthSubmitting: boolean;
  setIsAuthSubmitting: (val: boolean) => void;
  authMode: "signup" | "signin";
  setAuthMode: (mode: "signup" | "signin") => void;
  authName: string;
  setAuthName: (name: string) => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authPassword: string;
  setAuthPassword: (pwd: string) => void;
  businessName: string;
  socialAccount: string;
  timeline: string;
  budgetTier: string;
  tierConfig: any;
  calculation: any;
  selectedBundles: string[];
  selectedGoal: string;
  selectedGoals?: string[];
  currency: "USD" | "INR";
  signInWithGoogle: (redirectTo?: string) => Promise<any>;
  dispatchLeadCapture: (params: any) => Promise<any>;
  saveLeadProfile: (profile: any) => void;
  onProceedWithCustomQuote?: (quoteData: any) => void;
  handleWhatsAppQuote: () => void;
  handleUnlockSubmit: (e: React.FormEvent) => void;
}

export default function CostCalculatorStepResult({
  locale,
  t,
  goToStep,
  isUnlocked,
  setIsUnlocked,
  authLoading,
  authError,
  setAuthError,
  isAuthSubmitting,
  setIsAuthSubmitting,
  authMode,
  setAuthMode,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  businessName,
  socialAccount,
  timeline,
  budgetTier,
  tierConfig,
  calculation,
  selectedBundles,
  selectedGoal,
  selectedGoals,
  currency,
  signInWithGoogle,
  dispatchLeadCapture,
  saveLeadProfile,
  onProceedWithCustomQuote,
  handleWhatsAppQuote,
  handleUnlockSubmit,
}: CostCalculatorStepResultProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToStep(3)}
          className="px-5 py-2 rounded-full border border-sky-300 text-[#0a192f] font-bold text-xs hover:bg-white transition cursor-pointer flex items-center gap-1.5"
        >
          <span>←</span>
          <span>{locale === "ur" ? "بجٹ اور وقت تبدیل کریں" : "Adjust Scope & Budget"}</span>
        </button>
      </div>

      {authLoading ? (
        <div className="rounded-3xl bg-[#c8ecff]/30 border border-sky-300/90 p-12 text-center backdrop-blur-md flex flex-col items-center justify-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
          <span className="text-xs font-bold text-sky-900">Verifying session...</span>
        </div>
      ) : !isUnlocked ? (
        /* ================= LOCKED RESULT GATE ================= */
        <div className="relative rounded-3xl bg-[#c8ecff]/30 border border-sky-300/90 p-6 sm:p-10 shadow-lg text-center overflow-hidden backdrop-blur-md">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-[#0a192f] text-2xl mb-4 border border-sky-200">
            🔒
          </div>

          <h3 className="text-2xl font-black !text-[#0a192f]">{t.funnel.unlockTitle}</h3>
          <p className="text-xs text-sky-950/80 max-w-md mx-auto mt-2 mb-6 leading-relaxed font-medium">
            {t.funnel.unlockSubtitle}
          </p>

          {authError && (
            <div className="max-w-md mx-auto mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {authError}
            </div>
          )}

          <div className="max-w-md mx-auto">
            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={isAuthSubmitting}
              onClick={async () => {
                setAuthError("");
                setIsAuthSubmitting(true);
                try {
                  const target = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/pricing";
                  await signInWithGoogle(target);
                } catch (err: any) {
                  setAuthError(err.message || "Failed to sign in with Google");
                  setIsAuthSubmitting(false);
                }
              }}
              className="w-full py-3 px-4 rounded-full bg-white hover:bg-slate-50 text-[#0a192f] border border-sky-300 font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer mb-3.5 disabled:opacity-60"
            >
              {isAuthSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {locale === "ur"
                  ? "Google / Gmail کے ساتھ جاری رکھیں"
                  : locale === "hi"
                  ? "Google / Gmail के साथ जारी रखें"
                  : locale === "es"
                  ? "Continuar con Google / Gmail"
                  : locale === "fr"
                  ? "Continuer avec Google / Gmail"
                  : locale === "ja"
                  ? "Google / Gmail で続行"
                  : locale === "zh"
                  ? "通过 Google / Gmail 继续"
                  : "Continue with Google / Gmail"}
              </span>
            </>
          )}
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-sky-200 flex-1" />
              <span className="text-[11px] text-sky-900/60 font-semibold uppercase tracking-wider">
                {locale === "ur" ? "یا ای میل کے ساتھ" : "or with email"}
              </span>
              <div className="h-px bg-sky-200 flex-1" />
            </div>

            <form
              onSubmit={handleUnlockSubmit}
              className="space-y-3.5 text-left"
              autoComplete="on"
            >
              {authMode === "signup" && (
                <div>
                  <label
                    htmlFor="calc_auth_name"
                    className="block text-xs font-bold !text-[#0a192f] mb-1"
                  >
                    {t.funnel.nameLabel}
                  </label>
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
                <label
                  htmlFor="calc_auth_email"
                  className="block text-xs font-bold !text-[#0a192f] mb-1"
                >
                  {t.funnel.emailLabel}
                </label>
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
                <label
                  htmlFor="calc_auth_password"
                  className="block text-xs font-bold !text-[#0a192f] mb-1"
                >
                  {t.funnel.passwordLabel}
                </label>
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
                  ? locale === "ur"
                    ? "حساب لگایا جا رہا ہے..."
                    : "Calculating & Unlocking..."
                  : authMode === "signup"
                  ? t.funnel.unlockBtn
                  : t.funnel.signinTab}
              </button>
            </form>
          </div>

          <div className="mt-4 text-xs text-sky-950/80">
            {authMode === "signup" ? (
              <>
                {locale === "ur" ? "پہلے سے اکاؤنٹ ہے؟ " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="text-sky-700 hover:underline font-black cursor-pointer"
                >
                  {t.funnel.signinTab}
                </button>
              </>
            ) : (
              <>
                {locale === "ur" ? "نیا کلائنٹ؟ " : "New client? "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="text-sky-700 hover:underline font-black cursor-pointer"
                >
                  {t.funnel.signupTab}
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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-950 text-xs font-bold border border-sky-200">
                  ✓ {businessName || (locale === "ur" ? "آپ کا پروجیکٹ" : "Your Project")}
                </span>
                <MarketRegionSelector />
              </div>
              <h3 className="text-2xl font-black !text-[#0a192f]">{t.funnel.totalInvestment}</h3>
              <p className="text-xs text-sky-950/80 mt-1 font-medium">
                {locale === "ur"
                  ? `مدت: ${timeline} • بجٹ: ${budgetTier}`
                  : `Timeline: ${timeline} • Budget: ${budgetTier}`}
              </p>
            </div>

            <div className="text-center md:text-right">
              <div className="text-4xl sm:text-5xl font-black !text-[#0a192f] tracking-tight">
                {tierConfig.currencySymbol}
                {calculation.finalTotalMarket.toLocaleString()} {tierConfig.currencyCode}
              </div>
            </div>
          </div>

          {/* ITEMISED BREAKDOWN */}
          <div className="p-6 rounded-2xl bg-[#c8ecff]/25 border border-sky-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-800">
              {locale === "ur"
                ? `شامل ماڈیولز (${calculation.bundleCount})`
                : `Included Scope Modules (${calculation.bundleCount})`}
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
                        <span className="text-sky-800/80 hidden sm:inline ml-2 font-medium">
                          • {bundle.tagline}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-sky-900 shrink-0">
                      {locale === "ur" ? "اسکوپ میں شامل" : "Included in Scope"}
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
                  const goalTitle =
                    selectedGoals && selectedGoals.length > 0
                      ? selectedGoals
                          .map((id) => WEBSITE_GOALS.find((g) => g.id === id)?.title)
                          .filter(Boolean)
                          .join(" + ")
                      : WEBSITE_GOALS.find((g) => g.id === selectedGoal)?.title || selectedGoal;
                  let likedList: string[] = [];
                  if (typeof window !== "undefined") {
                    try {
                      const raw = localStorage.getItem("tanie_liked_aesthetics");
                      if (raw) likedList = JSON.parse(raw);
                    } catch {}
                  }
                  onProceedWithCustomQuote({
                    projectName: businessName,
                    socialAccount: socialAccount.trim() || undefined,
                    goal: goalTitle,
                    industry: goalTitle,
                    selectedBundles,
                    bundles: selectedBundles
                      .map((id) => FEATURE_BUNDLES.find((b) => b.id === id))
                      .filter(Boolean),
                    finalTotalInr: calculation.finalTotalInr,
                    finalTotalUsd: calculation.finalTotalUsd,
                    currency,
                    timeline,
                    budgetTier,
                    likedAesthetics: likedList,
                  });
                }
              }}
              className="py-3.5 px-6 rounded-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center cursor-pointer"
            >
              {t.funnel.proceedBooking}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppQuote}
              className="py-3.5 px-6 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>💬</span>
              <span>{t.funnel.whatsappShare}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
