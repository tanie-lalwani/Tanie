interface TropicalLeafProps {
  id: string
  w?: number
  h?: number
}

/**
 * Parametric tropical leaf shape with central vein + lateral vein strokes.
 */
export function TropicalLeaf({ id, w = 170, h = 300 }: TropicalLeafProps) {
  const hw = w / 2

  // Bezier leaf outline paths
  const outline = [
    `M 0 0`,
    `C ${hw * 0.9} ${h * 0.1}  ${hw * 1.1} ${h * 0.35}  ${hw * 0.72} ${h * 0.65}`,
    `C ${hw * 0.42} ${h * 0.88} ${hw * 0.12} ${h * 0.97} 0 ${h}`,
    `C ${-hw * 0.12} ${h * 0.97} ${-hw * 0.42} ${h * 0.88} ${-hw * 0.72} ${h * 0.65}`,
    `C ${-hw * 1.1} ${h * 0.35} ${-hw * 0.9} ${h * 0.1} 0 0`,
    `Z`,
  ].join(" ")

  const veinTs = [0.18, 0.33, 0.48, 0.63, 0.78]

  return (
    <svg
      viewBox={`${-hw - 24} -24 ${w + 48} ${h + 32}`}
      width={w}
      height={h}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#3da862" />
          <stop offset="55%" stopColor="#1e6b3a" />
          <stop offset="100%" stopColor="#0d3d1d" />
        </linearGradient>
        <filter id={`fs-${id}`} x="-30%" y="-20%" width="160%" height="140%">
          <feDropShadow dx="3" dy="10" stdDeviation="10" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      {/* Leaf body */}
      <path d={outline} fill={`url(#lg-${id})`} filter={`url(#fs-${id})`} />

      {/* Central vein */}
      <path
        d={`M 0 -8 C 1 ${h * 0.28} 2 ${h * 0.62} 0 ${h + 8}`}
        stroke="rgba(110,230,150,0.5)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Lateral vein pairs */}
      {veinTs.map((t) => {
        const y = t * h
        const lx = hw * 0.65 * (1 - t * 0.55)
        return (
          <g key={t}>
            <path
              d={`M 0 ${y} Q ${lx * 0.55} ${y - 14} ${lx} ${y + 5}`}
              stroke="rgba(130,235,165,0.36)"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d={`M 0 ${y} Q ${-lx * 0.55} ${y - 14} ${-lx} ${y + 5}`}
              stroke="rgba(130,235,165,0.36)"
              strokeWidth="1.4"
              fill="none"
            />
          </g>
        )
      })}
    </svg>
  )
}
