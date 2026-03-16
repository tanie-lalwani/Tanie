import { motion, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"
import { useIsMobile } from "../hooks/useIsMobile"

const OFFERINGS = [
  "Portfolios",
  "Projects",
  "Brand landing pages",
  "Product visions",
  "Custom games and concepts",
  "Dashboards",
]

export default function Hero() {
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerMode = isMobile || (shouldReduceMotion ?? false)

  return (
    <motion.section
      className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-center overflow-hidden px-4 py-12 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_18%,rgba(56,189,248,0.14),transparent_42%),radial-gradient(ellipse_at_82%_72%,rgba(34,211,238,0.08),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-size-[56px_56px] bg-[linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] opacity-[0.06]" />
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-[95px]"
        animate={lowPowerMode ? undefined : { x: [0, 28, -14, 0], y: [0, 16, -20, 0] }}
        transition={{ duration: 11, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-400/14 blur-[110px]"
        animate={lowPowerMode ? undefined : { x: [0, -24, 10, 0], y: [0, -24, 18, 0] }}
        transition={{ duration: 13, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/20 bg-white/8 p-5 shadow-[0_30px_100px_rgba(2,6,23,0.58)] backdrop-blur-2xl sm:p-8 lg:p-10"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.05)_38%,rgba(255,255,255,0)_62%)]" />
        <div className="pointer-events-none absolute -top-10 left-16 h-24 w-2/3 rounded-full bg-white/12 blur-3xl" />

        <div className="relative">
          <p className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-100/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
            Immersive Build Studio
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Hey, I&apos;m Tanisha.
          </h1>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-200 sm:text-lg">
            I can help you make your portfolios, projects, brand landing pages, visions, custom games or concepts, dashboards, and the list goes on.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {OFFERINGS.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/22 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100"
              >
                {item}
              </span>
            ))}
            <span className="rounded-full border border-cyan-200/30 bg-cyan-100/8 px-3 py-1.5 text-xs font-medium text-cyan-100">
              And more...
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              What I have built so far
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/8 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/12"
            >
              Let&apos;s start building
            </Link>
            <Link
              to="/interview-me"
              className="inline-flex items-center justify-center rounded-xl border border-cyan-200/30 bg-cyan-100/8 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-100/14"
            >
              Interview me
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
