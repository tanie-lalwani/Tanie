import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ProjectCard } from "./ProjectCard"

export interface Project {
  client: string
  role: string
  project: string
  site: string
  quote: string
  outcome: string
}

interface ProjectsCarouselProps {
  projects: Project[]
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = projects[activeIndex]

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <div className="relative w-full">
      <div className="relative mb-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-700/30 pb-2.5 sm:mb-3 sm:pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={goToPrev}
            className="inline-flex items-center justify-center rounded-lg border border-sky-700/30 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-950 transition-all duration-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0 active:bg-sky-200/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="inline-flex items-center justify-center rounded-lg border border-sky-700/30 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-950 transition-all duration-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0 active:bg-sky-200/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="relative min-h-72 sm:min-h-80">
        <AnimatePresence mode="wait">
          <ProjectCard key={activeProject.site} {...activeProject} />
        </AnimatePresence>
      </div>
    </div>
  )
}
