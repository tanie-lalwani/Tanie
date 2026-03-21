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
        <div className="relative overflow-hidden rounded-2xl border border-sky-700/15 bg-white/60 p-4 shadow-sm max-w-xl mx-auto flex flex-col items-center">
          {/* Large video area with View Project button inside, bottom-right */}
          <div className="aspect-[16/9] w-full max-w-xl min-h-[260px] rounded-xl bg-linear-to-br from-sky-100 to-sky-50 flex items-center justify-center relative">
            {/* Replace with <video> or <img> as needed */}
            <span className="text-sky-500 text-base">Project Video Placeholder</span>
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center rounded-lg bg-sky-900/90 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              View Project
            </a>
          </div>
        </div>
        {/* All content below video removed as requested */}
        {/* Testimonial quote, outcome, and site link removed as requested */}
      </div>
    </motion.article>
  )
}
