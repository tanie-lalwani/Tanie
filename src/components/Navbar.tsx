import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { CSSProperties } from 'react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

const SHELL: CSSProperties = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.03) 100%)",
  borderBottom: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 6px 26px rgba(2,6,23,0.34), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.08)",
  backdropFilter: "blur(22px) saturate(175%) contrast(115%) brightness(108%)",
  WebkitBackdropFilter: "blur(22px) saturate(175%) contrast(115%) brightness(108%)",
}

const CTA: CSSProperties = {
  background: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.85) 100%)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 12px rgba(15,23,42,0.4)",
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-20">
      <nav className="relative flex h-11 w-full items-center justify-between overflow-hidden px-5 sm:h-12 sm:px-8" style={SHELL}>
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 180% at 10% 0%, rgba(255,255,255,0.26) 0%, transparent 46%), radial-gradient(120% 180% at 90% 100%, rgba(148,163,184,0.22) 0%, transparent 55%), linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 36%, rgba(255,255,255,0.11) 64%, rgba(255,255,255,0.03) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute -left-16 top-0 h-full w-1/2 opacity-70"
          style={{
            background: "linear-gradient(98deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.28) 42%, rgba(255,255,255,0.04) 100%)",
            filter: "blur(14px)",
            transform: "skewX(-18deg)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 4%, rgba(226,232,240,0.55) 35%, rgba(226,232,240,0.82) 50%, rgba(226,232,240,0.55) 65%, transparent 96%)" }}
        />

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
          className="relative hidden rounded-md px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 md:inline-flex"
          style={CTA}
        >
          Interview Me
        </NavLink>

        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-md border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:bg-white/15 md:hidden"
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
            className="absolute inset-x-0 top-full p-2 md:hidden"
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
