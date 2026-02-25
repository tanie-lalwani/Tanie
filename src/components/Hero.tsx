export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="max-w-2xl">
        <p className="mb-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          React + TypeScript + Tailwind
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          I build clean, fast, and modern web experiences.
        </h1>

        <p className="mt-6 text-lg text-slate-600">
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
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  )
}
