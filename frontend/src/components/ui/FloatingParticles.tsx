import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface FloatingParticlesProps {
  count?: number
  className?: string
  colors?: string[]
  sizes?: number[]
  duration?: [number, number]
  opacity?: [number, number]
}

export default function FloatingParticles({
  count = 50,
  className = '',
  colors = ['#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'],
  sizes = [2, 4, 6],
  duration = [15, 25],
  opacity = [0.1, 0.6]
}: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: duration[0] + Math.random() * (duration[1] - duration[0]),
      delay: Math.random() * 10,
      initialOpacity: opacity[0] + Math.random() * (opacity[1] - opacity[0])
    }))
  }, [count, colors, sizes, duration, opacity])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.initialOpacity,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [particle.initialOpacity, particle.initialOpacity * 1.5, 0, particle.initialOpacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
