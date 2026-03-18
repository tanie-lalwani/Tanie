import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { CSSProperties } from 'react'

const navLinks = [
  { label: 'Built So Far', href: '#projects' },
  { label: 'Let\'s Start Building', href: '#contact' },
  { label: 'Interview Me', href: '/interview-me' },
]

const SHELL: CSSProperties = {
  background: 'rgba(2, 6, 23, 0.24)',
  borderBottom: '1px solid rgba(226, 232, 240, 0.24)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}

type NavbarProps = {
  isSettingsOpen: boolean
  onSettingsToggle: (open: boolean) => void
}

export default function Navbar({ isSettingsOpen, onSettingsToggle }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-20">
      <nav className="relative flex h-11 w-full items-center justify-between px-4 sm:h-12 sm:px-8" style={SHELL}>

        <a href="/" className="relative text-sm font-semibold tracking-tight text-slate-100 sm:text-base" style={{ fontFamily: 'var(--font-display)' }} onClick={closeMenu}>
          Tanie
        </a>

        <ul className="relative hidden items-center gap-1 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('#') ? (
                <a
                  href={link.href}
                  className="rounded-full px-3 py-1 transition text-slate-200 hover:bg-white/8 hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-1 transition ${isActive ? 'bg-white/12 text-white' : 'text-slate-200 hover:bg-white/8 hover:text-white'}`
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
          title="Scene settings"
          className="relative inline-flex items-center justify-center rounded-md border border-white/26 bg-white/12 px-2 py-1.5 text-white transition hover:bg-white/18 md:px-2.5"
          onClick={() => onSettingsToggle(!isSettingsOpen)}
          aria-label="Toggle scene settings"
          aria-pressed={isSettingsOpen}
        >
          <svg className="h-4 w-4 md:h-4.5 md:w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
          </svg>
        </button>

        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-md border border-white/26 bg-white/16 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:bg-white/24 md:hidden"
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
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="block rounded-lg px-3 py-2 transition text-slate-100 hover:bg-white/12 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <NavLink
                      to={link.href}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-white/16 text-white' : 'text-slate-100 hover:bg-white/12 hover:text-white'}`
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
