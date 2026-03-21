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
      className="relative w-full space-y-3 sm:space-y-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-white">Name</span>
        <input
          type="text"
          name="name"
          required
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="rounded-lg border border-sky-700/20 bg-white px-3 py-2 text-sky-900 text-xs transition-all placeholder:text-sky-700/40 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
          placeholder="Your name"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-white">Email</span>
        <input
          type="email"
          name="email"
          required
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="rounded-lg border border-sky-700/20 bg-white px-3 py-2 text-sky-900 text-xs transition-all placeholder:text-sky-700/40 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
          placeholder="your@email.com"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-white">
        Subject
        <input
          type="text"
          name="subject"
          value={fields.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          className="rounded-lg border border-sky-700/20 bg-white px-3 py-2 text-sky-900 text-xs outline-none transition placeholder:text-sky-700/40 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
          placeholder="What's this about?"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-white">
        Message
        <textarea
          name="message"
          required
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={5}
          className="rounded-lg border border-sky-700/20 bg-white px-3 py-2 text-sky-900 text-xs outline-none transition placeholder:text-sky-700/40 focus:border-sky-400 focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
          placeholder="Tell me about your project..."
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-sky-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>

      {submitStatus !== "idle" && (
        <motion.p
          className={`text-sm font-medium ${
            submitStatus === "success" ? "text-green-600" : "text-red-600"
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
