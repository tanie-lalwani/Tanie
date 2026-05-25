import { ProjectCard } from "./ProjectCard"

export interface Project {
  title: string
  description: string
  techStack: string[]
  site: string
}

interface ProjectsCarouselProps {
  projects: Project[]
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  return (
    <div className="relative w-full">
      <div className="relative mb-3 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/8 pb-2.5 sm:mb-4">
        <p className="section-eyebrow ml-auto">
          {String(projects.length).padStart(2, "0")} projects
        </p>
      </div>

      <div
        className="project-scroll -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:gap-5 sm:px-6"
        aria-label="Projects"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.site}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            site={project.site}
          />
        ))}
      </div>
    </div>
  )
}
