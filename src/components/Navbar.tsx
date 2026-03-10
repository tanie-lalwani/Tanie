const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  return (
    <header className="sticky top-4 z-20 px-4 sm:px-6">
      <nav className="nav-glass-shell mx-auto flex h-16 w-full max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-6">
        <div className="nav-glass-topbar pointer-events-none absolute left-1/2 top-0 h-1.5 w-40 -translate-x-1/2 rounded-b-full" />

        <a href="#" className="relative text-lg font-semibold tracking-tight text-slate-100">
          Tanie
        </a>

        <ul className="relative hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="transition hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="nav-glass-cta relative rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Get in touch
        </a>
      </nav>
    </header>
  )
}
