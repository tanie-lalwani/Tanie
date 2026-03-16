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
    <header className={`mb-10 max-w-3xl rounded-2xl border border-white/20 bg-slate-950/36 p-4 backdrop-blur-md sm:mb-12 sm:p-5 ${className}`}>
      <p className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100" style={CHIP}>
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white drop-shadow-[0_3px_14px_rgba(2,6,23,0.7)] sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-sm text-slate-100/90 sm:text-base lg:text-lg">
        {description}
      </p>
    </header>
  )
}
