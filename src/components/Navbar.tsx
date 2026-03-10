import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-3 z-20 px-3 sm:top-4 sm:px-6">
      <nav className="nav-glass-shell mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-2xl px-3 sm:h-16 sm:px-6">
        <div className="nav-glass-topbar pointer-events-none absolute left-1/2 top-0 h-1.5 w-32 -translate-x-1/2 rounded-b-full sm:w-40" />

        <NavLink to="/" className="relative text-base font-semibold tracking-tight text-slate-100 sm:text-lg" onClick={closeMenu}>
          Tanie
        </NavLink>

        <ul className="relative hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `transition hover:text-white ${isActive ? 'text-white' : 'text-slate-200'}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink
          to="/interview-me"
          className="nav-glass-cta relative hidden rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 md:inline-flex"
        >
          Interview Me
        </NavLink>

        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:bg-white/20 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          Menu
        </button>

        {isMenuOpen ? (
          <div
            id="mobile-nav-menu"
            className="nav-glass-shell absolute left-0 right-0 top-[calc(100%+0.6rem)] rounded-xl p-3 md:hidden"
          >
            <ul className="flex flex-col gap-1 text-sm font-medium text-slate-100">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-white/15 text-white' : 'hover:bg-white/10'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
