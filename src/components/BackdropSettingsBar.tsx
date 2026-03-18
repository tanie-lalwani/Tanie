import type { ReactNode } from "react"
import { formatPhaseLabel, type TimePhase } from "../experience/timePhase"

type BackdropSettingsBarProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isTimeSyncEnabled: boolean
  phase: TimePhase
  onToggleTimeSync: (enabled: boolean) => void
  onSelectPhase: (phase: TimePhase) => void
}

const MANUAL_PHASES: TimePhase[] = ["dawn", "noon", "night"]

const PHASE_ICONS: Record<TimePhase, ReactNode> = {
  dawn: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h16M6 16a6 6 0 0112 0M12 4v2M7.1 6.1l1.4 1.4M16.9 6.1l-1.4 1.4" />
    </svg>
  ),
  noon: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="3.8" />
      <path strokeLinecap="round" d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.7 5.7l1.7 1.7M16.6 16.6l1.7 1.7M18.3 5.7l-1.7 1.7M7.4 16.6l-1.7 1.7" />
    </svg>
  ),
  night: (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.8 3.2a8.6 8.6 0 108 12.1 7.1 7.1 0 01-8-12.1z" />
    </svg>
  ),
}

export default function BackdropSettingsBar({
  isOpen,
  onOpenChange,
  isTimeSyncEnabled,
  phase,
  onToggleTimeSync,
  onSelectPhase,
}: BackdropSettingsBarProps) {
  if (!isOpen) return null

  return (
    <aside className="fixed bottom-3 right-3 z-30 w-[min(92vw,20rem)] rounded-2xl border border-white/18 bg-slate-950/62 p-3 shadow-[0_20px_70px_rgba(2,6,23,0.52)] backdrop-blur-xl sm:bottom-4 sm:right-4 sm:p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">
          Scene Mood
        </p>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-md p-0.5 text-slate-400 transition hover:text-white"
          aria-label="Close settings"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <label className="mt-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/5 px-3 py-2">
        <span className="text-xs font-semibold text-slate-100">Auto by local time</span>

        <span className="relative inline-flex items-center">
          <input
            type="checkbox"
            checked={isTimeSyncEnabled}
            onChange={(event) => onToggleTimeSync(event.target.checked)}
            className="peer sr-only"
            aria-label="Enable local-time scene mode"
          />
          <span className="h-6 w-10 rounded-full bg-slate-700/80 transition peer-checked:bg-cyan-500/80" />
          <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-4" />
        </span>
      </label>

      <p className="mt-2 text-[11px] text-slate-300">
        Current look: <span className="font-semibold text-slate-100">{formatPhaseLabel(phase)}</span>
      </p>

      <div className="mt-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Manual Switch
        </p>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {MANUAL_PHASES.map((item) => (
            <button
              key={item}
              type="button"
              disabled={isTimeSyncEnabled}
              onClick={() => onSelectPhase(item)}
              aria-label={formatPhaseLabel(item)}
              title={formatPhaseLabel(item)}
              className={`flex items-center justify-center rounded-lg border px-2 py-2.5 text-[11px] font-semibold transition ${
                phase === item
                  ? "border-cyan-200/40 bg-cyan-100/18 text-cyan-50"
                  : "border-white/14 bg-white/7 text-slate-200 hover:bg-white/12"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {PHASE_ICONS[item]}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
