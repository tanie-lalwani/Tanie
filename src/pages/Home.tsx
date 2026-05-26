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
      "Viziona is a web project by Tanie, built with a focus on clean UI, modern frontend development, and practical product execution.",
    techStack: ["React", "TypeScript", "GitHub"],
    site: "https://viziona.com",
    code: "https://github.com/taniemp3/viziona",
  },
  {
    title: "Checkout Performance Overhaul — FinchPay",
    description:
      "This project explores interactive frontend development with a focus on usability, motion, performance, and modern web experiences using React and TypeScript.",
    techStack: ["React", "TypeScript", "Node.js"],
    site: "https://finchpay.example",
  },
  {
    title: "Marketing Site Rebuild — Leafline",
    description:
      "This project explores interactive frontend development with a focus on usability, motion, performance, and modern web experiences using React and TypeScript.",
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
            title="About me."
            description=""
            className="mb-3 max-w-xl [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white/94 sm:[&_h2]:text-4xl md:[&_h2]:text-5xl"
          />

          <p className="mt-1 max-w-lg text-[10px] font-medium uppercase tracking-[0.18em] text-slate-200/34 sm:text-[11px]">
            3D Developer · Creative Developer · Full-Stack Web Developer · GitHub: taniemp3
          </p>

          <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/8 pb-2.5 sm:mb-5" />

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.85fr)] lg:items-center">
            <div>
              <p className="max-w-[36rem] text-[0.82rem] leading-6 text-white/62 sm:text-sm">
                Hi, I’m Tanie, also known as tanie.mp3 and Tanisha Lalwani. I’m a React developer, 3D developer, creative developer, and full stack developer making interactive websites, immersive web experiences, and modern web applications. This tanie portfolio at tanie.me connects my developer work, creator work, GitHub projects, and selected web builds. Using React, TypeScript, Node.js, Three.js, and GitHub workflows, I turn ideas into engaging and technically strong web experiences. I’m open to creative, portfolio, and business web projects. Check out my qna above or scroll down to see some of my work!
              </p>

              <p className="mt-3 max-w-[36rem] text-[0.78rem] leading-5 text-white/50 sm:text-xs">
                Who is Tanie? Tanie is tanie.mp3: a React developer, creative developer, 3D web developer, and creator building web projects and sharing code on GitHub as taniemp3.
              </p>

              <div className="mt-4 flex max-w-xl flex-wrap gap-1.5">
                {[
                  "tanie.mp3",
                  "tanie mp3",
                  "tanie.me",
                  "Tanie",
                  "Tanisha Lalwani",
                  "taniemp3",
                  "tanie developer",
                  "tanie portfolio",
                  "tanie react",
                  "tanie singer",
                  "who is Tanie",
                  "3D Developer",
                  "React Developer",
                  "React",
                  "TypeScript",
                  "Three.js",
                  "Node.js",
                  "Frontend Development",
                  "GitHub",
                  "Interactive Websites",
                ].map((t) => (
                  <span key={t} className="rounded-full border border-white/9 bg-white/4 px-2 py-0.5 text-[10px] font-medium text-sky-100/50">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <a
                  href="https://www.google.com/search?q=who+is+tanisha+lalwani+tanie"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ui-button-link"
                >
                  Know more
                </a>
              </div>

              <p className="mt-3 max-w-xl text-[11px] text-sky-100/42 sm:text-xs">
                LinkedIn still connects through Tanisha Lalwani, while the site name stays focused on tanie.mp3.
              </p>
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
            title="Tanie portfolio."
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




