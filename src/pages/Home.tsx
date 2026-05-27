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
      "A responsive web application shaped around clear interaction, UI/UX design, and practical product execution.",
    techStack: ["React", "TypeScript", "UI/UX"],
    site: "https://viziona.com",
    code: "https://github.com/taniemp3/viziona",
  },
  {
    title: "Checkout Performance Overhaul - FinchPay",
    description:
      "A frontend performance optimization pass for faster checkout flows, clearer states, and smoother feedback.",
    techStack: ["React", "TypeScript", "Performance"],
    site: "https://finchpay.example",
  },
  {
    title: "Marketing Site Rebuild - Leafline",
    description:
      "A modern frontend rebuild with tighter content structure, responsive layouts, and a calmer visual system.",
    techStack: ["React", "TypeScript", "Web development"],
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
        aria-labelledby="home-title"
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
          <header className="relative max-w-none">
            <h1
              id="home-title"
              className="mt-4 text-4xl font-bold tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              I'm Tanie!
            </h1>
            <p className="mt-1 max-w-lg text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200/36 sm:text-[11px]">
              Creative Developer
            </p>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-blue-950 sm:text-base">
              I make interactive websites, 3D web experiences, and modern responsive web applications with React, TypeScript, and thoughtful frontend engineering.
            </p>
          </header>
        </motion.div>
      </motion.section>

      <section
        id="about"
        aria-labelledby="about-title"
        className="relative isolate flex min-h-[88svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="before you scroll..."
            titleId="about-title"
            description="A bit about me."
            className="mb-4 max-w-[62ch]"
            />

          <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/7 pb-2.5 sm:mb-6" />

          <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.82fr)] lg:items-center">
            <article aria-label="About Tanie Lalwani">
              <div className="max-w-[60ch] space-y-3.5 text-[0.82rem] leading-6 text-slate-200/48 sm:text-sm">
                <p>Looking for a portfolio website, an interactive web experience, a modern frontend build, or a landing page that feels intentional?</p>

                <p>I'm a frontend developer and React developer who has spent the last two years building, experimenting, and learning what makes interfaces feel genuinely enjoyable to use.</p>

                <p>I like clean TypeScript developer workflows, polished interaction, UI/UX design details, and web development that feels useful without losing personality.</p>
              </div>

              <div className="mt-5">
                <a href="https://www.google.com/search?q=Tanie+Lalwani" target="_blank" rel="noopener noreferrer" className="inline-flex border-b border-white/14 pb-0.5 text-sm font-medium text-slate-200/54 no-underline transition hover:border-white/34 hover:text-white/82" aria-label="Search for more information about Tanie Lalwani">
                  Know more
                </a>
              </div>
            </article>

            <figure
              className="relative h-52 w-full overflow-hidden rounded-2xl border border-white/7 bg-white/4 sm:h-60"
            >
              <img
                src="/about-workspace.jpg"
                alt="Laptop workspace with colorful light for Tanie Lalwani's creative web development portfolio"
                className="h-full w-full object-cover opacity-82"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-br from-slate-950/10 via-sky-100/4 to-slate-950/28" />
            </figure>
          </div>
        </div>
      </section>

      <section
        id="projects"
        aria-labelledby="projects-title"
        className="relative isolate flex min-h-[88svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="Built so far..."
            titleId="projects-title"
            description="Projects and testimonials."
            className="mb-4 max-w-[62ch]"
            />
          <div className="relative w-full">
            <ProjectsCarousel projects={PROJECTS} />
          </div>
        </div>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-title"
        className="relative isolate flex min-h-[88svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="Let's build ..."
            titleId="contact-title"
            description="Let's bring your ideas to life."
            className="mb-4 max-w-[62ch]"
          />

          <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/7 pb-3 sm:mb-6" />

          <ContactForm />
        </div>
      </section>
    </main>
  )
}




