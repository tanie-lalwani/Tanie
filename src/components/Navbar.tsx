import { NavLink } from 'react-router-dom'
import type { TimePhase } from '../experience/timePhase'

const navLinks = [
  { label: 'QnA', href: '/qna' },
]

type NavbarProps = {
  phase: TimePhase
}

export default function Navbar({ phase }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <nav className="flex h-9 w-full items-center justify-between border-b border-sky-200/40 bg-white/90 px-3 shadow-[0_6px_18px_rgba(10,37,64,0.10)] backdrop-blur-xl sm:px-5" >

        <a
          href="/"
          className="relative inline-flex h-4 w-4 items-center justify-center !no-underline"
          data-phase={phase}
          aria-label="Home"
        >
          <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-sky-200/75" aria-hidden="true" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-200 shadow-[0_0_18px_rgba(191,228,255,0.9)]" aria-hidden="true" />
        </a>

        <ul className="relative flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('#') ? (
                <a
                  href={link.href}
                  className="rounded-xl bg-sky-200 px-4 py-2 text-sm font-semibold !no-underline !text-slate-950 transition hover:bg-sky-100 hover:!text-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2 text-sm font-semibold !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                      isActive ? 'bg-sky-100 !text-slate-950 shadow' : 'bg-sky-200 !text-slate-950 hover:bg-sky-100 hover:!text-slate-950'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
