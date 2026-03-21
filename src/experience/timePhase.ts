export type TimePhase = "noon"

export function getLocalTimePhase(): TimePhase {
  return "noon"
}

export function formatPhaseLabel(phase: TimePhase): string {
  switch (phase) {
    case "noon":
      return "Dark"
  }
}
