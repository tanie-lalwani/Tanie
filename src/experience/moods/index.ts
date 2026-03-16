import { dawnMood } from "./dawnMood"
import { nightMood } from "./nightMood"
import { noonMood } from "./noonMood"
import { sunsetMood } from "./sunsetMood"
import type { BeachMoodPreset } from "./types"
import type { TimePhase } from "../timePhase"

export const MOOD_PRESETS: Record<TimePhase, BeachMoodPreset> = {
  dawn: dawnMood,
  noon: noonMood,
  sunset: sunsetMood,
  night: nightMood,
}

export type { BeachMoodPreset }
