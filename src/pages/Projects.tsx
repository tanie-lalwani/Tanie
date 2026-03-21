import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import PageHeader from "../components/PageHeader"

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
    <section className="mx-auto w-full max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pb-10 sm:pt-12">
      <PageHeader
        eyebrow="What I Have Built"
        title=""
        description=""
      />

      <div className="relative">

        <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/8 pb-2.5 sm:mb-4 sm:pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goToPrev}
              className="rounded-md border border-white/18 bg-white/7 px-2.5 py-1 text-[11px] font-semibold text-slate-100 transition hover:bg-white/12"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="rounded-md border border-white/18 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>

        <div className="relative min-h-64">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeProject.client + activeProject.project}
              className="relative"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg border border-white/14 bg-slate-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                  <div className="aspect-16/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(160deg,#0f172a_0%,#030712_56%,#020617_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(2,6,23,0.76)_100%)]" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-col items-start justify-between gap-1.5 sm:bottom-3 sm:left-3 sm:right-3 sm:flex-row sm:items-end sm:gap-2.5">
                    <div>
                      <p className="text-sm font-semibold text-white">{activeProject.client}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">{activeProject.role}</p>
                    </div>
                    <div className="rounded-full border border-white/18 bg-white/10 px-2.5 py-0.5 text-[9px] font-medium text-slate-200 backdrop-blur-sm sm:text-[10px]">
                      {activeProject.project}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <blockquote className="border-l border-white/14 pl-2 text-[13px] italic leading-snug text-slate-300">
                    &quot;{activeProject.quote}&quot;
                  </blockquote>
                  <p className="mt-1.5 text-[12px] leading-snug text-slate-400">{activeProject.outcome}</p>

                  <div className="mt-2.5 flex flex-col gap-1.5 border-t border-white/8 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Live website</p>
                      <a
                        href={activeProject.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex text-[11px] font-medium text-slate-100 transition hover:text-white"
                      >
                        {activeProject.site.replace("https://", "")}
                      </a>
                    </div>
                    <a
                      href={activeProject.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-900 transition hover:bg-slate-200 sm:w-auto"
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
