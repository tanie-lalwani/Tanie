import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"
import { useIsMobile } from "../hooks/useIsMobile"

type Mode = "practical" | "experience"

// ─── Experience placeholder (Three.js comes here later) ──────────────────────
function ExperiencePlaceholder({
  onBack,
  lowPowerMode,
}: {
  onBack: () => void
  lowPowerMode: boolean
}) {
  return (
    <motion.div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #02020f 0%, #080015 50%, #020617 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute h-128 w-lg rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 70%)", filter: "blur(50px)", top: "5%", left: "2%" }}
          animate={lowPowerMode ? {} : { x: [0, 22, -16, 0], y: [0, -28, 18, 0], scale: [1, 1.08, 0.93, 1], opacity: [1, 0.85, 0.95, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.48) 0%, transparent 70%)", filter: "blur(38px)", bottom: "8%", right: "5%" }}
          animate={lowPowerMode ? {} : { x: [0, -28, 20, 0], y: [0, 16, -24, 0], scale: [1, 1.1, 0.9, 1], opacity: [1, 0.88, 0.96, 1] }}
          transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-56 w-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)", filter: "blur(44px)", top: "48%", left: "52%" }}
          animate={lowPowerMode ? {} : { x: [0, 32, -18, 0], y: [0, 22, -16, 0], scale: [1, 1.06, 1.12, 1], opacity: [0.9, 1, 0.85, 0.9] }}
          transition={{ duration: 12.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.22) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 18%, transparent 66%)",
          maskImage: "radial-gradient(ellipse at center, black 18%, transparent 66%)",
        }}
      />

      {/* Pulsing rings */}
      <motion.div
        className="pointer-events-none absolute h-72 w-72 rounded-full border border-violet-500/20"
        animate={lowPowerMode ? {} : { scale: [1, 1.45, 1], opacity: [0.45, 0.05, 0.45] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute h-44 w-44 rounded-full border border-cyan-400/25"
        animate={lowPowerMode ? {} : { scale: [1, 1.6, 1], opacity: [0.55, 0.08, 0.55] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.65 }}
      />
      <motion.div
        className="pointer-events-none absolute h-24 w-24 rounded-full border border-pink-400/20"
        animate={lowPowerMode ? {} : { scale: [1, 1.7, 1], opacity: [0.5, 0.06, 0.5] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
      />

      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.75)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <motion.span
          className="text-[10px] font-bold uppercase tracking-[0.55em] text-violet-300/60"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading Reality
        </motion.span>
        <motion.h1
          className="text-6xl font-black text-white sm:text-8xl"
          style={{ textShadow: "0 0 55px rgba(139,92,246,0.72), 0 0 110px rgba(34,211,238,0.28)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Coming Soon
        </motion.h1>
        <motion.p
          className="mt-1 max-w-xs text-sm leading-relaxed text-slate-400/65"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          An immersive Three.js world is being built. Prepare to step inside.
        </motion.p>
        <motion.button
          className="mt-8 rounded-full border border-violet-500/30 bg-violet-950/40 px-7 py-2.5 text-sm font-medium text-violet-200/80 backdrop-blur-sm transition hover:bg-violet-900/50 hover:text-violet-100"
          onClick={onBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          whileHover={lowPowerMode ? undefined : { scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          ← Go Back
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Mode selection split screen ─────────────────────────────────────────────
function ModeSelection({
  onSelect,
  lowPowerMode,
}: {
  onSelect: (m: Mode) => void
  lowPowerMode: boolean
}) {
  const [hovered, setHovered] = useState<Mode | null>(null)

  return (
    <motion.div
      className="relative flex h-screen w-full flex-col overflow-hidden sm:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── Experience tile ─────────────────────────────────── */}
      <motion.button
        className="relative flex flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden border-0 outline-none"
        style={{ background: "radial-gradient(ellipse at 30% 25%, rgba(139,92,246,0.42) 0%, transparent 55%), radial-gradient(ellipse at 74% 78%, rgba(34,211,238,0.3) 0%, transparent 50%), radial-gradient(ellipse at 58% 52%, rgba(236,72,153,0.2) 0%, transparent 45%), linear-gradient(160deg, #02020f 0%, #080110 50%, #020617 100%)" }}
        onHoverStart={() => !lowPowerMode && setHovered("experience")}
        onHoverEnd={() => !lowPowerMode && setHovered(null)}
        onClick={() => onSelect("experience")}
        animate={
          lowPowerMode
            ? {}
            : { flexGrow: hovered === "experience" ? 1.28 : hovered === "practical" ? 0.72 : 1 }
        }
        transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute h-112 w-md rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 70%)", filter: "blur(50px)", top: "4%", left: "8%" }}
            animate={lowPowerMode ? {} : { x: [0, 22, -16, 0], y: [0, -28, 18, 0], scale: [1, 1.08, 0.93, 1], opacity: [1, 0.85, 0.95, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-72 w-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(34,211,238,0.48) 0%, transparent 70%)", filter: "blur(38px)", bottom: "6%", right: "4%" }}
            animate={lowPowerMode ? {} : { x: [0, -28, 20, 0], y: [0, 16, -24, 0], scale: [1, 1.1, 0.9, 1], opacity: [1, 0.88, 0.96, 1] }}
            transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-52 w-52 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)", filter: "blur(44px)", top: "52%", left: "42%" }}
            animate={lowPowerMode ? {} : { x: [0, 32, -18, 0], y: [0, 22, -16, 0], scale: [1, 1.06, 1.12, 1], opacity: [0.9, 1, 0.85, 0.9] }}
            transition={{ duration: 12.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Perspective grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.19]"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.22) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 18%, transparent 66%)",
            maskImage: "radial-gradient(ellipse at center, black 18%, transparent 66%)",
          }}
        />

        {/* Edge vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_22%,rgba(0,0,0,0.72)_100%)]" />

        {/* Content */}
        <div className="relative z-10 flex select-none flex-col items-center gap-1 px-8 text-center">
          <motion.span
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.52em] text-cyan-300/60"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            Immersive
          </motion.span>
          <motion.h2
            className="text-6xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
            style={{ textShadow: "0 0 38px rgba(139,92,246,0.68), 0 0 75px rgba(34,211,238,0.22)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            Experience
          </motion.h2>
          <motion.p
            className="mt-2 text-sm italic text-slate-300/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.54 }}
          >
            Interactive 3D World
          </motion.p>
          <motion.span
            className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 text-lg text-cyan-300/75"
            animate={lowPowerMode ? {} : { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            initial={{ opacity: 0 }}
          >
            →
          </motion.span>
        </div>
      </motion.button>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div
        className="pointer-events-none h-px w-full shrink-0 sm:hidden"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.16) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.16) 75%, transparent)" }}
      />
      <div
        className="pointer-events-none hidden h-full w-px shrink-0 sm:block"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.14) 20%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.14) 80%, transparent)" }}
      />

      {/* ── Practical tile ──────────────────────────────────── */}
      <motion.button
        className="relative flex flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden border-0 outline-none"
        style={{ background: "radial-gradient(ellipse at 68% 22%, rgba(100,116,139,0.22) 0%, transparent 50%), radial-gradient(ellipse at 28% 76%, rgba(71,85,105,0.16) 0%, transparent 45%), linear-gradient(160deg, #0f172a 0%, #060d1c 50%, #020617 100%)" }}
        onHoverStart={() => !lowPowerMode && setHovered("practical")}
        onHoverEnd={() => !lowPowerMode && setHovered(null)}
        onClick={() => onSelect("practical")}
        animate={
          lowPowerMode
            ? {}
            : { flexGrow: hovered === "practical" ? 1.28 : hovered === "experience" ? 0.72 : 1 }
        }
        transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Subtle orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute h-80 w-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(148,163,184,0.14) 0%, transparent 70%)", filter: "blur(55px)", top: "6%", right: "8%" }}
            animate={lowPowerMode ? {} : { x: [0, 20, -28, 0], y: [0, -24, 16, 0], scale: [1, 0.9, 1.1, 1], opacity: [1, 0.96, 0.88, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-60 w-60 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(100,116,139,0.11) 0%, transparent 70%)", filter: "blur(42px)", bottom: "10%", left: "10%" }}
            animate={lowPowerMode ? {} : { x: [0, 22, -16, 0], y: [0, -28, 18, 0], scale: [1, 1.08, 0.93, 1], opacity: [1, 0.85, 0.95, 1] }}
            transition={{ duration: 13.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Fine grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage: "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 16%, transparent 62%)",
            maskImage: "radial-gradient(ellipse at center, black 16%, transparent 62%)",
          }}
        />

        {/* Edge vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_22%,rgba(0,0,0,0.58)_100%)]" />

        {/* Content */}
        <div className="relative z-10 flex select-none flex-col items-center gap-1 px-8 text-center">
          <motion.span
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.52em] text-slate-400/55"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.37 }}
          >
            Classic
          </motion.span>
          <motion.h2
            className="text-6xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
            style={{ textShadow: "0 0 28px rgba(148,163,184,0.36)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
          >
            Practical
          </motion.h2>
          <motion.p
            className="mt-2 text-sm italic text-slate-400/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Standard Portfolio
          </motion.p>
          <motion.span
            className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-400/22 text-lg text-slate-300/65"
            animate={lowPowerMode ? {} : { scale: [1, 1.09, 1], opacity: [0.55, 0.92, 0.55] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            initial={{ opacity: 0 }}
          >
            →
          </motion.span>
        </div>
      </motion.button>
    </motion.div>
  )
}

// ─── Practical hero (existing content) ───────────────────────────────────────
function PracticalHero({
  lowPowerMode,
  onChangeMode,
}: {
  lowPowerMode: boolean
  onChangeMode: () => void
}) {
  return (
    <motion.section
      className="relative isolate mx-auto w-full max-w-6xl overflow-hidden px-4 py-14 sm:px-6 sm:py-20 lg:py-24"
      initial={{ opacity: 0, y: lowPowerMode ? 10 : 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: lowPowerMode ? -8 : -16 }}
      transition={{ duration: lowPowerMode ? 0.45 : 0.7, ease: "easeOut" }}
    >
      {/* Subtle "change mode" badge */}
      <motion.button
        className="absolute right-6 top-5 z-10 flex items-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400/70 backdrop-blur-sm transition hover:border-white/20 hover:text-slate-300/90 sm:right-8"
        onClick={onChangeMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={lowPowerMode ? undefined : { scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        ⊞ Change Mode
      </motion.button>

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

// ─── Root component ───────────────────────────────────────────────────────────
export default function Hero() {
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const [mode, setMode] = useState<Mode | null>(null)
  const lowPowerModeBool: boolean = isMobile || (shouldReduceMotion ?? false)

  return (
    <AnimatePresence mode="wait">
      {mode === null && (
        <ModeSelection key="selection" onSelect={setMode} lowPowerMode={lowPowerModeBool} />
      )}
      {mode === "experience" && (
        <ExperiencePlaceholder key="experience" onBack={() => setMode(null)} lowPowerMode={lowPowerModeBool} />
      )}
      {mode === "practical" && (
        <PracticalHero key="practical" lowPowerMode={lowPowerModeBool} onChangeMode={() => setMode(null)} />
      )}
    </AnimatePresence>
  )
}
