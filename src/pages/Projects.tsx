import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { CSSProperties } from "react"
import PageHeader from "../components/PageHeader"

const GLASS_PANEL: CSSProperties = {
  background: "linear-gradient(150deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.09) 34%, rgba(255,255,255,0.035) 100%)",
  border: "1px solid rgba(255,255,255,0.24)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -16px 30px rgba(148,163,184,0.12), 0 28px 84px rgba(2,6,23,0.56)",
  backdropFilter: "blur(30px) saturate(128%)",
  WebkitBackdropFilter: "blur(30px) saturate(128%)",
}

const GLASS_RIM: CSSProperties = {
  background: "linear-gradient(128deg, rgba(255,255,255,0.54) 0%, rgba(255,255,255,0.2) 17%, rgba(255,255,255,0.04) 44%, rgba(255,255,255,0.16) 100%)",
  opacity: 0.62,
}

const projects = [
  {
    client: "Brightlane",
    role: "Founder",
    project: "SaaS Dashboard Redesign",
    site: "https://brightlane.example",
    quote: "The product finally feels obvious to first-time users.",
    outcome: "Onboarding clarity improved and support friction dropped in early sessions.",
  },
  {
    client: "FinchPay",
    role: "Product Team",
    project: "Checkout Performance Overhaul",
    site: "https://finchpay.example",
    quote: "We saw a noticeable lift in successful completions after launch.",
    outcome: "Payment flow became clearer and completion quality improved across mobile.",
  },
  {
    client: "Leafline",
    role: "CTO",
    project: "Marketing Site Rebuild",
    site: "https://leafline.example",
    quote: "The new site tells the story in half the clicks.",
    outcome: "Storytelling sharpened with a cleaner path from landing to conversion.",
  },
]

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = projects[activeIndex]

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-14 sm:pt-16">
      <PageHeader
        eyebrow="What I Have Built"
        title="Client testimonials"
        description="Same proof and context, now navigated like a running strip that moves only when you choose."
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/26 bg-slate-950/44 p-3 backdrop-blur-md sm:rounded-3xl sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.03)_36%,rgba(255,255,255,0)_58%)]" />

        <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 sm:mb-5 sm:pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
            Strip {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrev}
              className="rounded-lg border border-white/20 bg-white/8 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/14"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="rounded-lg border border-white/20 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>

        <div className="relative min-h-112">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeProject.client + activeProject.project}
              className="relative overflow-hidden rounded-3xl p-3.5 sm:rounded-[1.75rem] sm:p-5"
              style={GLASS_PANEL}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pointer-events-none absolute inset-0" style={GLASS_RIM} />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.04)_34%,rgba(255,255,255,0)_60%)]" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-200/10 blur-3xl" />
              <div className="relative">
                <div className="relative overflow-hidden rounded-[1.35rem] border border-white/18 bg-slate-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  <div className="aspect-video bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(160deg,#0f172a_0%,#030712_56%,#020617_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(2,6,23,0.78)_100%)]" />
                  <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/14 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] sm:tracking-[0.22em]">
                    Drop testimonial video here
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start justify-between gap-2 sm:bottom-4 sm:left-4 sm:right-4 sm:flex-row sm:items-end sm:gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">{activeProject.client}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{activeProject.role}</p>
                    </div>
                    <div className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[10px] font-medium text-slate-100 backdrop-blur-sm sm:text-[11px]">
                      {activeProject.project}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <blockquote className="border-l border-white/16 pl-3 text-sm italic leading-relaxed text-slate-200">
                    &quot;{activeProject.quote}&quot;
                  </blockquote>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{activeProject.outcome}</p>

                  <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Live website</p>
                      <a
                        href={activeProject.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex text-sm font-medium text-slate-100 transition hover:text-white"
                      >
                        {activeProject.site.replace("https://", "")}
                      </a>
                    </div>
                    <a
                      href={activeProject.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-200 sm:w-auto"
                    >
                      Verify Project
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="relative mt-4 flex gap-2 sm:mt-5">
          {projects.map((item, index) => (
            <button
              key={item.client}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 flex-1 rounded-full transition ${
                index === activeIndex ? "bg-cyan-200/90" : "bg-white/18 hover:bg-white/32"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
