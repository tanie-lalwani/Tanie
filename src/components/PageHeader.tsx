type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  className?: string
}

export default function PageHeader({ eyebrow, title, description, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-8 max-w-3xl ${className}`}>
      <p className="inline-flex text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-900">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-sky-950 sm:text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h1>
      <p className="mt-2.5 text-[13px] text-sky-900 sm:text-sm lg:text-base">
        {description}
      </p>
    </header>
  )
}



