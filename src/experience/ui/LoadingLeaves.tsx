import { useEffect, useRef } from "react"
import gsap from "gsap"

// ── SVG tropical leaf shape ────────────────────────────────────────────────────
function AnimatedLeaf({ id, w = 140, h = 240 }: { id: string; w?: number; h?: number }) {
  const hw = w / 2

  const outline = [
    `M 0 0`,
    `C ${hw * 0.9} ${h * 0.1}  ${hw * 1.1} ${h * 0.35}  ${hw * 0.72} ${h * 0.65}`,
    `C ${hw * 0.42} ${h * 0.88} ${hw * 0.12} ${h * 0.97} 0 ${h}`,
    `C ${-hw * 0.12} ${h * 0.97} ${-hw * 0.42} ${h * 0.88} ${-hw * 0.72} ${h * 0.65}`,
    `C ${-hw * 1.1} ${h * 0.35} ${-hw * 0.9} ${h * 0.1} 0 0`,
    `Z`,
  ].join(" ")

  const veinTs = [0.18, 0.33, 0.48, 0.63, 0.78]

  return (
    <svg
      viewBox={`${-hw - 20} -20 ${w + 40} ${h + 30}`}
      width={w}
      height={h}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`lg-load-${id}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#3da862" />
          <stop offset="55%" stopColor="#1e6b3a" />
          <stop offset="100%" stopColor="#0d3d1d" />
        </linearGradient>
        <filter id={`fs-load-${id}`} x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="2" dy="8" stdDeviation="8" floodColor="rgba(0,0,0,0.45)" />
        </filter>
      </defs>

      <path d={outline} fill={`url(#lg-load-${id})`} filter={`url(#fs-load-${id})`} />
      <path
        d={`M 0 -8 C 1 ${h * 0.28} 2 ${h * 0.62} 0 ${h + 8}`}
        stroke="rgba(110,230,150,0.5)"
        strokeWidth="2"
        fill="none"
      />

      {veinTs.map((t) => {
        const y = t * h
        const lx = hw * 0.65 * (1 - t * 0.55)
        return (
          <g key={t}>
            <path
              d={`M 0 ${y} Q ${lx * 0.55} ${y - 12} ${lx} ${y + 5}`}
              stroke="rgba(130,235,165,0.36)"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d={`M 0 ${y} Q ${-lx * 0.55} ${y - 12} ${-lx} ${y + 5}`}
              stroke="rgba(130,235,165,0.36)"
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ── Layout and animation config ────────────────────────────────────────────────
const LOADING_LEAVES = [
  { top: "12%",  left: "15%",  rot:  -35, delay: 0.0 },
  { top: "25%",  left: "8%",   rot:   55, delay: 0.15 },
  { top: "48%",  left: "18%",  rot:  -75, delay: 0.3 },
  { top: "65%",  left: "12%",  rot:   25, delay: 0.45 },
  { top: "18%",  left: "82%",  rot:   45, delay: 0.1 },
  { top: "42%",  left: "88%",  rot:  -55, delay: 0.25 },
  { top: "70%",  left: "80%",  rot:   75, delay: 0.4 },
] as const

/**
 * Loading overlay with spinning/floating leaves and pulsing progress indicator.
 * Fades out once isReady becomes true (scene is initialized and rendering).
 */
interface Props {
  isReady: boolean
}

export default function LoadingLeaves({ isReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)

  // Leaf animations: continuous floating + spinning
  useEffect(() => {
    const leaves = containerRef.current?.querySelectorAll<HTMLElement>(".ll-leaf")
    if (!leaves) return

    const tl = gsap.timeline({ repeat: -1 })

    leaves.forEach((el, i) => {
      const leaf = LOADING_LEAVES[i]
      // Gentle floating + rotating using fromTo for keyframe arrays
      tl.fromTo(
        el,
        { y: 0, rotation: 0 },
        {
          y: -18,
          rotation: `+=${360}`,
          duration: 3.8 + i * 0.3,
          ease: "sine.inOut",
          transformOrigin: "center center",
        },
        leaf.delay,
      )
    })

    return () => {
      tl.kill()
    }
  }, [])

  // Spinner pulse
  useEffect(() => {
    const spinner = spinnerRef.current
    if (!spinner) return

    const tl = gsap.timeline({ repeat: -1 })
    tl.fromTo(
      spinner,
      { scale: 1, opacity: 0.6 },
      {
        scale: 1.2,
        opacity: 1,
        duration: 1.6,
        ease: "sine.inOut",
      },
    )

    return () => {
      tl.kill()
    }
  }, [])

  // Exit animation when ready
  useEffect(() => {
    if (!isReady || !containerRef.current) return

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.85,
      ease: "power2.out",
      pointerEvents: "none",
    })
  }, [isReady])

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #02020f 0%, #080015 50%, #020617 100%)" }}
    >
      {/* Leaves scattered around */}
      {LOADING_LEAVES.map((leaf, i) => (
        <div
          key={i}
          className="ll-leaf absolute"
          style={{
            top: leaf.top,
            left: leaf.left,
            transform: `rotate(${leaf.rot}deg)`,
            opacity: 0.75,
          }}
        >
          <AnimatedLeaf id={`load-${i}`} w={120} h={200} />
        </div>
      ))}

      {/* Central spinner + text */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          ref={spinnerRef}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-400/30 border-t-emerald-400/80"
          style={{
            boxShadow: "0 0 20px rgba(52,211,153,0.35)",
          }}
        />
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300/65">
            Initializing
          </p>
          <p className="mt-1 text-[10px] text-white/40">Your experience awaits…</p>
        </div>
      </div>

      {/* Ambient vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  )
}
