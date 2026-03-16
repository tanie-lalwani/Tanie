export type TimePhase = "dawn" | "day" | "afternoon" | "sunset" | "night"

export function getLocalTimePhase(date = new Date()): TimePhase {
  const hour = date.getHours()

  if (hour >= 5 && hour < 9) return "dawn"
  if (hour >= 9 && hour < 14) return "day"
  if (hour >= 14 && hour < 18) return "afternoon"
  if (hour >= 18 && hour < 21) return "sunset"
  return "night"
}

export function formatPhaseLabel(phase: TimePhase): string {
  switch (phase) {
    case "dawn":
      return "Dawn"
    case "day":
      return "Day"
    case "afternoon":
      return "Afternoon"
    case "sunset":
      return "Sunset"
    case "night":
      return "Night"
  }
}
