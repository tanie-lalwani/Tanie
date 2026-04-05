import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import { smoothstep } from "../math"
import { buildNormalMap } from "../textures"

type WaterUniformValue = THREE.Color | THREE.Texture | THREE.Vector3 | number
type WaterShaderMaterial = THREE.ShaderMaterial & {
  uniforms: Record<string, { value: WaterUniformValue }>
}

type CreateOceanSurfaceOptions = {
  distortionScale: number
  isMobile: boolean
  scene: THREE.Scene
  sun: THREE.Vector3
  sunColor: THREE.Color
  useContinuousDive: boolean
  waterColor: THREE.Color
  waterNormalsTexture?: THREE.Texture
}

function enhanceWaterMaterial(material: WaterShaderMaterial) {
  material.uniforms.size.value = 1.2
  material.uniforms.uProgress = { value: 0 }
  material.uniforms.uTime = { value: 0 }

  material.fragmentShader = material.fragmentShader.replace(
    "gl_FragColor = vec4( mix( waterColor, sunColor, pow( sunFade, 3.0 ) ), 1.0 );",
    `
    float waveLayer = sin(vUv.x * 12.0 + uTime * 2.0) * 0.05;
    waveLayer += cos(vUv.y * 8.0 + uTime * 1.5) * 0.05;
    vec3 enhancedColor = mix(waterColor, sunColor, pow(sunFade, 3.0));
    enhancedColor += waveLayer * sunColor * 0.3;

    float edgeNoise = sin(vUv.x * 40.0 + uTime * 0.7) * 0.04;
    edgeNoise += sin(vUv.x * 80.0 - uTime * 1.2) * 0.02;
    edgeNoise += cos(vUv.x * 24.0 + uTime * 0.3) * 0.03;
    edgeNoise += sin((vUv.x + vUv.y) * 60.0 + uTime * 0.9) * 0.025;
    float fadeHeight = 0.14 + 0.06 * sin(vUv.x * 6.0 + uTime * 0.5);
    float edge = vUv.y + edgeNoise;
    float fade = smoothstep(0.0, fadeHeight, edge);
    float softEdge = smoothstep(0.0, 0.06, edge);
    fade *= softEdge;

    vec3 bottomBlue = vec3(0.18, 0.38, 0.65);
    vec3 bottomBlend = mix(bottomBlue, enhancedColor, fade);
    gl_FragColor = vec4(bottomBlend, fade);
    `,
  )

  material.needsUpdate = true
}

export function createOceanSurface({
  distortionScale,
  isMobile,
  scene,
  sun,
  sunColor,
  useContinuousDive,
  waterColor,
  waterNormalsTexture,
}: CreateOceanSurfaceOptions) {
  const geometry = new THREE.PlaneGeometry(
    12000,
    12000,
    isMobile ? 96 : 192,
    isMobile ? 96 : 192,
  )

  const proceduralNormals = waterNormalsTexture ? null : buildNormalMap()
  const water = new Water(geometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: waterNormalsTexture ?? proceduralNormals!,
    sunDirection: new THREE.Vector3().copy(sun).normalize(),
    sunColor,
    waterColor,
    alpha: 0.95,
    distortionScale: isMobile ? Math.max(2.5, distortionScale - 0.3) : distortionScale,
    fog: false,
  })

  water.rotation.x = -Math.PI / 2
  water.position.y = -0.05

  const material = water.material as WaterShaderMaterial
  material.side = THREE.DoubleSide
  enhanceWaterMaterial(material)

  scene.add(water)

  return {
    water,
    update: (elapsed: number, stageDepth: number) => {
      const surfaceWaveTime = elapsed * 0.45

      material.uniforms.time.value = surfaceWaveTime
      material.uniforms.uTime.value = elapsed
      material.uniforms.uProgress.value = stageDepth
      water.position.y = -0.05 - smoothstep(0.14, 0.98, stageDepth) * 3.9

      if (useContinuousDive) {
        water.visible = smoothstep(0.82, 0.34, stageDepth) > 0.05
      }
    },
    dispose: () => {
      proceduralNormals?.dispose()
      geometry.dispose()
      material.dispose()
    },
  }
}
