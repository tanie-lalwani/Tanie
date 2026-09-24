"use client";

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { TimePhase } from '../experience/timePhase'
import { languageOptions, useLanguage } from '../context/LanguageContext'
import AmbientOceanAudio from './AmbientOceanAudio'
import { useAuth } from '@/hooks/useAuth'

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
  const { user, signOut } = useAuth()
  const [diveProgress, setDiveProgress] = useState(0)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
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
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('[data-hamburger-btn="true"]')) {
          setIsMobileNavOpen(false)
        }
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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
  const selectedLanguage = languageOptions.find((option) => option.locale === locale) ?? languageOptions[0]
  const isRtl = locale === 'ur'
  
  const linkStyle = (isActive = false): CSSProperties => ({
    backgroundColor: isActive ? activeBackground : linkBackground,
    borderColor: linkBorder,
    color: linkText,
  })

  const navLabels: Record<string, { pricing: string; client: string; projects: string; faq: string; qna: string; contact: string; terms: string }> = {
    en: { pricing: "Pricing", client: "Client Workspace", projects: "Projects & Works", faq: "FAQ", qna: "Q&A Bot", contact: "Contact", terms: "Terms & Policies" },
    ur: { pricing: "قیمتیں", client: "کلائنٹ ورک اسپیس", projects: "پروجیکٹس اور کام", faq: "عمومی سوالات", qna: "انٹرویو بوٹ", contact: "رابطہ", terms: "شرائط و پالیسیاں" },
    es: { pricing: "Precios", client: "Área de Clientes", projects: "Proyectos y Trabajos", faq: "Preguntas Frecuentes", qna: "Bot de Entrevista", contact: "Contacto", terms: "Términos y Políticas" },
    fr: { pricing: "Tarifs", client: "Espace Client", projects: "Projets & Travaux", faq: "FAQ", qna: "Bot Interview", contact: "Contact", terms: "Conditions & Politiques" },
    hi: { pricing: "मूल्य निर्धारण", client: "क्लाइंट कार्यक्षेत्र", projects: "परियोजनाएं और कार्य", faq: "सामान्य प्रश्न", qna: "साक्षात्कार बॉट", contact: "संपर्क", terms: "नियम एवं नीतियां" },
    ja: { pricing: "料金プラン", client: "クライアントワークスペース", projects: "実績・プロジェクト", faq: "よくある質問", qna: "Q&A ボット", contact: "お問い合わせ", terms: "利用規約とポリシー" },
    zh: { pricing: "价格方案", client: "客户工作区", projects: "项目与作品", faq: "常见问题", qna: "问答机器人", contact: "联系我们", terms: "条款与政策" },
  }

  const currentLabels = navLabels[locale] || navLabels.en

  const NAV_PAGES = [
    { href: '/', label: copy.nav.homeLabel || 'Home', icon: '🏠' },
    { href: '/pricing', label: currentLabels.pricing, icon: '💎' },
    { href: '/client', label: currentLabels.client, icon: '💼' },
    { href: '/projects', label: currentLabels.projects, icon: '🛠️' },
    { href: '/faq', label: currentLabels.faq, icon: '💡' },
    { href: '/qna', label: copy.nav.qna || currentLabels.qna, icon: '❓' },
    { href: '/contact', label: copy.nav.contactLabel || currentLabels.contact, icon: '📬' },
  ]

  return (
    <header className="relative z-50 w-full">
      <nav
        aria-label="Primary navigation"
        className="flex h-12 w-full items-center justify-between border-b px-3 backdrop-blur-xl transition-colors duration-200 sm:px-5"
        style={{ backgroundColor: 'transparent', borderColor: navBorder }}
      >
        {/* LEFT: Pulsing Home Indicator */}
        <div className="flex items-center">
          <a
            href="/"
            className="relative inline-flex h-10 w-10 items-center justify-center !no-underline"
            data-phase={phase}
            aria-label="Home"
          >
            <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full" style={{ backgroundColor: glowColor }} aria-hidden="true" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dotColor }} aria-hidden="true" />
          </a>
        </div>

        {/* RIGHT: Volume Toggle Button in place of language button, followed by Hamburger Menu */}
        <div className="relative flex items-center gap-2">
          {/* Volume Button in the right position */}
          <AmbientOceanAudio placement="inline" />

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            data-hamburger-btn="true"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-slate-100 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
            style={linkStyle(isMobileNavOpen)}
            aria-label="Toggle navigation menu"
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

          {/* ------------------------------------------------------------- */}
          {/* COMPACT FLOATING MENU POPOVER (NO FULL SCREEN VEIL)           */}
          {/* ------------------------------------------------------------- */}
          {isMobileNavOpen && (
            <div
              ref={mobileNavRef}
              dir="ltr"
              role="dialog"
              aria-modal="false"
              aria-label="Site Navigation"
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              style={{
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.25) transparent',
              }}
              className={`absolute top-[calc(100%+0.5rem)] z-50 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] max-h-[80svh] overflow-y-auto overscroll-contain rounded-2xl border border-sky-300/30 bg-slate-950/96 p-3 sm:p-4 shadow-[0_20px_50px_rgba(2,8,23,0.7)] backdrop-blur-2xl text-slate-100 ${
                isRtl ? 'left-0' : 'right-0'
              }`}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-sky-400">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-white transition cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Compact Navigation Links */}
              <div className="space-y-1">
                {NAV_PAGES.map((page) => (
                  <a
                    key={page.href}
                    href={page.href}
                    onClick={(e) => {
                      setIsMobileNavOpen(false)
                      if (typeof window !== 'undefined') {
                        const isCurrentHome = window.location.pathname === '/' || window.location.pathname === '/contact'
                        if (page.href === '/contact' && isCurrentHome) {
                          e.preventDefault()
                          const contactEl = document.getElementById('contact')
                          if (contactEl) {
                            contactEl.scrollIntoView({ behavior: 'smooth' })
                          }
                        } else if (page.href === '/' && isCurrentHome) {
                          e.preventDefault()
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                      }
                    }}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold !no-underline text-slate-200 hover:bg-sky-500/20 hover:text-white transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{page.icon}</span>
                      <span>{page.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 group-hover:text-sky-300">→</span>
                  </a>
                ))}
              </div>

              {/* Language Switcher Section Inside Menu */}
              <div className="mt-3 border-t border-white/10 pt-2.5">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Language
                  </span>
                  <span className="text-[11px] font-bold text-sky-300">{selectedLanguage.label}</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {languageOptions.map((option) => {
                    const isSelected = option.code === selectedLanguage.code
                    return (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => {
                          setLocale(option.locale)
                        }}
                        className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-sky-500 text-white shadow-xs'
                            : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tiny Policy Links Footer */}
              <div className="mt-3 border-t border-white/10 pt-2 text-[11px] text-slate-400 flex flex-wrap gap-x-3 gap-y-1 justify-center">
                <a href="/terms" onClick={() => setIsMobileNavOpen(false)} className="hover:text-sky-300 !no-underline font-medium">
                  {currentLabels.terms}
                </a>
                <span>•</span>
                <a href="/faq" onClick={() => setIsMobileNavOpen(false)} className="hover:text-sky-300 !no-underline font-medium">
                  {currentLabels.faq}
                </a>
              </div>

              {/* Logged in User & Sign Out at the end */}
              {user && (
                <div className="mt-3 border-t border-white/10 pt-2.5">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span
                      className="text-[10px] font-mono text-slate-400 truncate max-w-[170px]"
                      title={user.email || ''}
                    >
                      {user.email}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Signed In
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsMobileNavOpen(false)
                      await signOut()
                      window.location.href = '/'
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
