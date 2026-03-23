import * as THREE from "three"

export function disposeScene(scene: THREE.Scene) {
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

