import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Maya Patel",
    role: "Founder, Brightlane",
    project: "SaaS Dashboard Redesign",
    quote:
      "Tanie transformed our dashboard from clunky to crystal clear. Onboarding time dropped by 38% in the first month.",
  },
  {
    name: "Jordan Lee",
    role: "Product Manager, FinchPay",
    project: "Checkout Performance Overhaul",
    quote:
      "The new frontend is incredibly fast. We saw a measurable conversion lift and far fewer support tickets about payment flow.",
  },
  {
    name: "Amara Okafor",
    role: "Operations Lead, Nuvio",
    project: "Internal Tooling Portal",
    quote:
      "The developer workflow improvements were huge. Releases are smoother, and the team trusts the pipeline now.",
  },
  {
    name: "Ethan Brooks",
    role: "CTO, Leafline",
    project: "Marketing Site Rebuild",
    quote:
      "Design polish, accessibility, and speed all improved at once. It feels premium without being over-engineered.",
  },
  {
    name: "Sofia Ramirez",
    role: "Growth Lead, Orbitly",
    project: "Landing Page Experiment System",
    quote:
      "We can launch experiments in hours instead of days. The component structure made iteration effortless.",
  },
  {
    name: "Noah Campbell",
    role: "Head of Design, Verta",
    project: "Design System Foundations",
    quote:
      "Tanie balanced design and engineering perfectly. The system is consistent, scalable, and easy for new hires to use.",
  },
]

export default function Projects() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      <div className="mb-8 max-w-3xl sm:mb-12">
        <p className="glass-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100">
          Projects Route
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Project Testimonials
        </h1>
        <p className="mt-4 text-sm text-slate-300 sm:text-base lg:text-lg">
          Feedback from collaborators and clients on project outcomes, product quality, and developer experience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name + item.project}
            className="glass-hero-panel relative overflow-hidden rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <div className="glass-hero-rim pointer-events-none absolute inset-0" />
            <div className="relative">
              <p className="text-sm leading-relaxed text-slate-200">"{item.quote}"</p>

              <div className="mt-5 border-t border-white/15 pt-4">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-xs text-slate-300">{item.role}</p>
                <p className="mt-2 inline-flex rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-200">
                  {item.project}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
