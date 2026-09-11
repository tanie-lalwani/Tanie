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
    <div className="min-h-screen bg-[#dff4ff] text-slate-900 font-sans selection:bg-sky-200 selection:text-black">
      <Navbar phase="default" />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.2rem] border border-sky-300/70 bg-white/95 p-8 sm:p-12 backdrop-blur-xl shadow-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/80 bg-sky-100/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-950 mb-4">
            Fulfillment & Delivery
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-2">
            Digital Service & Delivery Policy
          </h1>
          <p className="text-xs font-semibold text-slate-500 mb-8 pb-4 border-b border-sky-100">
            Last Updated: September 11, 2026
          </p>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">1. Nature of Delivery (Digital Only)</h2>
              <p>
                All services offered by <strong>Tanie Lalwani</strong> (including UI/UX Design, 3D WebGL Web Experiences, and Full-Stack Next.js Applications) are <strong>100% digital</strong>. No physical goods or packages are shipped.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">2. Delivery Methods & Channels</h2>
              <p>
                Project deliverables are handed over through secure digital channels:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-700">
                <li><strong>Live Staging Links:</strong> Preview deployments hosted on Vercel or custom subdomains.</li>
                <li><strong>Source Code Repositories:</strong> Private GitHub repository access or archived code repositories.</li>
                <li><strong>Design Tokens & UI Kits:</strong> Figma workspace invites and exported SVG/GLB assets.</li>
                <li><strong>Client Hub:</strong> Real-time asset vault and digital signed agreements within the Client Workspace.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">3. Delivery Timelines</h2>
              <p>
                Delivery schedules depend on the chosen package and scope:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-700">
                <li><strong>High-Converting Luxury Landing Page:</strong> 1 to 2 Weeks.</li>
                <li><strong>3D Interactive & Brand Experience:</strong> 3 to 5 Weeks.</li>
                <li><strong>Full-Stack Web App / SaaS MVP:</strong> 4 to 6 Weeks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">4. Client Review & Sign-Off</h2>
              <p>
                Upon staging deployment, clients are granted a 7-day review window to test, provide feedback, and submit change requests via the Client Hub before final production launch.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-950 mb-2">5. Delivery Inquiries</h2>
              <p>
                For questions regarding deliverable timelines, contact us at:{" "}
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
            <Link href="/privacy" className="hover:underline">
              Privacy Policy →
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
