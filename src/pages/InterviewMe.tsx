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
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <section
      ref={scrollContainerRef}
      className="relative h-svh w-full overflow-y-auto bg-black [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:y_mandatory]"
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_14%,rgba(14,116,144,0.14),transparent_42%),radial-gradient(ellipse_at_84%_76%,rgba(56,189,248,0.1),transparent_40%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-size-[54px_54px] bg-[linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] opacity-[0.05]" />

      <div className="pointer-events-none sticky top-3 z-20 flex justify-end px-3 sm:top-4 sm:px-6">
        <div className="rounded-full border border-cyan-200/26 bg-cyan-100/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur-sm">
          {String(activeQuestion).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
        </div>
      </div>

      <motion.article
        className="flex h-svh w-full snap-start items-center justify-center px-3 pb-6 pt-4 sm:px-6 sm:py-6"
        initial={lowPowerMode ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.992 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ root: scrollContainerRef, amount: 0.7 }}
        transition={{ duration: lowPowerMode ? 0.18 : 0.38, ease: lowPowerMode ? "linear" : smoothEase }}
      >
        <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-100/22 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.68)] backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_32%,rgba(255,255,255,0)_56%)]" />
          <div className="pointer-events-none absolute -right-8 -top-14 h-40 w-40 rounded-full bg-cyan-300/16 blur-3xl" />
          <div className="relative">
            <p className="inline-flex rounded-full border border-cyan-100/26 bg-cyan-100/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Interview Deck
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Quick interview reel
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Scroll through short prompts and concise video answers.
            </p>
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
              ? { duration: 0.2, ease: "linear" }
              : { type: "spring", stiffness: 150, damping: 26, mass: 0.86 }
          }
          onViewportEnter={() => setActiveQuestion(index + 1)}
        >
          <motion.div
            className="relative aspect-9/16 w-full max-w-76.75 overflow-hidden rounded-2xl border border-cyan-100/24 bg-slate-900 shadow-[0_20px_70px_rgba(0,0,0,0.72)] sm:max-w-86 sm:shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
            whileHover={lowPowerMode ? undefined : { scale: 1.012, y: -2 }}
            transition={lowPowerMode ? { duration: 0.15 } : { type: "spring", stiffness: 190, damping: 24 }}
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
                transition={{ duration: lowPowerMode ? 0.16 : 0.32, delay: lowPowerMode ? 0 : 0.05, ease: lowPowerMode ? "linear" : smoothEase }}
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
