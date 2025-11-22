import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface SpotlightEffectProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  size?: number
  intensity?: number
}

export default function SpotlightEffect({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.1)',
  size = 300,
  intensity = 0.8
}: SpotlightEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const spotlightX = useTransform(mouseX, (value) => `${value}px`)
  const spotlightY = useTransform(mouseY, (value) => `${value}px`)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      mouseX.set(x)
      mouseY.set(y)
    }

    const element = ref.current
    if (element) {
      element.addEventListener('mousemove', handleMouseMove)
      return () => element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Spotlight effect */}
      <motion.div
        className="absolute pointer-events-none z-10"
        style={{
          left: spotlightX,
          top: spotlightY,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
          opacity: intensity,
        }}
      />
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}
