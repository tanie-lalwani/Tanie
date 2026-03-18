type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  className?: string
}

export default function PageHeader({ eyebrow, title, description, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-8 max-w-3xl ${className}`}>
      <p className="inline-flex text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100 in-data-[phase=dawn]:text-sky-100 in-data-[phase=noon]:text-sky-900 in-data-[phase=night]:text-sky-200/90">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(2,6,23,0.6)] in-data-[phase=dawn]:text-slate-50 in-data-[phase=noon]:text-sky-950 in-data-[phase=noon]:drop-shadow-none in-data-[phase=night]:text-slate-100 sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <p className="mt-2.5 text-[13px] text-slate-200/90 in-data-[phase=dawn]:text-slate-200 in-data-[phase=noon]:text-sky-900 in-data-[phase=night]:text-slate-300 sm:text-sm lg:text-base">
        {description}
      </p>
    </header>
  )
}



