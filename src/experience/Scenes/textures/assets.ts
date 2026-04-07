/**
 * File summary: Loads and configures image-backed textures for the experience scene.
 * Scope: Creates reusable texture handles, optional underwater ripple clones, and a single disposal contract for loaded assets.
 */
import * as THREE from "three"

export type ExperienceTextures = {
  bubbleSpriteTexture: THREE.Texture
  sedimentOverlayTexture: THREE.Texture
  siltParticleTexture: THREE.Texture
  surfaceRippleTextureA: THREE.Texture | null
  surfaceRippleTextureB: THREE.Texture | null
  waterNormalsTexture: THREE.Texture
  // Purpose: Release all textures held by the loaded experience texture bundle.
  dispose: () => void
}

// Purpose: Configure a texture to clamp at its edges so sprite-like assets do not tile.
function clampTexture(texture: THREE.Texture) {
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
}

// Purpose: Load all external textures required by the ocean experience and prepare optional underwater variants.
export function loadExperienceTextures(
  textureLoader: THREE.TextureLoader,
  supportsUnderwaterSystems: boolean,
): ExperienceTextures {
  const waterNormalsTexture = textureLoader.load("/textures/waternormals.jpg")
  waterNormalsTexture.wrapS = THREE.RepeatWrapping
  waterNormalsTexture.wrapT = THREE.RepeatWrapping

  const bubbleSpriteTexture = textureLoader.load("/textures/bubble-circle.png")
  clampTexture(bubbleSpriteTexture)

  const siltParticleTexture = textureLoader.load("/textures/micro-particle.png")
  clampTexture(siltParticleTexture)

  const sedimentOverlayTexture = textureLoader.load("/textures/coast-sand-01-diff-1k.jpg")
  sedimentOverlayTexture.colorSpace = THREE.SRGBColorSpace

  const surfaceRippleTextureA = supportsUnderwaterSystems ? waterNormalsTexture.clone() : null
  const surfaceRippleTextureB = supportsUnderwaterSystems ? waterNormalsTexture.clone() : null

  if (surfaceRippleTextureA) {
    surfaceRippleTextureA.repeat.set(3.1, 2.1)
    surfaceRippleTextureA.offset.set(0, 0)
    surfaceRippleTextureA.needsUpdate = true
  }

  if (surfaceRippleTextureB) {
    surfaceRippleTextureB.repeat.set(2.5, 1.85)
    surfaceRippleTextureB.offset.set(0.18, 0.12)
    surfaceRippleTextureB.needsUpdate = true
  }

  return {
    bubbleSpriteTexture,
    sedimentOverlayTexture,
    siltParticleTexture,
    surfaceRippleTextureA,
    surfaceRippleTextureB,
    waterNormalsTexture,
    // Purpose: Release every texture owned by the experience asset bundle.
    dispose: () => {
      waterNormalsTexture.dispose()
      bubbleSpriteTexture.dispose()
      siltParticleTexture.dispose()
      sedimentOverlayTexture.dispose()
      surfaceRippleTextureA?.dispose()
      surfaceRippleTextureB?.dispose()
    },
  }
}
