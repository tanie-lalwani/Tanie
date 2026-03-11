import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import type { CSSProperties } from "react"

const GLASS_PANEL: CSSProperties = {
  background: "linear-gradient(155deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.05) 100%)",
  border: "1px solid rgba(255,255,255,0.34)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.48), inset 0 -16px 28px rgba(148,163,184,0.16), 0 35px 90px rgba(2,6,23,0.6)",
  backdropFilter: "blur(24px) saturate(115%)",
  WebkitBackdropFilter: "blur(24px) saturate(115%)",
}

const GLASS_RIM: CSSProperties = {
  background: "linear-gradient(130deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.18) 18%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.2) 100%)",
  opacity: 0.58,
}

const CHIP: CSSProperties = {
  background: "linear-gradient(145deg, rgba(226,232,240,0.28) 0%, rgba(148,163,184,0.12) 100%)",
  border: "1px solid rgba(226,232,240,0.38)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.34)",
}

const SOCIALS = [
  {
    label: "GitHub",
    handle: "@taniehq",
    href: "https://github.com/taniehq",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    handle: "@tanie.mp3",
    href: "https://instagram.com/tanie.mp3",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "Tanisha Lalwani",
    href: "https://linkedin.com/in/tanisha-lalwani/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 1 1 0-3.96 1.98 1.98 0 0 1 0 3.96zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    handle: "contact@tanie.me",
    href: "mailto:contact@tanie.me",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
]

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
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100" style={CHIP}>
          Contact Me
        </p>
        <p className="mt-4 text-sm text-slate-300 sm:text-base lg:text-lg">
          Fill out the form and I'll get back to you at {RECIPIENT_EMAIL}.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="relative max-w-3xl space-y-5 overflow-hidden rounded-3xl p-5 sm:p-8"
        style={GLASS_PANEL}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="pointer-events-none absolute inset-0" style={GLASS_RIM} />
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-300">Recipient: {RECIPIENT_EMAIL}</p>
          {submitMessage ? (
            <p className={`text-xs ${submitStatus === "success" ? "text-emerald-300" : "text-rose-300"}`}>
              {submitMessage}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </motion.form>

      {/* Footer */}
      <motion.footer
        className="mt-16 max-w-3xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(148,163,184,0.18) 30%, rgba(148,163,184,0.18) 70%, transparent)" }}
        />
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Tanie</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
              Frontend engineer based anywhere with Wi-Fi.<br />Open to roles, collabs, and good conversations.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group flex items-center gap-3 text-slate-400 transition hover:text-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/4 text-slate-400 transition group-hover:border-white/20 group-hover:text-slate-100">
                  {s.icon}
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold leading-none tracking-wide">{s.label}</span>
                  <span className="mt-0.5 text-[11px] text-slate-500 group-hover:text-slate-400">{s.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div
          className="mt-8 h-px w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(148,163,184,0.10) 30%, rgba(148,163,184,0.10) 70%, transparent)" }}
        />
        <p className="mt-4 text-center text-[11px] text-slate-600">
          © {new Date().getFullYear()} Tanie — built with React, TypeScript & Tailwind
        </p>
      </motion.footer>
    </section>
  )
}
