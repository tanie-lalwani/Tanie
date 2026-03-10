export default function Hero() {
  return (
    <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_20%,rgba(14,165,233,0.18),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(99,102,241,0.2),transparent_42%),linear-gradient(135deg,#020617,#0f172a_45%,#111827)]" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-white/8 p-8 shadow-[0_28px_90px_rgba(2,6,23,0.65)] backdrop-blur-2xl sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_35%)]" />

        <p className="relative mb-4 inline-flex rounded-full border border-indigo-300/40 bg-indigo-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200">
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
