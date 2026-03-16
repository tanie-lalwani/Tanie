import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { CSSProperties } from 'react'

const navLinks = [
  { label: 'Hey I\'m Tanisha', to: '/' },
  { label: 'Built So Far', to: '/projects' },
  { label: 'Let\'s Start Building', to: '/contact' },
  { label: 'Interview Me', to: '/interview-me' },
]

const SHELL: CSSProperties = {
  background: 'rgba(2, 6, 23, 0.18)',
  borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}

const CTA: CSSProperties = {
  border: '1px solid rgba(255,255,255,0.2)',
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-20">
      <nav className="relative flex h-11 w-full items-center justify-between px-4 sm:h-12 sm:px-8" style={SHELL}>

        <NavLink to="/" className="relative text-sm font-semibold tracking-tight text-slate-100 sm:text-base" style={{ fontFamily: 'var(--font-display)' }} onClick={closeMenu}>
          Tanie
        </NavLink>

        <ul className="relative hidden items-center gap-1 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink
          to="/interview-me"
          className="relative hidden rounded-md bg-white/6 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/12 md:inline-flex"
          style={CTA}
        >
          Interview Me
        </NavLink>

        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-md border border-white/20 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:bg-white/14 md:hidden"
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
            className="absolute inset-x-0 top-full mt-1 p-2 md:hidden"
            style={SHELL}
          >
            <ul className="flex flex-col gap-0.5 text-sm font-medium text-slate-100">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
