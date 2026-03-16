type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  className?: string
}

export default function PageHeader({ eyebrow, title, description, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-8 max-w-3xl ${className}`}>
      <p className="inline-flex text-[10px] font-semibold uppercase tracking-wide text-cyan-100">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(2,6,23,0.6)] sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <p className="mt-2.5 text-[13px] text-slate-200/90 sm:text-sm lg:text-base">
        {description}
      </p>
    </header>
  )
}
