import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/react-app/lib/utils'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: 'warm' | 'cool' | 'purple' | 'emerald' | 'rose' | 'default'
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  border?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'
  interactive?: boolean
}

const gradients = {
  default: 'bg-white/5 border-white/10',
  warm: 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-amber-500/20',
  cool: 'bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-teal-500/10 border-blue-500/20',
  purple: 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10 border-purple-500/20',
  emerald: 'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 border-emerald-500/20',
  rose: 'bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-red-500/10 border-rose-500/20'
}

const blurs = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
  '3xl': 'backdrop-blur-3xl'
}

const shadows = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl'
}

export default function GlassCard({
  children,
  className,
  hover = false,
  gradient = 'default',
  blur = 'xl',
  border = true,
  shadow = 'xl',
  interactive = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        blurs[blur],
        'backdrop-saturate-150',
        gradients[gradient],
        border && 'border',
        shadows[shadow],
        hover && 'transition-all duration-500',
        interactive && 'cursor-pointer',
        className
      )}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3, ease: 'easeOut' }
            }
          : undefined
      }
      whileTap={
        interactive
          ? {
              scale: 0.98,
              transition: { duration: 0.1 }
            }
          : undefined
      }
      {...props}
    >
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient border enhancement */}
      {border && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-transparent to-white/20 p-[1px]">
          <div className="h-full w-full rounded-2xl bg-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
