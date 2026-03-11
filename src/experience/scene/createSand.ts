import * as THREE from "three"

/**
 * Adds a sandy beach strip between the camera and the water line.
 * Slight vertex jitter gives a natural, non-uniform surface.
 */
export function createSand(scene: THREE.Scene) {
  // Wide, shallow plane — extends well beyond the viewport edges
  const geometry = new THREE.PlaneGeometry(1200, 120, 40, 20)

  // Micro-displacement: tiny random height variation per vertex
  const pos = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.06)
  }
  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({
    color: 0xe8c87a, // warm sandy tone
    roughness: 0.96,
    metalness: 0.0,
  })

  const sand = new THREE.Mesh(geometry, material)
  sand.rotation.x = -Math.PI / 2
  // Sits just above the water plane and in front of the camera
  sand.position.set(0, 0.08, 58)
  scene.add(sand)
}
