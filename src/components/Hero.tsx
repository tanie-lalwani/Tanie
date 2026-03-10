import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"
import { useIsMobile } from "../hooks/useIsMobile"

export default function Hero() {
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerMode = isMobile || shouldReduceMotion

  return (
    <motion.section
      className="relative isolate mx-auto w-full max-w-6xl overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:py-24"
      initial={{ opacity: 0, y: lowPowerMode ? 10 : 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: lowPowerMode ? 0.45 : 0.7, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_18%,rgba(203,213,225,0.16),transparent_45%),radial-gradient(circle_at_86%_82%,rgba(148,163,184,0.2),transparent_42%),linear-gradient(135deg,#020617,#0f172a_45%,#111827)]" />
      <motion.div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl"
        animate={lowPowerMode ? { opacity: 0.22 } : { y: [0, 18, 0], opacity: [0.25, 0.35, 0.25] }}
        transition={lowPowerMode ? { duration: 0.2 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-zinc-300/15 blur-3xl"
        animate={lowPowerMode ? { opacity: 0.2 } : { y: [0, -14, 0], opacity: [0.2, 0.3, 0.2] }}
        transition={lowPowerMode ? { duration: 0.2 } : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="glass-hero-panel relative max-w-3xl overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12"
        initial={{ opacity: 0, scale: lowPowerMode ? 0.985 : 0.96, y: lowPowerMode ? 14 : 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: lowPowerMode ? 0.5 : 0.8, ease: "easeOut", delay: lowPowerMode ? 0.04 : 0.12 }}
      >
        <div className="glass-hero-rim pointer-events-none absolute inset-0" />
        <div className="glass-hero-noise pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_28%,rgba(255,255,255,0)_50%)]" />
        <div className="pointer-events-none absolute left-8 top-4 h-20 w-2/3 rounded-full bg-white/35 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-slate-200/15 blur-3xl" />

        <motion.p
          className="glass-chip relative mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
        >
          React + TypeScript + Tailwind
        </motion.p>

        <motion.h1
          className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34 }}
        >
          I build clean, fast, and modern web experiences.
        </motion.h1>

        <motion.p
          className="relative mt-5 text-base text-slate-300 sm:mt-6 sm:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
        >
          Welcome to my portfolio. I focus on polished UI, good performance, and reliable developer workflows.
        </motion.p>

        <motion.div
          className="relative mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            whileHover={lowPowerMode ? undefined : { y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/projects" className="block">
              View Projects
            </Link>
          </motion.div>
          <motion.div
            className="rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-white/20"
            whileHover={lowPowerMode ? undefined : { y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/contact" className="block">
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
