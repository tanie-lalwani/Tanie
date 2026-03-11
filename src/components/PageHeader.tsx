import type { CSSProperties } from "react"

const CHIP: CSSProperties = {
  background: "linear-gradient(145deg, rgba(226,232,240,0.18) 0%, rgba(148,163,184,0.08) 100%)",
  border: "1px solid rgba(226,232,240,0.22)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
}

type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  className?: string
}

export default function PageHeader({ eyebrow, title, description, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-10 max-w-3xl sm:mb-12 ${className}`}>
      <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100" style={CHIP}>
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-sm text-slate-300 sm:text-base lg:text-lg">
        {description}
      </p>
    </header>
  )
}
