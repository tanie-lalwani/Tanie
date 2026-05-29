import { motion } from "framer-motion"
import type { KeyboardEvent } from "react"

interface ProjectCardProps {
  title: string
  description: string
  onOpen: () => void
}

export function ProjectCard({ title, description, onOpen }: ProjectCardProps) {
  const titleId = `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`

  const openFromKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    onOpen()
  }

  return (
    <motion.article
      aria-labelledby={titleId}
      role="button"
      tabIndex={0}
      className="relative h-full shrink-0 snap-start cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/24"
      onClick={onOpen}
      onKeyDown={openFromKeyboard}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="relative w-[78vw] max-w-xs overflow-visible sm:w-[22.5rem] sm:max-w-none md:w-[25.5rem] lg:w-[27.5rem]">
          <div className="flex w-full flex-col gap-3.5">
            <div className="flex w-full items-center justify-center">
              <div
                className="project-visual project-video relative flex aspect-2/1 min-h-20 w-full items-center justify-center overflow-hidden rounded-xl border border-white/6 shadow-[0_16px_44px_rgba(2,8,23,0.2)] sm:min-h-28 md:min-h-36 lg:aspect-video lg:min-h-40"
              >
                <video
                  src="/project-preview.mp4"
                  className="absolute inset-0 h-full w-full object-cover opacity-62"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-slate-950/20" />
                <div className="absolute bottom-4 left-4 right-4 h-1 rounded-full bg-white/10">
                  <div className="project-video-progress h-full rounded-full bg-sky-100/42" />
                </div>
                <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-sky-100/62 shadow-[0_0_18px_rgba(186,230,253,0.55)]" />
                <p className="absolute bottom-3 right-3 text-[9px] font-medium uppercase tracking-[0.22em] text-slate-100/48">
                  Open
                </p>
              </div>
            </div>

            <div className="relative px-1 pt-0.5">
              <h3 id={titleId} className="text-[10px] font-medium leading-5 tracking-[0.18em] text-slate-100/58 sm:text-[11px]" style={{ fontFamily: "var(--font-body)" }}>
                {title}
              </h3>
              <p className="copy-clamp mt-1 max-w-[58ch] text-[10px] font-medium leading-5 tracking-[0.18em] text-slate-200/36 sm:text-[11px]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
