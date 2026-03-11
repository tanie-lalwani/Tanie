import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { CSSProperties } from 'react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

const SHELL: CSSProperties = {
  background:
    "linear-gradient(120deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 38%, rgba(255,255,255,0.01) 100%), rgba(2,6,23,0.82)",
  borderBottom: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 4px 20px rgba(2,6,23,0.5), inset 0 -1px 0 rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px) saturate(130%)",
  WebkitBackdropFilter: "blur(20px) saturate(130%)",
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
      <nav className="relative flex h-11 w-full items-center justify-between px-5 sm:h-12 sm:px-8" style={SHELL}>
        {/* Top-edge highlight rule */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 4%, rgba(226,232,240,0.55) 35%, rgba(226,232,240,0.82) 50%, rgba(226,232,240,0.55) 65%, transparent 96%)" }}
        />

        <NavLink to="/" className="relative text-sm font-semibold tracking-tight text-slate-100 sm:text-base" onClick={closeMenu}>
          Tanie
        </NavLink>

        <ul className="relative hidden items-center gap-7 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `transition hover:text-white ${isActive ? 'text-white' : 'text-slate-400'}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink
          to="/interview-me"
          className="relative hidden rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 md:inline-flex"
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
                      `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-white/12 text-white' : 'hover:bg-white/8'}`
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
