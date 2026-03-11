import { useEffect, useRef } from "react"
import gsap from "gsap"

// ── SVG tropical leaf shape ────────────────────────────────────────────────────
// Parametric palm-frond silhouette with central vein + lateral vein strokes.
function TropicalLeaf({ id, w = 170, h = 300 }: { id: string; w?: number; h?: number }) {
  const hw = w / 2 // half-width

  // Bezier leaf outline paths
  const outline = [
    `M 0 0`,
    `C ${hw * 0.9} ${h * 0.1}  ${hw * 1.1} ${h * 0.35}  ${hw * 0.72} ${h * 0.65}`,
    `C ${hw * 0.42} ${h * 0.88} ${hw * 0.12} ${h * 0.97} 0 ${h}`,
    `C ${-hw * 0.12} ${h * 0.97} ${-hw * 0.42} ${h * 0.88} ${-hw * 0.72} ${h * 0.65}`,
    `C ${-hw * 1.1} ${h * 0.35} ${-hw * 0.9} ${h * 0.1} 0 0`,
    `Z`,
  ].join(" ")

  const veinTs = [0.18, 0.33, 0.48, 0.63, 0.78] // proportional positions along leaf

  return (
    <svg
      viewBox={`${-hw - 24} -24 ${w + 48} ${h + 32}`}
      width={w}
      height={h}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#3da862" />
          <stop offset="55%" stopColor="#1e6b3a" />
          <stop offset="100%" stopColor="#0d3d1d" />
        </linearGradient>
        <filter id={`fs-${id}`} x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="3" dy="10" stdDeviation="10" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      {/* Leaf body */}
      <path d={outline} fill={`url(#lg-${id})`} filter={`url(#fs-${id})`} />

      {/* Central vein */}
      <path
        d={`M 0 -8 C 1 ${h * 0.28} 2 ${h * 0.62} 0 ${h + 8}`}
        stroke="rgba(110,230,150,0.5)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Lateral vein pairs */}
      {veinTs.map((t) => {
        const y = t * h
        const lx = hw * 0.65 * (1 - t * 0.55)
        return (
          <g key={t}>
            <path
              d={`M 0 ${y} Q ${lx * 0.55} ${y - 14} ${lx} ${y + 5}`}
              stroke="rgba(130,235,165,0.36)"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d={`M 0 ${y} Q ${-lx * 0.55} ${y - 14} ${-lx} ${y + 5}`}
              stroke="rgba(130,235,165,0.36)"
              strokeWidth="1.4"
              fill="none"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ── Leaf layout config ─────────────────────────────────────────────────────────
// Each entry: position (CSS), initial transform-origin, GSAP exit vector
const LEAVES = [
  // Top-centre: large frond hanging straight down
  { top: "-8%",  left: "50%",   tx: "-50%", rot:    0, ex:    0, ey: -700, s: 1.5 },
  // Top-left: tilted toward lower-right
  { top: "-6%",  left: "8%",    tx:   "0%", rot:   55, ex: -500, ey: -550, s: 1.25 },
  // Top-right: mirror of top-left
  { top: "-6%",  left: "78%",   tx:   "0%", rot:  -55, ex:  500, ey: -550, s: 1.2 },
  // Mid-left: pointing mostly right
  { top: "30%",  left: "-5%",   tx:   "0%", rot:   90, ex: -700, ey:   60, s: 1.1 },
  // Mid-right: pointing mostly left
  { top: "28%",  left: "92%",   tx:   "0%", rot:  -90, ex:  700, ey:   60, s: 1.1 },
  // Lower-left: angled upward-right
  { top: "68%",  left: "10%",   tx:   "0%", rot:  135, ex: -480, ey:  520, s: 1.2 },
  // Lower-right: angled upward-left
  { top: "66%",  left: "70%",   tx:   "0%", rot: -135, ex:  480, ey:  520, s: 1.15 },
] as const

// ── Component ──────────────────────────────────────────────────────────────────
export default function LeafReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const leafEls = container.querySelectorAll<HTMLElement>(".exp-leaf")

    const tl = gsap.timeline({ delay: 0.85 })

    // Stagger each leaf off-screen in its own direction with a spin
    leafEls.forEach((el, i) => {
      const leaf = LEAVES[i]
      tl.to(
        el,
        {
          x: leaf.ex,
          y: leaf.ey,
          rotation: `+=${160 + i * 43}`,
          scale: 0.25,
          opacity: 0,
          duration: 1.35,
          ease: "power2.in",
        },
        i * 0.072, // stagger offset
      )
    })

    // Reveal name text as leaves clear
    tl.fromTo(
      text,
      { opacity: 0, y: 28, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
      "-=0.55",
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <>
      {/* Leaf canopy overlay */}
      <div ref={containerRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {LEAVES.map((leaf, i) => (
          <div
            key={i}
            className="exp-leaf absolute"
            style={{
              top: leaf.top,
              left: leaf.left,
              transform: `translateX(${leaf.tx}) rotate(${leaf.rot}deg) scale(${leaf.s})`,
              transformOrigin: "center top",
            }}
          >
            <TropicalLeaf id={`lf-${i}`} />
          </div>
        ))}
      </div>

      {/* Name reveal — fades in once the canopy clears */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center opacity-0"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.52em] text-emerald-300/70">
          Welcome
        </p>
        <h1
          className="mt-2 text-7xl font-black text-white sm:text-9xl"
          style={{
            textShadow: "0 0 70px rgba(52,211,153,0.45), 0 2px 40px rgba(0,0,0,0.65)",
            letterSpacing: "-0.02em",
          }}
        >
          Tanisha
        </h1>
        <p className="mt-3 text-sm font-medium tracking-wide text-white/55 sm:text-base">
          Full Stack Developer · Music Lover
        </p>
      </div>
    </>
  )
}
