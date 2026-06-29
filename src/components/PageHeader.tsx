type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  className?: string
  titleId?: string
}

export default function PageHeader({ eyebrow, title, description, className = "", titleId }: PageHeaderProps) {
  return (
    <header className={`mb-8 max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="inline-flex text-[11.5px] font-medium uppercase tracking-[0.2em] text-sky-200/90" style={{ fontFamily: "var(--font-ui)" }}>
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2
          id={titleId}
          className="mt-2 text-[1.8rem] font-semibold leading-none tracking-normal text-white/90 sm:text-[2.25rem] lg:text-[2.85rem]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-2 max-w-[60ch] text-base leading-7 text-sky-100/68">
          {description}
        </p>
      ) : null}
    </header>
  )
}
