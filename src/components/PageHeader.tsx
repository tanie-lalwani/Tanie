type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  className?: string
}

export default function PageHeader({ eyebrow, title, description, className = "" }: PageHeaderProps) {
  return (
    <header className={`mb-8 max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="section-eyebrow">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 className="section-title" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="section-copy">
          {description}
        </p>
      ) : null}
    </header>
  )
}



