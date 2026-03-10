export default function Hero() {
  return (
    <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden px-6 py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-300/35 blur-3xl" />

      <div className="relative max-w-3xl rounded-3xl border border-white/60 bg-white/45 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:p-12">
        <p className="mb-4 inline-flex rounded-full border border-indigo-200/70 bg-indigo-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          React + TypeScript + Tailwind
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          I build clean, fast, and modern web experiences.
        </h1>

        <p className="mt-6 text-lg text-slate-700">
          Welcome to my portfolio. I focus on polished UI, good performance, and reliable developer workflows.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-300/80 bg-white/60 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white/80"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  )
}
