"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { TimePhase } from '../experience/timePhase'
import { languageOptions, useLanguage } from '../context/LanguageContext'
import AmbientOceanAudio from './AmbientOceanAudio'

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const languageMenuRef = useRef<HTMLLIElement | null>(null)
  const mobileNavRef = useRef<HTMLDivElement | null>(null)

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
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-hamburger-btn="true"]')) {
          setIsMobileNavOpen(false)
        }
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false)
        setIsMobileNavOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
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

  const NAV_PAGES = [
    { href: '/', label: copy.nav.homeLabel || 'Home', icon: '🏠', desc: 'Interactive Brand Canvas' },
    { href: '/packages', label: 'Packages & Aesthetics', icon: '📦', desc: 'Design Matrix & Sprints' },
    { href: '/client', label: 'Client Workspace', icon: '💼', desc: 'Milestones, Assets & Contracts' },
    { href: '/paywall', label: 'Razorpay Paywall & Invoices', icon: '💳', desc: 'Instant Retainers & Test Review' },
    { href: '/projects', label: 'Projects & Archive', icon: '🛠️', desc: 'Selected Creative Engineering' },
    { href: '/qna', label: copy.nav.qna || 'Q&A Bot', icon: '❓', desc: 'Interactive Knowledge Base' },
    { href: '/contact', label: copy.nav.contactLabel || 'Contact', icon: '📬', desc: 'Get in Touch' },
  ]

  return (
    <header className="relative z-50 w-full">
      <nav
        aria-label="Primary navigation"
        className="flex h-12 w-full items-center justify-between border-b px-3 backdrop-blur-xl transition-colors duration-200 sm:px-5"
        style={{ backgroundColor: 'transparent', borderColor: navBorder }}
      >
        {/* LEFT: Home Indicator & Ambient Volume Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            className="relative inline-flex h-10 w-10 items-center justify-center !no-underline"
            data-phase={phase}
            aria-label="Home"
          >
            <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full" style={{ backgroundColor: glowColor }} aria-hidden="true" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dotColor }} aria-hidden="true" />
          </a>

          {/* Volume Button in the Left */}
          <div className="relative flex items-center">
            <AmbientOceanAudio placement="inline" />
          </div>
        </div>

        {/* RIGHT: Language Switcher & Hamburger Menu */}
        <ul className="relative flex items-center gap-1.5 text-sm font-medium">
          {/* Quick Language Dropdown */}
          <li ref={languageMenuRef} className="relative">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-full border px-3.5 sm:px-4 text-xs sm:text-sm font-semibold !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
              style={linkStyle(isLanguageMenuOpen)}
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
              onClick={() => setIsLanguageMenuOpen((current) => !current)}
            >
              <span>{selectedLanguage.code}</span>
              <span className="ml-1 text-[10px] opacity-75">▾</span>
            </button>

            {isLanguageMenuOpen && (
              <div
                role="menu"
                aria-label="Languages"
                className="absolute right-0 top-[calc(100%+0.45rem)] w-44 overflow-hidden rounded-2xl border bg-slate-950/96 p-2 shadow-[0_18px_55px_rgba(2,8,23,0.5)] backdrop-blur-2xl z-50"
                style={{ backgroundColor: languageMenuBackground, borderColor: languageMenuBorder }}
              >
                <p className="px-2 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold !no-underline transition cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'text-slate-200 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => {
                          setLocale(option.locale)
                          setIsLanguageMenuOpen(false)
                        }}
                      >
                        <span>{option.label}</span>
                        {isSelected && <span aria-hidden="true">✓</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </li>

          {/* Hamburger Menu Button */}
          <li className="relative">
            <button
              type="button"
              data-hamburger-btn="true"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-slate-100 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
              style={linkStyle(isMobileNavOpen)}
              aria-label="Toggle all pages navigation menu"
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </li>
        </ul>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* HAMBURGER SLIDE-OVER / EXPANDED NAVIGATION DRAWER            */}
      {/* ------------------------------------------------------------- */}
      {isMobileNavOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Drawer */}
          <div
            ref={mobileNavRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-950 via-[#04111b] to-slate-950 border-l border-sky-400/20 p-6 sm:p-8 shadow-[0_0_60px_rgba(2,132,199,0.25)] backdrop-blur-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-sky-300">
                    Menu & Navigation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* All Pages Links */}
              <div className="mt-6 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  Explore Pages
                </p>
                {NAV_PAGES.map((page) => (
                  <a
                    key={page.href}
                    href={page.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="group flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/60 p-3.5 !no-underline transition hover:border-sky-400/40 hover:bg-sky-950/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg group-hover:scale-110 transition">
                        {page.icon}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                          {page.label}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {page.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-500 group-hover:text-sky-300 group-hover:translate-x-1 transition text-xs font-bold">
                      →
                    </span>
                  </a>
                ))}
              </div>

              {/* Language Switcher Section */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Language
                  </span>
                  <span className="text-xs font-bold text-sky-400">{selectedLanguage.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {languageOptions.map((option) => {
                    const isSelected = option.code === selectedLanguage.code
                    return (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => {
                          setLocale(option.locale)
                        }}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold !no-underline transition cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500 text-white shadow-md'
                            : 'border border-white/10 bg-slate-900/50 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{option.label}</span>
                        <span className="text-[10px] opacity-75 font-mono">[{option.code}]</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Footer & Compliance Links */}
            <div className="mt-8 border-t border-white/10 pt-4 text-[11px] text-slate-400 space-y-2">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="/terms" onClick={() => setIsMobileNavOpen(false)} className="hover:text-sky-300 !no-underline">Terms</a>
                <span>•</span>
                <a href="/refund-policy" onClick={() => setIsMobileNavOpen(false)} className="hover:text-sky-300 !no-underline">Refunds</a>
                <span>•</span>
                <a href="/privacy" onClick={() => setIsMobileNavOpen(false)} className="hover:text-sky-300 !no-underline">Privacy</a>
                <span>•</span>
                <a href="/shipping-policy" onClick={() => setIsMobileNavOpen(false)} className="hover:text-sky-300 !no-underline">Delivery</a>
              </div>
              <p className="text-[10px] text-slate-500">
                Tanie Lalwani • Verified Creative Web Engineering
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
