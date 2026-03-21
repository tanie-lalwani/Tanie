import { useEffect, useRef } from "react"
import gsap from "gsap"
import { TropicalLeaf } from "../../components/TropicalLeaf"

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
