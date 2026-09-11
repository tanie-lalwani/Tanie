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
    <div className="min-h-screen bg-[#dff4ff] text-slate-900 font-sans selection:bg-sky-200 selection:text-black">
      <Navbar phase="default" />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.2rem] border border-sky-300/70 bg-white/95 p-8 sm:p-12 backdrop-blur-xl shadow-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-100/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-950 mb-4">
            Data Privacy & Security
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs font-semibold text-slate-500 mb-8 pb-4 border-b border-sky-100">
            Last Updated: September 11, 2026
          </p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">1. Information We Collect</h2>
              <p>
                We collect personal information provided directly by you when inquiring about website packages, registering for the Client Workspace, or completing a payment through Razorpay. This includes your name, email address, company name, project brief, and contact telephone number.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">2. Payment Security & Razorpay</h2>
              <p>
                We do NOT store credit card numbers, CVVs, or bank account PINs on our servers. All financial transactions and payment data are encrypted and handled directly by <strong>Razorpay Payments System</strong>, which is PCI-DSS Level 1 compliant and adheres to all Reserve Bank of India (RBI) security protocols.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">3. How We Use Your Information</h2>
              <p>
                Your information is used strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-700">
                <li>Provide design and software development deliverables.</li>
                <li>Manage project milestones, feedback, and staging links in the Client Workspace.</li>
                <li>Issue transaction receipts, invoices, and project agreements.</li>
                <li>Communicate progress updates regarding your website build.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">4. Third-Party Services</h2>
              <p>
                We utilize trusted infrastructure providers including Supabase (secure database & authentication), Vercel (edge hosting), and Razorpay (payment processing). We never sell, rent, or trade your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">5. Data Retention & User Rights</h2>
              <p>
                You have the right to request access to, correction of, or deletion of your personal account information from our systems at any time by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">6. Contact for Privacy Inquiries</h2>
              <p>
                If you have questions about our data protection practices, email us at:{" "}
                <a href="mailto:wordsofvoice2210@gmail.com" className="text-sky-700 font-bold underline">
                  wordsofvoice2210@gmail.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-sky-100 flex flex-wrap gap-4 text-xs font-bold text-sky-800">
            <Link href="/terms" className="hover:underline">
              Terms & Conditions →
            </Link>
            <Link href="/refund-policy" className="hover:underline">
              Cancellation & Refund Policy →
            </Link>
            <Link href="/shipping-policy" className="hover:underline">
              Service Delivery Policy →
            </Link>
            <Link href="/paywall" className="hover:underline">
              Paywall & Invoices →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
