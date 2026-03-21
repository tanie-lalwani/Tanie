import { motion } from "framer-motion"

interface ProjectCardProps {
  client: string
  role: string
  project: string
  quote: string
  outcome: string
  site: string
}

export function ProjectCard({
  client,
  role,
  project,
  quote,
  outcome,
  site,
}: ProjectCardProps) {
  return (
    <motion.article
      className="relative h-full"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -36 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex h-full flex-col">
        <div className="relative overflow-hidden rounded-lg border border-sky-700/25 bg-white/70 p-4 sm:p-6 shadow-sm">
          <div className="aspect-video rounded-lg bg-linear-to-br from-sky-100 to-sky-50" />
        </div>

        <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
          <div>
            <p
              className="text-lg font-semibold tracking-tight text-sky-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {client}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-sky-700">{role}</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-700/25 bg-sky-50 px-3 py-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-900">{project}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-sky-700/20 pt-4 sm:mt-5 sm:space-y-4 sm:pt-5">
          <blockquote className="text-sm italic leading-relaxed text-sky-950">&quot;{quote}&quot;</blockquote>
          <p className="text-sm leading-relaxed text-sky-900">{outcome}</p>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-sky-700/20 pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-sky-700">Visit project</p>
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-semibold text-sky-950 underline decoration-sky-300 decoration-2 underline-offset-2 transition hover:text-sky-900"
            >
              {site.replace("https://", "")}
            </a>
          </div>
          <a
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-700/30 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-950 transition-all duration-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 active:bg-sky-200/50"
          >
            View Project
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </motion.article>
  )
}
