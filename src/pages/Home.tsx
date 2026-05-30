import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
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

const PROJECT_TITLE_IDS = [
  "project-viziona-webapp-1",
  "project-finchpay-checkout-1",
  "project-leafline-marketing-1",
  "project-innomedia-agency-1",
  "project-lunara-portfolio-1",
  "project-neuroflow-dashboard-1",
  "project-pixelhaven-storefront-1",
]


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
  const [aboutExpanded, _setAboutExpanded] = useState(true)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll()
  const worldDiveProgress = useTransform(scrollYProgress, [0, isMobile ? 0.22 : 0.34], [0, 1])
  const aboutParagraphs = isMobile ? copy.home.aboutParagraphsMobile ?? copy.home.aboutParagraphs : copy.home.aboutParagraphs
  const projects: CarouselProject[] = Array.from({ length: 7 }, (_, index) => {
    const base = copy.home.projects[index % copy.home.projects.length]
    const project = { ...base, previewVideo: "/project-preview.mp4", detailVideo: "/project-preview.mp4" }
    const projectId = PROJECT_TITLE_IDS[index] ?? `project-${base.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${index + 1}`

    if (index === 4) {
      return {
        ...project,
        id: projectId,
        title: "Innomedia",
        description: "A lightweight 360 degree marketing company website built with basic HTML and CSS, then elevated with motion, animated sections, and flexible layouts.",
        techStack: ["HTML", "CSS", "Flex", "Animation"],
        previewVideo: "/Innomedia.mp4",
        previewFit: "contain",
        details: [
          "Innomedia is a generic 360 degree marketing company site shaped around simple service storytelling, clear page flow, and quick visual trust. The base was intentionally lean: HTML, CSS, flexible sections, and direct content structure.",
          "Even with a basic stack, the build adds motion through animated reveals, soft transitions, and layout rhythm so the site feels more alive than a static brochure. It is a practical example of making small frontend decisions feel polished without overengineering.",
        ],
      }
    }

    // Ensure each generated project instance has unique content/ids for SEO
    const uniqueIndex = index + 1
    return {
      ...project,
      id: projectId,
      description: `${project.description} (Demo ${uniqueIndex})`,
      site: `${project.site}?instance=${uniqueIndex}`,
      code: project.code ? `${project.code}?instance=${uniqueIndex}` : undefined,
    }
  })

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
        className="relative isolate flex min-h-[128svh] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[118svh] sm:px-6 sm:pb-14 sm:pt-24"
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
        className="relative isolate flex min-h-[78svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title={copy.home.aboutTitle}
            titleId="about-title"
            description=""
            className="mb-4 max-w-[62ch]"
            />

          <div className="relative mb-5 flex flex-wrap items-center justify-end gap-2.5 border-b border-white/7 pb-2.5 sm:mb-6">
            <a href="https://www.google.com/search?q=Tanie+Lalwani" target="_blank" rel="noopener noreferrer" className="inline-flex text-[11.5px] font-medium uppercase tracking-[0.2em] !text-sky-200/55 no-underline transition hover:!text-sky-100/80">
              {copy.home.knowMore}
            </a>
          </div>

          <div className="mt-5 grid w-full grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,20rem)] lg:items-start">
            <article className="max-w-[62ch]" aria-label="About Tanie Lalwani">
              <div data-lenis-prevent className={`about-scroll max-h-[calc(78svh-13rem)] space-y-3.5 pr-3 text-[12px] font-medium leading-6 tracking-[0.12em] text-slate-200/50 sm:max-h-[calc(76vh-12rem)] sm:text-[12.5px] sm:tracking-[0.16em] ${aboutExpanded ? "overflow-y-auto" : "overflow-hidden"}`}>
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>

              <div className="mt-5 flex items-center gap-4" />
            </article>

            <div className="hidden lg:block">
              <figure
                className="relative mx-auto h-[calc(76vh-12rem)] max-h-[26rem] min-h-64 w-full max-w-[18rem] overflow-hidden rounded-2xl border border-white/10 bg-white/4 sm:max-w-[20rem] lg:mx-0 lg:w-full"
              >
                <img
                  src="/favicon.png"
                  alt="Tanie Lalwani profile photo."
                  className="h-full w-full object-cover object-[center_40%] transform scale-100 opacity-82"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-br from-slate-950/10 via-sky-100/4 to-slate-950/28" />
                <a
                  href="/gallery"
                  className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-white/14 bg-slate-950/42 text-xl !text-white/72 !no-underline backdrop-blur-md transition hover:bg-white/10 hover:!text-white"
                  aria-label="Open gallery"
                >
                  ↗
                </a>
              </figure>

              <div className="mt-5 overflow-hidden sm:mt-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div
                  className="skills-marquee-track flex w-max items-center whitespace-nowrap text-[11px] font-medium tracking-[0.18em] text-slate-300/40 sm:text-[12px]"
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-label="Skills and capabilities"
                >
                  <span className="pr-10">{ABOUT_SKILLS_LINE}</span>
                  <span className="pr-10" aria-hidden="true">{ABOUT_SKILLS_LINE}</span>
                  <span className="pr-10" aria-hidden="true">{ABOUT_SKILLS_LINE}</span>
                  <span className="pr-10" aria-hidden="true">{ABOUT_SKILLS_LINE}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        aria-labelledby="projects-title"
        className="relative isolate flex min-h-[78svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
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
        className="relative isolate flex min-h-[78svh] w-full items-start overflow-hidden px-4 pb-7 pt-6 sm:min-h-[76vh] sm:px-6 sm:pb-9 sm:pt-9"
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




