import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { TimePhase } from '../experience/timePhase'

const navLinks = [
  { label: 'Quick Q&A', href: '/qna' },
]

type NavbarProps = {
  phase: TimePhase
}

export default function Navbar({ phase }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 w-full">
      <nav className="flex h-12 w-full items-center justify-between border-b border-sky-200/40 bg-[#d7efff]/92 px-4 shadow-[0_10px_30px_rgba(10,37,64,0.12)] backdrop-blur-xl sm:px-6" >

        <a href="/" className="relative text-base font-semibold tracking-tight text-blue-950 transition hover:text-blue-900 sm:text-lg" style={{ fontFamily: 'var(--font-display)' }} onClick={closeMenu} data-phase={phase}>
          Tanie
        </a>

        <ul className="relative hidden items-center gap-1 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('#') ? (
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-blue-950 transition-all hover:bg-white/40 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0 ${
                      isActive ? "bg-white/55 text-blue-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" : "text-blue-950 hover:bg-white/40 hover:text-blue-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-full border border-sky-300/60 bg-[#bfe4ff] px-4 py-2 text-sm font-semibold text-blue-950 shadow-[0_8px_24px_rgba(21,54,92,0.16)] transition-all hover:bg-[#dff3ff] focus:outline-none focus:ring-2 focus:ring-sky-300 active:bg-[#a9d9ff] md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          Menu
        </button>

        {isMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="absolute inset-x-0 top-full border-b border-sky-200/40 bg-[#dff2ff]/95 shadow-[0_18px_36px_rgba(10,37,64,0.12)] backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-0 text-sm font-medium text-blue-950">
              {navLinks.map((link) => (
                <li key={link.label} className="border-b border-sky-300/30 last:border-b-0">
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="block px-4 py-3 text-blue-950 transition hover:bg-white/35 hover:text-blue-900"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <NavLink
                      to={link.href}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block rounded-2xl px-4 py-3 transition ${isActive ? 'bg-white/45 text-blue-950' : 'text-blue-950 hover:bg-white/35 hover:text-blue-900'}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}




