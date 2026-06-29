import { ProjectCard } from "./ProjectCard"
import { useLanguage } from "../context/LanguageContext"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useIsMobile } from "../hooks/useIsMobile"

export interface Project {
  id?: string
  title: string
  description: string
  techStack: string[]
  site: string
  code?: string
  previewVideo?: string
  detailVideo?: string
  previewFit?: "cover" | "contain"
  details?: string[]
}

interface ProjectsCarouselProps {
  projects: Project[]
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const { copy } = useLanguage()
  const isMobile = useIsMobile()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const suppressClickRef = useRef(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const detailTitleId = activeProject?.id ? `${activeProject.id}-detail-title` : "project-detail-title"

  const updateScrollControls = () => {
    const scroller = scrollRef.current
    if (!scroller) return

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
    setCanScrollLeft(scroller.scrollLeft > 4)
    setCanScrollRight(scroller.scrollLeft < maxScrollLeft - 4)
  }

  const scrollProjects = (direction: -1 | 1) => {
    const scroller = scrollRef.current
    if (!scroller) return

    const card = scroller.querySelector("article")
    const cardWidth = card?.getBoundingClientRect().width ?? scroller.clientWidth * 0.8
    const computedStyle = window.getComputedStyle(scroller)
    const gapValue = computedStyle.columnGap || computedStyle.gap || "0"
    const gap = Number.parseFloat(gapValue) || 0

    scroller.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return

    let startX = 0
    let startY = 0
    let startScrollLeft = 0
    let lock: "x" | "y" | null = null

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return

      const touch = event.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startScrollLeft = scroller.scrollLeft
      lock = null
      suppressClickRef.current = false
    }

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return

      const touch = event.touches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (!lock && (absX > 8 || absY > 8)) {
        lock = absX > absY * 1.08 ? "x" : "y"
      }

      if (lock !== "x") return

      event.preventDefault()
      suppressClickRef.current = absX > 10
      scroller.scrollLeft = startScrollLeft - deltaX
    }

    const onTouchEnd = () => {
      lock = null
      startX = 0
      startY = 0
      startScrollLeft = scroller.scrollLeft
    }

    if (isMobile) {
      scroller.addEventListener("touchstart", onTouchStart, { passive: true })
      scroller.addEventListener("touchmove", onTouchMove, { passive: false })
      scroller.addEventListener("touchend", onTouchEnd)
      scroller.addEventListener("touchcancel", onTouchEnd)
    }

    const onWheel = (event: WheelEvent) => {
      const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.8
      if (!horizontalDelta) return

      event.preventDefault()
      event.stopPropagation()
      scroller.scrollLeft += event.deltaX
    }

    scroller.addEventListener("wheel", onWheel, { passive: false })

    updateScrollControls()
    window.addEventListener("resize", updateScrollControls)
    const resizeObserver = new ResizeObserver(updateScrollControls)
    resizeObserver.observe(scroller)

    return () => {
      scroller.removeEventListener("touchstart", onTouchStart)
      scroller.removeEventListener("touchmove", onTouchMove)
      scroller.removeEventListener("touchend", onTouchEnd)
      scroller.removeEventListener("touchcancel", onTouchEnd)
      scroller.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", updateScrollControls)
      resizeObserver.disconnect()
    }
  }, [isMobile])

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
        <a
          href="https://tanie.me/projects"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex text-[11.5px] font-medium uppercase tracking-[0.2em] !text-sky-200/90 underline transition hover:!text-sky-100/80"
        >
          {copy.projectCard.allProjects}
        </a>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="project-scroll -mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-9 sm:-mx-6 sm:gap-4 sm:px-6 sm:pb-10"
          style={{
            touchAction: isMobile ? "pan-y pinch-zoom" : "pan-x pan-y",
            overscrollBehaviorX: "contain",
            WebkitOverflowScrolling: "touch",
          }}
          aria-label={copy.home.projectsTitle}
          onScroll={updateScrollControls}
          onClickCapture={(event) => {
            if (!suppressClickRef.current) return
            event.preventDefault()
            event.stopPropagation()
            suppressClickRef.current = false
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.site}-${index}`}
              titleId={project.id}
              title={project.title}
              description={project.description}
              openLabel={copy.projectCard.open}
              previewVideo={project.previewVideo}
              previewFit={project.previewFit}
              onOpen={() => setActiveProject(project)}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-between px-1 lg:px-0">
          <button
            type="button"
            aria-label="Scroll projects left"
            onClick={() => scrollProjects(-1)}
            disabled={!canScrollLeft}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-none border-0 bg-transparent p-0 text-slate-100/85 shadow-none transition hover:text-white focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-35 sm:h-12 sm:w-12"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:h-8.5 sm:w-8.5">
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll projects right"
            onClick={() => scrollProjects(1)}
            disabled={!canScrollRight}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-none border-0 bg-transparent p-0 text-slate-100/85 shadow-none transition hover:text-white focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-35 sm:h-12 sm:w-12"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:h-8.5 sm:w-8.5">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </div>

      <section className="sr-only" aria-label={copy.projectCard.projectDetails}>
        {projects.map((project, index) => (
          <article key={`${project.site}-seo-${index}`}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {(project.details ?? copy.projectCard.defaultProjectDetails).map((detail) => <p key={detail}>{detail}</p>)}
            <a href={project.site} tabIndex={-1}>{copy.projectCard.view}</a>
            {project.code ? <a href={project.code} tabIndex={-1}>{copy.projectCard.code}</a> : null}
          </article>
        ))}
      </section>

      {activeProject && typeof document !== "undefined" ? createPortal(
        <div
          className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] items-stretch justify-center overflow-y-auto bg-slate-950 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={detailTitleId}
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative min-h-full w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/58 text-lg leading-none text-slate-100/70 shadow-[0_18px_55px_rgba(2,8,23,0.32)] backdrop-blur-xl transition hover:bg-white/8 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/24 sm:right-6 sm:top-6"
              aria-label={copy.projectCard.closeDetails}
              onClick={() => setActiveProject(null)}
            >
              x
            </button>

            <article className="grid min-h-[calc(100vh-2rem)] content-center gap-5 py-12 sm:min-h-[calc(100vh-3rem)] sm:py-14 lg:grid-cols-[minmax(0,1.28fr)_minmax(18rem,0.72fr)] lg:items-center">
              <div className="project-visual project-video relative aspect-video w-full overflow-hidden rounded-2xl border border-white/8 shadow-[0_26px_75px_rgba(2,8,23,0.35)]">
                <video
                  src={activeProject.detailVideo ?? "/project-preview.mp4"}
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
                  id={detailTitleId}
                  className="mt-3 text-[2.25rem] font-semibold tracking-normal text-white sm:text-[2.85rem]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {activeProject.title}
                </h2>
                <div className="mt-4 max-h-[38vh] overflow-y-auto pr-3 text-[13px] font-medium leading-7 tracking-normal text-slate-200/70 sm:text-sm lg:max-h-[44vh]">
                  <p>{activeProject.description}</p>
                  {(activeProject.details ?? copy.projectCard.defaultProjectDetails).map((detail) => <p className="mt-4" key={detail}>{detail}</p>)}
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
