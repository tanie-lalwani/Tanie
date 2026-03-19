// Water transition shader - liquid distortion effect
varying vec2 vUv;
varying float vWave;

uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture;
uniform sampler2D uNoise;

// Perlin-like noise
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float n0 = noise(i);
  float n1 = noise(i + vec2(1.0, 0.0));
  float n2 = noise(i + vec2(0.0, 1.0));
  float n3 = noise(i + vec2(1.0, 1.0));
  
  float nx0 = mix(n0, n1, f.x);
  float nx1 = mix(n2, n3, f.x);
  return mix(nx0, nx1, f.y);
}

void main() {
  vec2 uv = vUv;
  
  // Create subtle wave distortion - very minimal for fast transitions
  float wave = sin(uv.x * 10.0 + uTime * 2.0) * 0.005 * uProgress;
  wave += cos(uv.y * 8.0 + uTime * 1.5) * 0.005 * uProgress;
  
  // Subtle Perlin noise distortion
  float noiseVal = smoothNoise(uv * 5.0 + uTime * 0.5);
  vec2 distortion = vec2(
    (noiseVal - 0.5) * 0.02 * uProgress,
    (smoothNoise(uv * 5.0 + 100.0 + uTime * 0.5) - 0.5) * 0.02 * uProgress
  );
  
  // Apply distortion
  uv += distortion;
  uv.y += wave;
  
  // Clamp UVs
  uv = clamp(uv, 0.0, 1.0);
  
  gl_FragColor = texture2D(uTexture, uv);
}
