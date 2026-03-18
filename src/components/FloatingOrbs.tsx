import { motion } from "framer-motion"

function FloatingOrbs() {
  const orbs = [
    { id: 1, delay: 0, color: "from-cyan-300/20 to-cyan-400/10", duration: 15 },
    { id: 2, delay: 2, color: "from-sky-300/15 to-sky-400/8", duration: 18 },
    { id: 3, delay: 4, color: "from-blue-300/18 to-blue-400/12", duration: 20 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full bg-linear-to-br ${orb.color} blur-3xl`}
          initial={{
            opacity: 0.3,
            scale: 0.8,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            x: [0, 100, -80, 0],
            y: [0, -60, 100, 0],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: `${280 + orb.id * 40}px`,
            height: `${280 + orb.id * 40}px`,
            top: `${20 + orb.id * 25}%`,
            left: `${15 + orb.id * 30}%`,
          }}
        />
      ))}
    </div>
  )
}

export default FloatingOrbs
