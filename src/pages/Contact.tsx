import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"

const RECIPIENT_EMAIL = "contact@tanie.me"

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

export default function Contact() {
  const [fields, setFields] = useState<ContactFields>(initialFields)

  const updateField = (key: keyof ContactFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const subject = fields.subject || `Portfolio inquiry from ${fields.name || "Visitor"}`
    const body = [
      `Name: ${fields.name}`,
      `Email: ${fields.email}`,
      "",
      fields.message,
    ].join("\n")

    const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="glass-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
          Contact Me
        </p>
        <p className="mt-4 text-sm text-slate-300 sm:text-base lg:text-lg">
          Fill out the form and your mail app will open with your message pre-filled to {RECIPIENT_EMAIL}.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="glass-hero-panel relative max-w-3xl space-y-5 overflow-hidden rounded-3xl p-5 sm:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="glass-hero-rim pointer-events-none absolute inset-0" />
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-100">
            Name
            <input
              type="text"
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
            value={fields.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            className="rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-white/40 focus:ring-2 focus:ring-white/20"
            placeholder="How can I help?"
          />
        </label>

        <label className="relative flex flex-col gap-2 text-sm text-slate-100">
          Message
          <textarea
            required
            value={fields.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={6}
            className="rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-white/40 focus:ring-2 focus:ring-white/20"
            placeholder="Tell me about your project, goals, and timeline..."
          />
        </label>

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-300">Recipient: {RECIPIENT_EMAIL}</p>
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Send Message
          </button>
        </div>
      </motion.form>
    </section>
  )
}
