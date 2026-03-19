import { noonMood } from "./noonMood"
import type { BeachMoodPreset } from "./types"
import type { TimePhase } from "../timePhase"

export const MOOD_PRESETS: Record<TimePhase, BeachMoodPreset> = {
  noon: noonMood,
}

export type { BeachMoodPreset }
