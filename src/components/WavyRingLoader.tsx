import React, { useEffect, useRef } from "react";

interface WavyRingLoaderProps {
  size?: number;
  color?: string;
  thickness?: number;
  duration?: number;
}

// Utility to generate wavy ring points
function generateWavyRingPoints(
  radius: number,
  waviness: number,
  points: number,
  phase: number
) {
  const angleStep = (Math.PI * 2) / points;
  const path: string[] = [];
  for (let i = 0; i < points; i++) {
    const angle = i * angleStep;
    const wave = Math.sin(angle * 3 + phase) * waviness;
    const r = radius + wave;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    path.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }
  path.push("Z");
  return path.join(" ");
}

const WavyRingLoader: React.FC<WavyRingLoaderProps> = ({
  size = 64,
  // color = "#52bdf3", // not used, gradient is used instead
  thickness = 6,
  duration = 1.2,
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
  const points = 64;
  const path = generateWavyRingPoints(radius, waviness, points, phase);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      <g transform={`translate(${size / 2},${size / 2})`}>
        <path
          d={path}
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 18px rgba(82,189,243,0.75))" }}
        />
        <defs>
          <radialGradient id="wavy-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8f8ff" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#9edfff" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#52bdf3" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </g>
    </svg>
  );
};

export default WavyRingLoader;
