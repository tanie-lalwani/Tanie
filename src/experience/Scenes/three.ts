/**
 * File summary: Provides low-level Three.js cleanup helpers for the experience scene.
 * Scope: Disposes geometries and materials attached to scene meshes during teardown.
 */
import * as THREE from "three"

// Purpose: Dispose geometries and materials across a scene graph to prevent GPU memory leaks.
export function disposeScene(scene: THREE.Scene) {
  // Purpose: Visit each object and release mesh resources when present.
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }

    const material = (mesh as { material?: THREE.Material | THREE.Material[] }).material
    if (Array.isArray(material)) {
      for (const entry of material) {
        entry.dispose()
      }
    } else if (material) {
      material.dispose()
    }
  })
}

