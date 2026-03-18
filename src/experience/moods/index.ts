import { dawnMood } from "./dawnMood"
import { nightMood } from "./nightMood"
import { noonMood } from "./noonMood"
import type { BeachMoodPreset } from "./types"
import type { TimePhase } from "../timePhase"

export const MOOD_PRESETS: Record<TimePhase, BeachMoodPreset> = {
  dawn: dawnMood,
  noon: noonMood,
  night: nightMood,
}

export type { BeachMoodPreset }
