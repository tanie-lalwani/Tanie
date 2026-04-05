import * as THREE from "three";
import type { TimePhase } from "../../timePhase";

export function addUnderwaterParticles(
  _scene?: THREE.Scene,
  _phase?: TimePhase,
  _depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  _bubbleTexture?: THREE.Texture
) {
  return {
    particles: { visible: true },
    update: () => {},
  };
}

export function addUnderwaterSilt(
  _scene?: THREE.Scene,
  _depthStage?: "mid" | "deep",
  _isMobile?: boolean,
  _siltParticleTexture?: THREE.Texture
) {
  return {
    update: () => {},
  };
}

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
      update: () => {},
    };
  }

  // Use provided textures or create dummy textures if missing
  const texA = textureA ?? new THREE.Texture();
  const texB = textureB ?? new THREE.Texture();
  texB.repeat?.set?.(3.6, 2.8);
  // DEBUG: Use a bright green color for visibility
  const color = new THREE.Color(0x00ff00); // Bright green for debug
  const strength = depthStage === "mid" ? 0.11 : 0.075;

  const planeA = new THREE.Mesh(
    new THREE.PlaneGeometry(1500, 980),
    new THREE.MeshBasicMaterial({
      map: texA,
      color,
      transparent: true,
      opacity: strength,
      blending: THREE.AdditiveBlending,
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
    update: (time = 0) => {
      if (texA.offset) {
        texA.offset.x = time * 0.033;
        texA.offset.y = -time * 0.018;
      }
      if (texB.offset) {
        texB.offset.x = -time * 0.027;
        texB.offset.y = time * 0.015;
      }
      planeA.position.x = Math.sin(time * 0.22) * 10;
      planeB.position.x = Math.cos(time * 0.18) * 8;
      (planeA.material as THREE.MeshBasicMaterial).opacity = strength + Math.sin(time * 0.7) * 0.02;
    },
  };
}
