import { motion } from "framer-motion"

interface SubmitSuccessEffectProps {
  isVisible: boolean
}

export function SubmitSuccessEffect({ isVisible }: SubmitSuccessEffectProps) {
  if (!isVisible) return null

  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    angle: (360 / 12) * i,
    delay: i * 0.05,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((particle) => {
        const rad = (particle.angle * Math.PI) / 180
        const x = Math.cos(rad) * 80
        const y = Math.sin(rad) * 80

        return (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(34,211,238,0.8), rgba(34,211,238,0.2))`,
              boxShadow: "0 0 6px rgba(34,211,238,0.6)",
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x, y, scale: 0 }}
            transition={{
              duration: 0.8,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        )
      })}
    </div>
  )
}
