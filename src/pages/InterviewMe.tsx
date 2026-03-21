import { motion, useReducedMotion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Lenis from "lenis"
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


export default function QnA() {
  const [showCta, setShowCta] = useState(false)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerMode = isMobile || shouldReduceMotion
  const [activeQuestion, setActiveQuestion] = useState(1)
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]
  const lenisRef = useRef<Lenis | null>(null)

  // Apply Lenis smooth scrolling
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!scrollContainerRef.current) return
    lenisRef.current?.destroy()
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current,
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    })
    lenisRef.current = lenis
    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }
    rafId = window.requestAnimationFrame(raf)
    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Show CTA only after last question is scrolled away
  useEffect(() => {
    if (activeQuestion > totalQuestions) setShowCta(true)
    else setShowCta(false)
  }, [activeQuestion, totalQuestions])

  return (
    <>
      {showCta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-2xl bg-blue-950 border border-sand-200/20 shadow-xl p-8 max-w-xs w-full text-center">
            <h2 className="text-lg font-bold text-white mb-2">Get in touch!</h2>
            <p className="text-white mb-4">Want to collaborate or have questions? Reach out via the contact form.</p>
            <a href="/#contact" className="inline-block rounded-lg bg-sand-200 px-4 py-2 font-semibold text-blue-950 hover:bg-sand-100 transition">Go to Contact Form</a>
            <button className="block mx-auto mt-4 text-xs text-white underline hover:text-sand-100" onClick={() => setShowCta(false)}>Close</button>
          </div>
        </div>
      )}
      <section
        ref={scrollContainerRef}
        className="relative h-svh w-full overflow-y-auto bg-blue-950 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-y snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_14%,rgba(30,64,175,0.10),transparent_42%),radial-gradient(ellipse_at_84%_76%,rgba(2,132,199,0.08),transparent_40%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-size-[54px_54px] bg-[linear-gradient(rgba(224,242,254,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(224,242,254,0.08)_1px,transparent_1px)] opacity-[0.05]" />

      <div className="pointer-events-none sticky top-3 z-20 flex justify-end px-3 sm:top-4 sm:px-6">
        <div className="rounded-full border border-sky-200/30 bg-sky-100/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100 backdrop-blur-sm">
          {String(activeQuestion).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
        </div>
      </div>

      {questions.map((question, index) => (
        <motion.article
          key={question}
          className="flex min-h-screen w-full snap-center items-center justify-center px-2 py-4 sm:px-4 sm:py-6"
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
            className="relative aspect-9/16 w-full max-w-76.75 overflow-hidden rounded-2xl border border-sky-100/20 bg-blue-950 shadow-[0_20px_70px_rgba(2,6,23,0.72)] sm:max-w-86 sm:shadow-[0_24px_80px_rgba(2,6,23,0.75)]"
            whileHover={lowPowerMode ? undefined : { scale: 1.012, y: -2 }}
            transition={lowPowerMode ? { duration: 0.15 } : { type: "spring", stiffness: 190, damping: 24 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(160deg,#1f2937_0%,#111827_38%,#020617_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_58%,rgba(0,0,0,0.78)_100%)]" />

            <div className="absolute left-3 top-3 rounded-md border border-sand-200/25 bg-blue-900/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sand-200 sm:left-4 sm:top-4">
              Question {index + 1}
            </div>

            <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full border border-sand-200/30 bg-sand-100/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
                Video Placeholder
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
              <motion.p
                className="text-base font-bold text-white drop-shadow-[0_3px_14px_rgba(2,6,23,0.8)] sm:text-lg"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollContainerRef, amount: 0.82 }}
                transition={{ duration: lowPowerMode ? 0.16 : 0.32, delay: lowPowerMode ? 0 : 0.05, ease: lowPowerMode ? "linear" : smoothEase }}
              >
                {question}
              </motion.p>
              {index === questions.length - 1 && (
                <button
                  className="mt-6 rounded-lg bg-sand-200 px-4 py-2 font-semibold text-blue-950 hover:bg-sand-100 transition"
                  onClick={() => setActiveQuestion(totalQuestions + 1)}
                >
                  Finish
                </button>
              )}
            </div>
          </motion.div>
        </motion.article>
      ))}
    </section>
    </>
  )
}
