import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Delivery Policy | Tanie Lalwani",
  description: "Digital service fulfillment and deliverable handover timelines.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#04111b] text-slate-100 selection:bg-sky-500/30 selection:text-white">
      <Navbar phase="default" />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 mb-4">
            Fulfillment & Delivery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Digital Service & Delivery Policy
          </h1>
          <p className="text-xs text-slate-400 mb-8 pb-4 border-b border-white/10">
            Last Updated: September 11, 2026
          </p>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Nature of Delivery (Digital Only)</h2>
              <p>
                All services offered by <strong>Tanie Lalwani</strong> (including UI/UX Design, 3D WebGL Web Experiences, and Full-Stack Next.js Applications) are <strong>100% digital</strong>. No physical goods or packages are shipped.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Delivery Methods & Channels</h2>
              <p>
                Project deliverables are handed over through secure digital channels:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-300">
                <li><strong>Live Staging Links:</strong> Preview deployments hosted on Vercel or custom subdomains.</li>
                <li><strong>Source Code Repositories:</strong> Private GitHub repository access or archived code repositories.</li>
                <li><strong>Design Tokens & UI Kits:</strong> Figma workspace invites and exported SVG/GLB assets.</li>
                <li><strong>Client Hub:</strong> Real-time asset vault and digital signed agreements within the Client Workspace.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Delivery Timelines</h2>
              <p>
                Delivery schedules depend on the chosen package and scope:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300">
                <li><strong>High-Converting Luxury Landing Page:</strong> 1 to 2 Weeks.</li>
                <li><strong>3D Interactive & Brand Experience:</strong> 3 to 5 Weeks.</li>
                <li><strong>Full-Stack Web App / SaaS MVP:</strong> 4 to 6 Weeks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Confirmation & Invoices</h2>
              <p>
                Upon payment confirmation via Razorpay, instant automated email confirmations are issued with access credentials to your dedicated Client Workspace.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Delivery Inquiries</h2>
              <p>
                For timeline updates or handover queries, contact:{" "}
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
            <Link href="/privacy" className="text-slate-400 hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
