/**
 * File summary: Composes the underwater scene environment from reusable layer builders.
 * Scope: Instantiates particles, seabed, volume veil, silt, sunlight, caustics, and surface-window layers with shared update/dispose orchestration.
 */
import * as THREE from "three"
import type { TimePhase } from "../../timePhase"
import { addCausticReflections, addSeabedTerrain, addSubsurfaceSunlight, addUnderwaterVolumeVeil } from "./scenery"
import {
  addUnderwaterParticles,
  addUnderwaterSilt,
  addUnderwaterSurfaceWindow,
} from "./particles"

type CreateUnderwaterEnvironmentOptions = {
  bubbleSpriteTexture: THREE.Texture
  isMobile: boolean
  phase: TimePhase
  scene: THREE.Scene
  sedimentOverlayTexture: THREE.Texture
  siltParticleTexture: THREE.Texture
  surfaceRippleTextureA: THREE.Texture | null
  surfaceRippleTextureB: THREE.Texture | null
}

// Purpose: Create all underwater visual layers and return a unified lifecycle controller.
export function createUnderwaterEnvironment({
  bubbleSpriteTexture,
  isMobile,
  phase,
  scene,
  sedimentOverlayTexture,
  siltParticleTexture,
  surfaceRippleTextureA,
  surfaceRippleTextureB,
}: CreateUnderwaterEnvironmentOptions) {
  const depthStage: "mid" | "deep" = "mid"

  const particlesLayer = addUnderwaterParticles(
    scene,
    phase,
    depthStage,
    isMobile,
    bubbleSpriteTexture,
  )
  const seabedLayer = addSeabedTerrain(scene, phase, isMobile)
  const volumeLayer = addUnderwaterVolumeVeil(
    scene,
    phase,
    isMobile,
    sedimentOverlayTexture,
  )
  const siltLayer = addUnderwaterSilt(scene, depthStage, isMobile, siltParticleTexture)
  const subsurfaceSunlightLayer = addSubsurfaceSunlight(scene, phase)
  const reflectionLayer = addCausticReflections(
    scene,
    phase,
    surfaceRippleTextureA,
    surfaceRippleTextureB,
  )
  const surfaceWindowLayer = addUnderwaterSurfaceWindow(
    scene,
    phase,
    depthStage,
    isMobile,
    surfaceRippleTextureA ?? undefined,
    surfaceRippleTextureB ?? undefined,
  )

  return {
    // Purpose: Advance every underwater layer using the current elapsed time and dive depth.
    update: (elapsed: number, stageDepth: number) => {
      particlesLayer.update(elapsed, stageDepth)
      seabedLayer.update(elapsed, stageDepth)
      volumeLayer.update(elapsed, stageDepth)
      siltLayer.update(elapsed, stageDepth)
      subsurfaceSunlightLayer.update(elapsed, stageDepth)
      reflectionLayer.update(elapsed, stageDepth)
      surfaceWindowLayer.update(elapsed, stageDepth)
    },
    // Purpose: Dispose all underwater layer resources owned by this environment controller.
    dispose: () => {
      particlesLayer.dispose()
      seabedLayer.dispose()
      volumeLayer.dispose()
      siltLayer.dispose()
      subsurfaceSunlightLayer.dispose()
      reflectionLayer.dispose()
      surfaceWindowLayer.dispose?.()
    },
  }
}
