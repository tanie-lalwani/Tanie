import { motion } from "framer-motion"
import type { FormEvent } from "react"
import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"

const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT ?? ""

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

const labelClass = "text-[11.5px] font-medium tracking-[0.16em] text-slate-200/50 sm:text-[12.5px]"
const inputClass = "rounded-xl border border-white/14 bg-white/10 px-4 py-2 text-[12.5px] font-medium leading-6 tracking-normal text-slate-100/76 outline-none transition placeholder:text-[12.5px] placeholder:tracking-normal placeholder:text-slate-200/38 focus:border-sky-300/46 focus:ring-2 focus:ring-sky-300/20 sm:text-[13px]"

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
        setSubmitStatus("error")
        setSubmitMessage(copy.contact.error)
      }
    } catch {
      setSubmitStatus("error")
      setSubmitMessage(copy.contact.networkError)
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
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>{copy.contact.labels.name}</span>
        <input
          type="text"
          name="name"
          required
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
          className={inputClass}
          placeholder={copy.contact.placeholders.name}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>{copy.contact.labels.email}</span>
        <input
          type="email"
          name="email"
          required
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          className={inputClass}
          placeholder={copy.contact.placeholders.email}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>{copy.contact.labels.subject}</span>
        <input
          type="text"
          name="subject"
          value={fields.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          className={inputClass}
          placeholder={copy.contact.placeholders.subject}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>{copy.contact.labels.message}</span>
        <textarea
          name="message"
          required
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={3}
          className={`${inputClass} min-h-20 resize-y`}
          placeholder={copy.contact.placeholders.message}
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-8 items-center justify-center rounded-full border border-[#274472]/15 px-3.5 text-[9px] font-medium tracking-[0.04em] text-[#274472] transition hover:bg-white/5"
      >
        {isSubmitting ? copy.contact.sending : copy.contact.button}
      </button>

      {submitStatus !== "idle" && (
        <motion.p
          className={`text-[12.5px] font-medium leading-6 tracking-normal sm:text-[13px] ${
            submitStatus === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {submitMessage}
        </motion.p>
      )}
    </motion.form>
  )
}
