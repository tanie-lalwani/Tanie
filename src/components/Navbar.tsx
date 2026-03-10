import { NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Interview Me', to: '/interview-me' },
]

export default function Navbar() {
  return (
    <header className="sticky top-4 z-20 px-4 sm:px-6">
      <nav className="nav-glass-shell mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-6">
        <div className="nav-glass-topbar pointer-events-none absolute left-1/2 top-0 h-1.5 w-40 -translate-x-1/2 rounded-b-full" />

        <NavLink to="/" className="relative text-lg font-semibold tracking-tight text-slate-100">
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
          className="nav-glass-cta relative rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Interview Me
        </NavLink>
      </nav>
    </header>
  )
}
