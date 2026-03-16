import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import type { CSSProperties } from "react"
import PageHeader from "../components/PageHeader"

const GLASS_PANEL: CSSProperties = {
  background: "linear-gradient(152deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.09) 32%, rgba(255,255,255,0.035) 100%)",
  border: "1px solid rgba(255,255,255,0.26)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.46), inset 0 -18px 34px rgba(148,163,184,0.14), 0 36px 90px rgba(2,6,23,0.58)",
  backdropFilter: "blur(28px) saturate(128%)",
  WebkitBackdropFilter: "blur(28px) saturate(128%)",
}

const GLASS_RIM: CSSProperties = {
  background: "linear-gradient(126deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.22) 16%, rgba(255,255,255,0.05) 44%, rgba(255,255,255,0.18) 100%)",
  opacity: 0.62,
}

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

const SUBJECT_PRESETS = ["New project", "Contract role", "Collaboration", "Quick question"]

export default function Contact() {
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
    <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-14 sm:pt-16">
      <PageHeader
        eyebrow="Contact"
        title="Let's start building"
        description={`Fill out the form and I will get back to you at ${RECIPIENT_EMAIL}.`}
      />

      <motion.div
        className="mb-6 grid gap-2.5 sm:mb-8 sm:gap-3 sm:grid-cols-2"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="relative overflow-hidden rounded-xl border border-white/20 bg-white/8 p-3.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] sm:rounded-2xl sm:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_42%,rgba(255,255,255,0)_70%)]" />
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Response</p>
          <p className="mt-2 text-sm font-semibold text-white">Within 24-48h</p>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/20 bg-white/8 p-3.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] sm:rounded-2xl sm:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_42%,rgba(255,255,255,0)_70%)]" />
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Availability</p>
          <p className="mt-2 text-sm font-semibold text-white">Freelance and full-time roles</p>
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="relative mx-auto w-full max-w-5xl space-y-4 overflow-hidden rounded-2xl p-4 sm:space-y-5 sm:rounded-3xl sm:p-8"
        style={GLASS_PANEL}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-0" style={GLASS_RIM} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_36%,rgba(255,255,255,0)_60%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-20 w-1/2 rounded-full bg-white/18 blur-2xl" />

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
              className="rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-white/40 focus:ring-2 focus:ring-white/20"
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
              className="rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-white/40 focus:ring-2 focus:ring-white/20"
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
            className="rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-white/40 focus:ring-2 focus:ring-white/20"
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
            className="rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-white/40 focus:ring-2 focus:ring-white/20"
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
            {submitStatus === "error" ? (
              <a href={`mailto:${RECIPIENT_EMAIL}`} className="ml-2 underline decoration-dotted underline-offset-2 hover:text-white">
                Or email directly
              </a>
            ) : null}
          </div>
        ) : null}
      </motion.form>
    </section>
  )
}
