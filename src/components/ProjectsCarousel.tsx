import { ProjectCard } from "./ProjectCard"
import { useLanguage } from "../context/LanguageContext"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

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

const projectDetails = [
  "Viziona was built as a polished product surface with a strong focus on responsive layout, clear visual hierarchy, and smooth interaction states. The work balances brand presence with practical usability, keeping the interface easy to scan while still feeling distinctive.",
  "The project highlights frontend execution across structure, motion, spacing, and cross-device behavior. Each section is shaped to guide the user naturally from first impression to action, with careful attention to readable content, reliable components, and a modern React and TypeScript workflow.",
]

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const { copy } = useLanguage()
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!activeProject) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProject(null)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeProject])

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
        {projects.map((project, index) => (
          <ProjectCard
            key={`${project.site}-${index}`}
            title={project.title}
            description={project.description}
            onOpen={() => setActiveProject(project)}
          />
        ))}
      </div>

      <section className="sr-only" aria-label="Project details">
        {projects.map((project, index) => (
          <article key={`${project.site}-seo-${index}`}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {projectDetails.map((detail) => <p key={detail}>{detail}</p>)}
            <a href={project.site}>{copy.projectCard.view}</a>
            {project.code ? <a href={project.code}>{copy.projectCard.code}</a> : null}
          </article>
        ))}
      </section>

      {activeProject && typeof document !== "undefined" ? createPortal(
        <div
          className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] items-stretch justify-center overflow-y-auto bg-slate-950 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative min-h-full w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/58 text-lg leading-none text-slate-100/70 shadow-[0_18px_55px_rgba(2,8,23,0.32)] backdrop-blur-xl transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/24 sm:right-6 sm:top-6"
              aria-label="Close project details"
              onClick={() => setActiveProject(null)}
            >
              x
            </button>

            <article className="grid min-h-[calc(100vh-2rem)] content-center gap-5 py-12 sm:min-h-[calc(100vh-3rem)] sm:py-14 lg:grid-cols-[minmax(0,1.28fr)_minmax(18rem,0.72fr)] lg:items-center">
              <div className="project-visual project-video relative aspect-video w-full overflow-hidden rounded-2xl border border-white/8 shadow-[0_26px_75px_rgba(2,8,23,0.35)]">
                <video
                  src="/project-preview.mp4"
                  className="absolute inset-0 h-full w-full object-cover opacity-72"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/56 via-slate-950/12 to-transparent" />
              </div>

              <div className="max-w-[60ch] lg:pl-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-sky-200/44">
                  {copy.home.projectsTitle}
                </p>
                <h2
                  id="project-detail-title"
                  className="mt-3 text-[2.25rem] font-semibold tracking-normal text-white sm:text-[2.85rem]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {activeProject.title}
                </h2>
                <div className="mt-4 max-h-[38vh] overflow-y-auto pr-3 text-[12px] font-medium leading-7 tracking-[0.14em] text-slate-200/68 sm:text-[13px] sm:tracking-[0.16em] lg:max-h-[44vh]">
                  <p>{activeProject.description}</p>
                  {projectDetails.map((detail) => <p className="mt-4" key={detail}>{detail}</p>)}
                </div>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  <a
                    href={activeProject.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-sky-200/20 bg-sky-100/10 px-4 py-2 text-[10px] font-medium tracking-[0.18em] no-underline text-slate-100/78 transition hover:bg-sky-100/16 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/24"
                  >
                    {copy.projectCard.view}
                  </a>
                  {activeProject.code ? (
                    <a
                      href={activeProject.code}
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-white/8 bg-white/5 px-4 py-2 text-[10px] font-medium tracking-[0.18em] no-underline text-slate-100/64 transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/22"
                    >
                      {copy.projectCard.code}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        </div>
      , document.body) : null}
    </div>
  )
}
