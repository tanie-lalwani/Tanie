import { motion } from "framer-motion"
import { useLanguage } from "../context/LanguageContext"

interface ProjectCardProps {
  site: string
  code?: string
  title: string
  description: string
  techStack: string[]
}

export function ProjectCard({ site, code, title, description, techStack }: ProjectCardProps) {
  const { copy } = useLanguage()
  const titleId = `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`

  return (
    <motion.article
      aria-labelledby={titleId}
      className="relative h-full shrink-0 snap-start"
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
                aria-hidden="true"
                className="project-visual project-video relative flex aspect-2/1 min-h-20 w-full items-center justify-center overflow-hidden rounded-xl border border-white/6 shadow-[0_16px_44px_rgba(2,8,23,0.2)] sm:min-h-28 md:min-h-36 lg:aspect-video lg:min-h-40"
              >
                <video
                  src="/project-preview.mp4"
                  className="absolute inset-0 h-full w-full object-cover opacity-62"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-slate-950/20" />
                <div className="absolute bottom-4 left-4 right-4 h-1 rounded-full bg-white/10">
                  <div className="project-video-progress h-full rounded-full bg-sky-100/42" />
                </div>
              </div>
            </div>

            <div className="relative px-1 pt-0.5">
              <h3 id={titleId} className="text-[10px] font-medium leading-5 tracking-[0.18em] text-slate-100/58 sm:text-[11px]" style={{ fontFamily: "var(--font-body)" }}>
                {title}
              </h3>
              <p className="copy-clamp mt-1 max-w-[58ch] text-[10px] font-medium leading-5 tracking-[0.18em] text-slate-200/36 sm:text-[11px]">
                {description}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {techStack.map((t) => (
                  <span key={t} className="rounded-full border border-white/5 bg-white/2 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.18em] text-slate-200/34">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-sky-200/18 bg-sky-100/8 px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] no-underline text-slate-100/58 transition hover:bg-sky-100/12 hover:text-slate-50/74 focus:outline-none focus:ring-2 focus:ring-sky-300/24"
                  aria-label={`${copy.projectCard.view} ${title}`}
                >
                  {copy.projectCard.view}
                </a>
                {code ? (
                  <a
                    href={code}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/5 bg-transparent px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] no-underline text-slate-200/38 transition hover:bg-white/5 hover:text-slate-100/58 focus:outline-none focus:ring-2 focus:ring-sky-300/22"
                    aria-label={`${copy.projectCard.code} ${title}`}
                  >
                    {copy.projectCard.code}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
