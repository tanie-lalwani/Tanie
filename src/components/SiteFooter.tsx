import type { ReactNode } from "react"
import { useLanguage } from "../context/LanguageContext"

type SocialItem = {
  label: string
  href: string
  icon: ReactNode
}

const SOCIALS: SocialItem[] = [
  {
    label: "GitHub",
    href: "https://github.com/tanie-lalwani",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/tanie.mp3",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/tanie-lalwani/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.98 1.98 0 1 1 0-3.96 1.98 1.98 0 0 1 0 3.96zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Google Developers",
    href: "https://me.developers.google.com/u/tanielalwani",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.41 0-6.173-2.763-6.173-6.173 0-3.41 2.763-6.173 6.173-6.173 1.485 0 2.842.525 3.9 1.4l3.017-3.017C17.848 1.54 15.22.75 12.24.75 5.866.75.7 5.916.7 12.29s5.166 11.54 11.54 11.54c6.643 0 11.055-4.665 11.055-11.26 0-.756-.067-1.485-.195-2.285H12.24z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/tanielalwani",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.655l-5.214-6.817-5.966 6.817H1.683l7.73-8.835L1.254 2.25h6.824l4.713 6.231 5.453-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  
]

type SiteFooterProps = {
  className?: string
}

export default function SiteFooter({ className = "" }: SiteFooterProps) {
  const { copy } = useLanguage()

  return (
    <footer className={`relative z-20 w-full border-t border-white/8 bg-slate-950/56 px-4 pt-12 pb-6 backdrop-blur-xl sm:px-6 sm:pt-16 sm:pb-8 ${className}`}>
      <div className="site-container">
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-normal text-white/92" style={{ fontFamily: "var(--font-display)" }}>
              Tanie Lalwani
            </p>
            <p className="mt-1 text-[0.86rem] font-medium text-sky-100/88">{copy.footer.role}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto") ? undefined : "me noopener noreferrer"}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/14 bg-white/8 text-sky-100 transition hover:border-sky-200/40 hover:bg-white/14 focus:outline-none focus:ring-2 focus:ring-sky-300"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-5 h-px w-full bg-linear-to-r from-transparent via-white/8 to-transparent" />
        <p className="mt-3 text-center text-[11.5px] text-sky-100/82">
        {copy.footer.copyright}{" "}
        </p>
      </div>
    </footer>
  )
}
