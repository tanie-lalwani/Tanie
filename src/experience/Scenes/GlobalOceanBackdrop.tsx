// utils (same folder as component)
import { clamp01, smoothstep, getSectionScrollProgress, getDepthBlend } from "./math"
import { disposeScene } from "./three"

// textures
import { buildNormalMap } from "../Scenes/surface/textures"

// surface
import { addSeafloorTerrain, scatterSeafloorDecor } from "../Scenes/surface/oceanFloor"
import { addSurfaceCloudLayer, addSurfaceSunLight } from "../Scenes/surface/sky"

// underwater 
import {
  addUnderwaterParticles,
  addUnderwaterSilt,
} from "../Scenes/underwater/particles"

import {
  addUnderwaterBed,
  addUnderwaterVolumeTexture,
  addMutedTopSunlight,
  addUnderwaterReflections,
} from "../Scenes/underwater/water"

import { addUnderwaterSurfaceWindow } from "../Scenes/underwater/particles"

import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { MotionValue } from "framer-motion"
import { Water } from "three/examples/jsm/objects/Water.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"
import { useIsMobile } from "../../hooks/useIsMobile"
import type { TimePhase } from "../timePhase"
import { OCEAN_SCENE_PRESETS } from "../moods"


type GlobalOceanBackdropProps = {
  phase: TimePhase
  position?: "fixed" | "absolute"
  depthStage?: "surface" | "mid" | "deep"
  enableContinuousDive?: boolean
  diveProgressValue?: MotionValue<number>
}

const GLOBAL_OCEAN_START = performance.now() * 0.001
const OVERLAY_CLEAR_START = 0.55
const OVERLAY_CLEAR_STEP = 0.04
const OVERLAY_CLEAR_DROP = 0.15

function getPostTransitionFade(stageDepth: number) {
  const scrollStepsAfterStart = Math.max(0, (stageDepth - OVERLAY_CLEAR_START) / OVERLAY_CLEAR_STEP)
  return clamp01(1 - scrollStepsAfterStart * OVERLAY_CLEAR_DROP)
}


export default function GlobalOceanBackdrop({
  phase,
  position = "fixed",
  depthStage = "surface",
  enableContinuousDive = false,
  diveProgressValue,
}: GlobalOceanBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const transitionVeilRef = useRef<HTMLDivElement | null>(null)
  const transitionWashRef = useRef<HTMLDivElement | null>(null)
  const externalDiveProgressRef = useRef<number | null>(null)
  const isMobile = useIsMobile()
  const scenePreset = useMemo(() => OCEAN_SCENE_PRESETS[phase], [phase])
  const isSurfaceStage = depthStage === "surface"
  const usesContinuousDive = enableContinuousDive
  const supportsUnderwaterSystems = !isSurfaceStage || usesContinuousDive

  useEffect(() => {
    if (!diveProgressValue) {
      externalDiveProgressRef.current = null
      return
    }

    externalDiveProgressRef.current = clamp01(diveProgressValue.get())
    const unsubscribe = diveProgressValue.on("change", (value) => {
      externalDiveProgressRef.current = clamp01(value)
    })

    return () => {
      unsubscribe()
    }
  }, [diveProgressValue])

  const depthTuning = useMemo(() => {
    // TUNE: Main continuous-dive profile (overall darkness, fog, camera depth, and light loss).

    // BRIGHTER, CLEARER underwater for reference look
    if (usesContinuousDive) {
      return {
        exposureMultiplier: 0.44, // brighter
        fogDensityMultiplier: 2.2, // much less fog
        waterLightnessDrop: 0.19, // lighter water
        waterSaturationBoost: 0.22, // more color
        fogLightnessDrop: 0.18, // lighter fog
        cameraY: -3.2,
        cameraZ: 62,
        lookAtY: -4.2,
        lookAtZ: -138,
        lightMultiplier: 0.22,
        distortionMultiplier: 0.98,
      }
    }

    // BRIGHTER "mid" depth for reference look
    if (depthStage === "mid") {
      return {
        exposureMultiplier: 0.62,
        fogDensityMultiplier: 1.7,
        waterLightnessDrop: 0.13,
        waterSaturationBoost: 0.18,
        fogLightnessDrop: 0.13,
        cameraY: 3.8,
        cameraZ: 92,
        lookAtY: 2.2,
        lookAtZ: -152,
        lightMultiplier: 0.38,
        distortionMultiplier: 0.97,
      }
    }

    // TUNE: Deep profile for manual `depthStage="deep"` snapshots.
    if (depthStage === "deep") {
      return {
        exposureMultiplier: 0.34,
        fogDensityMultiplier: 5.2,
        waterLightnessDrop: 0.42,
        waterSaturationBoost: 0.12,
        fogLightnessDrop: 0.56,
        cameraY: 0.6,
        cameraZ: 80,
        lookAtY: -0.5,
        lookAtZ: -168,
        lightMultiplier: 0.16,
        distortionMultiplier: 0.82,
      }
    }

    // TUNE: Surface profile for the above-water look.
    return {
      exposureMultiplier: 0.78,
      fogDensityMultiplier: 1,
      waterLightnessDrop: 0,
      waterSaturationBoost: 0,
      fogLightnessDrop: 0,
      cameraY: 2,
      cameraZ: 70,
      lookAtY: -1.2,
      lookAtZ: -162,
      lightMultiplier: 0.72,
      distortionMultiplier: 1,
    }
  }, [depthStage, usesContinuousDive])

  const waterColor = useMemo(() => {
    const color = new THREE.Color(scenePreset.waterColor)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    // TUNE: Fine color grading applied before depth darkening.
    const phaseShift = { h: 0.012, s: 0.05, l: 0.01 }
    const phaseExtraDrop = 0.04
    const shiftedHue = (hsl.h + phaseShift.h + 1) % 1
    color.setHSL(
      shiftedHue,
      Math.min(1, hsl.s + depthTuning.waterSaturationBoost + phaseShift.s),
      Math.max(0.02, hsl.l + phaseShift.l - depthTuning.waterLightnessDrop - phaseExtraDrop),
    )
    return color
  }, [scenePreset.waterColor, depthTuning])

  const fogColor = useMemo(() => {
    const color = new THREE.Color(scenePreset.fogColor)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    color.setHSL(hsl.h, Math.min(1, hsl.s + 0.03), Math.max(0.02, hsl.l - depthTuning.fogLightnessDrop))
    return color
  }, [scenePreset.fogColor, depthTuning])

  const sunColor = useMemo(() => {
    const color = new THREE.Color(scenePreset.sunColor)
    const hsl = { h: 0, s: 0, l: 0 }
    color.getHSL(hsl)
    color.setHSL(hsl.h, Math.max(0, hsl.s - 0.06), Math.max(0.04, hsl.l * depthTuning.lightMultiplier))
    return color
  }, [scenePreset.sunColor, depthTuning.lightMultiplier])

  const submergedClearColor = useMemo(() => {
    // Use adjusted water color for underwater background - matches water surface shader for continuity
    return waterColor.clone()
  }, [waterColor])

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
    renderer.toneMappingExposure = Math.max(0.28, scenePreset.exposure * depthTuning.exposureMultiplier)
    if (isSurfaceStage && !usesContinuousDive) {
      renderer.setClearColor(0x000000, 0) // Transparent background
    } else {
      renderer.setClearColor(submergedClearColor, 1)
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(fogColor, scenePreset.fogDensity * depthTuning.fogDensityMultiplier)

    const textureLoader = new THREE.TextureLoader()
    const proceduralWaterNormals = buildNormalMap()
    const waterNormalsTexture = textureLoader.load("/textures/waternormals.jpg")
    waterNormalsTexture.wrapS = THREE.RepeatWrapping
    waterNormalsTexture.wrapT = THREE.RepeatWrapping

    const bubbleSpriteTexture = textureLoader.load("/textures/bubble-circle.png")
    bubbleSpriteTexture.wrapS = THREE.ClampToEdgeWrapping
    bubbleSpriteTexture.wrapT = THREE.ClampToEdgeWrapping
    const siltParticleTexture = textureLoader.load("/textures/micro-particle.png")
    siltParticleTexture.wrapS = THREE.ClampToEdgeWrapping
    siltParticleTexture.wrapT = THREE.ClampToEdgeWrapping
    const sedimentOverlayTexture = textureLoader.load("/textures/coast-sand-01-diff-1k.jpg")
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

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      20000,
    )
    // TUNE: Initial camera placement before scroll-based dive interpolation.
    camera.position.set(0, depthTuning.cameraY, 88)
    camera.lookAt(0, depthTuning.lookAtY, depthTuning.lookAtZ)
    const cameraLookAt = new THREE.Vector3(0, depthTuning.lookAtY, depthTuning.lookAtZ)

    const sun = new THREE.Vector3()
    const phi = THREE.MathUtils.degToRad(90 - scenePreset.sunElevation)
    const theta = THREE.MathUtils.degToRad(scenePreset.sunAzimuth)
    sun.setFromSphericalCoords(1, phi, theta)

    let sky: Sky | null = null
    if (isSurfaceStage) {
      sky = new Sky()
      sky.scale.setScalar(10000)
      scene.add(sky)

      const skyUniforms = sky.material.uniforms
      skyUniforms["turbidity"].value = scenePreset.turbidity
      skyUniforms["rayleigh"].value = scenePreset.rayleigh
      skyUniforms["mieCoefficient"].value = scenePreset.mieCoefficient
      skyUniforms["mieDirectionalG"].value = scenePreset.mieDirectionalG
      skyUniforms["sunPosition"].value.copy(sun)
    }

    const waterGeometry = new THREE.PlaneGeometry(
      12000,
      12000,
      isMobile ? 96 : 192,
      isMobile ? 96 : 192,
    )

    let water: Water | null = null
    if (isSurfaceStage) {
      water = new Water(waterGeometry, {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals: waterNormalsTexture ?? proceduralWaterNormals,
        sunDirection: new THREE.Vector3().copy(sun).normalize(),
        sunColor,
        waterColor,
        alpha: 0.95,
        distortionScale: isMobile
          ? Math.max(2.5, (scenePreset.waterDistortion + 0.5) * depthTuning.distortionMultiplier)
          : (scenePreset.waterDistortion + 0.8) * depthTuning.distortionMultiplier,
        fog: false,
      })
      water.rotation.x = -Math.PI / 2
      water.position.y = -0.05

            // Ensure water is visible from below
            if (water.material) {
              water.material.side = THREE.DoubleSide;
            }
      
      // Enhanced water material with transition effects
      if (water.material && water.material.uniforms) {
        water.material.uniforms.size.value = 1.2
        
        // Add custom uniforms for transition effects
        water.material.uniforms.uProgress = { value: 0 }
        water.material.uniforms.uSurfaceFade = { value: 1 }
        water.material.uniforms.uTime = { value: 0 }
        
        // Enhance shader with better wave dynamics
        const originalFragmentShader = water.material.fragmentShader
        
        // Add more wave layers to fragment shader for richer transitions
        water.material.fragmentShader = `
          uniform float uProgress;
          uniform float uSurfaceFade;
          uniform float uTime;
        ${originalFragmentShader.replace(
          'gl_FragColor = vec4( mix( waterColor, sunColor, pow( sunFade, 3.0 ) ), 1.0 );',
          `
          // Enhanced wave layers for transition
          float waveLayer = sin(vUv.x * 12.0 + uTime * 2.0) * 0.05;
          waveLayer += cos(vUv.y * 8.0 + uTime * 1.5) * 0.05;
          vec3 enhancedColor = mix(waterColor, sunColor, pow(sunFade, 3.0));
          enhancedColor += waveLayer * sunColor * 0.18;
          float submergeBlend = smoothstep(0.18, 0.64, uProgress);
          vec3 underwaterTint = vec3(0.09, 0.30, 0.42);
          enhancedColor = mix(enhancedColor, underwaterTint, submergeBlend * 0.84);

          // Enhanced animated soft mask for water edge
          float edgeNoise = sin(vUv.x * 40.0 + uTime * 0.7) * 0.04;
          edgeNoise += sin(vUv.x * 80.0 - uTime * 1.2) * 0.02;
          edgeNoise += cos(vUv.x * 24.0 + uTime * 0.3) * 0.03;
          edgeNoise += sin((vUv.x + vUv.y) * 60.0 + uTime * 0.9) * 0.025;
          // Variable fade height for more organic edge
          float fadeHeight = 0.14 + 0.06 * sin(vUv.x * 6.0 + uTime * 0.5);
          float edge = vUv.y + edgeNoise;
          float fade = smoothstep(0.0, fadeHeight, edge); // fade out at the bottom, animated and variable
          // Soften the very bottom edge further
          float softEdge = smoothstep(0.0, 0.06, edge);
          fade *= softEdge;
          // Subtle color blend at the bottom for smoother transition (blend to blue)
          vec3 bottomBlue = mix(vec3(0.60, 0.69, 0.72), vec3(0.10, 0.29, 0.40), smoothstep(0.22, 0.72, uProgress)); // soft bridge tint
          vec3 bottomBlend = mix(bottomBlue, enhancedColor, fade); // blend to blue
          float surfaceAlpha = fade * uSurfaceFade;
          gl_FragColor = vec4(bottomBlend, surfaceAlpha);
          `
        )}`
        water.material.transparent = true
        water.material.depthWrite = false
        water.material.needsUpdate = true
      }
      
      scene.add(water)
    }

    if (isSurfaceStage && !usesContinuousDive) {
      addSeafloorTerrain(scene, scenePreset)
      scatterSeafloorDecor(scene, isMobile, scenePreset)
    }
    const surfaceCloudLayer = isSurfaceStage ? addSurfaceCloudLayer(scene, isMobile) : null
    const surfaceSunLayer = isSurfaceStage ? addSurfaceSunLight(scene) : null
    const underwaterDepthStage: "mid" | "deep" = depthStage === "deep" ? "deep" : "mid"
    // UNDERWATER SCENE LAYERS RESTORED
    const underwaterLayer: ReturnType<typeof addUnderwaterParticles> | null = supportsUnderwaterSystems ? addUnderwaterParticles(scene, phase, underwaterDepthStage, isMobile) : null;
    const underwaterBedLayer: ReturnType<typeof addUnderwaterBed> | null = supportsUnderwaterSystems ? addUnderwaterBed(scene, phase, underwaterDepthStage, isMobile) : null;
    const underwaterVolumeLayer: ReturnType<typeof addUnderwaterVolumeTexture> | null = supportsUnderwaterSystems ? addUnderwaterVolumeTexture(scene, phase, underwaterDepthStage, isMobile) : null;
    const underwaterSiltLayer: ReturnType<typeof addUnderwaterSilt> | null = supportsUnderwaterSystems ? addUnderwaterSilt(scene, underwaterDepthStage, isMobile) : null;
    const mutedSunlightLayer: ReturnType<typeof addMutedTopSunlight> | null = supportsUnderwaterSystems ? addMutedTopSunlight(scene, phase, underwaterDepthStage) : null;
    const reflectionLayer: ReturnType<typeof addUnderwaterReflections> | null = supportsUnderwaterSystems ? addUnderwaterReflections(scene, phase, underwaterDepthStage) : null;
    const surfaceWindowLayer: ReturnType<typeof addUnderwaterSurfaceWindow> | null = supportsUnderwaterSystems ? addUnderwaterSurfaceWindow(scene, phase, underwaterDepthStage, isMobile) : null;

    // Configure camera layers.
    camera.layers.enable(1)

    const ambientLight = new THREE.AmbientLight(scenePreset.ambientColor, scenePreset.ambientIntensity * depthTuning.lightMultiplier)
    const hemisphereLight = new THREE.HemisphereLight(
      scenePreset.hemisphereSkyColor,
      scenePreset.hemisphereGroundColor,
      scenePreset.hemisphereIntensity * depthTuning.lightMultiplier,
    )
    scene.add(ambientLight)
    scene.add(hemisphereLight)

    let sunLight: THREE.DirectionalLight | null = null
    let fillLight: THREE.DirectionalLight | null = null
    let rimLight: THREE.DirectionalLight | null = null

    if (isSurfaceStage) {
      sunLight = new THREE.DirectionalLight(
        scenePreset.sunlightColor,
        scenePreset.sunlightIntensity * depthTuning.lightMultiplier,
      )
      sunLight.position.copy(sun).multiplyScalar(scenePreset.sunlightDistance)
      scene.add(sunLight)

      fillLight = new THREE.DirectionalLight(scenePreset.fillColor, scenePreset.fillIntensity * depthTuning.lightMultiplier)
      fillLight.position.set(...scenePreset.fillPosition)
      scene.add(fillLight)

      rimLight = new THREE.DirectionalLight(scenePreset.rimColor, scenePreset.rimIntensity * depthTuning.lightMultiplier)
      rimLight.position.set(...scenePreset.rimPosition)
      scene.add(rimLight)
    }

    let raf = 0
    let smoothedDepthBlend = getDepthBlend(depthStage, 0.2)
    let isSceneVisible = true

    const parent = canvas.parentElement ?? canvas
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isSceneVisible = entry?.isIntersecting ?? true
      },
      { threshold: 0.01 },
    )
    visibilityObserver.observe(parent)

    const fog = scene.fog as THREE.FogExp2
    // Use the adjusted water color (same as water surface shader) for underwater background - ensures continuity
    const baseUnderwaterColor = waterColor.clone()
    const dynamicFogColor = baseUnderwaterColor.clone()
    const dynamicClearColor = baseUnderwaterColor.clone()

    const render = () => {
      raf = requestAnimationFrame(render)
      const elapsed = performance.now() * 0.001 - GLOBAL_OCEAN_START

      if (!isSceneVisible) {
        return
      }

      const sectionProgress = getSectionScrollProgress(parent)
      const controlledProgress =
        typeof externalDiveProgressRef.current === "number" ? externalDiveProgressRef.current : sectionProgress
      const targetDepthBlend = usesContinuousDive ? controlledProgress : getDepthBlend(depthStage, controlledProgress)
      smoothedDepthBlend = THREE.MathUtils.lerp(smoothedDepthBlend, targetDepthBlend, usesContinuousDive ? 0.2 : 0.5)
      const stageDepth = usesContinuousDive || !isSurfaceStage ? clamp01(smoothedDepthBlend) : smoothedDepthBlend
      const surfaceWaveTime = elapsed * 0.45
      const transitionVeil = transitionVeilRef.current
      const transitionWash = transitionWashRef.current
      const postTransitionFade = usesContinuousDive ? getPostTransitionFade(stageDepth) : 1

      if (transitionVeil) {
        const veilIn = smoothstep(0.14, 0.34, stageDepth)
        const veilOut = 1 - smoothstep(0.76, 0.94, stageDepth)
        const veilOpacity = usesContinuousDive ? veilIn * veilOut * postTransitionFade * 0.78 : 0
        const veilHeight = THREE.MathUtils.lerp(42, 92, smoothstep(0.22, 0.62, stageDepth))
        const veilLift = THREE.MathUtils.lerp(-18, -3, veilIn)

        transitionVeil.style.opacity = veilOpacity.toFixed(3)
        transitionVeil.style.height = `${veilHeight.toFixed(2)}%`
        transitionVeil.style.transform = `translateY(${veilLift.toFixed(2)}%)`
      }
      if (transitionWash) {
        const washIn = smoothstep(0.2, 0.42, stageDepth)
        const washOut = 1 - smoothstep(0.78, 0.94, stageDepth)
        const washOpacity = usesContinuousDive ? washIn * washOut * postTransitionFade * 0.86 : 0
        const washLift = THREE.MathUtils.lerp(10, -9, smoothstep(0.28, 0.74, stageDepth))

        transitionWash.style.opacity = washOpacity.toFixed(3)
        transitionWash.style.transform = `translateY(${washLift.toFixed(2)}%)`
      }

      const exposureMultiplier = THREE.MathUtils.lerp(1, depthTuning.exposureMultiplier, stageDepth)
      // Keep exposure brighter longer so the descent remains airy and not abruptly dark.
      const depthExposureFactor = stageDepth < 0.6 ? THREE.MathUtils.lerp(1, 0.82, stageDepth / 0.6) : 1
      const textureOnsetDimmer = THREE.MathUtils.lerp(1, 0.72, smoothstep(0.1, 0.5, stageDepth))
      renderer.toneMappingExposure = Math.max(
        0.2,
        scenePreset.exposure * exposureMultiplier * depthExposureFactor * textureOnsetDimmer,
      )

      if (!isSurfaceStage || usesContinuousDive) {
        const skyTransitionColor = new THREE.Color(0x8ab8cc)
        const underwaterPhase = smoothstep(0.1, 0.5, stageDepth)

        const baseHsl = { h: 0, s: 0, l: 0 }
        baseUnderwaterColor.getHSL(baseHsl)

        const lightWaterColor = new THREE.Color()
        lightWaterColor.setHSL(baseHsl.h, baseHsl.s, Math.min(1, baseHsl.l + 0.17))

        const mediumWaterColor = new THREE.Color()
        mediumWaterColor.setHSL(baseHsl.h, baseHsl.s, Math.min(1, baseHsl.l + 0.08))

        const darkWaterColor = baseUnderwaterColor.clone()

        if (stageDepth < 0.65) {
          dynamicClearColor.copy(lightWaterColor)
        } else if (stageDepth < 0.80) {
          const mediumProgress = (stageDepth - 0.65) / 0.15
          dynamicClearColor.copy(lightWaterColor)
          dynamicClearColor.lerp(mediumWaterColor, mediumProgress)
        } else {
          const darkProgress = Math.min(1, (stageDepth - 0.80) / 0.25)
          dynamicClearColor.copy(mediumWaterColor)
          dynamicClearColor.lerp(darkWaterColor, darkProgress)
        }

        dynamicClearColor.lerpColors(skyTransitionColor, dynamicClearColor.clone(), underwaterPhase)
        const bridgeHazeColor = new THREE.Color(0x385a68)
        const bridgeHazeStrength = smoothstep(0.42, 0.68, stageDepth) * (1 - smoothstep(0.82, 0.96, stageDepth)) * 0.58
        dynamicClearColor.lerp(bridgeHazeColor, bridgeHazeStrength)
        
        dynamicFogColor.copy(baseUnderwaterColor)
        dynamicFogColor.lerp(bridgeHazeColor, bridgeHazeStrength * 0.62)

        fog.color.copy(dynamicFogColor)

        // Fog density: lighter near surface, increases with depth for layered effect
        const startFogDensity = usesContinuousDive ? 0.48 : 1.8
        const baseDensity = THREE.MathUtils.lerp(startFogDensity, depthTuning.fogDensityMultiplier, stageDepth)
        fog.density = scenePreset.fogDensity * baseDensity

        renderer.setClearColor(dynamicClearColor, 1)
      }

      // Smooth dive curve: aggressive zoom during water phase (0-0.4), then deep dive (0.4+)
      const diveCurve = usesContinuousDive ? smoothstep(0.02, 0.46, stageDepth) : stageDepth
      const sideViewBlend = usesContinuousDive ? smoothstep(0.34, 0.84, stageDepth) : 0
      // Camera Y: passes through water surface (0) smoothly for immersive submersion effect
      const baseY = THREE.MathUtils.lerp(11.5, depthTuning.cameraY - 3.2, diveCurve)
      const baseZ = THREE.MathUtils.lerp(88, depthTuning.cameraZ - 12, diveCurve)

      camera.position.x = THREE.MathUtils.lerp(0, isMobile ? -9 : -13.5, sideViewBlend)
      camera.position.y = THREE.MathUtils.lerp(baseY, baseY - (isMobile ? 0.6 : 1.1), sideViewBlend)
      camera.position.z = THREE.MathUtils.lerp(baseZ, isMobile ? 6 : 2.5, sideViewBlend)

      cameraLookAt.x = THREE.MathUtils.lerp(0, isMobile ? 7.5 : 11.5, sideViewBlend)
      // Look-at point descends with camera for natural dive orientation through waterline
      cameraLookAt.y = THREE.MathUtils.lerp(1.8, depthTuning.lookAtY - 2.8, diveCurve)
      cameraLookAt.z = THREE.MathUtils.lerp(-140, depthTuning.lookAtZ + 18, diveCurve)
      camera.lookAt(cameraLookAt)

      const targetFov = THREE.MathUtils.lerp(50, isMobile ? 76 : 68, sideViewBlend)
      if (Math.abs(camera.fov - targetFov) > 0.01) {
        camera.fov = targetFov
        camera.updateProjectionMatrix()
      }

      const lightMultiplier = THREE.MathUtils.lerp(1, depthTuning.lightMultiplier, stageDepth)
      ambientLight.intensity = scenePreset.ambientIntensity * lightMultiplier
      hemisphereLight.intensity = scenePreset.hemisphereIntensity * lightMultiplier
      if (sunLight) sunLight.intensity = scenePreset.sunlightIntensity * lightMultiplier
      if (fillLight) fillLight.intensity = scenePreset.fillIntensity * lightMultiplier
      if (rimLight) rimLight.intensity = scenePreset.rimIntensity * lightMultiplier

      // Target and cancel out orange and pink tones only during scroll transition
      const transitionMuteAmount = Math.max(0, 1 - Math.abs(controlledProgress - 0.5) * 2.5)
      
      // Always show blue colors normally
      ambientLight.color.setHex(scenePreset.ambientColor)
      hemisphereLight.color.setHex(scenePreset.hemisphereSkyColor)
      if (fillLight) fillLight.color.setHex(scenePreset.fillColor)
      
      // Mute only warm/orange/pink colors during transition
      if (transitionMuteAmount > 0.01) {
        const tempColor = new THREE.Color()
        
        // Cancel out sun light (which is orange/yellow in noon mood)
        if (sunLight) {
          tempColor.setHex(scenePreset.sunlightColor)
          tempColor.multiplyScalar(1 - transitionMuteAmount * 0.95)  // Nearly cancel it out
          sunLight.color.copy(tempColor)
        }
        // Cancel out rim light (which is orange/peachy/pink)
        if (rimLight) {
          tempColor.setHex(scenePreset.rimColor)
          tempColor.multiplyScalar(1 - transitionMuteAmount * 0.95)  // Nearly cancel it out
          rimLight.color.copy(tempColor)
        }
        // Cancel out hemisphere ground color (which is pinkish)
        tempColor.setHex(scenePreset.hemisphereGroundColor)
        tempColor.multiplyScalar(1 - transitionMuteAmount * 0.95)
        hemisphereLight.groundColor.copy(tempColor)
      } else {
        // When not in transition zone, show full colors
        if (sunLight) sunLight.color.setHex(scenePreset.sunlightColor)
        if (rimLight) rimLight.color.setHex(scenePreset.rimColor)
        hemisphereLight.groundColor.setHex(scenePreset.hemisphereGroundColor)
      }

      if (water) {
        water.material.uniforms["time"].value = surfaceWaveTime
        const surfaceFade = usesContinuousDive ? 1 - smoothstep(0.18, 0.42, stageDepth) : 1
        // Update enhanced transition uniforms
        if (water.material.uniforms.uTime) {
          water.material.uniforms.uTime.value = elapsed
        }
        if (water.material.uniforms.uProgress) {
          water.material.uniforms.uProgress.value = stageDepth
        }
        if (water.material.uniforms.uSurfaceFade) {
          water.material.uniforms.uSurfaceFade.value = surfaceFade
        }
        // TUNE: Waterline drop curve. First value = start depth, second = fully submerged point.
        water.position.y = -0.05 - smoothstep(0.08, 0.48, stageDepth) * 5.05
        // Water stays fully visible during zoom phase (0-0.4), then fades as you go deeper
        if (usesContinuousDive) {
          // TUNE: Water surface visibility window during dive.
          water.visible = surfaceFade > 0.002
        }
      }
      // Control sky visibility during continuous dive - long smooth fade
      if (sky && usesContinuousDive) {
        // TUNE: Keep ambient sky light alive after the surface band starts clearing.
        sky.visible = smoothstep(0.58, 0.34, stageDepth) > 0.03
      }
      // Fade clouds out before the darker transition window kicks in.
      if (surfaceCloudLayer && usesContinuousDive) {
        // TUNE: Cloud fade starts early so the overhead surface clears before projects.
        const cloudFade = 1 - smoothstep(0.08, 0.24, stageDepth)
        surfaceCloudLayer.update(elapsed, cloudFade)
      } else {
        surfaceCloudLayer?.update(elapsed)
      }
      surfaceSunLayer?.update(elapsed, usesContinuousDive ? 1 - smoothstep(0.24, 0.58, stageDepth) : 1)
      
      // Only show underwater effects after water zoom completes (stageDepth > 0.2)
      if (underwaterLayer) {
        underwaterLayer.particles.visible = stageDepth > 0.2
        underwaterLayer.update()
      }
      underwaterBedLayer?.update(elapsed, stageDepth)
      underwaterVolumeLayer?.update(elapsed, stageDepth)
      underwaterSiltLayer?.update()
      if (mutedSunlightLayer) {
        mutedSunlightLayer.update(elapsed, stageDepth)
      }
      if (reflectionLayer) {
        reflectionLayer.update(elapsed, stageDepth)
      }
      if (surfaceWindowLayer) {
        surfaceWindowLayer.update(elapsed, stageDepth, postTransitionFade)
      }
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
    resizeObserver.observe(parent)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      proceduralWaterNormals.dispose()
      waterNormalsTexture.dispose()
      bubbleSpriteTexture.dispose()
      siltParticleTexture.dispose()
      sedimentOverlayTexture.dispose()
      surfaceRippleTextureA?.dispose()
      surfaceRippleTextureB?.dispose()
      underwaterBedLayer?.dispose()
      underwaterVolumeLayer?.dispose()
      water?.geometry.dispose()
      water?.material.dispose()
      disposeScene(scene)
      renderer.dispose()
    }
  }, [depthTuning, fogColor, isMobile, isSurfaceStage, phase, scenePreset, submergedClearColor, sunColor, waterColor, depthStage, usesContinuousDive, supportsUnderwaterSystems])

  const positionClass = position === "absolute" ? "absolute" : "fixed"

  return (
    <div className={`pointer-events-none ${positionClass} inset-0 z-0 overflow-hidden`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block" }}
        aria-hidden="true"
      />
      <div
        ref={transitionVeilRef}
        className="pointer-events-none absolute inset-x-0 top-0 opacity-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(4, 16, 24, 0.94) 0%, rgba(12, 34, 48, 0.76) 42%, rgba(46, 81, 96, 0.44) 76%, rgba(46, 81, 96, 0) 100%)",
          height: "48%",
          transform: "translateY(-16%)",
          willChange: "height, opacity, transform",
        }}
        aria-hidden="true"
      />
      <div
        ref={transitionWashRef}
        className="pointer-events-none absolute inset-x-0 top-[34%] h-[72%] opacity-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(98, 132, 148, 0) 0%, rgba(105, 144, 161, 0.58) 20%, rgba(61, 99, 117, 0.52) 43%, rgba(16, 46, 64, 0.38) 68%, rgba(5, 17, 25, 0) 100%)",
          backdropFilter: "blur(10px) saturate(90%)",
          WebkitBackdropFilter: "blur(10px) saturate(90%)",
          willChange: "opacity, transform",
        }}
        aria-hidden="true"
      />
    </div>
  )
}
