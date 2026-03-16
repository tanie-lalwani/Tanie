import { motion, useReducedMotion } from "framer-motion"
import { useIsMobile } from "../hooks/useIsMobile"

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
        className="relative mx-auto w-full max-w-6xl"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            I'm Tanisha.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Full-stack developer building immersive, creative experiences. Portfolios, games, dashboards, and everything in between. Check out my work or let's build together—use the menu above.
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
