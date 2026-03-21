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
      <div className="relative flex h-full flex-col items-center justify-center">
        <div
          className="relative overflow-hidden rounded-2xl border border-sky-700/15 bg-white/60 shadow-sm
            w-[90vw] max-w-xs p-2
            sm:w-[80vw] sm:max-w-md sm:p-4
            md:w-[70vw] md:max-w-lg
            lg:w-full lg:max-w-2xl"
        >
          <div className="w-full flex items-center justify-center">
            <div
              className="w-full rounded-xl bg-linear-to-br from-sky-100 to-sky-50 flex items-center justify-center relative
                aspect-2/1 min-h-24
                sm:aspect-2/1 sm:min-h-44
                md:aspect-2/1 md:min-h-56
                lg:aspect-video lg:min-h-96"
            >
              <span className="text-sky-500 text-base">Project Video Placeholder</span>
              <a
                href={site}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 inline-flex items-center justify-center rounded-lg bg-sky-900/90 px-2 py-1 text-xl font-semibold text-white shadow transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:bottom-4 sm:right-4 sm:px-4 sm:py-2 sm:text-2xl"
                aria-label="Visit project site"
              >
                <span aria-hidden="true">Go</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
