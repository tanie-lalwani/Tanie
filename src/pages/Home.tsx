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

const RECIPIENT_EMAIL = "contact@tanie.me"

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

      {/* Hero Section */}
      <motion.section
        id="home"
        className="relative isolate flex min-h-[200svh] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[200svh] sm:px-6 sm:pb-14 sm:pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(39,39,42,0)_0%,rgba(39,39,42,0.08)_72%,rgba(39,39,42,0.18)_100%)]" />
        <motion.div
          className="relative z-10 mx-auto w-full max-w-6xl"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative max-w-2xl">
            <h1
              className="text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              I'm Tanisha.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-sky-900 sm:text-base">
              Full-stack developer building immersive, creative experiences. Portfolios, games, dashboards, and everything in
              between. Scroll to see my work or jump to the contact form.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Projects Section */}
      <section
        id="projects"
        className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:pb-14 sm:pt-24"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <PageHeader
            eyebrow="What I Have Built"
            title="Client testimonials"
            description=""
            className="**:text-white"
          />

          <div className="relative mx-auto w-full max-w-4xl">
            <ProjectsCarousel projects={PROJECTS} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:pb-14 sm:pt-24"
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <PageHeader
            eyebrow="Contact"
            title="Let's start building"
            description={`Fill out the form and I will get back to you at ${RECIPIENT_EMAIL}.`}
            className="**:text-white"
          />

          <ContactForm />
        </div>
      </section>
    </main>
  )
}




