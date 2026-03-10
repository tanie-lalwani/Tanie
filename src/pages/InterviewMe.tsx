import { motion } from "framer-motion"
import { useRef } from "react"

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

  return (
    <section
      ref={scrollContainerRef}
      className="h-screen w-full overflow-y-auto bg-black [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:y_mandatory]"
    >
      {questions.map((question, index) => (
        <motion.article
          key={question}
          className="flex h-screen w-full snap-start items-center justify-center px-3 py-6 sm:px-6"
          initial={{ opacity: 0.42, scale: 0.985, filter: "blur(2px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ root: scrollContainerRef, amount: 0.72 }}
          transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.8 }}
        >
          <motion.div
            className="relative aspect-9/16 w-full max-w-107.5 overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
            whileHover={{ scale: 1.015 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(160deg,#1f2937_0%,#111827_38%,#020617_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_58%,rgba(0,0,0,0.78)_100%)]" />

            <div className="absolute left-4 top-4 rounded-md border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200">
              Interview Reel {index + 1}
            </div>

            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur">
                Video Placeholder
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <motion.p
                className="text-base font-semibold text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)] sm:text-lg"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollContainerRef, amount: 0.82 }}
                transition={{ duration: 0.35, delay: 0.06 }}
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
