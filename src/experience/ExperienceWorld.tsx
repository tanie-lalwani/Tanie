import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { useThreeScene } from "./scene/useThreeScene"
import LeafReveal from "./ui/LeafReveal"
import LoadingLeaves from "./ui/LoadingLeaves"
import BackButton from "./ui/BackButton"

interface Props {
  onBack: () => void
}

/**
 * The Experience world entry point.
 *
 * Structure (z-layers):
 *   0  – Three.js canvas  (sky + ocean + beach)
 *   10 – LeafReveal canopy (GSAP leaves scatter, then name is revealed)
 *   50 – BackButton        (always accessible)
 */
export default function ExperienceWorld({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)

  useThreeScene(canvasRef, () => setIsReady(true))

  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Three.js renders into this canvas — fill the full container */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ display: "block" }}
      />

      {/* Loading overlay with animated leaves */}
      <LoadingLeaves isReady={isReady} />

      {/* Tropical leaf reveal animation + name text */}
      <LeafReveal />

      {/* Always-visible back navigation */}
      <BackButton onBack={onBack} />
    </motion.div>
  )
}
