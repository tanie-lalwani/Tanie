import { motion } from "framer-motion"
import type { FormEvent } from "react"
import { useState } from "react"

const SUBJECT_PRESETS = ["New project", "Contract role", "Collaboration", "Quick question"]
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
      className="relative mx-auto w-full max-w-5xl space-y-4 sm:space-y-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* Subject presets */}
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

      {/* Name field */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-sky-950">Name</span>
        <input
          type="text"
          name="name"
          required
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="rounded-lg border border-sky-700/25 bg-white px-4 py-3 text-sky-950 transition-all placeholder:text-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
          placeholder="Your name"
        />
      </label>

      {/* Email field */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-sky-950">Email</span>
        <input
          type="email"
          name="email"
          required
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="rounded-lg border border-sky-700/25 bg-white px-4 py-3 text-sky-950 transition-all placeholder:text-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
          placeholder="your@email.com"
        />
      </label>

      {/* Subject field */}
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

      {/* Message field */}
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-sky-950">Message</span>
        <textarea
          name="message"
          required
          value={fields.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={6}
          className="rounded-lg border border-sky-700/25 bg-white px-4 py-3 text-sky-950 transition-all placeholder:text-sky-700/50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0"
          placeholder="Tell me about your project..."
        />
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg border border-sky-700/30 bg-sky-950 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-0 active:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>

      {/* Status messages */}
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
