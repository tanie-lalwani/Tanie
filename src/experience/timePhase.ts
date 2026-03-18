export type TimePhase = "dawn" | "noon" | "night"

export function getLocalTimePhase(date = new Date()): TimePhase {
  const hour = date.getHours()

  if (hour >= 5 && hour < 9) return "dawn"
  if (hour >= 9 && hour < 18) return "noon"
  return "night"
}

export function formatPhaseLabel(phase: TimePhase): string {
  switch (phase) {
    case "dawn":
      return "Dawn"
    case "noon":
      return "Noon"
    case "night":
      return "Night"
  }
}
