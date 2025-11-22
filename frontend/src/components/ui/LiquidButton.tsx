import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LiquidButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
  secondary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  outline: 'border-2 border-amber-500 text-amber-600 bg-transparent hover:bg-amber-50'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export default function LiquidButton({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md'
}: LiquidButtonProps) {
  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-full font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Liquid animation background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ scale: 0, borderRadius: '50%' }}
        whileHover={
          !disabled
            ? {
                scale: 2,
                transition: { duration: 0.4, ease: 'easeOut' }
              }
            : undefined
        }
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          transformOrigin: 'center'
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
