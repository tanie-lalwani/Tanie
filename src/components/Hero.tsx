export default function Hero() {
  return (
    <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_18%,rgba(203,213,225,0.16),transparent_45%),radial-gradient(circle_at_86%_82%,rgba(148,163,184,0.2),transparent_42%),linear-gradient(135deg,#020617,#0f172a_45%,#111827)]" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-zinc-300/15 blur-3xl" />

      <div className="glass-hero-panel relative max-w-3xl overflow-hidden rounded-3xl p-8 sm:p-12">
        <div className="glass-hero-rim pointer-events-none absolute inset-0" />
        <div className="glass-hero-noise pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_28%,rgba(255,255,255,0)_50%)]" />
        <div className="pointer-events-none absolute left-8 top-4 h-20 w-2/3 rounded-full bg-white/35 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-slate-200/15 blur-3xl" />

        <p className="glass-chip relative mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
          React + TypeScript + Tailwind
        </p>

        <h1 className="relative text-4xl font-bold tracking-tight text-white sm:text-5xl">
          I build clean, fast, and modern web experiences.
        </h1>

        <p className="relative mt-6 text-lg text-slate-300">
          Welcome to my portfolio. I focus on polished UI, good performance, and reliable developer workflows.
        </p>

        <div className="relative mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/20"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  )
}
