import React, { useEffect, useRef } from "react";

interface WavySparkleRingLoaderProps {
  size?: number;
  color?: string;
  thickness?: number;
  duration?: number;
  sparkleCount?: number;
}

function getWavyPoint(
  radius: number,
  waviness: number,
  angle: number,
  phase: number
) {
  const wave = Math.sin(angle * 3 + phase) * waviness;
  const r = radius + wave;
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  return { x, y };
}

const WavySparkleRingLoader: React.FC<WavySparkleRingLoaderProps> = ({
  size = 64,
  // color = "#52bdf3", // not used, gradient is used instead
  thickness = 6,
  duration = 1.2,
  sparkleCount = 12,
}) => {
  const [phase, setPhase] = React.useState(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) / 1000;
      setPhase(elapsed * Math.PI * 2 / duration);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [duration]);

  const radius = size / 2 - thickness;
  const waviness = thickness * 0.7;
  const points = sparkleCount;
  const sparkles = Array.from({ length: points }, (_, i) => {
    // Animate sparkles trailing around the ring
    const sparklePhase = phase - (i / points) * Math.PI * 2 * 0.7;
    const angle = (i / points) * Math.PI * 2 + sparklePhase;
    return getWavyPoint(radius, waviness, angle, phase);
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <g transform={`translate(${size / 2},${size / 2})`}>
        {sparkles.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r={thickness * 0.45 + Math.sin(phase + i) * 1.2}
            fill="url(#sparkle-gradient)"
            opacity={0.7 + 0.3 * Math.sin(phase + i)}
            // No drop-shadow for a cleaner look
          />
        ))}
        <defs>
          <radialGradient id="sparkle-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8f8ff" stopOpacity="1" />
            <stop offset="60%" stopColor="#9edfff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#52bdf3" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </g>
    </svg>
  );
};

export default WavySparkleRingLoader;
