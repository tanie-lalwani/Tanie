import * as THREE from "three"
import { Sky } from "three/examples/jsm/objects/Sky.js"

/**
 * Adds a procedural sky dome to the scene and returns the normalised sun vector
 * so that lights and water shaders can share the same sun position.
 */
export function createSky(scene: THREE.Scene): { sun: THREE.Vector3 } {
  const sky = new Sky()
  sky.scale.setScalar(10000)
  scene.add(sky)

  const u = sky.material.uniforms
  // Turbidity / haze – low = crisp clear-blue day
  u["turbidity"].value = 3.5
  // Rayleigh scattering – controls the deep-blue dome
  u["rayleigh"].value = 2.0
  u["mieCoefficient"].value = 0.005
  u["mieDirectionalG"].value = 0.7

  // Golden-hour sun: 15° above the horizon, slightly south-west
  const sun = new THREE.Vector3()
  const phi = THREE.MathUtils.degToRad(90 - 15) // elevation
  const theta = THREE.MathUtils.degToRad(200)    // azimuth
  sun.setFromSphericalCoords(1, phi, theta)
  u["sunPosition"].value.copy(sun)

  return { sun }
}
