import { NavLink } from 'react-router-dom'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { TimePhase } from '../experience/timePhase'
import { languageOptions, useLanguage } from '../context/LanguageContext'

const navLinks = [
  { href: '/qna' },
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
  const { locale, setLocale, copy } = useLanguage()
  const [diveProgress, setDiveProgress] = useState(0)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const languageMenuRef = useRef<HTMLLIElement | null>(null)

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

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current) return
      if (!languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const navBorder = rgba([186, 230, 253, 0.38], [130, 162, 172, 0.14], diveProgress)
  const linkBackground = rgba([185, 216, 239, 0.86], [10, 32, 46, 0.54], diveProgress)
  const activeBackground = rgba([200, 228, 247, 0.9], [18, 48, 66, 0.68], diveProgress)
  const linkBorder = rgba([125, 211, 252, 0.62], [154, 185, 194, 0.24], diveProgress)
  const linkText = rgba([36, 59, 107, 1], [234, 246, 255, 1], diveProgress)
  const glowColor = rgba([186, 230, 253, 0.54], [150, 190, 204, 0.36], diveProgress)
  const dotColor = rgba([186, 230, 253, 1], [202, 228, 236, 0.92], diveProgress)
  const languageMenuBackground = rgba([7, 24, 36, 0.96], [7, 24, 36, 0.96], diveProgress)
  const languageMenuBorder = rgba([186, 230, 253, 0.16], [186, 230, 253, 0.16], diveProgress)
  const selectedLanguage = languageOptions.find((option) => option.locale === locale) ?? languageOptions[0]
  const linkStyle = (isActive = false): CSSProperties => ({
    backgroundColor: isActive ? activeBackground : linkBackground,
    borderColor: linkBorder,
    color: linkText,
  })

  return (
    <header className="w-full">
      <nav
        aria-label="Primary navigation"
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
            <li key={link.href}>
              {link.href.startsWith('#') ? (
                <a
                  href={link.href}
                  className="rounded-full border px-5 py-1.5 text-sm font-medium !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300"
                  style={linkStyle()}
                >
                  {copy.nav.qna}
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className="rounded-full border px-5 py-1.5 text-sm font-medium !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300"
                  style={({ isActive }) => linkStyle(isActive)}
                >
                  {copy.nav.qna}
                </NavLink>
              )}
            </li>
          ))}

          <li ref={languageMenuRef} className="relative">
            <button
              type="button"
              className="rounded-full border px-5 py-1.5 text-sm font-medium !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300"
              style={linkStyle(isLanguageMenuOpen)}
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
              onClick={() => setIsLanguageMenuOpen((current) => !current)}
            >
              {selectedLanguage.code} ▾
            </button>

            {isLanguageMenuOpen ? (
              <div
                role="menu"
                aria-label="Languages"
                className="absolute right-0 top-[calc(100%+0.45rem)] w-40 overflow-hidden rounded-2xl border bg-slate-950/96 p-2 shadow-[0_18px_55px_rgba(2,8,23,0.35)] backdrop-blur-xl"
                style={{ backgroundColor: languageMenuBackground, borderColor: languageMenuBorder }}
              >
                <p className="px-2 pb-2 pt-1 text-[11px] font-medium tracking-[0.18em] text-slate-200/50">
                  {copy.nav.languages}
                </p>

                <div className="flex flex-col gap-1">
                  {languageOptions.map((option) => {
                    const isSelected = option.code === selectedLanguage.code

                    return (
                      <button
                        key={option.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isSelected}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm font-medium !no-underline transition ${
                          isSelected
                            ? 'bg-white text-slate-900'
                            : 'text-slate-100/78 hover:bg-white/6 hover:text-white'
                        }`}
                        onClick={() => {
                          setLocale(option.locale)
                          setIsLanguageMenuOpen(false)
                        }}
                      >
                        <span>{option.label}</span>
                        {isSelected ? <span aria-hidden="true">✓</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </li>
        </ul>
      </nav>
    </header>
  )
}
