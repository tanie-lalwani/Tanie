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
          className="surface-panel relative overflow-hidden
            w-[90vw] max-w-xs p-3
            sm:w-[80vw] sm:max-w-md sm:p-4
            md:w-[70vw] md:max-w-lg
            lg:w-full lg:max-w-2xl"
        >
          <div className="w-full flex items-center justify-center">
            <div
              className="relative flex w-full items-center justify-center rounded-[1.25rem] border border-white/10 bg-linear-to-br from-sky-950/90 to-slate-950/90
                aspect-2/1 min-h-24
                sm:aspect-2/1 sm:min-h-44
                md:aspect-2/1 md:min-h-56
                lg:aspect-video lg:min-h-96"
            >
              <span className="text-sm font-medium text-sky-100/72 sm:text-base">Project Video Placeholder</span>
              <a
                href={site}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 inline-flex items-center justify-center rounded-[1.1rem] border border-sky-200/70 bg-[#bfe4ff] px-4 py-2 text-xs font-semibold text-blue-950 shadow-[0_10px_24px_rgba(18,53,92,0.2)] transition hover:bg-[#dff3ff] focus:outline-none focus:ring-2 focus:ring-sky-300 sm:bottom-4 sm:right-4 sm:px-5 sm:py-2.5 sm:text-sm"
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
