/**
 * File summary: Centralizes Three.js scene layer definitions and layer utilities.
 * Scope: Provides named layer constants plus helpers for object assignment, camera masks, visibility debugging, and raycaster targeting.
 */
import * as THREE from "three"

export const LAYERS = {
  SEAFLOOR: 1,
  DECOR: 2,
  WATER: 3,
  EFFECTS: 4,
  UI: 5,
  // Add more as needed
} as const

export type SceneLayer = typeof LAYERS[keyof typeof LAYERS]

// Purpose: Assign a layer to a single Object3D without touching its descendants.
export function setLayer(obj: THREE.Object3D, layer: SceneLayer) {
  obj.layers.set(layer)
}

// Purpose: Assign a layer to an object tree so the root and every child share the same render mask.
export function setLayerRecursive(obj: THREE.Object3D, layer: SceneLayer) {
  // Purpose: Apply the layer value to each descendant during traversal.
  obj.traverse(child => child.layers.set(layer))
}

// Purpose: Enable every defined experience layer on a camera for full rendering or debugging.
export function enableAllLayers(camera: THREE.Camera) {
  for (const key in LAYERS) {
    camera.layers.enable(LAYERS[key as keyof typeof LAYERS])
  }
}

// Purpose: Enable a provided subset of scene layers on a camera.
export function enableLayers(camera: THREE.Camera, ...layers: SceneLayer[]) {
  // Purpose: Turn on each requested layer bit for the camera.
  layers.forEach(layer => camera.layers.enable(layer))
}

// Purpose: Show or hide every scene object assigned to a specific layer.
export function toggleLayerVisibility(scene: THREE.Scene, layer: SceneLayer, visible: boolean) {
  const targetLayer = new THREE.Layers()
  targetLayer.set(layer)

  // Purpose: Inspect each object and toggle only those matching the target layer.
  scene.traverse(obj => {
    if (obj.layers.test(targetLayer)) {
      obj.visible = visible
    }
  })
}

// Purpose: Isolate a single layer by hiding all objects outside the target layer.
export function isolateLayer(scene: THREE.Scene, layer: SceneLayer) {
  const targetLayer = new THREE.Layers()
  targetLayer.set(layer)

  // Purpose: Recompute visibility for each object based on whether it belongs to the target layer.
  scene.traverse(obj => {
    obj.visible = obj.layers.test(targetLayer)
  })
}

// Purpose: Restore visibility for every object after layer debugging.
export function showAllLayers(scene: THREE.Scene) {
  // Purpose: Mark each traversed object as visible.
  scene.traverse(obj => { obj.visible = true })
}

// Purpose: Limit raycaster hits to objects on a specific experience layer.
export function setRaycasterLayer(raycaster: THREE.Raycaster, layer: SceneLayer) {
  raycaster.layers.set(layer)
}
