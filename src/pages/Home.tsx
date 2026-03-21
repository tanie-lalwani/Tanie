import { motion, useScroll, useTransform } from "framer-motion"
import PageHeader from "../components/PageHeader"
import { ProjectsCarousel, type Project } from "../components/ProjectsCarousel"
import { ContactForm } from "../components/ContactForm"
import GlobalBeachBackdrop from "../experience/GlobalBeachBackdrop"
import type { TimePhase } from "../experience/timePhase"

const PROJECTS: Project[] = [
  {
    client: "Brightlane",
    role: "Founder",
    project: "SaaS Dashboard Redesign",
    site: "https://brightlane.example",
    quote: "The product finally feels obvious to first-time users.",
    outcome: "Onboarding clarity improved and support friction dropped in early sessions.",
  },
  {
    client: "FinchPay",
    role: "Product Team",
    project: "Checkout Performance Overhaul",
    site: "https://finchpay.example",
    quote: "We saw a noticeable lift in successful completions after launch.",
    outcome: "Payment flow became clearer and completion quality improved across mobile.",
  },
  {
    client: "Leafline",
    role: "CTO",
    project: "Marketing Site Rebuild",
    site: "https://leafline.example",
    quote: "The new site tells the story in half the clicks.",
    outcome: "Storytelling sharpened with a cleaner path from landing to conversion.",
  },
]


type HomeProps = {
  phase: TimePhase
}

export default function Home({ phase }: HomeProps) {
  const { scrollYProgress } = useScroll()
  const worldDiveProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <main className="relative">
      <GlobalBeachBackdrop
        phase={phase}
        position="fixed"
        depthStage="surface"
        enableContinuousDive
        diveProgressValue={worldDiveProgress}
      />

      <motion.section
        id="home"
        className="relative isolate flex min-h-[140svh] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[140svh] sm:px-6 sm:pb-14 sm:pt-24"
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
              I'm Tanie.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-950 sm:text-base">
              I'm Tanisha Lalwani, also known as Tanie, a full-stack developer building immersive, creative experiences. Portfolios, games, dashboards, and everything in between. Scroll to see my work or jump to the contact form.
            </p>
          </div>
        </motion.div>
      </motion.section>

      <section
        id="projects"
        className="relative isolate flex min-h-[80svh] w-full items-start overflow-hidden px-4 pb-8 pt-6 sm:min-h-[80vh] sm:px-6 sm:pb-10 sm:pt-10"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="Built so far."
            description=""
            className="[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-white sm:[&_h1]:text-5xl md:[&_h1]:text-6xl lg:[&_h1]:text-7xl"
          />

          <div className="relative w-full">
            <ProjectsCarousel projects={PROJECTS} />
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:pb-14 sm:pt-24"
      >
        <div className="site-container relative z-10">
          <PageHeader
            eyebrow=""
            title="Let's build something."
            description=""
            className="[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-white sm:[&_h1]:text-5xl md:[&_h1]:text-6xl lg:[&_h1]:text-7xl"
          />

          <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/12 pb-3 sm:mb-5" />

          <ContactForm />
        </div>
      </section>
    </main>
  )
}




