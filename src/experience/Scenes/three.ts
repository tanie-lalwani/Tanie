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

type GlobalBeachBackdropProps = {
  phase: TimePhase
  position?: "fixed" | "absolute"
  depthStage?: "surface" | "mid" | "deep"
  enableContinuousDive?: boolean
  diveProgressValue?: MotionValue<number>
} //end of maths section
