import { motion } from "framer-motion"
import type { CSSProperties } from "react"
import PageHeader from "../components/PageHeader"

const GLASS_PANEL: CSSProperties = {
  background: "linear-gradient(155deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 100%)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -16px 28px rgba(148,163,184,0.12), 0 28px 80px rgba(2,6,23,0.54)",
  backdropFilter: "blur(24px) saturate(118%)",
  WebkitBackdropFilter: "blur(24px) saturate(118%)",
}

const GLASS_RIM: CSSProperties = {
  background: "linear-gradient(130deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.14) 18%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.12) 100%)",
  opacity: 0.56,
}

const projects = [
  {
    client: "Brightlane",
    role: "Founder testimonial",
    project: "SaaS Dashboard Redesign",
    site: "https://brightlane.example",
    outcome: "Onboarding clarity, cleaner information density, faster user trust.",
  },
  {
    client: "FinchPay",
    role: "Product team testimonial",
    project: "Checkout Performance Overhaul",
    site: "https://finchpay.example",
    outcome: "Smoother payment flow, lower friction, stronger conversion momentum.",
  },
  {
    client: "Leafline",
    role: "CTO testimonial",
    project: "Marketing Site Rebuild",
    site: "https://leafline.example",
    outcome: "Sharper storytelling, premium feel, and improved speed perception.",
  },
]

export default function Projects() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16">
      <PageHeader
        eyebrow="Client Work"
        title="Video testimonials and the sites behind them"
        description="Each project card is built to hold a client video testimonial on top, with the live website and outcome summary directly underneath."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {projects.map((item, index) => (
          <motion.article
            key={item.client + item.project}
            className="relative overflow-hidden rounded-[1.75rem] p-4 sm:p-5"
            style={GLASS_PANEL}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <div className="pointer-events-none absolute inset-0" style={GLASS_RIM} />
            <div className="relative">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/80">
                <div className="aspect-video bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(160deg,#0f172a_0%,#030712_56%,#020617_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(2,6,23,0.78)_100%)]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300 backdrop-blur-sm">
                  Drop testimonial video here
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-white">{item.client}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{item.role}</p>
                  </div>
                  <div className="rounded-full border border-white/14 bg-white/6 px-3 py-1 text-[11px] font-medium text-slate-200">
                    {item.project}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm leading-relaxed text-slate-300">{item.outcome}</p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Website</p>
                    <a
                      href={item.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex text-sm font-medium text-slate-100 transition hover:text-white"
                    >
                      {item.site.replace("https://", "")}
                    </a>
                  </div>
                  <a
                    href={item.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/6 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                  >
                    Visit Site
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/4 p-5 text-sm text-slate-400 backdrop-blur-sm sm:p-6"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45 }}
      >
        Replace the placeholder video area with each client’s actual testimonial video, and swap the example URLs with your live projects. The structure is already set up for that workflow.
      </motion.div>
    </section>
  )
}
