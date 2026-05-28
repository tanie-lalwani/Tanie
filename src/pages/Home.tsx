import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import PageHeader from "../components/PageHeader"
import { ProjectsCarousel, type Project as CarouselProject } from "../components/ProjectsCarousel"
import { ContactForm } from "../components/ContactForm"
import GlobalOceanBackdrop from "../experience/Scenes/GlobalOceanBackdrop"
import { useIsMobile } from "../hooks/useIsMobile"
import type { TimePhase } from "../experience/timePhase"
import { useLanguage } from "../context/LanguageContext"

const ABOUT_SKILLS = [
  "React",
  "TypeScript",
  "Interactive UI",
  "Frontend Engineering",
  "Responsive Web Apps",
  "UI/UX Design",
  "Motion & Interaction",
  "Tailwind CSS",
  "Accessibility",
  "Performance",
  "Component Systems",
  "Creative Development",
]

const ABOUT_SKILLS_LINE = ABOUT_SKILLS.join(" · ")


type HomeProps = {
  phase: TimePhase
  onSceneReady?: () => void
}

function InterviewPrompt() {
  const { copy } = useLanguage()
  const [show, setShow] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    let timer = 0
    const onScroll = () => {
      const about = document.getElementById("about")
      if (!about || timer || show || hasShown) return
      if (about.getBoundingClientRect().top < window.innerHeight * 0.45) {
        timer = window.setTimeout(() => {
          setShow(true)
          setHasShown(true)
        }, 4000)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.clearTimeout(timer)
    }
  }, [hasShown, show])

  useEffect(() => {
    if (!show) return
    const timer = window.setTimeout(() => setShow(false), 4000)
    return () => window.clearTimeout(timer)
  }, [show])

  return (
    <>
      {show ? (
        <motion.aside
          className="fixed right-4 top-14 z-40 max-w-[15rem] rounded-2xl border border-white/8 bg-slate-950/34 px-4 py-3 text-[11.5px] font-medium tracking-[0.18em] text-slate-100/62 shadow-[0_18px_55px_rgba(2,8,23,0.22)] backdrop-blur-xl sm:right-6 sm:top-16 sm:text-[12.5px]"
          initial={{ opacity: 0, x: 16, y: -8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Interview page prompt"
        >
          <button
            type="button"
            className="absolute right-2 top-1.5 text-sm leading-none text-slate-200/38 transition hover:text-slate-100/70"
            aria-label="Dismiss interview prompt"
            onClick={() => {
              setShow(false)
              setHasShown(true)
            }}
          >
            ×
          </button>
          <Link to="/qna" className="!no-underline text-inherit">
            {copy.nav.interviewPrompt}
          </Link>
          <span className="absolute right-6 -top-5 h-5 w-px bg-sky-100/22" aria-hidden="true" />
        </motion.aside>
      ) : null}
    </>
  )
}

export default function Home({ phase, onSceneReady }: HomeProps) {
  const { copy } = useLanguage()
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const skillsTrackRef = useRef<HTMLDivElement | null>(null)
  const [skillsLoopDistance, setSkillsLoopDistance] = useState(0)
  const { scrollYProgress } = useScroll()
  const worldDiveProgress = useTransform(scrollYProgress, [0, isMobile ? 0.65 : 0.4], [0, 1])
  const projects: CarouselProject[] = copy.home.projects

  useEffect(() => {
    const track = skillsTrackRef.current
    if (!track) return

    const updateLoopDistance = () => {
      setSkillsLoopDistance(track.scrollWidth / 2)
    }

    updateLoopDistance()

    const observer = new ResizeObserver(updateLoopDistance)
    observer.observe(track)

    return () => observer.disconnect()
  }, [])

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
      <InterviewPrompt />

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
              {copy.home.heroTitle}
            </h1>
            <p className="mt-1 max-w-lg text-[11.5px] font-medium uppercase tracking-[0.18em] text-slate-200/54 sm:text-[12.5px]">
              {copy.home.heroRole}
            </p>

            <p className="mt-5 max-w-2xl text-[11.5px] font-medium leading-6 tracking-[0.18em] text-blue-950 sm:text-[12.5px]">
              {copy.home.heroDescription}
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
            title={copy.home.aboutTitle}
            titleId="about-title"
            description=""
            className="mb-4 max-w-[62ch]"
            />

          <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/7 pb-2.5 sm:mb-6" />

          <div className="mt-5 grid w-full grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,20rem)] lg:items-start">
            <article aria-label="About Tanie Lalwani">
              <div className="space-y-3.5 text-[11.5px] font-medium leading-6 tracking-[0.18em] text-slate-200/36 sm:text-[12.5px]">
                {copy.home.aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-5">
                <a href="https://www.google.com/search?q=Tanie+Lalwani" target="_blank" rel="noopener noreferrer" className="inline-flex border-b border-transparent pb-0.5 text-[11.5px] font-medium tracking-[0.18em] !text-slate-200/36 no-underline transition-colors duration-200 !hover:text-white !hover:border-white/20 sm:text-[12.5px]" aria-label="Search for more information about Tanie Lalwani">
                  {copy.home.knowMore}
                </a>
              </div>
            </article>

            <div className="hidden lg:block">
              <figure
                className="relative mx-auto aspect-[3/4] w-full max-w-[18rem] overflow-hidden rounded-2xl border border-white/10 bg-white/4 sm:max-w-[20rem] lg:mx-0 lg:w-full"
              >
                <img
                  src="/favicon.png"
                  alt="Tanie Lalwani profile photo."
                  className="h-full w-full object-cover object-center opacity-82"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-br from-slate-950/10 via-sky-100/4 to-slate-950/28" />
              </figure>

              <div className="mt-5 overflow-hidden sm:mt-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                {prefersReducedMotion ? (
                  <p
                    className="whitespace-nowrap text-[11px] font-medium tracking-[0.18em] text-slate-300/40 sm:text-[12px]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {ABOUT_SKILLS_LINE}
                  </p>
                ) : (
                  <motion.div
                    ref={skillsTrackRef}
                    className="flex w-max items-center whitespace-nowrap text-[11px] font-medium tracking-[0.18em] text-slate-300/40 sm:text-[12px]"
                    style={{ fontFamily: "var(--font-body)" }}
                    animate={skillsLoopDistance > 0 ? { x: [0, -skillsLoopDistance] } : undefined}
                    transition={{ duration: 32, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
                    aria-label="Skills and capabilities"
                  >
                    <span className="pr-10">{ABOUT_SKILLS_LINE}</span>
                    <span className="pr-10" aria-hidden="true">{ABOUT_SKILLS_LINE}</span>
                  </motion.div>
                )}
              </div>
            </div>
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
            title={copy.home.projectsTitle}
            titleId="projects-title"
            description=""
            className="mb-4 max-w-[62ch]"
            />
          <div className="relative w-full">
            <ProjectsCarousel projects={projects} />
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
            title={copy.home.contactTitle}
            titleId="contact-title"
            description=""
            className="mb-4 max-w-[62ch]"
          />

          <div className="relative mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/7 pb-3 sm:mb-6" />

          <ContactForm />
        </div>
      </section>
    </main>
  )
}




