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
  const worldDiveProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1])

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
            <h1 className="text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
              I'm Tanisha.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-sky-900 sm:text-base">
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
        <div className="relative z-10 mx-auto w-full max-w-6xl">
        <PageHeader
          eyebrow="What I Have Built"
          title="Client testimonials"
          description=""
          className="**:text-sky-100"
        />

        <div className="relative mx-auto w-full max-w-4xl">
          <div className="relative mb-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-700/30 pb-2.5 sm:mb-3 sm:pb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900">
              {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={goToPrev}
                className="inline-flex items-center justify-center rounded-lg border border-sky-700/30 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-950 transition-all duration-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0 active:bg-sky-200/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="inline-flex items-center justify-center rounded-lg border border-sky-700/30 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-950 transition-all duration-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0 active:bg-sky-200/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next →
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
                  <div className="relative overflow-hidden rounded-lg border border-sky-700/25 bg-white/70 p-4 sm:p-6 shadow-sm">
                    <div className="aspect-video rounded-lg bg-linear-to-br from-sky-100 to-sky-50" />
                  </div>

                  <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-sky-950" style={{ fontFamily: 'var(--font-display)' }}>{activeProject.client}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-sky-700">{activeProject.role}</p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-sky-700/25 bg-sky-50 px-3 py-1.5">
                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-900">{activeProject.project}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-sky-700/20 pt-4 sm:mt-5 sm:space-y-4 sm:pt-5">
                    <blockquote className="text-sm italic leading-relaxed text-sky-950">
                      &quot;{activeProject.quote}&quot;
                    </blockquote>
                    <p className="text-sm leading-relaxed text-sky-900">{activeProject.outcome}</p>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-sky-700/20 pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-sky-700">Visit project</p>
                      <a
                        href={activeProject.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm font-semibold text-sky-950 underline decoration-sky-300 decoration-2 underline-offset-2 transition hover:text-sky-900"
                      >
                        {activeProject.site.replace("https://", "")}
                      </a>
                    </div>
                    <a
                      href={activeProject.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-700/30 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-950 transition-all duration-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 active:bg-sky-200/50"
                    >
                      View Project
                      <span aria-hidden="true">↗</span>
                    </a>
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
                className={`h-1.5 flex-1 rounded-full border border-sky-700/25 transition-all duration-200 ${
                  index === activeIndex ? "bg-sky-400" : "bg-sky-200 hover:bg-sky-300"
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
        <div className="relative z-10 mx-auto w-full max-w-6xl">
        <PageHeader
          eyebrow="Contact"
          title="Let's start building"
          description={`Fill out the form and I will get back to you at ${RECIPIENT_EMAIL}.`}
          className="**:text-sky-100"
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
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  fields.subject === preset
                    ? "border border-sky-700/30 bg-sky-100 text-sky-950"
                    : "border border-sky-700/20 bg-white text-sky-900 hover:bg-sky-50"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="relative grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-sky-950">Name</span>
              <input
                type="text"
                name="name"
                required
                value={fields.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="rounded-lg border border-sky-700/25 bg-white px-4 py-3 text-sky-950 transition-all placeholder:text-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
                placeholder="Your full name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-sky-950">Email</span>
              <input
                type="email"
                name="email"
                required
                value={fields.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="rounded-lg border border-sky-700/25 bg-white px-4 py-3 text-sky-950 transition-all placeholder:text-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-sky-950">Subject</span>
            <input
              type="text"
              name="subject"
              value={fields.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className="rounded-lg border border-sky-700/25 bg-white px-4 py-3 text-sky-950 transition-all placeholder:text-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
              placeholder="What's this about?"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-sky-950">Message</span>
            <textarea
              name="message"
              required
              value={fields.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={6}
              className="rounded-lg border border-sky-700/25 bg-white px-4 py-3 text-sky-950 transition-all placeholder:text-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
              placeholder="Tell me about your project and what you're looking for..."
            />
          </label>

          <div className="flex flex-col gap-3 border-t border-sky-700/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-sky-900">I'll respond to <span className="font-semibold">{RECIPIENT_EMAIL}</span></p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-700/30 bg-sky-50 px-6 py-3 text-sm font-semibold text-sky-950 transition-all duration-200 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300 active:bg-sky-200/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sky-300 border-t-sky-950"></span>
                  Sending...
                </>
              ) : (
                <>Send Message</>
              )}
            </button>
          </div>

          {submitMessage && (
            <div className={`rounded-lg border px-4 py-3 text-sm ${
              submitStatus === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : "border-red-300 bg-red-50 text-red-900"
            }`}>
              {submitMessage}
            </div>
          )}
        </motion.form>
        </div>
      </section>
    </main>
  )
}




