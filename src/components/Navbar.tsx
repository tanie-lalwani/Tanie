import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { TimePhase } from '../experience/timePhase'

const navLinks = [
  { label: 'Built So Far', href: '#projects' },
  { label: 'Let\'s Start Building', href: '#contact' },
  { label: 'Interview Me', href: '/interview-me' },
]

type NavbarProps = {
  phase: TimePhase
}

export default function Navbar({ phase }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-40 w-full">
      <nav className="flex h-12 w-full items-center justify-between border-b border-sky-700/20 bg-sky-50/95 px-4 backdrop-blur-sm sm:h-14 sm:px-6" >

        <a href="/" className="relative text-base font-semibold tracking-tight text-sky-950 transition hover:text-sky-900 sm:text-lg" style={{ fontFamily: 'var(--font-display)' }} onClick={closeMenu}>
          Tanie
        </a>

        <ul className="relative hidden items-center gap-1 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('#') ? (
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-sky-900 transition-all hover:text-sky-950 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0 ${
                      isActive ? "bg-sky-100 text-sky-950" : "text-sky-900 hover:text-sky-950 hover:bg-sky-100"
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
          className="relative inline-flex items-center justify-center rounded-lg border border-sky-700/25 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-950 transition-all hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 active:bg-sky-200/50 md:hidden"
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
            className="absolute inset-x-0 top-full border-b border-sky-700/20 bg-sky-50/95 backdrop-blur-sm md:hidden"
          >
            <ul className="flex flex-col gap-0 text-sm font-medium text-sky-950">
              {navLinks.map((link) => (
                <li key={link.label} className="border-b border-sky-700/10 last:border-b-0">
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className="block px-4 py-3 text-sky-900 transition hover:bg-sky-100 hover:text-sky-950"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <NavLink
                      to={link.href}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 transition ${isActive ? 'bg-sky-200/35 text-sky-950' : 'text-sky-950 hover:bg-sky-200/82 hover:text-sky-950'}`
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




