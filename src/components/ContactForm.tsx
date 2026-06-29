import { motion } from "framer-motion"
import type { FormEvent } from "react"
import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"

const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "https://formspree.io/f/mpqypqka"

interface ContactFields {
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

const labelClass = "text-[11.5px] font-medium tracking-[0.16em] text-slate-200/88 sm:text-[12.5px]"
const inputClass = "rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[12.5px] font-medium leading-6 tracking-normal text-slate-100 outline-none transition placeholder:text-[12.5px] placeholder:tracking-normal placeholder:text-slate-200/68 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/30 sm:text-[13px]"

export function ContactForm() {
  const { copy } = useLanguage()
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
      setSubmitMessage(copy.contact.endpointError)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      const subject = fields.subject || `Portfolio inquiry from ${fields.name || "Visitor"}`

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          subject,
          message: fields.message,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setSubmitMessage(copy.contact.success)
        setFields(initialFields)

        setTimeout(() => {
          setSubmitStatus("idle")
        }, 4000)
      } else {
        const errorData = await response.json().catch(() => null)
        const detailedError =
          errorData?.errors?.map((err: { field?: string; message: string }) => `${err.field ? `${err.field}: ` : ""}${err.message}`).join(", ") ||
          errorData?.error ||
          `Server returned status ${response.status} (${response.statusText || "Error"})`
        setSubmitStatus("error")
        setSubmitMessage(`Failed to send message: ${detailedError}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : copy.contact.networkError
      setSubmitStatus("error")
      setSubmitMessage(`Network error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="surface-panel relative w-full space-y-3.5 p-4 sm:p-5"
      aria-label="Contact form for web development project inquiries"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Honeypot field to trap spam bots */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label htmlFor="contact-name" className="flex flex-col gap-1.5">
        <span className={labelClass} style={{ fontFamily: "var(--font-ui)" }}>{copy.contact.labels.name}</span>
        <input
          id="contact-name"
          type="text"
          name="name"
          autoComplete="name"
          required
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
          className={inputClass}
          style={{ fontFamily: "var(--font-ui)" }}
          placeholder={copy.contact.placeholders.name}
        />
      </label>

      <label htmlFor="contact-email" className="flex flex-col gap-1.5">
        <span className={labelClass} style={{ fontFamily: "var(--font-ui)" }}>{copy.contact.labels.email}</span>
        <input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          className={inputClass}
          style={{ fontFamily: "var(--font-ui)" }}
          placeholder={copy.contact.placeholders.email}
        />
      </label>

      <label htmlFor="contact-subject" className="flex flex-col gap-1.5">
        <span className={labelClass} style={{ fontFamily: "var(--font-ui)" }}>{copy.contact.labels.subject}</span>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          autoComplete="off"
          value={fields.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          className={inputClass}
          style={{ fontFamily: "var(--font-ui)" }}
          placeholder={copy.contact.placeholders.subject}
        />
      </label>

      <label htmlFor="contact-message" className="flex flex-col gap-1.5">
        <span className={labelClass} style={{ fontFamily: "var(--font-ui)" }}>{copy.contact.labels.message}</span>
        <textarea
          id="contact-message"
          name="message"
          autoComplete="off"
          required
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={3}
          className={`${inputClass} min-h-20 resize-y`}
          style={{ fontFamily: "var(--font-ui)" }}
          placeholder={copy.contact.placeholders.message}
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-8 items-center justify-center rounded-full border border-sky-300/30 px-4 text-[10px] font-medium tracking-[0.12em] text-sky-100 transition hover:bg-white/10"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {isSubmitting ? copy.contact.sending : copy.contact.button}
      </button>

      {submitStatus !== "idle" && (
        <motion.p
          className={`text-[12.5px] font-medium leading-6 tracking-normal sm:text-[13px] ${
            submitStatus === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
          style={{ fontFamily: "var(--font-ui)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {submitMessage}
        </motion.p>
      )}
    </motion.form>
  )
}
