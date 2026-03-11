import { motion, useReducedMotion } from "framer-motion"
import { useRef, useState } from "react"
import { useIsMobile } from "../hooks/useIsMobile"

const questions = [
  "Tell me about yourself.",
  "Walk me through a project you are proud of.",
  "How do you handle bugs in production?",
  "Describe a time you disagreed with a teammate.",
  "How do you optimize frontend performance?",
  "Why do you want this role?",
]

const totalQuestions = questions.length

export default function InterviewMe() {
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerMode = isMobile || shouldReduceMotion
  const [activeQuestion, setActiveQuestion] = useState(1)

  return (
    <section
      ref={scrollContainerRef}
      className="relative h-svh w-full overflow-y-auto bg-black [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:y_mandatory]"
    >
      <div className="pointer-events-none sticky top-3 z-20 flex justify-end px-3 sm:top-4 sm:px-6">
        <div className="rounded-full border border-white/18 bg-white/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 backdrop-blur-sm">
          {String(activeQuestion).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
        </div>
      </div>

      <motion.article
        className="flex h-svh w-full snap-start items-center justify-center px-3 pb-6 pt-4 sm:px-6 sm:py-6"
        initial={{ opacity: 0.75, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ root: scrollContainerRef, amount: 0.7 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.68)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_32%,rgba(255,255,255,0)_56%)]" />
          <div className="pointer-events-none absolute -right-8 -top-14 h-40 w-40 rounded-full bg-cyan-300/8 blur-3xl" />
          <div className="relative">
            <p className="inline-flex rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300">
              Interview Deck
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Quick interview reel
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Scroll to browse short prompt cards. Each card is meant to hold a direct, concise video answer so hiring teams can understand communication style, product thinking, and engineering depth quickly.
            </p>
            <ul className="mt-6 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
              <li className="rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2">Communication clarity</li>
              <li className="rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2">Execution and craft</li>
              <li className="rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2">Process and collaboration</li>
            </ul>
          </div>
        </div>
      </motion.article>

      {questions.map((question, index) => (
        <motion.article
          key={question}
          className="flex h-svh w-full snap-start items-center justify-center px-2 py-4 sm:px-6 sm:py-6"
          initial={{ opacity: 0.55, scale: lowPowerMode ? 0.995 : 0.985, filter: lowPowerMode ? "blur(0px)" : "blur(2px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ root: scrollContainerRef, amount: lowPowerMode ? 0.62 : 0.72 }}
          transition={
            lowPowerMode
              ? { duration: 0.25, ease: "easeOut" }
              : { type: "spring", stiffness: 170, damping: 24, mass: 0.8 }
          }
          onViewportEnter={() => setActiveQuestion(index + 1)}
        >
          <motion.div
            className="relative aspect-9/16 w-full max-w-76.75 overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-[0_20px_70px_rgba(0,0,0,0.72)] sm:max-w-86 sm:shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
            whileHover={lowPowerMode ? undefined : { scale: 1.015 }}
            transition={lowPowerMode ? { duration: 0.2 } : { type: "spring", stiffness: 220, damping: 20 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(160deg,#1f2937_0%,#111827_38%,#020617_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_58%,rgba(0,0,0,0.78)_100%)]" />

            <div className="absolute left-3 top-3 rounded-md border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200 sm:left-4 sm:top-4">
              Question {index + 1}
            </div>

            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-100 backdrop-blur sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
                Video Placeholder
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
              <motion.p
                className="text-sm font-semibold text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)] sm:text-lg"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollContainerRef, amount: 0.82 }}
                transition={{ duration: lowPowerMode ? 0.2 : 0.35, delay: lowPowerMode ? 0 : 0.06 }}
              >
                {question}
              </motion.p>
            </div>
          </motion.div>
        </motion.article>
      ))}
    </section>
  )
}
