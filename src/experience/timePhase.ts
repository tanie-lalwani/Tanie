/**
 * File summary: Defines the time-phase contract used by the ocean experience.
 * Scope: Keeps phase selection and display labels centralized for scene mood lookups.
 */
export type TimePhase = "default"

// Purpose: Return the active time phase for the experience mood system.
export function getLocalTimePhase(): TimePhase {
  return "default"
}

// Purpose: Convert a time phase into the label shown in UI or diagnostics.
export function formatPhaseLabel(_phase: TimePhase): string {
  return "Default"
}
