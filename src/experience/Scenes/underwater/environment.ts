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
    update: (elapsed: number, stageDepth: number) => {
      particlesLayer.update(elapsed, stageDepth)
      seabedLayer.update(elapsed, stageDepth)
      volumeLayer.update(elapsed, stageDepth)
      siltLayer.update(elapsed, stageDepth)
      subsurfaceSunlightLayer.update(elapsed, stageDepth)
      reflectionLayer.update(elapsed, stageDepth)
      surfaceWindowLayer.update(elapsed, stageDepth)
    },
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
