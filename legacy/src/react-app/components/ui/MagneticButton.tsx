import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent } from 'react'
import { cn } from '@/react-app/lib/utils'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  disabled?: boolean
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const variants = {
  primary: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/25 border-0',
  secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-lg shadow-gray-500/10 border border-gray-300',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200',
  glass: 'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900 shadow-xl shadow-black/10'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
}

export default function MagneticButton({
  children,
  className,
  strength = 0.3,
  disabled = false,
  onClick,
  variant = 'primary',
  size = 'md'
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 300 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [2, -2])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-2, 2])

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const offsetX = (e.clientX - centerX) / rect.width
    const offsetY = (e.clientY - centerY) / rect.height
    
    x.set(offsetX * strength)
    y.set(offsetY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-xl font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.98] hover:scale-[1.02]',
        variants[variant],
        sizes[size],
        className
      )}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {/* Glass overlay */}
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl" />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
