import { motion } from "framer-motion"


interface ProjectCardProps {
  site: string
}
export function ProjectCard({ site }: ProjectCardProps) {
  return (
    <motion.article
      className="relative h-full"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -36 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex h-full flex-col">
        <div className="relative overflow-hidden rounded-2xl border border-sky-700/15 bg-white/60 p-4 shadow-sm max-w-2xl mx-auto flex flex-col items-center">
          {/* Extra small mobile: smaller card and video area */}
          <div className="w-full max-w-xs p-2 sm:max-w-2xl sm:p-4 mx-auto flex flex-col items-center">
            <div
              className="w-full rounded-xl bg-linear-to-br from-sky-100 to-sky-50 flex items-center justify-center relative
                aspect-[16/8] min-h-[120px]
                sm:aspect-[16/8] sm:min-h-[220px] sm:max-w-lg
                md:aspect-[16/8] md:min-h-[260px] md:max-w-xl
                lg:aspect-[16/9] lg:min-h-[390px] lg:max-w-2xl"
            >
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
