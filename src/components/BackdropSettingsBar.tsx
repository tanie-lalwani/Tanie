import { formatPhaseLabel, type TimePhase } from "../experience/timePhase"

type BackdropSettingsBarProps = {
  isTimeSyncEnabled: boolean
  phase: TimePhase
  onToggleTimeSync: (enabled: boolean) => void
  onSelectPhase: (phase: TimePhase) => void
}

const MANUAL_PHASES: TimePhase[] = ["dawn", "noon", "sunset", "night"]

export default function BackdropSettingsBar({
  isTimeSyncEnabled,
  phase,
  onToggleTimeSync,
  onSelectPhase,
}: BackdropSettingsBarProps) {
  return (
    <aside className="fixed bottom-3 right-3 z-30 w-[min(92vw,20rem)] rounded-2xl border border-white/18 bg-slate-950/62 p-3 shadow-[0_20px_70px_rgba(2,6,23,0.52)] backdrop-blur-xl sm:bottom-4 sm:right-4 sm:p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/80">
        Scene Mood
      </p>

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
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {MANUAL_PHASES.map((item) => (
            <button
              key={item}
              type="button"
              disabled={isTimeSyncEnabled}
              onClick={() => onSelectPhase(item)}
              className={`rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition ${
                phase === item
                  ? "border-cyan-200/40 bg-cyan-100/18 text-cyan-50"
                  : "border-white/14 bg-white/7 text-slate-200 hover:bg-white/12"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {formatPhaseLabel(item)}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
