import { useEffect, useRef } from "react"
import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"
import { useIsMobile } from "../hooks/useIsMobile"

function buildNormalMap(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const u = (x / size) * Math.PI * 2
      const v = (y / size) * Math.PI * 2

      const nx =
        0.27 * Math.sin(u * 2) +
        0.12 * Math.sin(u * 6 + v * 3) +
        0.08 * Math.sin(u * 9 + v * 1.8)
      const ny =
        0.27 * Math.cos(v * 2) +
        0.12 * Math.cos(u * 3 + v * 5) +
        0.08 * Math.cos(v * 8 + u * 1.4)
      const nz = Math.sqrt(Math.max(1 - nx * nx - ny * ny, 0))

      data[idx] = Math.round((nx + 1) * 127.5)
      data[idx + 1] = Math.round((ny + 1) * 127.5)
      data[idx + 2] = Math.round(nz * 255)
      data[idx + 3] = 255
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.needsUpdate = true
  return texture
}

function addSand(scene: THREE.Scene) {
  const geometry = new THREE.PlaneGeometry(1000, 140, 44, 18)
  const pos = geometry.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.085)
  }

  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({
    color: 0xe9cb84,
    roughness: 0.96,
    metalness: 0,
  })

  const sand = new THREE.Mesh(geometry, material)
  sand.rotation.x = -Math.PI / 2
  sand.position.set(0, 0.12, 62)
  sand.receiveShadow = true
  scene.add(sand)
}

function createShell(): THREE.Mesh {
  const geometry = new THREE.ConeGeometry(0.22, 0.55, 16, 1, true)
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.08, 0.38, 0.75),
    roughness: 0.74,
    metalness: 0.02,
  })
  const shell = new THREE.Mesh(geometry, material)
  shell.scale.set(1, 0.48, 1)
  shell.rotation.x = Math.PI / 2
  return shell
}

function createStarfish(): THREE.Mesh {
  const shape = new THREE.Shape()
  const points = 5
  const outerRadius = 0.45
  const innerRadius = 0.18

  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 1,
  })

  geometry.center()

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.055, 0.66, 0.6),
    roughness: 0.8,
    metalness: 0.02,
  })

  const star = new THREE.Mesh(geometry, material)
  star.rotation.x = -Math.PI / 2
  return star
}

function scatterBeachDecor(scene: THREE.Scene, isMobile: boolean) {
  const decorCount = isMobile ? 16 : 34

  for (let i = 0; i < decorCount; i++) {
    const isStar = i % 3 === 0
    const mesh = isStar ? createStarfish() : createShell()
    const lane = Math.random() > 0.5 ? 1 : -1

    mesh.position.set(
      lane * (7 + Math.random() * 24),
      0.18 + Math.random() * 0.04,
      24 + Math.random() * 76,
    )

    mesh.rotation.y = Math.random() * Math.PI * 2
    mesh.rotation.z += (Math.random() - 0.5) * 0.22

    const scale = isStar ? 0.66 + Math.random() * 0.6 : 0.5 + Math.random() * 0.42
    mesh.scale.multiplyScalar(scale)

    scene.add(mesh)
  }
}

export default function GlobalBeachBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 1.8))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.54

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x84c8df, 0.00075)

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      20000,
    )
    camera.position.set(0, 4.4, 55)
    camera.lookAt(0, 2, -40)

    const sky = new Sky()
    sky.scale.setScalar(10000)
    scene.add(sky)

    const skyUniforms = sky.material.uniforms
    skyUniforms["turbidity"].value = 3.2
    skyUniforms["rayleigh"].value = 1.9
    skyUniforms["mieCoefficient"].value = 0.006
    skyUniforms["mieDirectionalG"].value = 0.74

    const sun = new THREE.Vector3()
    const phi = THREE.MathUtils.degToRad(90 - 16)
    const theta = THREE.MathUtils.degToRad(204)
    sun.setFromSphericalCoords(1, phi, theta)
    skyUniforms["sunPosition"].value.copy(sun)

    const water = new Water(new THREE.PlaneGeometry(12000, 12000), {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: buildNormalMap(),
      sunDirection: new THREE.Vector3().copy(sun).normalize(),
      sunColor: 0xfff2c6,
      waterColor: 0x006888,
      distortionScale: isMobile ? 2.5 : 3.4,
      fog: false,
    })
    water.rotation.x = -Math.PI / 2
    water.position.y = -0.05
    scene.add(water)

    addSand(scene)
    scatterBeachDecor(scene, isMobile)

    scene.add(new THREE.AmbientLight(0xfff1d8, 0.58))
    const sunLight = new THREE.DirectionalLight(0xfff2d2, 1.55)
    sunLight.position.copy(sun).multiplyScalar(460)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x99d8ff, 0.3)
    fillLight.position.set(-180, 80, 120)
    scene.add(fillLight)

    let raf = 0
    const clock = new THREE.Clock()

    const render = () => {
      raf = requestAnimationFrame(render)
      water.material.uniforms["time"].value = clock.getElapsedTime() * 0.45
      renderer.render(scene, camera)
    }
    render()

    const onResize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(canvas.parentElement ?? canvas)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      renderer.dispose()
    }
  }, [isMobile])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.34)_0%,rgba(2,6,23,0.54)_52%,rgba(2,6,23,0.72)_100%)]" />
    </div>
  )
}
