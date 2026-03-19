export type TimePhase = "dawn" | "noon"

export function getLocalTimePhase(date = new Date()): TimePhase {
  const hour = date.getHours()

  if (hour >= 5 && hour < 9) return "dawn"
  return "noon"
}

export function formatPhaseLabel(phase: TimePhase): string {
  switch (phase) {
    case "dawn":
      return "Light"
    case "noon":
      return "Dark"
  }
}
