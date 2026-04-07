/**
 * File summary: Builds lightweight surface sky elements for the ocean scene.
 * Scope: Creates animated cloud sprites and an overhead directional sunlight rig.
 */
import * as THREE from "three"
import { buildCloudTexture } from "../textures"

// Purpose: Add a drifting cloud sprite layer that can be animated by the scene loop.
export function addSurfaceCloudLayer(scene: THREE.Scene, isMobile: boolean) {
  const group = new THREE.Group()
  const texture = buildCloudTexture(128)
  const cloudCount = isMobile ? 10 : 20

  for (let i = 0; i < cloudCount; i++) {
    const baseOpacity = 0.36 + Math.random() * 0.24
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
        transparent: true,
        opacity: baseOpacity,
        depthWrite: false,
      }),
    )
    sprite.userData.baseOpacity = baseOpacity

    sprite.position.set(
      -340 + Math.random() * 680,
      58 + Math.random() * 50,
      -420 - Math.random() * 360,
    )
    const size = 64 + Math.random() * 120
    sprite.scale.set(size, size * (0.35 + Math.random() * 0.25), 1)
    group.add(sprite)
  }

  scene.add(group)

  // Purpose: Animate cloud drift, bobbing, and opacity for the current fade amount.
  const update = (time: number, fade = 1) => {
    // Purpose: Move each cloud sprite and keep its material opacity in sync with fade.
    group.children.forEach((child, index) => {
      child.position.x += 0.02 + (index % 3) * 0.005
      if (child.position.x > 380) child.position.x = -380
      child.position.y += Math.sin(time * 0.16 + index * 0.7) * 0.004

      const material = (child as THREE.Sprite).material as THREE.SpriteMaterial
      material.opacity = (child.userData.baseOpacity ?? 0.45) * fade
    })

    group.visible = fade > 0.01
  }

  return { group, update }
}

// Purpose: Add a static overhead directional light for the surface scene.
export function addSurfaceSunLight(scene: THREE.Scene) {
  // Overhead directional light creating sharp white-to-lavender illusion
  const overheadSunLight = new THREE.DirectionalLight(0xf5f2ff, 0.8)
  overheadSunLight.position.set(0, 300, 200)
  scene.add(overheadSunLight)

  return {
    // Purpose: Satisfy the layer update contract for a light that does not animate.
    update: () => {
      // Static overhead light, no animation needed
    },
  }
}
