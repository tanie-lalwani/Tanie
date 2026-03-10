import { motion, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import { useIsMobile } from "../hooks/useIsMobile"

const questions = [
  "Tell me about yourself.",
  "Walk me through a project you are proud of.",
  "How do you handle bugs in production?",
  "Describe a time you disagreed with a teammate.",
  "How do you optimize frontend performance?",
  "Why do you want this role?",
]

export default function InterviewMe() {
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerMode = isMobile || shouldReduceMotion

  return (
    <section
      ref={scrollContainerRef}
      className="h-svh w-full overflow-y-auto bg-black [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:y_mandatory]"
    >
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
        >
          <motion.div
            className="relative aspect-9/16 w-full max-w-76.75 overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-[0_20px_70px_rgba(0,0,0,0.72)] sm:max-w-86 sm:shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
            whileHover={lowPowerMode ? undefined : { scale: 1.015 }}
            transition={lowPowerMode ? { duration: 0.2 } : { type: "spring", stiffness: 220, damping: 20 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(160deg,#1f2937_0%,#111827_38%,#020617_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_58%,rgba(0,0,0,0.78)_100%)]" />

            <div className="absolute left-3 top-3 rounded-md border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200 sm:left-4 sm:top-4">
              Interview Reel {index + 1}
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
