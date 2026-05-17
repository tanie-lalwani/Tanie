import { NavLink } from 'react-router-dom'
import { useEffect, useState, type CSSProperties } from 'react'
import type { TimePhase } from '../experience/timePhase'

const navLinks = [
  { label: 'QnA', href: '/qna' },
]

type NavbarProps = {
  phase: TimePhase
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const ease = (value: number) => {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress
const rgba = (from: [number, number, number, number], to: [number, number, number, number], progress: number) => {
  const t = ease(progress)
  const r = Math.round(lerp(from[0], to[0], t))
  const g = Math.round(lerp(from[1], to[1], t))
  const b = Math.round(lerp(from[2], to[2], t))
  const a = lerp(from[3], to[3], t).toFixed(3)

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export default function Navbar({ phase }: NavbarProps) {
  const [diveProgress, setDiveProgress] = useState(0)

  useEffect(() => {
    let frame = 0

    const updateProgress = () => {
      frame = 0
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const pageProgress = clamp01(window.scrollY / scrollable)
      const nextDiveProgress = clamp01(pageProgress / 0.4)

      setDiveProgress((current) => (
        Math.abs(current - nextDiveProgress) > 0.004 ? nextDiveProgress : current
      ))
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateProgress)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  const navBorder = rgba([186, 230, 253, 0.5], [130, 162, 172, 0.18], diveProgress)
  const linkBackground = rgba([185, 216, 239, 0.95], [10, 32, 46, 0.64], diveProgress)
  const activeBackground = rgba([200, 228, 247, 0.96], [18, 48, 66, 0.76], diveProgress)
  const linkBorder = rgba([125, 211, 252, 0.8], [154, 185, 194, 0.3], diveProgress)
  const linkText = rgba([36, 59, 107, 1], [234, 246, 255, 1], diveProgress)
  const glowColor = rgba([186, 230, 253, 0.75], [150, 190, 204, 0.5], diveProgress)
  const dotColor = rgba([186, 230, 253, 1], [202, 228, 236, 0.92], diveProgress)
  const linkStyle = (isActive = false): CSSProperties => ({
    backgroundColor: isActive ? activeBackground : linkBackground,
    borderColor: linkBorder,
    color: linkText,
  })

  return (
    <header className="sticky top-0 z-40 w-full">
      <nav
        className="flex h-9 w-full items-center justify-between border-b px-3 backdrop-blur-xl transition-colors duration-200 sm:px-5"
        style={{ backgroundColor: 'transparent', borderColor: navBorder }}
      >

        <a
          href="/"
          className="relative inline-flex h-4 w-4 items-center justify-center !no-underline"
          data-phase={phase}
          aria-label="Home"
        >
          <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full" style={{ backgroundColor: glowColor }} aria-hidden="true" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dotColor }} aria-hidden="true" />
        </a>

        <ul className="relative flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('#') ? (
                <a
                  href={link.href}
                  className="rounded-full border px-5 py-1.5 text-sm font-medium !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300"
                  style={linkStyle()}
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className="rounded-full border px-5 py-1.5 text-sm font-medium !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300"
                  style={({ isActive }) => linkStyle(isActive)}
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
