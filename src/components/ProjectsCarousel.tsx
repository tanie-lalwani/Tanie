import { ProjectCard } from "./ProjectCard"
import { useLanguage } from "../context/LanguageContext"

export interface Project {
  title: string
  description: string
  techStack: string[]
  site: string
  code?: string
}

interface ProjectsCarouselProps {
  projects: Project[]
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const { copy } = useLanguage()

  return (
    <div className="relative w-full" aria-label={copy.home.projectsTitle}>
      <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/7 pb-2.5 sm:mb-4">
        <p className="ml-auto inline-flex text-[11.5px] font-medium uppercase tracking-[0.2em] text-sky-200/55">
          {String(projects.length).padStart(2, "0")} {copy.projectCard.projectsCountSuffix}
        </p>
      </div>

      <div
        className="project-scroll -mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-9 sm:-mx-6 sm:gap-4 sm:px-6 sm:pb-10"
        aria-label={copy.home.projectsTitle}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.site}
            title={project.title}
            description={project.description}
            site={project.site}
            code={project.code}
          />
        ))}
      </div>
    </div>
  )
}
