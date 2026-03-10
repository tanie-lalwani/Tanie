const questions = [
  {
    question: "Tell me about yourself.",
    note: "A concise intro covering your background, strengths, and goals.",
  },
  {
    question: "Walk me through a project you are proud of.",
    note: "Focus on your role, decisions, impact, and key tradeoffs.",
  },
  {
    question: "How do you handle bugs in production?",
    note: "Talk through triage, communication, and postmortem habits.",
  },
  {
    question: "Describe a time you disagreed with a teammate.",
    note: "Show conflict resolution, empathy, and outcome.",
  },
  {
    question: "How do you optimize frontend performance?",
    note: "Mention profiling, bundle strategy, rendering patterns, and metrics.",
  },
  {
    question: "Why do you want this role?",
    note: "Connect company mission with your strengths and growth goals.",
  },
]

export default function InterviewMe() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12 sm:pt-16">
      <div className="mb-10 max-w-2xl">
        <p className="glass-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
          Interview Prep Route
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Interview Me</h1>
        <p className="mt-4 text-base text-slate-300 sm:text-lg">
          Practice answers with these common interview prompts. Each card is a video placeholder for your future recordings.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((item, index) => (
          <article key={item.question} className="glass-hero-panel rounded-2xl p-4">
            <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-white/20 bg-slate-900/80">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_38%),linear-gradient(145deg,rgba(148,163,184,0.2),rgba(15,23,42,0.75))]" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
                  Video Placeholder
                </div>
              </div>
              <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-black/35 px-2 py-1 text-xs text-slate-200">
                Q{index + 1}
              </span>
            </div>

            <h2 className="text-base font-semibold text-white">{item.question}</h2>
            <p className="mt-2 text-sm text-slate-300">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
