import { motion } from "framer-motion"
import type { FormEvent } from "react"
import { useState } from "react"

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

const labelClass = "text-[11.5px] font-medium tracking-[0.18em] text-slate-200/36 sm:text-[12.5px]"
const inputClass = "rounded-xl border border-white/14 bg-white/10 px-4 py-2 text-[11.5px] font-medium leading-6 tracking-[0.18em] text-slate-100/70 outline-none transition placeholder:text-[11.5px] placeholder:tracking-[0.18em] placeholder:text-slate-200/30 focus:border-sky-300/46 focus:ring-2 focus:ring-sky-300/20 sm:text-[12.5px]"

export function ContactForm() {
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
        setSubmitMessage("Message sent! I'll get back to you soon.")
        setFields(initialFields)

        setTimeout(() => {
          setSubmitStatus("idle")
        }, 4000)
      } else {
        setSubmitStatus("error")
        setSubmitMessage("Failed to send message. Please try again.")
      }
    } catch {
      setSubmitStatus("error")
      setSubmitMessage("Network error. Please check your connection and try again.")
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
        <span className={labelClass}>Name</span>
        <input
          type="text"
          name="name"
          required
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
          className={inputClass}
          placeholder="Your name"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          name="email"
          required
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          className={inputClass}
          placeholder="your@email.com"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Subject</span>
        <input
          type="text"
          name="subject"
          value={fields.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          className={inputClass}
          placeholder="What's this about?"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Message</span>
        <textarea
          name="message"
          required
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={3}
          className={`${inputClass} min-h-20 resize-y`}
          placeholder="Tell me about your project..."
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${labelClass} inline-flex w-full items-center justify-center rounded-full border border-sky-300/65 bg-[#b9d8ef]/90 px-4 py-1.5 transition hover:bg-[#c8e4f7]/95 focus:outline-none focus:ring-2 focus:ring-sky-300/75 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto`}
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>

      {submitStatus !== "idle" && (
        <motion.p
          className={`text-[11.5px] font-medium leading-6 tracking-[0.18em] sm:text-[12.5px] ${
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
