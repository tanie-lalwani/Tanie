import { motion } from "framer-motion"

interface ProjectCardProps {
  client: string
  role: string
  project: string
  site: string
}

export function ProjectCard({
  client,
  role,
  project,
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
          {/* Video area with View Project button inside, bottom-right */}
          <div className="aspect-video rounded-lg bg-linear-to-br from-sky-100 to-sky-50 flex items-center justify-center relative">
            {/* Replace with <video> or <img> as needed */}
            <span className="text-sky-400 text-xs">Project Video Placeholder</span>
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center rounded-lg bg-sky-900/90 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              View Project
            </a>
          </div>
        </div>
        <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
          {/* Minimal project info, no extra text/labels */}
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
        {/* Testimonial quote, outcome, and site link removed as requested */}
      </div>
    </motion.article>
  )
}
