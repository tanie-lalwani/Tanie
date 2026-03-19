export type TimePhase = "noon"

export function getLocalTimePhase(date = new Date()): TimePhase {
  return "noon"
}

export function formatPhaseLabel(phase: TimePhase): string {
  switch (phase) {
    case "noon":
      return "Dark"
  }
}
