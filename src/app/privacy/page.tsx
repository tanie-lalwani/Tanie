import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Tanie Lalwani",
  description: "Privacy policy regarding user data handling, Supabase authentication, and Razorpay payment transactions.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 mb-4">
            Data Privacy & Security
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-white/10">
            Last Updated: September 11, 2026
          </p>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
              <p>
                We collect personal information provided directly by you when inquiring about website packages, registering for the Client Workspace, or completing a payment through Razorpay. This includes your name, email address, company name, project brief, and contact telephone number.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Payment Security & Razorpay</h2>
              <p>
                We do NOT store credit card numbers, CVVs, or bank account PINs on our servers. All financial transactions and payment data are encrypted and handled directly by <strong>Razorpay Payments System</strong>, which is PCI-DSS Level 1 compliant and adheres to all Reserve Bank of India (RBI) security protocols.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. How We Use Your Information</h2>
              <p>
                Your information is used strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300">
                <li>Provide design and software development deliverables.</li>
                <li>Manage project milestones, feedback, and staging links in the Client Workspace.</li>
                <li>Issue transaction receipts, invoices, and project agreements.</li>
                <li>Communicate progress updates regarding your website build.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Third-Party Services</h2>
              <p>
                We utilize trusted infrastructure providers including Supabase (secure database & authentication), Vercel (edge hosting), and Razorpay (payment processing). We never sell, rent, or trade your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Contact Us</h2>
              <p>
                If you have questions about your privacy or wish to request data deletion, contact us at:{" "}
                <a href="mailto:wordsofvoice2210@gmail.com" className="text-sky-400 underline">
                  wordsofvoice2210@gmail.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-xs">
            <Link href="/paywall" className="text-sky-400 hover:underline">
              ← Back to Paywall
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="text-slate-400 hover:text-white transition">
              Refund Policy
            </Link>
            <Link href="/shipping-policy" className="text-slate-400 hover:text-white transition">
              Delivery Policy
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
