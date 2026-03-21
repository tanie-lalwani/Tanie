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
      <nav className="flex h-9 w-full items-center justify-between border-b border-sky-200/50 bg-[#b8d3e8]/90 px-3 shadow-[0_6px_18px_rgba(10,37,64,0.10)] backdrop-blur-xl sm:px-5" >

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
                  className="rounded-full border border-sky-300/80 bg-[#b9d8ef]/95 px-5 py-1.5 text-sm font-medium !no-underline !text-[#243b6b] shadow-[0_0_0_1px_rgba(125,211,252,0.25),0_0_18px_rgba(56,189,248,0.35)] transition hover:bg-[#c8e4f7] hover:!text-[#243b6b] focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-full border px-5 py-1.5 text-sm font-medium !no-underline transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                      isActive
                        ? 'border-sky-300/90 bg-[#c8e4f7] !text-[#243b6b] shadow-[0_0_0_1px_rgba(125,211,252,0.3),0_0_18px_rgba(56,189,248,0.38)]'
                        : 'border-sky-300/80 bg-[#b9d8ef]/95 !text-[#243b6b] shadow-[0_0_0_1px_rgba(125,211,252,0.25),0_0_18px_rgba(56,189,248,0.35)] hover:bg-[#c8e4f7] hover:!text-[#243b6b]'
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
