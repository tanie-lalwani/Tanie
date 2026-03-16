export type TimePhase = "dawn" | "noon" | "sunset" | "night"

export function getLocalTimePhase(date = new Date()): TimePhase {
  const hour = date.getHours()

  if (hour >= 5 && hour < 9) return "dawn"
  if (hour >= 9 && hour < 17) return "noon"
  if (hour >= 17 && hour < 21) return "sunset"
  return "night"
}

export function formatPhaseLabel(phase: TimePhase): string {
  switch (phase) {
    case "dawn":
      return "Dawn"
    case "noon":
      return "Noon"
    case "sunset":
      return "Sunset"
    case "night":
      return "Night"
  }
}
