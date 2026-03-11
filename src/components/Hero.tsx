import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Link } from "react-router-dom"
import { useIsMobile } from "../hooks/useIsMobile"
import ExperienceWorld from "../experience/ExperienceWorld"

export type Mode = "practical" | "experience"

const GLASS_PANEL = {
  background: "linear-gradient(155deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 34%, rgba(255,255,255,0.04) 100%)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -18px 32px rgba(71,85,105,0.16), 0 28px 90px rgba(2,6,23,0.56)",
  backdropFilter: "blur(26px) saturate(125%)",
  WebkitBackdropFilter: "blur(26px) saturate(125%)",
} as const

const GLASS_RIM = {
  background: "linear-gradient(132deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.14) 18%, rgba(255,255,255,0.04) 44%, rgba(255,255,255,0.12) 100%)",
  opacity: 0.56,
} as const

const GLASS_CHIP = {
  background: "linear-gradient(145deg, rgba(226,232,240,0.18) 0%, rgba(148,163,184,0.08) 100%)",
  border: "1px solid rgba(226,232,240,0.22)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
} as const

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
      className="relative flex h-[100svh] w-full flex-col overflow-hidden sm:h-screen sm:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── Experience tile ─────────────────────────────────── */}
      <motion.button
        className="relative flex min-h-[50svh] flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden border-0 outline-none sm:min-h-0"
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
            className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
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
        className="relative flex min-h-[50svh] flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden border-0 outline-none sm:min-h-0"
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
            className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
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

// ─── Practical hero ───────────────────────────────────────────────────────────
const METRICS = [
  { value: "Fast", label: "shipping" },
  { value: "UI + DX", label: "balance" },
]

function PracticalHero({
  lowPowerMode,
  onChangeMode,
}: {
  lowPowerMode: boolean
  onChangeMode: () => void
}) {
  const cardEase: [number, number, number, number] = [0.22, 1, 0.36, 1]
  const hoverLift = lowPowerMode ? undefined : { y: -2, scale: 1.015 }

  return (
    <motion.section
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-24"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0c1322 50%, #0f172a 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: lowPowerMode ? -8 : -18 }}
      transition={{ duration: lowPowerMode ? 0.28 : 0.58, ease: cardEase }}
    >
      {/* Background orbs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(148,163,184,0.12) 0%, transparent 70%)", filter: "blur(72px)" }}
        animate={lowPowerMode ? { opacity: 0.7 } : { y: [0, 24, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(100,116,139,0.1) 0%, transparent 70%)", filter: "blur(64px)" }}
        animate={lowPowerMode ? { opacity: 0.6 } : { y: [0, -18, 0], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Fine dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: "radial-gradient(rgba(148,163,184,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Change mode */}
      <motion.button
        className="absolute right-3 top-4 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 backdrop-blur-sm transition hover:border-white/18 hover:text-slate-300 sm:right-6 sm:top-6 sm:text-[10px] sm:tracking-[0.18em]"
        onClick={onChangeMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        whileHover={lowPowerMode ? undefined : { scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        ⊞ Change Mode
      </motion.button>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">

        <motion.div
          className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl p-5 sm:rounded-4xl sm:p-8 lg:p-10"
          style={GLASS_PANEL}
          initial={{ opacity: 0, y: 18, scale: lowPowerMode ? 1 : 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: lowPowerMode ? 0.05 : 0.12, duration: lowPowerMode ? 0.3 : 0.58, ease: cardEase }}
        >
          <div className="pointer-events-none absolute inset-0" style={GLASS_RIM} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.06)_28%,rgba(255,255,255,0)_52%)]" />
          <div className="pointer-events-none absolute left-10 top-5 h-20 w-2/3 rounded-full bg-white/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -right-10 h-44 w-44 rounded-full bg-slate-200/8 blur-3xl" />

          <div className="relative">

            {/* Status badge */}
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:mb-8 sm:gap-2.5 sm:px-4"
              style={GLASS_CHIP}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                animate={lowPowerMode ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[11px] font-medium tracking-wide text-emerald-300/75 sm:text-xs">Available for opportunities</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-[5.4rem] lg:leading-[1.02]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.6 }}
            >
              Hey, I'm{" "}
              <span
                style={{
                  background: "linear-gradient(92deg, #f8fafc 12%, #cbd5e1 56%, #94a3b8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Tanie
              </span>
            </motion.h1>

            <motion.p
              className="mt-3 text-[11px] uppercase tracking-[0.18em] text-slate-400 sm:mt-4 sm:text-sm sm:tracking-[0.24em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
            >
              Full Stack Developer
            </motion.p>

            <motion.p
              className="mt-4 text-base font-medium tracking-wide text-slate-200/88 sm:mt-5 sm:text-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.55 }}
            >
              I make music and websites.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.54, duration: 0.5 }}
            >
              <motion.div
                whileHover={hoverLift}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/projects"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/30 transition hover:bg-slate-100 sm:w-auto"
                >
                  View Projects
                  <span className="text-slate-500">→</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={hoverLift}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur-sm transition hover:border-white/22 hover:bg-white/9 sm:w-auto"
                >
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="my-8"
              style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(148,163,184,0.18) 30%, rgba(148,163,184,0.18) 70%, transparent)" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
            />

            <motion.div
              className="grid gap-3 sm:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.78 }}
            >
              {METRICS.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.82 + i * 0.06 }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.03)_44%,rgba(255,255,255,0)_72%)]" />
                  <p className="text-lg font-semibold text-white">{metric.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function Hero({ mode, onModeChange }: {
  mode: Mode | null
  onModeChange: (m: Mode | null) => void
}) {
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerModeBool: boolean = isMobile || (shouldReduceMotion ?? false)

  return (
    <AnimatePresence mode="wait" initial={false}>
      {mode === null && (
        <ModeSelection key="selection" onSelect={onModeChange} lowPowerMode={lowPowerModeBool} />
      )}
      {mode === "experience" && (
        <ExperienceWorld key="experience" onBack={() => onModeChange(null)} />
      )}
      {mode === "practical" && (
        <PracticalHero key="practical" lowPowerMode={lowPowerModeBool} onChangeMode={() => onModeChange(null)} />
      )}
    </AnimatePresence>
  )
}
