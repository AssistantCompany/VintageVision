import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useMemo, useState, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SparkleParticle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

interface RevelationAnimationProps {
  children: ReactNode
  /** Whether to show the content (triggers reveal animation) */
  show: boolean
  /** Delay before starting the animation in milliseconds */
  delay?: number
  /** Duration of the main reveal animation in milliseconds */
  duration?: number
  /** Whether to show sparkle particles during reveal */
  showSparkles?: boolean
  /** Number of sparkle particles */
  sparkleCount?: number
  /** Color theme for the golden glow effect */
  glowColor?: 'gold' | 'silver' | 'rose' | 'emerald'
  /** Additional class names for the container */
  className?: string
  /** Callback when animation completes */
  onAnimationComplete?: () => void
}

const glowColors = {
  gold: {
    primary: 'rgba(251, 191, 36, 0.6)',
    secondary: 'rgba(245, 158, 11, 0.4)',
    sparkle: '#fbbf24',
    gradient: 'from-amber-500/30 via-yellow-400/20 to-orange-500/30',
  },
  silver: {
    primary: 'rgba(203, 213, 225, 0.6)',
    secondary: 'rgba(148, 163, 184, 0.4)',
    sparkle: '#cbd5e1',
    gradient: 'from-slate-400/30 via-gray-300/20 to-slate-500/30',
  },
  rose: {
    primary: 'rgba(251, 113, 133, 0.6)',
    secondary: 'rgba(244, 63, 94, 0.4)',
    sparkle: '#fb7185',
    gradient: 'from-rose-500/30 via-pink-400/20 to-red-500/30',
  },
  emerald: {
    primary: 'rgba(52, 211, 153, 0.6)',
    secondary: 'rgba(16, 185, 129, 0.4)',
    sparkle: '#34d399',
    gradient: 'from-emerald-500/30 via-green-400/20 to-teal-500/30',
  },
}

export default function RevelationAnimation({
  children,
  show,
  delay = 0,
  duration = 800,
  showSparkles = true,
  sparkleCount = 20,
  glowColor = 'gold',
  className,
  onAnimationComplete,
}: RevelationAnimationProps) {
  const [isRevealing, setIsRevealing] = useState(false)
  const colors = glowColors[glowColor]
  const durationInSeconds = duration / 1000

  // Generate sparkle particles
  const sparkles = useMemo<SparkleParticle[]>(() => {
    return Array.from({ length: sparkleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.5,
      duration: 0.8 + Math.random() * 0.4,
    }))
  }, [sparkleCount])

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsRevealing(true)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setIsRevealing(false)
    }
  }, [show, delay])

  // Main container variants
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.92,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: durationInSeconds,
        ease: [0.16, 1, 0.3, 1], // Custom easing for elegant feel
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
      transition: {
        duration: durationInSeconds * 0.5,
        ease: 'easeOut',
      },
    },
  }

  // Glow effect variants
  const glowVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: [0, 1, 0.7, 0],
      scale: [0.8, 1.1, 1.2, 1.3],
      transition: {
        duration: durationInSeconds * 1.2,
        ease: 'easeOut',
      },
    },
  }

  // Shimmer variants
  const shimmerVariants: Variants = {
    hidden: {
      x: '-100%',
      opacity: 0,
    },
    visible: {
      x: '200%',
      opacity: [0, 1, 1, 0],
      transition: {
        duration: durationInSeconds * 0.8,
        ease: 'easeInOut',
        delay: durationInSeconds * 0.2,
      },
    },
  }

  // Sparkle variants
  const sparkleVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: (particle: SparkleParticle) => ({
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0],
      transition: {
        duration: particle.duration,
        delay: particle.delay,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <AnimatePresence mode="wait">
      {isRevealing && (
        <motion.div
          className={cn('relative', className)}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={() => onAnimationComplete?.()}
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none -z-10"
            variants={glowVariants}
            initial="hidden"
            animate="visible"
          >
            <div
              className={cn(
                'absolute inset-0 rounded-2xl bg-gradient-to-r blur-2xl',
                colors.gradient
              )}
            />
          </motion.div>

          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10"
            style={{ opacity: 0.5 }}
          >
            <motion.div
              className="absolute inset-y-0 w-1/3"
              variants={shimmerVariants}
              initial="hidden"
              animate="visible"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
              }}
            />
          </motion.div>

          {/* Sparkle particles */}
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {sparkles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                  }}
                  custom={particle}
                  variants={sparkleVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Four-point star sparkle */}
                  <svg
                    viewBox="0 0 24 24"
                    fill={colors.sparkle}
                    className="w-full h-full"
                  >
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          )}

          {/* Border glow animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl z-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              transition: {
                duration: durationInSeconds * 1.5,
                ease: 'easeOut',
              },
            }}
            style={{
              boxShadow: `0 0 30px 10px ${colors.primary}, 0 0 60px 20px ${colors.secondary}`,
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-30"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: durationInSeconds * 0.6,
                delay: durationInSeconds * 0.3,
                ease: 'easeOut',
              },
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * A simpler revelation effect for inline elements
 */
export function InlineRevelation({
  children,
  show,
  delay = 0,
  className,
}: {
  children: ReactNode
  show: boolean
  delay?: number
  className?: string
}) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.span
          className={cn('inline-block', className)}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              duration: 0.5,
              delay: delay / 1000,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 },
          }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
