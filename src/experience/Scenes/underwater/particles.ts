/**
 * File summary: Defines underwater particle and surface-window visual layers.
 * Scope: Provides no-op particle/silt placeholders plus a caustic surface-window layer with update and disposal hooks.
 */
import * as THREE from "three";
import type { TimePhase } from "../../timePhase";
import { OCEAN_SCENE_PRESETS } from "../../moods";
import { smoothstep } from "../math";
import { buildCausticTexture } from "../textures";

// Purpose: Provide the underwater bubble particle layer contract for the environment controller.
export function addUnderwaterParticles(
  _scene?: THREE.Scene,
  _phase?: TimePhase,
  _depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  _bubbleTexture?: THREE.Texture
) {
  return {
    particles: { visible: true },
    // Purpose: Preserve the particle layer update contract while particle rendering is disabled.
    update: (_time?: number, _stageDepth?: number) => {},
    // Purpose: Preserve the particle layer disposal contract while particle rendering is disabled.
    dispose: () => {},
  };
}

// Purpose: Provide the underwater silt layer contract for the environment controller.
export function addUnderwaterSilt(
  _scene?: THREE.Scene,
  _depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  _siltParticleTexture?: THREE.Texture
) {
  return {
    // Purpose: Preserve the silt layer update contract while silt rendering is disabled.
    update: (_time?: number, _stageDepth?: number) => {},
    // Purpose: Preserve the silt layer disposal contract while silt rendering is disabled.
    dispose: () => {},
  };
}

// Purpose: Add a moving caustic surface-window layer above the underwater scene.
export function addUnderwaterSurfaceWindow(
  scene?: THREE.Scene,
  phase?: TimePhase,
  depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  textureA?: THREE.Texture,
  textureB?: THREE.Texture
) {
  // Fallbacks for missing arguments
  if (!scene || !phase) {
    return {
      group: { visible: true },
      // Purpose: Preserve the surface-window update contract when required scene data is missing.
      update: (_time?: number, _stageDepth?: number) => {},
      // Purpose: Preserve the surface-window disposal contract when required scene data is missing.
      dispose: () => {},
    };
  }

  // Use provided textures or generate caustics when missing to avoid flat white fallback maps.
  const ownsTextureA = !textureA;
  const ownsTextureB = !textureB;
  const texA = textureA ?? buildCausticTexture(256);
  const texB = textureB ?? buildCausticTexture(256);
  texA.wrapS = THREE.RepeatWrapping;
  texA.wrapT = THREE.RepeatWrapping;
  texA.repeat.set(2.8, 2.2);
  texB.repeat?.set?.(3.6, 2.8);
  const baseWaterColor = new THREE.Color(OCEAN_SCENE_PRESETS[phase].waterColor);
  const skyTintColor = new THREE.Color(0x4d8ed1);
  const color = skyTintColor.clone().lerp(baseWaterColor, 0.82);
  const strength = depthStage === "mid" ? 0.04 : 0.028;

  const planeA = new THREE.Mesh(
    new THREE.PlaneGeometry(1500, 980),
    new THREE.MeshBasicMaterial({
      map: texA,
      color,
      transparent: true,
      opacity: strength,
      blending: THREE.NormalBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  const planeB = new THREE.Mesh(
    new THREE.PlaneGeometry(1450, 940),
    new THREE.MeshBasicMaterial({
      map: texB,
      color,
      transparent: true,
      opacity: strength * 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  planeA.position.set(0, -3, -168);
  planeB.position.set(0, -8, -186);

  const group = new THREE.Group();
  group.add(planeA);
  group.add(planeB);
  scene.add(group);

  return {
    group,
    // Purpose: Animate caustic offsets, color, visibility, and layer drift through the dive.
    update: (time = 0, stageDepth = 1) => {
      const depthVisibility = smoothstep(0.02, 0.2, stageDepth) * (1 - smoothstep(0.66, 0.88, stageDepth));
      const colorMix = smoothstep(0.08, 0.68, stageDepth);
      const materialA = planeA.material as THREE.MeshBasicMaterial;
      const materialB = planeB.material as THREE.MeshBasicMaterial;

      if (texA.offset) {
        texA.offset.x = time * 0.033;
        texA.offset.y = -time * 0.018;
      }
      if (texB.offset) {
        texB.offset.x = -time * 0.027;
        texB.offset.y = time * 0.015;
      }

      color.copy(skyTintColor).lerp(baseWaterColor, colorMix);
      materialA.color.copy(color);
      materialB.color.copy(color);
      group.visible = depthVisibility > 0.01;
      planeA.position.x = Math.sin(time * 0.22) * 10;
      planeB.position.x = Math.cos(time * 0.18) * 8;
      materialA.opacity = (strength + Math.sin(time * 0.7) * 0.01) * depthVisibility;
      materialB.opacity = (strength * 0.5 + Math.cos(time * 0.56) * 0.008) * depthVisibility;
    },
    // Purpose: Dispose generated caustic textures while leaving caller-owned textures intact.
    dispose: () => {
      if (ownsTextureA) texA.dispose();
      if (ownsTextureB) texB.dispose();
    },
  };
}
