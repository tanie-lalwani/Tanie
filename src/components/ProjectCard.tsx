import { motion } from "framer-motion"

interface ProjectCardProps {
  site: string
  code?: string
  title: string
  description: string
  techStack: string[]
}

export function ProjectCard({ site, code, title, description, techStack }: ProjectCardProps) {
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
                className="project-visual project-video relative flex aspect-2/1 min-h-22 w-full items-center justify-center overflow-hidden rounded-xl border border-white/6 shadow-[0_18px_55px_rgba(2,8,23,0.22)] sm:min-h-32 md:min-h-40 lg:aspect-video lg:min-h-44"
              >
                <div className="absolute inset-3 rounded-lg border border-white/6" />
                <div className="absolute left-4 top-4 h-1.5 w-16 rounded-full bg-white/18" />
                <div className="absolute bottom-4 left-4 right-4 h-1 rounded-full bg-white/10">
                  <div className="project-video-progress h-full rounded-full bg-sky-100/42" />
                </div>
              </div>
            </div>

            <div className="relative px-1">
              <h3 id={titleId} className="text-[0.98rem] font-semibold leading-tight text-white/90" style={{ fontFamily: "var(--font-display)" }}>
                {title}
              </h3>
              <p className="copy-clamp mt-1.5 max-w-[58ch] text-xs leading-5 text-sky-100/58 sm:text-[0.82rem]">
                {description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {techStack.map((t) => (
                  <span key={t} className="rounded-full border border-white/5 bg-white/2 px-1.5 py-0.5 text-[9px] font-medium text-sky-100/44">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-sky-200/28 bg-sky-100/13 px-3 py-1.5 text-[10px] font-medium no-underline text-sky-50/78 transition hover:bg-sky-100/17 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/32"
                  aria-label={`Visit project site: ${title}`}
                >
                  View
                </a>
                {code ? (
                  <a
                    href={code}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/6 bg-transparent px-3 py-1.5 text-[10px] font-medium no-underline text-sky-50/50 transition hover:bg-white/6 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/26"
                    aria-label={`View GitHub code for ${title}`}
                  >
                    Code
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
