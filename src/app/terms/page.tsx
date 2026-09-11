import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | Tanie Lalwani",
  description: "Terms of service and client engagement agreement for design and software development services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 mb-4">
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-white/10">
            Last Updated: September 11, 2026
          </p>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Overview & Service Scope</h2>
              <p>
                These Terms and Conditions govern the provision of digital creative engineering, UI/UX design, 3D WebGL development, and full-stack software development services provided by <strong>Tanie Lalwani</strong> (&quot;Developer&quot;, &quot;Studio&quot;) to clients (&quot;Client&quot;). By engaging our services, booking a package, or submitting a payment via Razorpay, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Engagement & Project Sprints</h2>
              <p>
                Each project engagement is initiated upon agreement of project milestones, deliverables, and payment of the designated retainer deposit. Milestones and scope requirements are tracked transparently via the Client Workspace.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Payment Terms & Razorpay Processing</h2>
              <p>
                All payments, deposits, and retainers are processed securely through <strong>Razorpay Payments</strong>. Payment schedules typically consist of a 50% upfront retainer deposit upon contract execution, and the remaining 50% upon final staging review prior to domain DNS cutover or source repository transfer.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Intellectual Property Rights</h2>
              <p>
                Upon receipt of full payment for all agreed milestones, all bespoke source code, visual assets, 3D models, and Figma design tokens created exclusively for the Client shall be fully transferred to the Client. The Developer retains the right to display non-confidential project media in professional portfolios.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Warranty & Post-Launch Support</h2>
              <p>
                All completed projects include a standard <strong>30-day post-launch hypercare warranty</strong> covering bug fixes, browser rendering adjustments, and performance stabilization at no additional fee.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Contact & Legal Inquiries</h2>
              <p>
                For questions regarding agreements or invoices, contact us at:{" "}
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
            <Link href="/refund-policy" className="text-slate-400 hover:text-white transition">
              Refund Policy
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white transition">
              Privacy Policy
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
