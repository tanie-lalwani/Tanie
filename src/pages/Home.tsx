import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useState, type FormEvent } from "react"
import { useIsMobile } from "../hooks/useIsMobile"
import PageHeader from "../components/PageHeader"
import { SubmitSuccessEffect } from "../components/SubmitSuccessEffect"

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

export default function Home() {
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()
  const lowPowerMode = isMobile || (shouldReduceMotion ?? false)

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
      {/* Hero Section */}
      <motion.section
        id="home"
        className="relative isolate flex min-h-[calc(100svh-2.75rem)] w-full items-center overflow-hidden px-4 py-8 sm:min-h-[calc(100vh-3rem)] sm:px-6 sm:py-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-size-[56px_56px] bg-[linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] opacity-[0.06]" />

        <motion.div
          className="relative mx-auto w-full max-w-6xl"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              I'm Tanisha.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Full-stack developer building immersive, creative experiences. Portfolios, games, dashboards, and everything in between. Scroll to see my work or jump to the contact form.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Projects Section */}
      <section
        id="projects"
        className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
      >
        <PageHeader
          eyebrow="What I Have Built"
          title="Client testimonials"
          description=""
        />

        <div className="relative">
          <div className="relative mb-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/8 pb-2.5 sm:mb-3 sm:pb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goToPrev}
                className="rounded-md border border-white/18 bg-white/7 px-2.5 py-1 text-[11px] font-semibold text-slate-100 transition hover:bg-white/12"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="rounded-md border border-white/18 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Next
              </button>
            </div>
          </div>

          <div className="relative min-h-48">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeProject.client + activeProject.project}
                className="relative"
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative">
                  <div className="relative overflow-hidden rounded-lg border border-white/14 bg-slate-950/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                    <div className="aspect-video bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(160deg,#0f172a_0%,#030712_56%,#020617_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(2,6,23,0.76)_100%)]" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-col items-start justify-between gap-1.5 sm:bottom-3 sm:left-3 sm:right-3 sm:flex-row sm:items-end sm:gap-2.5">
                      <div>
                        <p className="text-sm font-semibold text-white">{activeProject.client}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">{activeProject.role}</p>
                      </div>
                      <div className="rounded-full border border-white/18 bg-white/6 px-2.5 py-0.5 text-[9px] font-medium text-slate-200 sm:text-[10px]">
                        {activeProject.project}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <blockquote className="border-l border-white/14 pl-2 text-[13px] italic leading-snug text-slate-300">
                      &quot;{activeProject.quote}&quot;
                    </blockquote>
                    <p className="mt-1.5 text-[12px] leading-snug text-slate-400">{activeProject.outcome}</p>

                    <div className="mt-2.5 flex flex-col gap-1.5 border-t border-white/8 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Live website</p>
                        <a
                          href={activeProject.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex text-[11px] font-medium text-slate-100 transition hover:text-white"
                        >
                          {activeProject.site.replace("https://", "")}
                        </a>
                      </div>
                      <a
                        href={activeProject.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-900 transition hover:bg-slate-200 sm:w-auto"
                      >
                        Verify Project
                        <span aria-hidden="true">↗</span>
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
                className={`h-1.5 flex-1 rounded-full transition ${
                  index === activeIndex ? "bg-cyan-200/90" : "bg-white/18 hover:bg-white/32"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <PageHeader
          eyebrow="Contact"
          title="Let's start building"
          description={`Fill out the form and I will get back to you at ${RECIPIENT_EMAIL}.`}
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
                    ? "border-white/35 bg-white/20 text-slate-100"
                    : "border-white/18 bg-white/8 text-slate-300 hover:border-white/28 hover:text-slate-100"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="relative grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-100">
              Name
              <input
                type="text"
                name="name"
                required
                value={fields.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={`rounded-xl border bg-slate-900/36 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  fields.name ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]" : "border-white/20 focus:border-white/40 focus:ring-white/20"
                }`}
                placeholder="Your name"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-100">
              Email
              <input
                type="email"
                name="email"
                required
                value={fields.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={`rounded-xl border bg-slate-900/36 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                  fields.email ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]" : "border-white/20 focus:border-white/40 focus:ring-white/20"
                }`}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="relative flex flex-col gap-2 text-sm text-slate-100">
            Subject
            <input
              type="text"
              name="subject"
              value={fields.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className={`rounded-xl border bg-slate-900/36 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                fields.subject ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]" : "border-white/20 focus:border-white/40 focus:ring-white/20"
              }`}
              placeholder="How can I help?"
            />
          </label>

          <label className="relative flex flex-col gap-2 text-sm text-slate-100">
            Message
            <textarea
              name="message"
              required
              value={fields.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={6}
              className={`rounded-xl border bg-slate-900/36 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                fields.message ? "border-cyan-400/40 focus:border-cyan-300/60 focus:ring-cyan-300/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]" : "border-white/20 focus:border-white/40 focus:ring-white/20"
              }`}
              placeholder="Tell me about your project, goals, and timeline..."
            />
          </label>

          <div className="relative flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-xs text-slate-300">Recipient: {RECIPIENT_EMAIL}</p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
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
      </section>
    </main>
  )
}
