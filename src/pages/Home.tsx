import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useState, type FormEvent } from "react"
import PageHeader from "../components/PageHeader"
import { SubmitSuccessEffect } from "../components/SubmitSuccessEffect"
import GlobalBeachBackdrop from "../experience/GlobalBeachBackdrop"
import type { TimePhase } from "../experience/timePhase"

const projects = [
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

const SUBJECT_PRESETS = ["New project", "Contract role", "Collaboration", "Quick question"]
const RECIPIENT_EMAIL = "contact@tanie.me"
const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT ?? ""
const TESTIMONIAL_TRANSITION_BUBBLES = [8, 14, 22, 31, 41, 53, 64, 73, 82, 91]
const DIVE_BUBBLE_PARTICLES = Array.from({ length: 52 }, (_, index) => {
  const seed = index + 1
  const wave = Math.sin(seed * 12.9898) * 43758.5453
  const noise = wave - Math.floor(wave)

  return {
    left: 2 + noise * 96,
    duration: 2.8 + (seed % 7) * 0.45 + noise * 0.7,
    delay: (seed % 11) * 0.22,
    size: 5 + (seed % 5) * 2,
    drift: -20 + ((seed * 17) % 41),
  }
})

type ContactFields = {
  name: string
  email: string
  subject: string
  message: string
}

const initialFields: ContactFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

type HomeProps = {
  phase: TimePhase
}

export default function Home({ phase }: HomeProps) {
  // Projects state
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = projects[activeIndex]

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  // Contact form state
  const [fields, setFields] = useState<ContactFields>(initialFields)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const { scrollYProgress } = useScroll()
  const stripDriftX = useTransform(scrollYProgress, [0, 1], [-18, 42])
  const stripShimmerX = useTransform(scrollYProgress, [0, 1], [-120, 165])
  const stripSheenOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.1, 0.18, 0.09])
  const stripTextureX = useTransform(scrollYProgress, [0, 1], [-24, 92])
  const stripTextureY = useTransform(scrollYProgress, [0, 1], [0, -10])
  const stripTextureOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [0.14, 0.24, 0.12])
  const dipOverlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.17, 0.31, 0.52, 0.72, 1],
    [0, 0.04, 0.2, 0.08, 0.26, 0.12],
  )
  const dipOverlayScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const dipOverlayY = useTransform(scrollYProgress, [0, 1], [0, -38])
  const lensSweepX = useTransform(scrollYProgress, [0, 0.4, 0.75, 1], [-45, 18, -10, 34])
  const lensSweepOpacity = useTransform(scrollYProgress, [0, 0.24, 0.48, 0.8, 1], [0, 0.14, 0.06, 0.18, 0.08])
  const diveProgress = useTransform(scrollYProgress, [0.34, 0.92], [0, 1])
  const diveFillScale = useTransform(diveProgress, [0, 1], [0, 1])
  const diveFillOpacity = useTransform(diveProgress, [0, 0.12, 0.48, 1], [0, 0.14, 0.62, 0.95])
  const diveBubbleOpacity = useTransform(diveProgress, [0, 0.1, 0.45, 1], [0, 0.1, 0.6, 1])
  const diveVeilOpacity = useTransform(diveProgress, [0.35, 0.74, 1], [0, 0.2, 0.5])
  const diveFlashOpacity = useTransform(diveProgress, [0.76, 0.88, 1], [0, 0.38, 0.14])
  const diveSheenX = useTransform(scrollYProgress, [0.28, 1], [-120, 180])

  const updateField = (key: keyof ContactFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!FORM_ENDPOINT) {
      setSubmitStatus("error")
      setSubmitMessage("Form endpoint is not configured.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      const subject = fields.subject || `Portfolio inquiry from ${fields.name || "Visitor"}`

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...fields,
          subject,
          _replyto: fields.email,
          _subject: subject,
          _to: RECIPIENT_EMAIL,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      setSubmitStatus("success")
      setSubmitMessage("Thanks! Your message was sent successfully.")
      setFields(initialFields)
    } catch {
      setSubmitStatus("error")
      setSubmitMessage("Message failed to send. Please try again in a moment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative">
      <SubmitSuccessEffect isVisible={submitStatus === "success"} />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[10] overflow-hidden"
        style={{ opacity: diveVeilOpacity }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(214,244,255,0.18)_0%,rgba(98,177,214,0.2)_34%,rgba(17,64,98,0.42)_66%,rgba(5,24,44,0.68)_100%)]" />
        <motion.div
          className="absolute -left-1/4 top-[10%] h-24 w-[70%] rotate-2 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(224,246,255,0.3)_45%,rgba(255,255,255,0)_100%)] mix-blend-screen blur-[2px]"
          style={{ x: diveSheenX }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[11] h-[94svh] origin-bottom overflow-hidden"
        style={{ scaleY: diveFillScale, opacity: diveFillOpacity }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(122,214,245,0)_0%,rgba(101,190,226,0.12)_12%,rgba(60,141,191,0.4)_46%,rgba(11,54,94,0.72)_78%,rgba(7,28,52,0.92)_100%)]" />
        <motion.div
          className="absolute -inset-x-16 top-[15%] h-8 bg-[repeating-linear-gradient(100deg,rgba(255,255,255,0)_0_16px,rgba(233,250,255,0.24)_18px_22px,rgba(255,255,255,0)_24px_42px)] mix-blend-screen blur-[1.5px]"
          style={{ x: diveSheenX }}
        />
        <div className="absolute inset-x-0 top-[14%] h-px bg-cyan-100/34" />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[12] overflow-hidden"
        style={{ opacity: diveBubbleOpacity }}
        aria-hidden="true"
      >
        {DIVE_BUBBLE_PARTICLES.map((bubble, index) => (
          <motion.span
            key={`dive-bubble-${index}`}
            className="absolute bottom-[-14%] rounded-full border border-cyan-100/30 bg-cyan-100/18"
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
            animate={{
              y: ["0vh", "-120vh"],
              x: [0, bubble.drift, bubble.drift * 0.4],
              opacity: [0, 0.75, 0],
              scale: [0.8, 1, 1.08],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              ease: "easeOut",
              delay: bubble.delay,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[13]"
        style={{ opacity: diveFlashOpacity }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(178,231,255,0.68)_0%,rgba(121,201,236,0.34)_26%,rgba(8,34,56,0)_62%)] mix-blend-screen" />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[9] overflow-hidden"
        style={{ opacity: dipOverlayOpacity }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute -inset-x-8 -inset-y-10 bg-[radial-gradient(circle_at_50%_24%,rgba(226,247,255,0.32)_0%,rgba(128,204,235,0.18)_28%,rgba(33,95,134,0.22)_52%,rgba(9,35,57,0.58)_100%)] mix-blend-screen"
          style={{ scale: dipOverlayScale, y: dipOverlayY }}
        />
        <motion.div
          className="absolute -left-1/3 top-[16%] h-28 w-[72%] rotate-2 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(235,252,255,0.28)_48%,rgba(255,255,255,0)_100%)] blur-[2px] mix-blend-screen"
          style={{ x: lensSweepX, opacity: lensSweepOpacity }}
        />
      </motion.div>
      {/* Hero Section */}
      <motion.section
        id="home"
        className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:pb-14 sm:pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlobalBeachBackdrop phase={phase} position="absolute" depthStage="surface" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(15,23,42,0)_0%,rgba(15,23,42,0.12)_72%,rgba(15,23,42,0.26)_100%)] in-data-[phase=noon]:bg-[radial-gradient(circle_at_50%_45%,rgba(39,39,42,0)_0%,rgba(39,39,42,0.08)_72%,rgba(39,39,42,0.18)_100%)]" />
        <motion.div
          className="relative z-10 mx-auto w-full max-w-6xl"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative max-w-2xl">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white in-data-[phase=noon]:text-slate-950 sm:text-6xl lg:text-7xl">
              I'm Tanisha.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 in-data-[phase=dawn]:text-sky-100 in-data-[phase=noon]:text-slate-900 in-data-[phase=night]:text-slate-300 sm:text-base">
              Full-stack developer building immersive, creative experiences. Portfolios, games, dashboards, and everything in between. Scroll to see my work or jump to the contact form.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Projects Section */}
      <section
        id="projects"
        className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:pb-14 sm:pt-24"
      >
        <GlobalBeachBackdrop phase={phase} position="absolute" depthStage="mid" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 overflow-hidden sm:h-24">
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,20,33,0.3)_0%,rgba(12,32,52,0.2)_26%,rgba(16,58,82,0.12)_54%,rgba(0,0,0,0)_100%)] in-data-[phase=noon]:bg-[linear-gradient(180deg,rgba(20,72,104,0.26)_0%,rgba(18,88,122,0.18)_30%,rgba(56,189,248,0.1)_58%,rgba(0,0,0,0)_100%)]"
            style={{ x: stripDriftX }}
          />
          <motion.div
            className="absolute -inset-x-12 inset-y-0 bg-[repeating-linear-gradient(103deg,rgba(255,255,255,0)_0_10px,rgba(255,255,255,0.08)_12px_14px,rgba(255,255,255,0)_16px_28px),repeating-linear-gradient(77deg,rgba(255,255,255,0)_0_18px,rgba(191,219,254,0.08)_20px_22px,rgba(255,255,255,0)_24px_44px)] mix-blend-screen blur-[1px] in-data-[phase=noon]:bg-[repeating-linear-gradient(103deg,rgba(255,255,255,0)_0_10px,rgba(224,242,254,0.12)_12px_14px,rgba(255,255,255,0)_16px_28px),repeating-linear-gradient(77deg,rgba(255,255,255,0)_0_18px,rgba(186,230,253,0.1)_20px_22px,rgba(255,255,255,0)_24px_44px)]"
            style={{ x: stripTextureX, y: stripTextureY, opacity: stripTextureOpacity }}
          />
          <motion.div
            className="absolute -left-1/2 top-1 h-5 w-[36%] rotate-1 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,244,220,0.38)_48%,rgba(255,255,255,0)_100%)] mix-blend-screen blur-[1.5px] in-data-[phase=noon]:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(224,244,255,0.44)_48%,rgba(255,255,255,0)_100%)]"
            style={{ x: stripShimmerX, opacity: stripSheenOpacity }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-white/16 in-data-[phase=noon]:bg-sky-100/24" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-cyan-200/12 in-data-[phase=noon]:bg-sky-300/20" />
          {TESTIMONIAL_TRANSITION_BUBBLES.map((left, index) => (
            <motion.span
              key={`bubble-${left}`}
              className="absolute bottom-1 h-1.5 w-1.5 rounded-full border border-cyan-100/24 bg-cyan-100/12 in-data-[phase=noon]:border-sky-100/32 in-data-[phase=noon]:bg-sky-100/18"
              style={{ left: `${left}%` }}
              animate={{ y: [0, -12, -22], opacity: [0.06, 0.22, 0] }}
              transition={{
                duration: 2.8 + (index % 4) * 0.55,
                repeat: Infinity,
                ease: "easeOut",
                delay: index * 0.22,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl">
        <PageHeader
          eyebrow="What I Have Built"
          title="Client testimonials"
          description=""
          className="in-data-[phase=noon]:**:text-sky-100"
        />

        <div className="relative mx-auto w-full max-w-4xl">
          <div className="relative mb-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/8 pb-2.5 in-data-[phase=noon]:border-sky-700/24 sm:mb-3 sm:pb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300 in-data-[phase=noon]:text-sky-300">
              {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goToPrev}
                className="rounded-md border border-white/28 bg-transparent px-2.5 py-1 text-[11px] font-semibold text-slate-100 transition hover:bg-white/8 in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:hover:bg-sky-900/20"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="rounded-md border border-white/28 bg-transparent px-2.5 py-1 text-[11px] font-semibold text-slate-100 transition hover:bg-white/8 in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:hover:bg-sky-900/20"
              >
                Next
              </button>
            </div>
          </div>

          <div className="relative min-h-72 sm:min-h-80">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeProject.client + activeProject.project}
                className="relative h-full"
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative flex h-full flex-col">
                  <div className="relative overflow-hidden rounded-lg border border-white/14 bg-transparent in-data-[phase=noon]:border-sky-700/30">
                    <div className="aspect-video bg-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(255,255,255,0.08),transparent_36%)] in-data-[phase=noon]:bg-[radial-gradient(circle_at_22%_26%,rgba(186,230,253,0.14),transparent_38%)]" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 in-data-[phase=noon]:border-sky-700/24">
                    <div>
                      <p className="text-base font-semibold text-white in-data-[phase=noon]:text-sky-100">{activeProject.client}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-300 in-data-[phase=noon]:text-sky-300">{activeProject.role}</p>
                    </div>
                    <div className="rounded-full border border-white/24 bg-transparent px-2.5 py-0.5 text-[9px] font-medium text-slate-200 in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:text-sky-200 sm:text-[10px]">
                      {activeProject.project}
                    </div>
                  </div>

                  <div className="mt-3 flex-1 rounded-xl border border-white/14 bg-transparent p-3 in-data-[phase=noon]:border-sky-700/28 sm:p-4">
                    <blockquote className="border-l border-white/20 pl-2 text-[13px] italic leading-snug text-slate-200 in-data-[phase=noon]:border-sky-600/35 in-data-[phase=noon]:text-sky-100">
                      &quot;{activeProject.quote}&quot;
                    </blockquote>
                    <p className="mt-1.5 text-[12px] leading-snug text-slate-300 in-data-[phase=noon]:text-sky-200">{activeProject.outcome}</p>

                    <div className="mt-2.5 flex flex-col gap-1.5 border-t border-white/8 pt-2.5 in-data-[phase=noon]:border-sky-700/24 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 in-data-[phase=noon]:text-sky-300">Live website</p>
                        <a
                          href={activeProject.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex text-[11px] font-medium text-slate-100 transition hover:text-white in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:hover:text-sky-50"
                        >
                          {activeProject.site.replace("https://", "")}
                        </a>
                      </div>
                      <a
                        href={activeProject.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/24 bg-transparent px-3 py-1.5 text-[11px] font-semibold text-slate-100 transition hover:bg-white/8 in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:hover:bg-sky-900/20 sm:w-auto"
                      >
                        Verify Project
                        <span aria-hidden="true">&#8599;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="relative mt-3 flex gap-2 sm:mt-3">
            {projects.map((item, index) => (
              <button
                key={item.client}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 flex-1 rounded-full border transition ${
                  index === activeIndex ? "border-cyan-200/90 bg-cyan-200/35 in-data-[phase=noon]:border-sky-400/70 in-data-[phase=noon]:bg-sky-300/25" : "border-white/35 bg-transparent hover:bg-white/12 in-data-[phase=noon]:border-sky-500/50 in-data-[phase=noon]:hover:bg-sky-900/20"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-start overflow-hidden px-4 pb-8 pt-16 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:pb-14 sm:pt-24">
        <GlobalBeachBackdrop phase={phase} position="absolute" depthStage="deep" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[4.5rem] overflow-hidden sm:h-20">
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,30,0.4)_0%,rgba(8,30,49,0.26)_30%,rgba(13,62,90,0.16)_62%,rgba(0,0,0,0)_100%)] in-data-[phase=noon]:bg-[linear-gradient(180deg,rgba(16,56,82,0.36)_0%,rgba(11,74,104,0.24)_34%,rgba(34,141,189,0.16)_64%,rgba(0,0,0,0)_100%)]"
            style={{ x: stripDriftX }}
          />
          <motion.div
            className="absolute -inset-x-10 inset-y-0 bg-[repeating-linear-gradient(104deg,rgba(255,255,255,0)_0_9px,rgba(209,243,255,0.08)_11px_14px,rgba(255,255,255,0)_16px_28px),repeating-linear-gradient(80deg,rgba(255,255,255,0)_0_17px,rgba(185,231,255,0.08)_19px_22px,rgba(255,255,255,0)_24px_44px)] mix-blend-screen blur-[1px]"
            style={{ x: stripTextureX, y: stripTextureY, opacity: stripTextureOpacity }}
          />
          <motion.div
            className="absolute -left-1/2 top-0.5 h-4 w-[34%] rotate-1 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(232,248,255,0.36)_48%,rgba(255,255,255,0)_100%)] mix-blend-screen blur-[1.5px]"
            style={{ x: stripShimmerX, opacity: stripSheenOpacity }}
          />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl">
        <PageHeader
          eyebrow="Contact"
          title="Let's start building"
          description={`Fill out the form and I will get back to you at ${RECIPIENT_EMAIL}.`}
          className="in-data-[phase=noon]:**:text-sky-100"
        />

        <motion.form
          onSubmit={handleSubmit}
          className="relative mx-auto w-full max-w-5xl space-y-4 sm:space-y-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="relative flex flex-wrap gap-2">
            {SUBJECT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateField("subject", preset)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                  fields.subject === preset
                    ? "border-white/35 bg-transparent text-slate-100 in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:text-sky-100"
                    : "border-white/18 bg-transparent text-slate-300 hover:border-white/28 hover:text-slate-100 in-data-[phase=noon]:border-sky-700/30 in-data-[phase=noon]:text-sky-200 in-data-[phase=noon]:hover:border-sky-100/36 in-data-[phase=noon]:hover:text-sky-100"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="relative grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-100 in-data-[phase=noon]:text-sky-100">
              Name
              <input
                type="text"
                name="name"
                required
                value={fields.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={`rounded-xl border bg-transparent px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 in-data-[phase=noon]:border-sky-700/30 in-data-[phase=noon]:bg-transparent in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:placeholder:text-sky-300/60 in-data-[phase=noon]:focus:ring-sky-900/12 ${
                  fields.name ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)] in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:focus:border-sky-800/45" : "border-white/20 focus:border-white/40 focus:ring-white/20 in-data-[phase=noon]:focus:border-sky-800/38"
                }`}
                placeholder="Your name"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-100 in-data-[phase=noon]:text-sky-100">
              Email
              <input
                type="email"
                name="email"
                required
                value={fields.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={`rounded-xl border bg-transparent px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 in-data-[phase=noon]:border-sky-700/30 in-data-[phase=noon]:bg-transparent in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:placeholder:text-sky-300/60 in-data-[phase=noon]:focus:ring-sky-900/12 ${
                  fields.email ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)] in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:focus:border-sky-800/45" : "border-white/20 focus:border-white/40 focus:ring-white/20 in-data-[phase=noon]:focus:border-sky-800/38"
                }`}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="relative flex flex-col gap-2 text-sm text-slate-100 in-data-[phase=noon]:text-sky-100">
            Subject
            <input
              type="text"
              name="subject"
              value={fields.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className={`rounded-xl border bg-transparent px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 in-data-[phase=noon]:border-sky-700/30 in-data-[phase=noon]:bg-transparent in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:placeholder:text-sky-300/60 in-data-[phase=noon]:focus:ring-sky-900/12 ${
                fields.subject ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)] in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:focus:border-sky-800/45" : "border-white/20 focus:border-white/40 focus:ring-white/20 in-data-[phase=noon]:focus:border-sky-800/38"
              }`}
              placeholder="How can I help?"
            />
          </label>

          <label className="relative flex flex-col gap-2 text-sm text-slate-100 in-data-[phase=noon]:text-sky-100">
            Message
            <textarea
              name="message"
              required
              value={fields.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={6}
              className={`rounded-xl border bg-transparent px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 in-data-[phase=noon]:border-sky-700/30 in-data-[phase=noon]:bg-transparent in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:placeholder:text-sky-300/60 in-data-[phase=noon]:focus:ring-sky-900/12 ${
                fields.message ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)] in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:focus:border-sky-800/45" : "border-white/20 focus:border-white/40 focus:ring-white/20 in-data-[phase=noon]:focus:border-sky-800/38"
              }`}
              placeholder="Tell me about your project, goals, and timeline..."
            />
          </label>

          <div className="relative flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-xs text-slate-300 in-data-[phase=noon]:text-sky-200">Recipient: {RECIPIENT_EMAIL}</p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-white/24 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-70 in-data-[phase=noon]:border-sky-700/35 in-data-[phase=noon]:bg-transparent in-data-[phase=noon]:text-sky-100 in-data-[phase=noon]:hover:bg-sky-900/20 sm:w-auto"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>

          {submitMessage ? (
            <div
              role="status"
              aria-live="polite"
              className={`relative rounded-xl border px-3 py-2 text-xs ${
                submitStatus === "success"
                  ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-300/40 bg-rose-400/10 text-rose-200"
              }`}
            >
              {submitMessage}
            </div>
          ) : null}
        </motion.form>
        </div>
      </section>
    </main>
  )
}




