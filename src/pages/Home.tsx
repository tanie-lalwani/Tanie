import { motion, useScroll, useTransform } from "framer-motion"
import PageHeader from "../components/PageHeader"
import { ProjectsCarousel } from "../components/ProjectsCarousel"
import { ContactForm } from "../components/ContactForm"
import GlobalOceanBackdrop from "../experience/Scenes/GlobalOceanBackdrop"
import { useIsMobile } from "../hooks/useIsMobile"
import type { TimePhase } from "../experience/timePhase"

type Project = {
  title: string
  description: string
  techStack: string[]
  site: string
  code?: string
}

const PROJECTS: Project[] = [
  {
    title: "Viziona",
    description:
      "A focused web project shaped around clear interaction, clean interface decisions, and practical product execution.",
    techStack: ["React", "TypeScript", "UI"],
    site: "https://viziona.com",
    code: "https://github.com/taniemp3/viziona",
  },
  {
    title: "Checkout Performance Overhaul — FinchPay",
    description:
      "A frontend performance pass focused on faster checkout flows, clearer states, and smoother user feedback.",
    techStack: ["React", "TypeScript", "Node.js"],
    site: "https://finchpay.example",
  },
  {
    title: "Marketing Site Rebuild — Leafline",
    description:
      "A modern site rebuild with tighter content structure, responsive layouts, and a calmer visual system.",
    techStack: ["React", "TypeScript", "Design"],
    site: "https://leafline.example",
  },
]


type HomeProps = {
  phase: TimePhase
  onSceneReady?: () => void
}

export default function Home({ phase, onSceneReady }: HomeProps) {
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll()
  const worldDiveProgress = useTransform(scrollYProgress, [0, isMobile ? 0.65 : 0.4], [0, 1])

  return (
    <main className="relative">
      <GlobalOceanBackdrop
        phase={phase}
        onReady={onSceneReady}
        position="fixed"
        depthStage="surface"
        enableContinuousDive
        diveProgressValue={worldDiveProgress}
      />

      <motion.section
        id="home"
        className="relative isolate flex min-h-[165svh] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[140svh] sm:px-6 sm:pb-14 sm:pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="site-container relative z-10"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative max-w-none">
            <h1
              className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              I’m Tanie!
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-blue-950 sm:text-base">
              I’m Tanie, a creative developer and full stack developer making interactive websites, 3D/immersive web experiences, and modern web applications. Scroll to see my work or jump to the contact section.
            </p>
          </div>
        </motion.div>
      </motion.section>

      <section
        id="about"
        className="relative isolate flex min-h-[88svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="About Tanie"
            description=""
            className="mb-3 max-w-xl [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white/94 sm:[&_h2]:text-4xl md:[&_h2]:text-5xl"
          />

          <p className="mt-1 max-w-lg text-[10px] font-medium uppercase tracking-[0.18em] text-black sm:text-[11px]">
            Creative Developer · Full-Stack Web Developer · Creator
          </p>

          <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/8 pb-2.5 sm:mb-5" />

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.85fr)] lg:items-center">
            <div>
              <p className="max-w-[36rem] text-[0.82rem] leading-6 text-black sm:text-sm">
                Tanie Lalwani is a creative developer and builder focused on interactive web experiences, thoughtful interfaces, and modern digital products. Working across frontend and full-stack development, she enjoys turning ideas into experiences that feel intuitive, immersive, and genuinely enjoyable to use.
              </p>

              <div className="mt-4 flex max-w-xl flex-wrap gap-1.5">
                {[
                  "React",
                  "TypeScript",
                  "Three.js",
                  "Full-Stack",
                  "Creative Development",
                  "UI Engineering",
                  "Node.js",
                  "Interactive Web",
                ].map((t) => (
                  <span key={t} className="rounded-full border border-white/9 bg-white/4 px-2 py-0.5 text-[10px] font-medium text-sky-100/50">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <a href="https://www.google.com/search?q=tanie+lalwani" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold underline">
                  Know more
                </a>
              </div>
            </div>

            <div
              className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-64"
              aria-label="About me image placeholder"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/9 via-sky-100/5 to-slate-950/20" />
              <div className="absolute inset-0 grid place-items-center text-xs font-semibold uppercase tracking-[0.22em] text-white/55">
                Image Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="relative isolate flex min-h-[88svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="Built so far."
            description=""
            className="mb-4 max-w-2xl [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white/94 sm:[&_h2]:text-4xl md:[&_h2]:text-5xl"
          />

          <div className="mt-3 flex flex-wrap gap-1.5">
            {"React, TypeScript, Three.js, Node.js".split(", ").map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.16em] text-white/48"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="relative w-full">
            <ProjectsCarousel projects={PROJECTS} />
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative isolate flex min-h-[88svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="Let's build something."
            description=""
            className="mb-3 max-w-2xl [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white/94 sm:[&_h2]:text-4xl md:[&_h2]:text-5xl"
          />

          <p className="mt-4 max-w-xl text-xs font-medium text-slate-200/36 sm:text-sm">
            Open to creative, portfolio, and business web projects.
          </p>

          <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3 sm:mb-5" />

          <ContactForm />
        </div>
      </section>
    </main>
  )
}




