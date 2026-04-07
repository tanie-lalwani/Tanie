/**
 * File summary: Collects math helpers for scroll and depth blending.
 * Scope: Provides normalized clamping, easing, section progress, and stage-depth calculations used by scene animation modules.
 */
// Purpose: Restrict a numeric value to the normalized zero-to-one range.
export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

// Purpose: Ease a value between two thresholds using a smooth cubic curve.
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

// Purpose: Compute how far a page section has progressed through the viewport.
export function getSectionScrollProgress(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const vh = window.innerHeight || 1
  const total = rect.height + vh
  const travelled = vh - rect.top
  return clamp01(travelled / Math.max(total, 1))
}

// Purpose: Translate a named depth stage and section progress into a normalized blend value.
export function getDepthBlend(depthStage: "surface" | "mid" | "deep", sectionProgress: number) {
  if (depthStage === "surface") {
    return smoothstep(0.08, 0.95, sectionProgress)
  }

  if (depthStage === "mid") {
    return 0.34 + smoothstep(0.06, 0.96, sectionProgress) * 0.36
  }

  return 0.7 + smoothstep(0.04, 0.94, sectionProgress) * 0.3
}

