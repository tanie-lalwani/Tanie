import { motion } from "framer-motion"

interface ProjectCardProps {
  site: string
  code?: string
  title: string
  description: string
  techStack: string[]
}

export function ProjectCard({ site, code, title, description, techStack }: ProjectCardProps) {
  return (
    <motion.article
      className="relative h-full shrink-0 snap-start"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex h-full flex-col items-center justify-center">
        <div
          className="surface-panel relative w-[82vw] max-w-xs overflow-hidden p-3 sm:w-[24rem] sm:max-w-none sm:p-4 md:w-[27rem] lg:w-[29rem]"
        >
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center justify-center">
              <div
                aria-hidden="true"
                className="project-visual relative flex aspect-2/1 min-h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-white/8 sm:min-h-36 md:min-h-48 lg:aspect-video lg:min-h-52"
              >
                <div className="absolute inset-x-8 top-1/2 h-px bg-white/18" />
                <div className="absolute inset-y-8 left-1/2 w-px bg-white/10" />
                <div className="h-10 w-24 rounded-full border border-white/10 bg-white/5 blur-[1px]" />
              </div>
            </div>

            <div className="relative">
              <h3 className="text-base font-semibold leading-tight text-white/92" style={{ fontFamily: "var(--font-display)" }}>
                {title}
              </h3>
              <p className="copy-clamp mt-1.5 max-w-xl text-xs leading-5 text-sky-100/52 sm:text-[0.82rem]">
                {description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {techStack.map((t) => (
                  <span key={t} className="rounded-full border border-white/7 bg-white/3 px-1.5 py-0.5 text-[9px] font-medium text-sky-100/45">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/7 px-3 py-1.5 text-[10px] font-medium no-underline text-sky-50/64 transition hover:bg-white/12 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/40"
                  aria-label={`Visit project site: ${title}`}
                >
                  View
                </a>
                {code ? (
                  <a
                    href={code}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/7 px-3 py-1.5 text-[10px] font-medium no-underline text-sky-50/64 transition hover:bg-white/12 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/40"
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
