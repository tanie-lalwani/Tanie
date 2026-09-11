import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation and Refund Policy | Tanie Lalwani",
  description: "Cancellation, milestone refund policy, and dispute resolution guidelines.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 mb-4">
            Compliance & Consumer Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-white/10">
            Last Updated: September 11, 2026
          </p>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Nature of Digital Services</h2>
              <p>
                Tanie Lalwani provides custom digital services, including UI/UX design, custom software engineering, WebGL 3D development, and website consulting. Because our services involve dedicated time and engineering labor, refunds are handled on a transparent milestone-based schedule.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Cancellation Prior to Sprint Start</h2>
              <p>
                If a Client requests cancellation within <strong>48 hours</strong> of paying a retainer deposit and prior to the commencement of any design discovery or wireframing work, a <strong>100% full refund</strong> (minus third-party payment gateway transaction fees) will be promptly issued.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Milestone-Based Refunds</h2>
              <p>
                Once discovery and engineering work has commenced:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-300">
                <li><strong>Discovery & Wireframing Stage:</strong> 50% of the initial deposit is refundable if work does not meet the agreed brief.</li>
                <li><strong>Development / Staging Phase:</strong> Once code has been written and staged, the initial sprint deposit is non-refundable, but no further milestone fees will be billed if the project is discontinued.</li>
                <li><strong>Completed Projects:</strong> Fees for fully completed and handed-over deliverables are non-refundable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Refund Processing Time</h2>
              <p>
                Approved refunds are processed through <strong>Razorpay</strong> directly to the original payment method (Credit/Debit Card, NetBanking, UPI, or Wallet) within <strong>5 to 7 business days</strong> in accordance with standard banking processing timelines.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. How to Request a Cancellation or Refund</h2>
              <p>
                To request a project cancellation or refund, email us with your project title and Razorpay Payment ID at:{" "}
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
