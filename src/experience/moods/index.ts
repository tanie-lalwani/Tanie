/**
 * File summary: Registers available ocean mood presets by time phase.
 * Scope: Exposes the preset map and shared preset type for experience scene modules.
 */
import { defaultOceanMood } from "./defaultOceanMood"
import type { OceanScenePreset } from "./types"
import type { TimePhase } from "../timePhase"

export const OCEAN_SCENE_PRESETS: Record<TimePhase, OceanScenePreset> = {
  default: defaultOceanMood,
}

export type { OceanScenePreset }
